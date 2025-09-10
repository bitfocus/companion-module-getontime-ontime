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

export class WS {
	ws?: WebSocket
	reconnect_timer?: NodeJS.Timeout
	version_timer?: NodeJS.Timeout

	connected = false

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

		this.ws = new WebSocket(url)

		this.ws.onopen = this.websocketOpen.bind(this)
		this.ws.onclose = this.websocketClose.bind(this)
		this.ws.onmessage = this.messageReceivedFromWebSocket.bind(this)
		this.ws.onerror = this.websocketError.bind(this)
		return true
	}

	public close(): void {
		this.connected = false
		this.ws?.close(1000)
		delete this.ws
		if (this.reconnect_timer) {
			clearTimeout(this.reconnect_timer)
			delete this.reconnect_timer
		}
		if (this.version_timer) {
			clearTimeout(this.version_timer)
			delete this.version_timer
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
			this.init()
		}, 5000)
	}

	websocketClose(event: WebSocket.CloseEvent): void {
		this.disconnect(`Connection to ${this.host} closed with code ${event.code}`)
	}

	websocketError(event: WebSocket.Event): void {
		let msgValue = null
		try {
			msgValue = JSON.stringify(event)
		} catch (_e) {
			msgValue = 'websocket error'
		}
		this.callbacks.onerror(msgValue)
	}

	public disconnect(msg: string): void {
		this.callbacks.ondisconnect(msg)
		this.maybeReconnect()
	}

	maybeReconnect(): void {
		if (!this.ws) return
		if (this.reconnect_timer) clearTimeout(this.reconnect_timer)
		if (this.version_timer) clearTimeout(this.version_timer)

		this.reconnect_timer = setTimeout(() => {
			this.init()
		}, 5000)
	}

	messageReceivedFromWebSocket(event: WebSocket.MessageEvent): void {
		let msgValue = null
		try {
			// eslint-disable-next-line @typescript-eslint/no-base-to-string
			msgValue = JSON.parse(event.data.toString())
			if (!this.connected) {
				if (msgValue?.tag === 'version') {
					const maybeVersion = coerce(msgValue.payload)
					if (maybeVersion && satisfies(maybeVersion, this.version)) {
						this.connected = true
						console.log('connected with version', maybeVersion.version)
						if (this.version_timer) clearTimeout(this.version_timer)
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
