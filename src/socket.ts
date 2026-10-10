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

interface WsCallbacks {
	onopen: onOpen
	onmessage: onMessage
	onerror: onError
	ondisconnect: onDisconnect
}

export interface Subscription {
	path: string
	method: 'full' | 'changes'
}

/** delay before a new connection attempt after the socket was closed */
const RECONNECT_INTERVAL = 5000
/** time Ontime has to answer the initial version request, otherwise the socket is dropped and retried */
const VERSION_TIMEOUT = 5000
/** without this an unreachable host can keep the socket in CONNECTING until the OS gives up */
const HANDSHAKE_TIMEOUT = 5000
/** a ping is sent at this interval, if no pong arrived before the next ping the connection is considered dead */
const HEARTBEAT_INTERVAL = 10000

export class WS {
	ws?: WebSocket
	reconnect_timer?: NodeJS.Timeout
	version_timer?: NodeJS.Timeout
	heartbeat_timer?: NodeJS.Timeout

	connected = false
	/** set by any pong or message from the server, reset when a ping is sent */
	private isAlive = false

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
		// the Ontime server (ws library) answers pings automatically, no server change is needed
		this.ws.on('pong', () => {
			this.isAlive = true
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
			// or a status change while a newer socket is already active.
			// without this, the close event of the replaced socket arrives after init() has created
			// the new one and schedules yet another init(), which closes the new socket again
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
			this.callbacks.onerror(`No version response from ${this.host}`)
			// terminate() emits 'close', so the retry goes through the normal reconnect path in websocketClose()
			this.ws?.terminate()
		}, VERSION_TIMEOUT)
		this.startHeartbeat()
	}

	websocketClose(event: WebSocket.CloseEvent): void {
		// reset state right away, otherwise send() would still write to the closed socket until the next init()
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

	maybeReconnect(): void {
		// no socket means close() was called on purpose (destroy or re-init), so do not reconnect
		if (!this.ws) return
		if (this.reconnect_timer) clearTimeout(this.reconnect_timer)

		this.reconnect_timer = setTimeout(() => {
			delete this.reconnect_timer
			this.init()
		}, RECONNECT_INTERVAL)
	}

	/**
	 * detects half open connections (e.g. network loss without a proper TCP close)
	 * which would otherwise only be noticed by the OS after a very long time.
	 * in that state no close event fires, the module status stays OK and all values freeze.
	 * a dead connection is detected after at most 2 * HEARTBEAT_INTERVAL
	 */
	private startHeartbeat(): void {
		this.isAlive = true
		this.heartbeat_timer = setInterval(() => {
			if (!this.ws) return
			if (!this.isAlive) {
				this.callbacks.onerror(`No heartbeat response from ${this.host}, reconnecting`)
				// terminate() instead of close(): a dead peer would never answer the close handshake
				this.ws.terminate()
				return
			}
			this.isAlive = false
			this.ws.ping()
		}, HEARTBEAT_INTERVAL)
	}

	private clearTimers(): void {
		if (this.version_timer) {
			clearTimeout(this.version_timer)
			delete this.version_timer
		}
		if (this.heartbeat_timer) {
			clearInterval(this.heartbeat_timer)
			delete this.heartbeat_timer
		}
	}

	messageReceivedFromWebSocket(event: WebSocket.MessageEvent): void {
		// any incoming data proves the connection is alive, same as a pong
		this.isAlive = true
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
						this.callbacks.onopen()
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
