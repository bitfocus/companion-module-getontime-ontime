import { InputValue, InstanceStatus } from '@companion-module/base'
import { OnTimeInstance } from '..'
import Websocket from 'ws'
import { findPreviousPlayableEvent, msToSplitTime, makeURL, variablesFromCustomFields } from '../utilities'
import { feedbackId, variableId } from '../enums'
import {
	CurrentBlockState,
	MessageState,
	OntimeBaseEvent,
	OntimeEvent,
	Runtime,
	SimpleTimerState,
	SupportedEvent,
	TimerState,
} from './ontime-types'
import { OntimeV3 } from './ontimev3'
import { CustomFields } from './ontime-types'

let ws: Websocket | null = null
let reconnectionTimeout: NodeJS.Timeout | null = null
let versionTimeout: NodeJS.Timeout | null = null
let reconnectInterval: number
let shouldReconnect = false

export function connect(self: OnTimeInstance, ontime: OntimeV3): void {
	reconnectInterval = self.config.reconnectInterval * 1000
	shouldReconnect = self.config.reconnect

	const wsUrls = makeURL(self.config.host, 'ws', self.config.ssl, true)

	if (!wsUrls) {
		self.updateStatus(InstanceStatus.BadConfig, `host format error`)
		return
	}

	self.updateStatus(InstanceStatus.Connecting, 'Trying WS connection')

	if (ws) {
		ws.close()
	}

	ws = new Websocket(wsUrls)

	self.log('info', `connection to server with: ${wsUrls}`)

	ws.onopen = () => {
		clearTimeout(reconnectionTimeout as NodeJS.Timeout)
		clearTimeout(versionTimeout as NodeJS.Timeout)
		self.updateStatus(InstanceStatus.Connecting)
		socketSendJson('version')
		versionTimeout = setTimeout(() => {
			self.updateStatus(InstanceStatus.ConnectionFailure, 'Unsupported version: see log')
			self.log(
				'error',
				'The version request timed out, this is most likely do to an old ontime version. You can download the latest version of Ontime through the website https://www.getontime.no/'
			)
			ws?.close()
		}, 500)
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

		self.setVariableValues({
			[variableId.TimerTotalMs]: val.current ?? 0,
			[variableId.TimeN]: timer.negative,
			[variableId.Time]: timer.hoursMinutesSeconds,
			[variableId.TimeHM]: timer.hoursMinutes,
			[variableId.TimeH]: timer.hours,
			[variableId.TimeM]: timer.minutes,
			[variableId.TimeS]: timer.seconds,
			[variableId.TimerPhase]: val.phase,
			[variableId.TimerStart]: timer_start.hoursMinutesSeconds,
			[variableId.TimerFinish]: timer_finish.hoursMinutesSeconds,
			[variableId.TimerAdded]: added.hoursMinutesSeconds,
			[variableId.TimerAddedNice]: added.delayString,
			[variableId.PlayState]: val.playback,
		})

		self.checkFeedbacks(
			feedbackId.ColorPlayback,
			feedbackId.ColorAddRemove,
			feedbackId.TimerPhase,
			feedbackId.TimerProgressBar,
			feedbackId.TimerProgressBarMulti
		)
	}

	const updateMessage = (val: MessageState) => {
		ontime.state.message = val
		self.setVariableValues({
			[variableId.TimerMessage]: val.timer.text,
			[variableId.ExternalMessage]: val.external,
			[variableId.TimerMessageVisible]: val.timer.visible,
			[variableId.TimerBlackout]: val.timer.blackout,
			[variableId.TimerBlink]: val.timer.blink,
			[variableId.TimerSecondarySource]: val.timer.secondarySource as string,
		})

		self.checkFeedbacks(
			feedbackId.MessageVisible,
			feedbackId.TimerBlackout,
			feedbackId.TimerBlink,
			feedbackId.MessageSecondarySourceVisible
		)
	}

	const updateRuntime = (val: Runtime) => {
		ontime.state.runtime = val
		const offset = msToSplitTime(ontime.state.runtime.offset)
		const plannedStart = msToSplitTime(val.plannedStart)
		const actualStart = msToSplitTime(val.actualStart)
		const plannedEnd = msToSplitTime(val.plannedEnd)
		const expectedEnd = msToSplitTime(val.expectedEnd)
		const selectedEventIndex = val.selectedEventIndex === null ? undefined : val.selectedEventIndex + 1
		self.setVariableValues({
			[variableId.NumberOfEvents]: val.numEvents,
			[variableId.SelectedEventIndex]: selectedEventIndex,
			[variableId.RundownOffset]: offset.hoursMinutesSeconds,
			[variableId.PlannedStart]: plannedStart.hoursMinutesSeconds,
			[variableId.ActualStart]: actualStart.hoursMinutesSeconds,
			[variableId.PlannedEnd]: plannedEnd.hoursMinutesSeconds,
			[variableId.ExpectedEnd]: expectedEnd.hoursMinutesSeconds,
		})
		self.checkFeedbacks(feedbackId.RundownOffset)
	}

	const updateEventNow = (val: OntimeEvent | null) => {
		ontime.state.eventNow = val
		self.setVariableValues({
			[variableId.TitleNow]: val?.title,
			[variableId.NoteNow]: val?.note,
			[variableId.CueNow]: val?.cue,
			[variableId.IdNow]: val?.id,
		})
		if (self.config.customToVariable) {
			self.setVariableValues(variablesFromCustomFields(ontime, 'Now', val?.custom))
			self.checkFeedbacks(feedbackId.CustomFieldsValue)
		}
	}

	const updateEventPrevious = (val: OntimeEvent | null) => {
		self.setVariableValues({
			[variableId.TitlePrevious]: val?.title ?? '',
			[variableId.NotePrevious]: val?.note ?? '',
			[variableId.CuePrevious]: val?.cue ?? '',
			[variableId.IdPrevious]: val?.id ?? '',
		})
		if (self.config.customToVariable) {
			self.setVariableValues(variablesFromCustomFields(ontime, 'Previous', val?.custom))
		}
	}

	const updateEventNext = (val: OntimeEvent | null) => {
		ontime.state.eventNext = val
		self.setVariableValues({
			[variableId.TitleNext]: val?.title ?? '',
			[variableId.NoteNext]: val?.note ?? '',
			[variableId.CueNext]: val?.cue ?? '',
			[variableId.IdNext]: val?.id ?? '',
		})
		if (self.config.customToVariable) {
			self.setVariableValues(variablesFromCustomFields(ontime, 'Next', val?.custom))
			self.checkFeedbacks(feedbackId.CustomFieldsValue)
		}
	}

	const updateCurrentBlock = (val: CurrentBlockState) => {
		ontime.state.currentBlock = val
		const startedAt = msToSplitTime(val.startedAt)
		self.setVariableValues({
			[variableId.CurrentBlockStartedAt]: startedAt.hoursMinutesSeconds,
			[variableId.CurrentBlockStartedAtMs]: val.startedAt ?? 0,
			[variableId.CurrentBlockTitle]: val.block?.title ?? '',
		})
	}

	const updateAuxTimer1 = (val: SimpleTimerState) => {
		ontime.state.auxtimer1 = val
		const duration = msToSplitTime(val.duration)
		const current = msToSplitTime(val.current)

		self.setVariableValues({
			[variableId.AuxTimerDurationMs + '-1']: val.duration,
			[variableId.AuxTimerCurrentMs + '-1']: val.current,
			[variableId.AuxTimerDirection + '-1']: duration.hoursMinutesSeconds,
			[variableId.AuxTimerCurrent + '-1']: current.hoursMinutesSeconds,
			[variableId.AuxTimerPalyback + '-1']: val.playback,
			[variableId.AuxTimerDirection + '-1']: val.direction,
		})
		self.checkFeedbacks(feedbackId.AuxTimerNegative, feedbackId.AuxTimerPlayback)
	}

	ws.onmessage = async (event: any) => {
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
					const prev = findPreviousPlayableEvent(ontime)
					updateEventPrevious(prev)
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
				case 'ontime-currentBlock': {
					updateCurrentBlock(payload)
					break
				}
				case 'ontime': {
					updateTimer(payload.timer)
					updateClock(payload.clock)
					updateMessage(payload.message)
					updateEventNow(payload.eventNow)
					updateEventNext(payload.eventNext)

					// currentBlock dons't exist in ontime prior to v3.5.0
					if ('currentBlock' in payload) {
						updateCurrentBlock(payload.currentBlock)
					}
					break
				}
				case 'version': {
					clearTimeout(versionTimeout as NodeJS.Timeout)
					const version = payload.split('.')
					self.log('info', `Ontime version "${payload}"`)
					self.log('debug', version)
					if (version.at(0) === '3') {
						if (Number(version.at(1)) < 6) {
							self.updateStatus(
								InstanceStatus.BadConfig,
								'Ontime version is too old (required >3.6.0) some features are not available'
							)
						} else {
							self.updateStatus(InstanceStatus.Ok, payload)
						}
						await fetchCustomFields(self, ontime)
						await fetchAllEvents(self, ontime)
						self.init_actions()
						self.init_feedbacks()
						const prev = findPreviousPlayableEvent(ontime)
						updateEventPrevious(prev)
						if (self.config.customToVariable) {
							self.setVariableDefinitions(ontime.getVariables(true))
						}
					} else {
						self.updateStatus(InstanceStatus.ConnectionFailure, 'Unsupported version: see log')
						self.log(
							'error',
							`Unsupported version "${payload}" You can download the latest version of Ontime through the website https://www.getontime.no/`
						)
						ws?.close()
					}
					break
				}
				case 'ontime-refetch': {
					if (self.config.refetchEvents) {
						await fetchAllEvents(self, ontime)
						const prev = findPreviousPlayableEvent(ontime)
						updateEventPrevious(prev)
						self.init_actions()
					}
					const change = await fetchCustomFields(self, ontime)
					if (change && self.config.customToVariable) {
						self.setVariableDefinitions(ontime.getVariables(true))
						self.init_feedbacks()
					}
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

async function fetchAllEvents(self: OnTimeInstance, ontime: OntimeV3): Promise<void> {
	const serverHttp = makeURL(self.config.host, 'data/rundown', self.config.ssl)
	if (!serverHttp) {
		return
	}
	self.log('debug', 'fetching events from ontime')
	try {
		const response = await fetch(serverHttp.href, {
			method: 'GET',
			headers: { 'if-none-match': rundownEtag, 'cache-control': '3600', pragma: '' },
		})
		if (response.status === 304) {
			self.log('debug', '304 -> nothing change in rundown')
			return
		}
		if (!response.ok) {
			ontime.events = []
			self.log('error', `uable to fetch events: ${response.statusText}`)
			return
		}
		rundownEtag = response.headers.get('Etag') ?? ''
		const data = (await response.json()) as OntimeBaseEvent[]
		ontime.events = data.filter((entry) => entry.type === SupportedEvent.Event) as OntimeEvent[]
		self.log('debug', `fetched ${ontime.events.length} events`)
	} catch (e: any) {
		ontime.events = []
		self.log('error', 'failed to fetch events from ontime')
		self.log('error', e.message)
	}
}

let customFieldsEtag: string = ''

//TODO: this might need to be updated on an interval
async function fetchCustomFields(self: OnTimeInstance, ontime: OntimeV3): Promise<boolean> {
	const serverHttp = makeURL(self.config.host, 'data/custom-fields', self.config.ssl)
	if (!serverHttp) {
		return false
	}
	self.log('debug', 'fetching custom-fields from ontime')
	try {
		const response = await fetch(serverHttp, {
			method: 'GET',
			headers: { 'if-none-match': customFieldsEtag, 'cache-control': '3600', pragma: '' },
		})
		if (response.status === 304) {
			self.log('debug', '304 -> nothing change custom fields')
			return false
		}
		if (!response.ok) {
			ontime.events = []
			self.log('error', `uable to fetch events: ${response.statusText}`)
			return false
		}
		customFieldsEtag = response.headers.get('Etag') ?? ''
		const data = (await response.json()) as CustomFields
		ontime.customFields = data
		return true
	} catch (e: any) {
		ontime.events = []
		self.log('error', `unable to fetch custom fields: ${e}`)
		return false
	}
}
