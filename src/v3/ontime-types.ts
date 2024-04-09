import { EndAction, Message, OntimeBaseEvent, Playback, SupportedEvent, TimerType } from '../common/ontime-types'

// Main runtime store

export type RuntimeStore = {
	// timer data
	clock: number
	timer: TimerState
	onAir: boolean

	// messages service
	message: MessageState

	// rundown data
	runtime: Runtime
	eventNow: OntimeEvent | null
	publicEventNow: OntimeEvent | null
	eventNext: OntimeEvent | null
	publicEventNext: OntimeEvent | null

	// extra timers
	timer1: SimpleTimerState
}

export type TimerState = {
	addedTime: number // time added by user, can be negative
	current: number | null // running countdown
	duration: number | null // normalised duration of current event
	elapsed: number | null // elapsed time in current timer
	expectedFinish: number | null // time we expect timer to finish
	finishedAt: number | null // only if timer has already finished
	playback: Playback
	secondaryTimer: number | null // used for roll mode
	startedAt: number | null // only if timer has already started
}

export type Runtime = {
	numEvents: number
	selectedEventIndex: number | null
	offset: number | null
	plannedStart: number | null
	actualStart: number | null
	plannedEnd: number | null
	expectedEnd: number | null
}

// Event

export type OntimeEvent = OntimeBaseEvent & {
	type: SupportedEvent.Event
	cue: string
	title: string
	note: string
	endAction: EndAction
	timerType: TimerType
	linkStart: string | null // ID of event to link to
	timeStrategy: TimeStrategy
	timeStart: number
	timeEnd: number
	duration: number
	isPublic: boolean
	skip: boolean
	colour: string
	revision: number
	delay?: number // calculated at runtime
	timeWarning: number
	timeDanger: number
	custom: EventCustomFields
}

export enum TimeStrategy {
	LockEnd = 'lock-end',
	LockDuration = 'lock-duration',
}

// Message

export type MessageState = {
	timer: TimerMessage
	public: Message
	lower: Message
	external: Message
}

type TimerMessage = Message & {
	blink: boolean
	blackout: boolean
}

// Custom fields

export type CustomField = {
	type: 'string'
	colour: string
	label: string
}

export type CustomFields = Record<string, CustomField>
export type EventCustomFields = Record<string, { value: string }>

//Extra timer

export enum SimplePlayback {
	Start = 'start',
	Pause = 'pause',
	Stop = 'stop',
}

export enum SimpleDirection {
	CountUp = 'count-up',
	CountDown = 'count-down',
}

export type SimpleTimerState = {
	duration: number
	current: number
	playback: SimplePlayback
	direction: SimpleDirection
}
