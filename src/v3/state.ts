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

enum SimplePlayback {
	Start = 'start',
	Pause = 'pause',
	Stop = 'stop',
}

enum SimpleDirection {
	CountUp = 'count-up',
	CountDown = 'count-down',
}

export type SimpleTimerState = {
	duration: number
	current: number
	playback: SimplePlayback
	direction: SimpleDirection
}

export enum Playback {
	Roll = 'roll',
	Play = 'play',
	Pause = 'pause',
	Stop = 'stop',
	Armed = 'armed',
}

type Message = {
	text: string
	visible: boolean
}

type TimerMessage = Message & {
	blink: boolean
	blackout: boolean
}

export type MessageState = {
	timer: TimerMessage
	public: Message
	lower: Message
	external: Message
}

enum SupportedEvent {
	Event = 'event',
	Delay = 'delay',
	Block = 'block',
}

type OntimeBaseEvent = {
	type: SupportedEvent
	id: string
	after?: string // used when creating an event to indicate its position in rundown
}

// type OntimeDelay = OntimeBaseEvent & {
// 	type: SupportedEvent.Delay
// 	duration: number
// }

// type OntimeBlock = OntimeBaseEvent & {
// 	type: SupportedEvent.Block
// 	title: string
// }

export type SimpleOntimeEvent = Pick<OntimeEvent, 'id' | 'cue' | 'title'>

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

enum EndAction {
	None = 'none',
	Stop = 'stop',
	LoadNext = 'load-next',
	PlayNext = 'play-next',
}

enum TimeStrategy {
	LockEnd = 'lock-end',
	LockDuration = 'lock-duration',
}

enum TimerType {
	CountDown = 'count-down',
	CountUp = 'count-up',
	TimeToEnd = 'time-to-end',
	Clock = 'clock',
}

// type CustomField = {
// 	type: 'string'
// 	colour: string
// 	label: string
// }

// type CustomFields = Record<string, CustomField>
type EventCustomFields = Record<string, { value: string }>

const stateobj: RuntimeStore = {
	clock: 0,
	timer: {
		current: null,
		elapsed: null,
		expectedFinish: null,
		addedTime: 0,
		startedAt: null,
		finishedAt: null,
		secondaryTimer: null,
		duration: null,
		playback: Playback.Stop,
	},
	onAir: false,
	message: {
		timer: { text: '', visible: false, blink: false, blackout: false },
		public: { text: '', visible: false },
		lower: { text: '', visible: false },
		external: { text: '', visible: false },
	},
	runtime: {
		numEvents: 0,
		selectedEventIndex: 0,
		offset: 0,
		plannedStart: 0,
		actualStart: 0,
		plannedEnd: 0,
		expectedEnd: 0,
	},
	eventNow: null,
	publicEventNow: null,
	eventNext: null,
	publicEventNext: null,
	timer1: {
		duration: 0,
		current: 0,
		playback: SimplePlayback.Stop,
		direction: SimpleDirection.CountDown,
	},
}

export { stateobj }
