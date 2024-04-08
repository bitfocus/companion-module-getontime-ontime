import { InputValue, InstanceStatus } from '@companion-module/base'
import { OnTimeInstance } from '..'
import Websocket from 'ws'
import { mstoTime, toReadableTime } from '../utilities'
import { feedbackId, variableId } from '../enums'
import { MessageState, OntimeEvent, Runtime, SimpleTimerState, TimerState } from './state'
import { OntimeV3 } from './ontimev3'

let ws: Websocket | null = null
let reconnectionTimeout: NodeJS.Timeout | null = null
let reconnectInterval: number
let shouldReconnect = false
const defaultTimerObject = {
	hours: '00',
	minutes: '00',
	seconds: '00',
}

export function connect(self: OnTimeInstance, ontime: OntimeV3): void {
	reconnectInterval = self.config.reconnectInterval * 1000
	shouldReconnect = self.config.reconnect

	const host = self.config.host
	const port = self.config.port

	if (!host || !port) {
		self.updateStatus(InstanceStatus.BadConfig, `no host and/or port defined`)
		return
	}

	self.updateStatus(InstanceStatus.Connecting)

	if (ws) {
		ws.close()
	}

	const pattern = /^((http|https):\/\/)/

	if (pattern.test(host)) {
		host.replace(pattern, '')
	}

	ws = new Websocket(`ws://${host}:${port}/ws`)

	ws.onopen = () => {
		clearTimeout(reconnectionTimeout as NodeJS.Timeout)
		self.updateStatus(InstanceStatus.Ok)
		self.log('debug', 'Socket connected')
		void fetchAllEvents(self, ontime)
	}

	ws.onclose = (event) => {
		self.log('debug', `Connection closed with code ${event.code}`)
		if (shouldReconnect) {
			reconnectionTimeout = setTimeout(() => {
				if (ws && ws.readyState === Websocket.CLOSED) {
					void connect(self, ontime)
				}
			}, reconnectInterval)
		}
	}

	ws.onerror = (event) => {
		self.log('debug', `WebSocket error: ${event.message}`)
		self.updateStatus(InstanceStatus.ConnectionFailure, `WebSocket error: ${event.message}`)
	}

	const updateClock = (val: number) => {
		ontime.state.clock = val
		const clock = toReadableTime(val)
		self.setVariableValues({ [variableId.Clock]: clock.hours + ':' + clock.minutes + ':' + clock.seconds })
	}

	const updateTimer = (val: TimerState) => {
		ontime.state.timer = val
		const timer = val.current === null ? defaultTimerObject : toReadableTime(val.current)
		const timer_start = val.startedAt === null ? defaultTimerObject : toReadableTime(val.startedAt)
		const timer_finish = val.expectedFinish === null ? defaultTimerObject : toReadableTime(val.expectedFinish)
		const added = mstoTime(val.addedTime)
		self.setVariableValues({
			[variableId.TimerTotalMs]: val.current ?? 0,
			[variableId.Time]: timer.hours + ':' + timer.minutes + ':' + timer.seconds,
			[variableId.TimeHM]: timer.hours + ':' + timer.minutes,
			[variableId.TimeH]: timer.hours,
			[variableId.TimeM]: timer.minutes,
			[variableId.TimeS]: timer.seconds,
			[variableId.TimerStart]: timer_start.hours + ':' + timer_start.minutes + ':' + timer_start.seconds,
			[variableId.TimerFinish]: timer_finish.hours + ':' + timer_finish.minutes + ':' + timer_finish.seconds,
			[variableId.TimerAdded]: added,
			[variableId.PlayState]: val.playback,
		})

		self.checkFeedbacks(feedbackId.ColorPlaybeck, feedbackId.ColorNegative, feedbackId.ColorAddRemove, feedbackId.OnAir)
	}

	const updateOnAir = (val: boolean) => {
		ontime.state.onAir = val
		self.setVariableValues({
			[variableId.OnAir]: val,
		})

		self.checkFeedbacks(feedbackId.OnAir)
	}

	const updateMessage = (val: MessageState) => {
		ontime.state.message = val
		self.setVariableValues({
			[variableId.TimerMessage]: val.timer.text,
			[variableId.PublicMessage]: val.public.text,
			[variableId.LowerMessage]: val.lower.text,

			[variableId.TimerMessageVisible]: val.timer.visible,
			[variableId.PublicMessageVisible]: val.public.visible,
			[variableId.LowerMessageVisible]: val.lower.visible,

			[variableId.TimerBlackout]: val.timer.blackout,
			[variableId.TimerBlink]: val.timer.blink,
		})

		self.checkFeedbacks(
			feedbackId.MessageVisible,
			feedbackId.ThisMessageVisible,
			feedbackId.TimerBlackout,
			feedbackId.TimerBlink
		)
	}

	const updateRuntime = (val: Runtime) => {
		ontime.state.runtime = val

		//TODO:
	}

	const updateEventNow = (val: OntimeEvent) => {
		ontime.state.eventNow = val
		self.setVariableValues({
			[variableId.TitleNow]: val.title ?? '',
			[variableId.NoteNow]: val.note ?? '',
			[variableId.CueNow]: val.cue ?? '',
			[variableId.IdNow]: val.id ?? '',
		})
	}
	const updateEventNext = (val: OntimeEvent) => {
		ontime.state.eventNext = val
		self.setVariableValues({
			[variableId.TitleNext]: val.title ?? '',
			[variableId.NoteNext]: val.note ?? '',
			[variableId.CueNext]: val.cue ?? '',
			[variableId.IdNext]: val.id ?? '',
		})
	}
	const updatePublicEventNext = (val: OntimeEvent) => {
		ontime.state.publicEventNow = val

		//TODO:
	}
	const updatePublicEventNow = (val: OntimeEvent) => {
		ontime.state.publicEventNext = val

		//TODO:
	}
	const updateTimer1 = (val: SimpleTimerState) => {
		ontime.state.timer1 = val
		//TODO:
	}

	ws.onmessage = (event: any) => {
		try {
			const data = JSON.parse(event.data)
			const { type, payload } = data

			if (!type) {
				return
			}

			//https://docs.getontime.no/api/runtime-data/
			switch (type) {
				case 'ontime-clock': {
					updateClock(payload)
					break
				}
				case 'ontime-timer': {
					updateTimer(payload)
					break
				}
				case 'ontime-onAir': {
					updateOnAir(payload)
					break
				}
				case 'ontime-message': {
					updateMessage(payload)
					break
				}
				case 'ontime-runtime': {
					updateRuntime(payload)
					break
				}

				case 'ontime-eventNow': {
					updateEventNow(payload)
					break
				}
				case 'ontime-publicEventNow': {
					updatePublicEventNow(payload)
					break
				}
				case 'ontime-eventNext': {
					updateEventNext(payload)
					break
				}
				case 'ontime-publicEventNext': {
					updatePublicEventNext(payload)
					break
				}
				case 'ontime-timer1': {
					updateTimer1(payload)
					break
				}
				case 'ontime': {
					updateTimer(payload.timer)
					updateClock(payload.clock)
					updateOnAir(payload.onAir)
					updateMessage(payload.message)
					updateEventNow(payload.eventNow)
					updateEventNext(payload.eventNext)
					break
				}
				case 'ontime-refetch': {
					if (self.config.refetchEvents === false) {
						break
					}
					self.log('debug', 'refetching events')
					// self.log('debug', JSON.stringify(payload))
					void fetchAllEvents(self, ontime).then(
						() => {
							self.init_actions()
						},
						(e: any) => {
							self.log('debug', e)
						}
					)
					break
				}
			}
		} catch (_) {
			// ignore unhandled
		}
	}
}

export function disconnectSocket(): void {
	shouldReconnect = false
	if (reconnectionTimeout) {
		clearTimeout(reconnectionTimeout)
	}
	ws?.close()
}

export function socketSend(message: string): void {
	if (ws && ws.readyState === ws.OPEN) {
		ws.send(message)
	}
}

export function socketSendJson(type: string, payload?: InputValue | object): void {
	socketSend(
		JSON.stringify({
			type,
			payload,
		})
	)
}

export function socketSendChange(type: string, eventId: string, property: InputValue, value: InputValue): void {
	socketSend(
		JSON.stringify({
			type,
			payload: {
				eventId,
				property,
				value,
			},
		})
	)
}


let Etag: string = ''
let timeout: NodeJS.Timeout

export async function fetchAllEvents(self: OnTimeInstance, ontime: OntimeV3): Promise<void> {
	clearTimeout(timeout)
	if (self.config.refetchEvents) {
		// timeout = setTimeout(() => fetchAllEvents(self, ontime), 60000)
	}
	self.log('debug', 'fetching events from ontime')
	try {
		const response = await fetch(`http://${self.config.host}:${self.config.port}/data/rundown`, {
			method: 'GET',
			headers: { Etag },
		})
		if (response.status === 304) {
			return
		}
		Etag = response.headers.get('Etag') ?? ''
		const data = (await response.json()) as OntimeEvent[]
		self.log('debug', `fetched ${data.length} events`)
		ontime.events = []
		ontime.events = data.filter(({ type }) => type === 'event').map(({ id, cue, title }) => ({ id, cue, title }))

		self.init_actions()
	} catch (e: any) {
		ontime.events = []
		self.log('error', 'failed to fetch events from ontime')
		self.log('error', e)
	}
}
