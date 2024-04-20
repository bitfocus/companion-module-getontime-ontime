import { InputValue, InstanceStatus } from '@companion-module/base'
import { OnTimeInstance } from '..'
import Websocket from 'ws'
import { extractTimerZone, msToSplitTime } from '../utilities'
import { feedbackId, variableId } from '../enums'
import { MessageState, OntimeEvent, Runtime, SimpleTimerState, TimerState } from './ontime-types'
import { OntimeV3 } from './ontimev3'
import { CustomFields } from './ontime-types'
import { TimerZone } from './ontime-types'

let ws: Websocket | null = null
let reconnectionTimeout: NodeJS.Timeout | null = null
let versionTimeout: NodeJS.Timeout | null = null
let reconnectInterval: number
let shouldReconnect = false

export function connect(self: OnTimeInstance, ontime: OntimeV3): void {
	reconnectInterval = self.config.reconnectInterval * 1000
	shouldReconnect = self.config.reconnect

	const host = self.config.host
	const port = self.config.port

	if (!host || !port) {
		self.updateStatus(InstanceStatus.BadConfig, `no host and/or port defined`)
		return
	}

	self.updateStatus(InstanceStatus.Connecting, 'Trying WS connection')

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
		self.updateStatus(InstanceStatus.Connecting, 'Ensurreing Ontime V3...')
		socketSendJson('version')
		versionTimeout = setTimeout(() => {
			self.updateStatus(InstanceStatus.ConnectionFailure, 'Version confirmation timed out')
			ws?.close()
		}, 1000)
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
		const clock = msToSplitTime(val)
		self.setVariableValues({ [variableId.Clock]: clock.hoursMinutesSeconds })
	}

	const updateTimer = (val: TimerState) => {
		ontime.state.timer = val
		const timer = msToSplitTime(val.current)
		const timer_start = msToSplitTime(val.startedAt)
		const timer_finish = msToSplitTime(val.expectedFinish)
		const added = msToSplitTime(val.addedTime)

		let timerZone = TimerZone.None
		if (ontime.state.eventNow) {
			const { timeWarning, timeDanger } = ontime.state.eventNow
			timerZone = extractTimerZone(ontime.state.timer.current, { timeWarning, timeDanger })
		}
		ontime.state.companionSpecific.timerZone = timerZone
		self.setVariableValues({
			[variableId.TimerTotalMs]: val.current ?? 0,
			[variableId.Time]: timer.hoursMinutesSeconds,
			[variableId.TimeHM]: timer.hoursMinutes,
			[variableId.TimeH]: timer.hours,
			[variableId.TimeM]: timer.minutes,
			[variableId.TimeS]: timer.seconds,
			[variableId.TimerZone]: timerZone,
			[variableId.TimerStart]: timer_start.hoursMinutesSeconds,
			[variableId.TimerFinish]: timer_finish.hoursMinutesSeconds,
			[variableId.TimerAdded]: added.hoursMinutesSeconds,
			[variableId.TimerAddedNice]: added.delayString,
			[variableId.PlayState]: val.playback,
		})

		self.checkFeedbacks(
			feedbackId.ColorPlayback,
			feedbackId.ColorNegative,
			feedbackId.ColorAddRemove,
			feedbackId.TimerZone
		)
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
			[variableId.TimerMessageVisible]: val.timer.visible,
			[variableId.TimerBlackout]: val.timer.blackout,
			[variableId.TimerBlink]: val.timer.blink,
		})

		self.checkFeedbacks(feedbackId.MessageVisible, feedbackId.TimerBlackout, feedbackId.TimerBlink)
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

	const updateAuxTimer1 = (val: SimpleTimerState) => {
		ontime.state.timer1 = val
		const duration = msToSplitTime(val.duration)
		const current = msToSplitTime(val.current)

		self.setVariableValues({
			[variableId.AuxTimerDurationMs + '-1']: val.duration,
			[variableId.AuxTimerCurrentMs + '-1']: val.current,
			[variableId.AuxTimerDuration + '-1']: duration.hoursMinutesSeconds,
			[variableId.AuxTimerCurrent + '-1']: current.hoursMinutesSeconds,
			[variableId.AuxTimerPalyback + '-1']: val.playback,
			[variableId.AuxTimerDirection + '-1']: val.direction,
		})
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
				case 'ontime-eventNext': {
					updateEventNext(payload)
					break
				}
				case 'ontime-auxtimer1': {
					updateAuxTimer1(payload)
					break
				}
				case 'version': {
					//TODO: check actual version
					if (versionTimeout) {
						clearTimeout(versionTimeout)
					}
					self.updateStatus(InstanceStatus.Ok)
					self.log('debug', 'Socket connected')
					void fetchAllEvents(self, ontime)
					void fetchCustomFields(self, ontime)
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

export function socketSendJson(type: string, payload?: InputValue | object): void {
	if (ws && ws.readyState === ws.OPEN) {
		ws.send(
			JSON.stringify({
				type,
				payload,
			})
		)
	}
}

let rundownEtag: string = ''

export async function fetchAllEvents(self: OnTimeInstance, ontime: OntimeV3): Promise<void> {
	self.log('debug', 'fetching events from ontime')
	try {
		const response = await fetch(`http://${self.config.host}:${self.config.port}/data/rundown`, {
			method: 'GET',
			headers: { Etag: rundownEtag },
		})
		if (!response.ok) {
			self.log('error', `uable to fetch events: ${response.statusText}`)
			return
		}
		if (response.status === 304) {
			return
		}
		rundownEtag = response.headers.get('Etag') ?? ''
		const data = (await response.json()) as OntimeEvent[]
		self.log('debug', `fetched ${data.length} events`)
		ontime.events = data

		self.init_actions()
	} catch (e: any) {
		ontime.events = []
		self.log('error', 'failed to fetch events from ontime')
		self.log('error', e)
	}
}

let customFieldsEtag: string = ''
let customFieldsTimeout: NodeJS.Timeout

export async function fetchCustomFields(self: OnTimeInstance, ontime: OntimeV3): Promise<void> {
	clearTimeout(customFieldsTimeout)
	if (self.config.refetchEvents) {
		customFieldsTimeout = setTimeout(() => fetchCustomFields(self, ontime), 60000)
	}
	self.log('debug', 'fetching custom-fields from ontime')
	try {
		const response = await fetch(`http://${self.config.host}:${self.config.port}/data/custom-fields`, {
			method: 'GET',
			headers: { Etag: customFieldsEtag },
		})
		if (response.status === 304) {
			return
		}
		customFieldsEtag = response.headers.get('Etag') ?? ''
		const data = (await response.json()) as CustomFields
		ontime.customFields = data

		self.init_actions()
	} catch (e: any) {
		ontime.events = []
		self.log('error', 'failed to fetch events from ontime')
		self.log('error', e)
	}
}
