import { InstanceStatus } from '@companion-module/base'
import { WS } from './socket.js'
import type { OntimeModule } from './index.js'
import OntimeState from './state.js'
import type { ApiResponse, CustomFields, OntimeEvent, RuntimeStore, SocketSender } from '@getontime/resolver'
import { isWsPacketToClient, MessageTag, RefetchKey } from '@getontime/resolver'
import { generateFeedbacks } from './feedbacks.js'
import { generatePresets } from './presets.js'
import { fetchAllEvents, fetchCustomFields } from './http.js'

export class OntimeConnection {
	private socket?: WS
	public state: OntimeState

	constructor(private module: OntimeModule) {
		this.state = new OntimeState(module)
	}

	public async destroy(): Promise<void> {
		this.socket?.close()
		this.module.updateStatus(InstanceStatus.Disconnected)
		delete this.socket
	}

	private onWsDisconnect(msg: string): void {
		this.module.updateStatus(InstanceStatus.Disconnected, msg)
	}

	private onWsError(msg: string): void {
		this.module.log('error', msg)
	}

	private onWsMessage(data: object): void {
		if (isWsPacketToClient(data)) {
			const { tag, payload } = data
			switch (tag) {
				case MessageTag.RuntimeData: {
					this.applyDataPatch(payload)
					break
				}
				case MessageTag.Refetch: {
					const { target } = payload
					const fetches: FetchPromiseArray = [Promise.resolve(false), Promise.resolve(false)]
					switch (target) {
						case RefetchKey.Rundown: {
							fetches[0] = fetchAllEvents(this.module)
							break
						}
						case RefetchKey.CustomFields: {
							fetches[1] = fetchCustomFields(this.module)
							break
						}
					}
					Promise.all(fetches)
						.then(([maybeEvents, maybeCustom]) => {
							if (maybeEvents) this.state.events = maybeEvents
							if (maybeCustom) this.state.customFields = maybeCustom
						})
						.catch(console.error)
					setTimeout(() => {
						this.state.applyPendingActionDefinition()
						this.state.applyPendingVariableDefinition()
					}, 100)
					break
				}
				default: {
					const { payload, tag } = data as unknown as ApiResponse
					if (tag === 'poll') {
						this.applyDataPatch(payload)
						break
					}
					console.log('WS tag:', data.tag)
					break
				}
			}
		} else {
			console.log('onmessage', data)
		}
	}
	private onWsOpen(): void {
		this.module.updateStatus(InstanceStatus.Ok)
		this.module.setPresetDefinitions(generatePresets())

		const pendingFetch: FetchPromiseArray = [fetchAllEvents(this.module), fetchCustomFields(this.module)]

		Promise.all(pendingFetch)
			.then(([maybeEvents, maybeCustom]) => {
				if (maybeEvents) this.state.events = maybeEvents
				if (maybeCustom) this.state.customFields = maybeCustom
			})
			.catch(console.error)
			.finally(() => {
				this.state.applyPendingActionDefinition(true)
				this.state.applyPendingVariableDefinition(true)
				this.module.setFeedbackDefinitions(generateFeedbacks(this.module))
				this.sendSocket('poll', undefined)
			})
	}

	public initConnection(): void {
		if (this.socket) this.socket?.close()
		delete this.socket

		this.socket = new WS(
			this.module.config.host,
			{
				ondisconnect: this.onWsDisconnect.bind(this),
				onerror: this.onWsError.bind(this),
				onmessage: this.onWsMessage.bind(this),
				onopen: this.onWsOpen.bind(this),
			},
			'4.0.x',
		)

		try {
			this.socket.init()
		} catch (e) {
			console.error(e)
		}
	}

	public sendSocket: SocketSender = (tag, payload) => {
		this.socket?.send({ tag, payload })
	}

	private applyDataPatch(payload: Partial<RuntimeStore>): void {
		this.state.clock = payload.clock
		this.state.timer = payload.timer
		this.state.message = payload.message
		this.state.rundown = payload.rundown
		this.state.offset = payload.offset
		this.state.eventNow = payload.eventNow
		this.state.eventNext = payload.eventNext
		this.state.eventFlag = payload.eventFlag
		this.state.groupNow = payload.groupNow
		this.state.auxtimer1 = payload.auxtimer1
		this.state.auxtimer2 = payload.auxtimer2
		this.state.auxtimer3 = payload.auxtimer3

		this.state.applyPendingVariables()
	}
}

type FetchPromiseArray = [Promise<false | OntimeEvent[]>, Promise<false | CustomFields>]
