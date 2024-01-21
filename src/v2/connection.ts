import { InputValue, InstanceStatus } from '@companion-module/base'
import { OnTimeInstance } from '..'
import Websocket from 'ws'
import { mstoTime, toReadableTime } from '../utilities'
import axios from 'axios'
import { feedbackId, variableId } from '../enums'

let ws: Websocket | null = null
let reconnectionTimeout: NodeJS.Timeout | null = null
let reconnectInterval: number
let shouldReconnect = false

export function connect(self: OnTimeInstance): void {
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
		void fetchEvents(self)
	}

	ws.onclose = (event) => {
		self.log('debug', `Connection closed with code ${event.code}`)
		if (shouldReconnect) {
			reconnectionTimeout = setTimeout(() => {
				if (ws && ws.readyState === Websocket.CLOSED) {
					void connect(self)
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
				self.states = payload

				const timer = self.states.timer.current === null ? null : toReadableTime(self.states.timer.current)
				const clock = toReadableTime(self.states.timer.clock)
				const timer_start = self.states.timer.startedAt === null ? null : toReadableTime(self.states.timer.startedAt)
				const timer_finish =
					self.states.timer.expectedFinish === null ? null : toReadableTime(self.states.timer.expectedFinish)
				const added = mstoTime(self.states.timer.addedTime)

				self.setVariableValues({
					[variableId.Time]: timer === null ? undefined : timer.hours + ':' + timer.minutes + ':' + timer.seconds,
					[variableId.TimeHM]: timer === null ? undefined : timer.hours + ':' + timer.minutes,
					[variableId.TimeH]: timer === null ? undefined : timer.hours,
					[variableId.TimeM]: timer === null ? undefined : timer.minutes,
					[variableId.TimeS]: timer === null ? undefined : timer.seconds,
					[variableId.Clock]: clock.hours + ':' + clock.minutes + ':' + clock.seconds,
					[variableId.TimerStart]:
						timer_start === null
							? undefined
							: timer_start.hours + ':' + timer_start.minutes + ':' + timer_start.seconds,
					[variableId.TimerFinish]:
						timer_finish === null
							? undefined
							: timer_finish.hours + ':' + timer_finish.minutes + ':' + timer_finish.seconds,
					[variableId.TimerAdded]: added,

					[variableId.PlayState]: self.states.playback,
					[variableId.OnAir]: self.states.onAir,

					[variableId.TitleNow]: self.states.eventNow?.title,
					[variableId.SubtitleNow]: self.states.eventNow?.subtitle,
					[variableId.SpeakerNow]: self.states.eventNow?.presenter,
					[variableId.NoteNow]: self.states.eventNow?.note,
					[variableId.CueNow]: self.states.eventNow?.cue,

					[variableId.TitleNext]: self.states.eventNext?.title,
					[variableId.SubtitleNext]: self.states.eventNext?.subtitle,
					[variableId.SpeakerNext]: self.states.eventNext?.presenter,
					[variableId.NoteNext]: self.states.eventNext?.note,
					[variableId.CueNext]: self.states.eventNext?.cue,

					[variableId.TimerMessage]: self.states.timerMessage.text,
					[variableId.PublicMessage]: self.states.publicMessage.text,
					[variableId.LowerMessage]: self.states.lowerMessage.text,

					[variableId.TimerMessageVisible]: self.states.timerMessage.visible,
					[variableId.PublicMessageVisible]: self.states.publicMessage.visible,
					[variableId.LowerMessageVisible]: self.states.lowerMessage.visible,

					[variableId.TimerBlackout]: self.states.timerMessage.timerBlackout,
					[variableId.TimerBlink]: self.states.timerMessage.timerBlink,
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
				void fetchEvents(self).then(
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

export async function fetchEvents(self: OnTimeInstance): Promise<void> {
	self.log('debug', 'fetching events from ontime')
	try {
		const result = await axios.get(`http://${self.config.host}:${self.config.port}/events`, { responseType: 'json' })
		self.log('debug', `fetched ${result.data.length} events`)
		self.events = []
		self.events = result.data
			.filter((event: any) => event.type === 'event')
			.map((event: any) => ({
				id: event.id,
				label: event.title,
			}))
		self.init_actions()
	} catch (e: any) {
		self.events = [{ id: 'noEvents', label: 'No events found' }]
		self.log('error', 'failed to fetch events from ontime')
		self.log('error', e)
	}
}
