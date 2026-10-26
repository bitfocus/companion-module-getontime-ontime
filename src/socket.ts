import { coerce, satisfies } from 'semver'
import WebSocket from 'ws'
import { makeURL } from './utilities.js'

/**
 * @link https://github.com/bitfocus/companion-module-luminex-gigacore/blob/main/src/websocket.ts
 */

interface onOpen {
	(): void
}

interface onMessage {
	(data: object): void
}

interface onError {
	(msg: string): void
}

interface onDisconnect {
	(msg: string): void
}

interface onBadVersion {
	(msg: string): void
}

interface WsCallbacks {
	onopen: onOpen
	onmessage: onMessage
	onerror: onError
	ondisconnect: onDisconnect
	/** the server did not identify as a supported version, no reconnect is attempted */
	onbadversion: onBadVersion
}

/** delay before a new connection attempt after the socket was closed */
const RECONNECT_INTERVAL = 5000
/** time Ontime has to answer the initial version request */
const VERSION_TIMEOUT = 5000
/** without this an unreachable host can keep the socket in CONNECTING until the OS gives up */
const HANDSHAKE_TIMEOUT = 5000
/**
 * Ontime sends a clock update every second, so a longer silence means the connection is dead.
 * the check is done on the client without sending anything to the server
 */
const STALE_TIMEOUT = 5000
const STALE_CHECK_INTERVAL = 1000

export class WS {
	ws?: WebSocket
	reconnect_timer?: NodeJS.Timeout
	version_timer?: NodeJS.Timeout
	stale_timer?: NodeJS.Timeout

	connected = false
	/** timestamp of the last message or ping from the server */
	private lastMessage = 0

	constructor(
		private host: string,
		private callbacks: WsCallbacks,
		private version: string,
		private useTag: boolean = true,
	) {}

	public init(): boolean {
		this.close()

		const url = makeURL(this.host, 'ws', true)

		if (!url) throw new Error('Invalid host')

		this.ws = new WebSocket(url, { handshakeTimeout: HANDSHAKE_TIMEOUT })

		this.ws.onopen = this.websocketOpen.bind(this)
		this.ws.onclose = this.websocketClose.bind(this)
		this.ws.onmessage = this.messageReceivedFromWebSocket.bind(this)
		this.ws.onerror = this.websocketError.bind(this)
		// a ping from the server counts as a sign of life as well
		this.ws.on('ping', () => {
			this.lastMessage = Date.now()
		})
		return true
	}

	public close(): void {
		this.connected = false
		this.clearTimers()
		if (this.reconnect_timer) {
			clearTimeout(this.reconnect_timer)
			delete this.reconnect_timer
		}
		if (this.ws) {
			// detach handlers so that late events from this socket can not trigger a reconnect
			// or a status change while a newer socket is already active
			const ws = this.ws
			ws.removeAllListeners()
			// closing a socket that is still CONNECTING emits 'error',
			// an EventEmitter without error listener would throw and crash the module
			ws.on('error', () => {})
			ws.close(1000)
			delete this.ws
		}
		console.log(`WS closed for ${this.host}`)
	}

	public send(data: object): void {
		if (this.ws && this.connected) {
			this.ws.send(JSON.stringify(data))
		} else {
			console.log(`Msg ${JSON.stringify(data)} lost because websocket not initialized yet`)
		}
	}

	websocketOpen(): void {
		if (this.useTag) {
			this.ws?.send(JSON.stringify({ tag: 'version' }))
		} else {
			this.ws?.send(JSON.stringify({ type: 'version' }))
		}
		this.version_timer = setTimeout(() => {
			this.badVersion(`No version response from ${this.host}, is this an Ontime ${this.version} server?`)
		}, VERSION_TIMEOUT)
	}

	websocketClose(event: WebSocket.CloseEvent): void {
		this.connected = false
		this.clearTimers()
		this.disconnect(`Connection to ${this.host} closed with code ${event.code}`)
	}

	websocketError(event: WebSocket.ErrorEvent): void {
		this.callbacks.onerror(`Websocket error: ${event.message}`)
	}

	public disconnect(msg: string): void {
		this.callbacks.ondisconnect(msg)
		this.maybeReconnect()
	}

	/**
	 * a wrong or missing server version can only be fixed by the user (upgrade Ontime or change the address),
	 * so the socket is closed for good and the status is reported instead of retrying
	 */
	private badVersion(msg: string): void {
		this.close()
		this.callbacks.onbadversion(msg)
	}

	maybeReconnect(): void {
		// no socket means close() was called on purpose (destroy or re-init), so do not reconnect
		if (!this.ws) return
		if (this.reconnect_timer) clearTimeout(this.reconnect_timer)

		this.reconnect_timer = setTimeout(() => {
			this.init()
		}, RECONNECT_INTERVAL)
	}

	/**
	 * detects half open connections (e.g. network loss without a proper TCP close)
	 * which would otherwise only be noticed by the OS after a very long time
	 */
	private startStaleCheck(): void {
		this.lastMessage = Date.now()
		this.stale_timer = setInterval(() => {
			if (!this.ws) return
			if (Date.now() - this.lastMessage > STALE_TIMEOUT) {
				this.callbacks.onerror(`No message from ${this.host} for ${STALE_TIMEOUT}ms, reconnecting`)
				// terminate() instead of close(): a dead peer would never answer the close handshake
				this.ws.terminate()
			}
		}, STALE_CHECK_INTERVAL)
	}

	private clearTimers(): void {
		if (this.version_timer) {
			clearTimeout(this.version_timer)
			delete this.version_timer
		}
		if (this.stale_timer) {
			clearInterval(this.stale_timer)
			delete this.stale_timer
		}
	}

	messageReceivedFromWebSocket(event: WebSocket.MessageEvent): void {
		this.lastMessage = Date.now()
		try {
			// eslint-disable-next-line @typescript-eslint/no-base-to-string
			const msgValue = JSON.parse(event.data.toString())
			if (!this.connected) {
				if (msgValue?.tag === 'version') {
					const maybeVersion = coerce(msgValue.payload)
					if (maybeVersion && satisfies(maybeVersion, this.version)) {
						this.connected = true
						console.log('connected with version', maybeVersion.version)
						if (this.version_timer) {
							clearTimeout(this.version_timer)
							delete this.version_timer
						}
						this.startStaleCheck()
						this.callbacks.onopen()
					} else {
						this.badVersion(
							`Unsupported Ontime version ${maybeVersion?.version ?? String(msgValue.payload)}, this module requires ${this.version}`,
						)
					}
				}
				return
			}
			this.callbacks.onmessage(msgValue)
		} catch (_e) {
			// swallow JSON errors
		}
	}
}
