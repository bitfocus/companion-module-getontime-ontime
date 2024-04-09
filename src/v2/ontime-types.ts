import { EndAction, Message, OntimeBaseEvent, Playback, SupportedEvent, TimerType } from '../common/ontime-types'

// Main runtime store

export type RuntimeStore = {
	// timer service
	timer: TimerState
	playback: Playback

	// messages service
	timerMessage: Message & { timerBlink: boolean; timerBlackout: boolean }
	publicMessage: Message
	lowerMessage: Message
	externalMessage: Message
	onAir: boolean

	// event loader
	loaded: Loaded
	eventNow: OntimeEvent | null
	publicEventNow: OntimeEvent | null
	eventNext: OntimeEvent | null
	publicEventNext: OntimeEvent | null
}

type Loaded = {
	numEvents: number
	selectedEventIndex: number | null
	selectedEventId: string | null
	selectedPublicEventId: string | null
	nextEventId: string | null
	nextPublicEventId: string | null
}

type TimerState = {
	clock: number // realtime clock
	current: number | null // running countdown
	elapsed: number | null // elapsed time in current timer
	expectedFinish: number | null
	addedTime: number // time added by user, can be negative
	startedAt: number | null
	finishedAt: number | null // only if timer has already finished
	secondaryTimer: number | null // used for roll mode
	selectedEventId: string | null
	duration: number | null
	timerType: TimerType | null
	endAction: EndAction | null
}

// Event

export type OntimeEvent = OntimeBaseEvent & {
	type: SupportedEvent.Event
	cue: string
	title: string
	subtitle: string
	presenter: string
	note: string
	endAction: EndAction
	timerType: TimerType
	timeStart: number
	timeEnd: number
	duration: number
	isPublic: boolean
	skip: boolean
	colour: string
	user0: string
	user1: string
	user2: string
	user3: string
	user4: string
	user5: string
	user6: string
	user7: string
	user8: string
	user9: string
	revision: number
	delay?: number // calculated at runtime
}
