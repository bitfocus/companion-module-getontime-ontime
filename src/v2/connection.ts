import { InputValue, InstanceStatus } from '@companion-module/base'
import { OnTimeInstance } from '..'
import Websocket from 'ws'
import { mstoTime, toReadableTime } from '../utilities'
import { feedbackId, variableId } from '../enums'
import { OntimeEvent, RuntimeStore } from './state'
import { OntimeV2 } from './ontimev2'

let ws: Websocket | null = null
let reconnectionTimeout: NodeJS.Timeout | null = null
let reconnectInterval: number
let shouldReconnect = false
const defaultTimerObject = {
	hours: '00',
	minutes: '00',
	seconds: '00',
}

export function connect(self: OnTimeInstance, ontime: OntimeV2): void {
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
		void fetchEvents(self, ontime)
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

	ws.onmessage = (event: any) => {
		try {
			const data = JSON.parse(event.data)
			const { type, payload } = data

			if (!type) {
				return
			}

			if (type === 'ontime') {
				ontime.state = payload as RuntimeStore

				const timer =
					ontime.state.timer.current === null ? defaultTimerObject : toReadableTime(ontime.state.timer.current)
				const clock = toReadableTime(ontime.state.timer.clock)
				const timer_start =
					ontime.state.timer.startedAt === null ? defaultTimerObject : toReadableTime(ontime.state.timer.startedAt)
				const timer_finish =
					ontime.state.timer.expectedFinish === null
						? defaultTimerObject
						: toReadableTime(ontime.state.timer.expectedFinish)
				const added = mstoTime(ontime.state.timer.addedTime)

				self.setVariableValues({
					[variableId.Time]: timer.hours + ':' + timer.minutes + ':' + timer.seconds,
					[variableId.TimeHM]: timer.hours + ':' + timer.minutes,
					[variableId.TimeH]: timer.hours,
					[variableId.TimeM]: timer.minutes,
					[variableId.TimeS]: timer.seconds,
					[variableId.Clock]: clock.hours + ':' + clock.minutes + ':' + clock.seconds,
					[variableId.TimerStart]: timer_start.hours + ':' + timer_start.minutes + ':' + timer_start.seconds,
					[variableId.TimerFinish]: timer_finish.hours + ':' + timer_finish.minutes + ':' + timer_finish.seconds,
					[variableId.TimerAdded]: added,

					[variableId.PlayState]: ontime.state.playback,
					[variableId.OnAir]: ontime.state.onAir,

					[variableId.TitleNow]: ontime.state.eventNow?.title,
					[variableId.SubtitleNow]: ontime.state.eventNow?.subtitle,
					[variableId.SpeakerNow]: ontime.state.eventNow?.presenter,
					[variableId.NoteNow]: ontime.state.eventNow?.note,
					[variableId.CueNow]: ontime.state.eventNow?.cue,

					[variableId.TitleNext]: ontime.state.eventNext?.title,
					[variableId.SubtitleNext]: ontime.state.eventNext?.subtitle,
					[variableId.SpeakerNext]: ontime.state.eventNext?.presenter,
					[variableId.NoteNext]: ontime.state.eventNext?.note,
					[variableId.CueNext]: ontime.state.eventNext?.cue,

					[variableId.TimerMessage]: ontime.state.timerMessage.text,
					[variableId.PublicMessage]: ontime.state.publicMessage.text,
					[variableId.LowerMessage]: ontime.state.lowerMessage.text,

					[variableId.TimerMessageVisible]: ontime.state.timerMessage.visible,
					[variableId.PublicMessageVisible]: ontime.state.publicMessage.visible,
					[variableId.LowerMessageVisible]: ontime.state.lowerMessage.visible,

					[variableId.TimerBlackout]: ontime.state.timerMessage.timerBlackout,
					[variableId.TimerBlink]: ontime.state.timerMessage.timerBlink,
				})
				self.checkFeedbacks(
					feedbackId.ColorRunning,
					feedbackId.ColorPaused,
					feedbackId.ColorStopped,
					feedbackId.ColorRoll,
					feedbackId.ColorNegative,
					feedbackId.ColorAddRemove,
					feedbackId.OnAir,
					feedbackId.TimerMessageVisible,
					feedbackId.ThisTimerMessageVisible,
					feedbackId.PublicMessageVisible,
					feedbackId.LowerMessageVisible,
					feedbackId.TimerBlink,
					feedbackId.TimerBlackout
				)
			}

			if (type === 'ontime-refetch' && self.config.refetchEvents === true) {
				self.log('debug', 'refetching events')
				void fetchEvents(self, ontime).then(
					() => {
						self.init_actions()
					},
					(e: any) => {
						self.log('debug', e)
					}
				)
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

export function socketSendJson(type: string, payload?: InputValue): void {
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

//@todo maybe we should take the whole event object here and decide where we consume it what data we need

export async function fetchEvents(self: OnTimeInstance, ontime: OntimeV2): Promise<void> {
	self.log('debug', 'fetching events from ontime')
	try {
		const response = await fetch(`http://${self.config.host}:${self.config.port}/data/rundown`)
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
