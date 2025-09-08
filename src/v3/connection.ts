import { type InputValue, InstanceStatus } from '@companion-module/base'
import { OnTimeInstance } from '../index.js'
import Websocket from 'ws'
import { findPreviousPlayableEvent, msToSplitTime, makeURL, variablesFromCustomFields } from '../utilities.js'
import { feedbackId, variableId } from '../enums.js'

import { OntimeV3 } from '../ontimev3.js'
import type {
	CustomFields,
	OntimeEvent,
	SimpleTimerState,
	WsPacketToClient,
	ApiAction,
} from '@getontime/types'
import { MessageTag, SupportedEntry, RefetchKey } from '@getontime/types'

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
				'The version request timed out, this is most likely do to an old ontime version. You can download the latest version of Ontime through the website https://www.getontime.no/',
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

	//TODO: should update when selected event changes
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

	const updateAuxTimer = (val: SimpleTimerState, timer: 'auxtimer1' | 'auxtimer2' | 'auxtimer3') => {
		ontime.state[timer] = val
		const index = timer.at(-1)
		const duration = msToSplitTime(val.duration)
		const current = msToSplitTime(val.current)

		self.setVariableValues({
			[variableId.AuxTimerDurationMs + '-' + index]: val.duration,
			[variableId.AuxTimerCurrentMs + '-' + index]: val.current,
			[variableId.AuxTimerDirection + '-' + index]: duration.hoursMinutesSeconds,
			[variableId.AuxTimerCurrent + '-' + index]: current.hoursMinutesSeconds,
			[variableId.AuxTimerPlayback + '-' + index]: val.playback,
			[variableId.AuxTimerDirection + '-' + index]: val.direction,
		})
		self.checkFeedbacks(feedbackId.AuxTimerNegative, feedbackId.AuxTimerPlayback)
	}

	// eslint-disable-next-line @typescript-eslint/no-misused-promises -- TODO: not sure how to fix this
	ws.onmessage = async (event: any) => {
		try {
			const data = JSON.parse(event.data) as WsPacketToClient
			const { tag, payload } = data

			if (!tag) {
				return
			}

			switch (tag) {
				case MessageTag.RuntimeData: {
					if (payload.clock !== undefined) {
						ontime.state.clock = payload.clock
						const clock = msToSplitTime(payload.clock)
						self.setVariableValues({ [variableId.Clock]: clock.hoursMinutesSeconds })
						self.setVariableValues({ [variableId.ClockMs]: payload.clock })
					}

					if (payload.timer !== undefined) {
						ontime.state.timer = payload.timer
						const timer = msToSplitTime(payload.timer.current)
						const timer_start = msToSplitTime(payload.timer.startedAt)
						const timer_finish = msToSplitTime(payload.timer.expectedFinish)
						const added = msToSplitTime(payload.timer.addedTime)

						self.setVariableValues({
							[variableId.TimerTotalMs]: payload.timer.current ?? 0,
							[variableId.TimeN]: timer.negative,
							[variableId.Time]: timer.hoursMinutesSeconds,
							[variableId.TimeHM]: timer.hoursMinutes,
							[variableId.TimeH]: timer.hours,
							[variableId.TimeM]: timer.minutes,
							[variableId.TimeS]: timer.seconds,
							[variableId.TimerPhase]: payload.timer.phase,
							[variableId.TimerStart]: timer_start.hoursMinutesSeconds,
							[variableId.TimerFinish]: timer_finish.hoursMinutesSeconds,
							[variableId.TimerAdded]: added.hoursMinutesSeconds,
							[variableId.TimerAddedNice]: added.delayString,
							[variableId.PlayState]: payload.timer.playback,
						})
					}

					if (payload.message !== undefined) {
						ontime.state.message = payload.message

						self.setVariableValues({
							[variableId.TimerMessage]: payload.message.timer.text,
							[variableId.TimerMessageVisible]: payload.message.timer.visible,
							[variableId.TimerBlackout]: payload.message.timer.blackout,
							[variableId.TimerBlink]: payload.message.timer.blink,
							[variableId.TimerSecondarySource]: payload.message.timer.secondarySource as string,
						})

						self.checkFeedbacks(
							feedbackId.MessageVisible,
							feedbackId.TimerBlackout,
							feedbackId.TimerBlink,
							feedbackId.MessageSecondarySourceVisible,
						)
					}

					if (payload.rundown !== undefined) {
						ontime.state.rundown = payload.rundown
						const plannedStart = msToSplitTime(payload.rundown.plannedStart)
						const plannedEnd = msToSplitTime(payload.rundown.plannedEnd)
						const actualStart = msToSplitTime(payload.rundown.actualStart)
						const selectedEventIndex =
							payload.rundown.selectedEventIndex === null ? undefined : payload.rundown.selectedEventIndex + 1

						self.setVariableValues({
							[variableId.NumberOfEvents]: payload.rundown.numEvents,
							[variableId.SelectedEventIndex]: selectedEventIndex,
							[variableId.PlannedStart]: plannedStart.hoursMinutesSeconds,
							[variableId.ActualStart]: actualStart.hoursMinutesSeconds,
							[variableId.PlannedEnd]: plannedEnd.hoursMinutesSeconds,
						})
					}

					if (payload.offset !== undefined) {
						ontime.state.offset = payload.offset
						const offset = msToSplitTime(ontime.state.offset.absolute) // TODO: relative
						const expectedEnd = msToSplitTime(payload.offset.expectedRundownEnd)
						self.setVariableValues({
							[variableId.RundownOffset]: offset.hoursMinutesSeconds,
							[variableId.ExpectedEnd]: expectedEnd.hoursMinutesSeconds,
						})
						self.checkFeedbacks(feedbackId.RundownOffset)
					}

					if (payload.eventNow !== undefined) {
						ontime.state.eventNow = payload.eventNow
						self.setVariableValues({
							[variableId.TitleNow]: payload.eventNow?.title,
							[variableId.NoteNow]: payload.eventNow?.note,
							[variableId.CueNow]: payload.eventNow?.cue,
							[variableId.IdNow]: payload.eventNow?.id,
						})
						if (self.config.customToVariable) {
							self.setVariableValues(variablesFromCustomFields(ontime, 'Now', payload.eventNow?.custom))
							self.checkFeedbacks(feedbackId.CustomFieldsValue)
						}
					}

					if (payload.eventNext !== undefined) {
						ontime.state.eventNext = payload.eventNext
						self.setVariableValues({
							[variableId.TitleNext]: payload.eventNext?.title,
							[variableId.NoteNext]: payload.eventNext?.note,
							[variableId.CueNext]: payload.eventNext?.cue,
							[variableId.IdNext]: payload.eventNext?.id,
						})
						if (self.config.customToVariable) {
							self.setVariableValues(variablesFromCustomFields(ontime, 'Next', payload.eventNext?.custom))
							self.checkFeedbacks(feedbackId.CustomFieldsValue)
						}
					}

					if (payload.auxtimer1 !== undefined) {
						updateAuxTimer(payload.auxtimer1, 'auxtimer1')
					}
					break
				}

				case MessageTag.Dialog:
				case MessageTag.ClientInit:
				case MessageTag.ClientList:
				case MessageTag.ClientRedirect:
				case MessageTag.ClientRename: {
					/** void all client control packets */
					break
				}

				case MessageTag.Pong:
				case MessageTag.Log: {
					//TODO: maybe...
					break
				}

				case MessageTag.Refetch: {
					switch (payload.target) {
						case RefetchKey.Rundown: {
							if (!self.config.refetchEvents) break
							await fetchAllEvents(self, ontime)
							const prev = findPreviousPlayableEvent(ontime)
							updateEventPrevious(prev)
							self.init_actions()
							break
						}
						case RefetchKey.CustomFields: {
							if (!self.config.customToVariable) break
							const change = await fetchCustomFields(self, ontime)
							if (!change) break
							self.setVariableDefinitions(ontime.getVariables(true))
							self.init_feedbacks()
							break
						}
					}
					break
				}
				default: {
					tag satisfies never
					const apiReply = tag as ApiAction
					if (apiReply === 'version') {
						clearTimeout(versionTimeout as NodeJS.Timeout)
						const version = (payload as string).split('.')
						self.log('info', `Ontime version "${payload}"`)
						if (version.at(0) === '4') {
							self.updateStatus(InstanceStatus.Ok, payload)
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
								`Unsupported version "${payload}" You can download the latest version of Ontime through the website https://www.getontime.no/`,
							)
							ws?.close()
						}
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

export function socketSendJson(tag: string, payload?: InputValue | object): void {
	if (ws && ws.readyState === ws.OPEN) {
		ws.send(JSON.stringify({ tag, payload }))
	}
}

let rundownEtag: string = ''

async function fetchAllEvents(self: OnTimeInstance, ontime: OntimeV3): Promise<void> {
	const serverHttp = makeURL(self.config.host, 'data/rundown/current', self.config.ssl)
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
			self.log('error', `unable to fetch events: ${response.statusText}`)
			return
		}
		rundownEtag = response.headers.get('Etag') ?? ''
		const { flatOrder, entries } = (await response.json()) as {
			id: string
			title: string
			order: string[]
			flatOrder: string[]
			entries: Record<string, OntimeEvent>
			revision: number
		}

		ontime.events = flatOrder.map((id) => entries[id]).filter((entry) => entry.type === SupportedEntry.Event)
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
