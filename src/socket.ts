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

const RECONNECT_INTERVAL = 5000
const VERSION_TIMEOUT = 5000
const HANDSHAKE_TIMEOUT = 5000
/** a ping is sent at this interval, if no pong arrived before the next ping the connection is considered dead */
const HEARTBEAT_INTERVAL = 10000

export class WS {
	ws?: WebSocket
	reconnect_timer?: NodeJS.Timeout
	version_timer?: NodeJS.Timeout
	heartbeat_timer?: NodeJS.Timeout

	connected = false
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
			// or a status change while a newer socket is already active
			const ws = this.ws
			ws.removeAllListeners()
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
			this.ws?.terminate()
		}, VERSION_TIMEOUT)
		this.startHeartbeat()
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

	maybeReconnect(): void {
		if (!this.ws) return
		if (this.reconnect_timer) clearTimeout(this.reconnect_timer)

		this.reconnect_timer = setTimeout(() => {
			delete this.reconnect_timer
			this.init()
		}, RECONNECT_INTERVAL)
	}

	/**
	 * detects half open connections (e.g. network loss without a proper TCP close)
	 * which would otherwise only be noticed by the OS after a very long time
	 */
	private startHeartbeat(): void {
		this.isAlive = true
		this.heartbeat_timer = setInterval(() => {
			if (!this.ws) return
			if (!this.isAlive) {
				this.callbacks.onerror(`No heartbeat response from ${this.host}, reconnecting`)
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
