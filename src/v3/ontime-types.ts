//Playbeck

export enum Playback {
	Roll = 'roll',
	Play = 'play',
	Pause = 'pause',
	Stop = 'stop',
	Armed = 'armed',
}

// Message

export type Message = {
	text: string
	visible: boolean
}

// Event

export enum SupportedEvent {
	Event = 'event',
	Delay = 'delay',
	Block = 'block',
}

/**
 * {@link https://github.com/cpvalente/ontime/blob/8f249b9d515fb0d799514d3a67de6713f5029faf/packages/types/src/definitions/core/OntimeEvent.type.ts GitHub}.
 */
export type OntimeBaseEvent = {
	type: SupportedEvent
	id: string
	after?: string // used when creating an event to indicate its position in rundown
}

export enum EndAction {
	None = 'none',
	Stop = 'stop',
	LoadNext = 'load-next',
	PlayNext = 'play-next',
}

export enum TimerType {
	CountDown = 'count-down',
	CountUp = 'count-up',
	TimeToEnd = 'time-to-end',
	Clock = 'clock',
}

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
	// publicEventNow: OntimeEvent | null
	eventNext: OntimeEvent | null
	// publicEventNext: OntimeEvent | null
	currentBlock: CurrentBlockState
	// extra timers
	auxtimer1: SimpleTimerState
}

/**
 * {@link https://github.com/cpvalente/ontime/blob/master/packages/types/src/definitions/runtime/TimerState.type.ts GitHub}
 */
export enum TimerPhase {
	None = 'none',
	Default = 'default',
	Warning = 'warning',
	Danger = 'danger',
	Overtime = 'overtime',
	Pending = 'pending', // used for waiting to roll
}

/**
 * {@link https://github.com/cpvalente/ontime/blob/master/packages/types/src/definitions/runtime/TimerState.type.ts GitHub}
 */
export type TimerState = {
	addedTime: number // time added by user, can be negative
	current: number | null // running countdown
	duration: number | null // normalised duration of current event
	elapsed: number | null // elapsed time in current timer
	expectedFinish: number | null // time we expect timer to finish
	finishedAt: number | null // only if timer has already finished
	phase: TimerPhase
	playback: Playback
	secondaryTimer: number | null // used for roll mode
	startedAt: number | null // only if timer has already started
}

/**
 * {@link https://github.com/cpvalente/ontime/blob/master/packages/types/src/definitions/runtime/Runtime.type.ts GitHub}
 */
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
	delay: number // calculated at runtime
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

export type OntimeBlock = OntimeBaseEvent & {
	type: SupportedEvent.Block
	title: string
}

export type CurrentBlockState = {
	block: OntimeBlock | null
	startedAt: number | null
}
