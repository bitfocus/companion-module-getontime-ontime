type RuntimeStore = {
	// timer service
	timer: TimerState
	playback: Playback

	// messages service
	timerMessage: TimerMessage
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

enum TimerType {
	CountDown = 'count-down',
	CountUp = 'count-up',
	TimeToEnd = 'time-to-end',
	Clock = 'clock',
}

enum EndAction {
	None = 'none',
	Stop = 'stop',
	LoadNext = 'load-next',
	PlayNext = 'play-next',
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

type Message = {
	text: string
	visible: boolean
}

type TimerMessage = Message & {
	timerBlink: boolean
	timerBlackout: boolean
}

enum Playback {
	Roll = 'roll',
	Play = 'play',
	Pause = 'pause',
	Stop = 'stop',
	Armed = 'armed',
}
type Loaded = {
	numEvents: number
	selectedEventIndex: number | null
	selectedEventId: string | null
	selectedPublicEventId: string | null
	nextEventId: string | null
	nextPublicEventId: string | null
}

const stateobj: RuntimeStore = {
	timer: {
		clock: 0,
		current: null,
		elapsed: null,
		expectedFinish: null,
		addedTime: 0,
		startedAt: null,
		finishedAt: null,
		secondaryTimer: null,
		selectedEventId: null,
		duration: null,
		timerType: null,
		endAction: null,
	},
	playback: Playback.Stop,
	timerMessage: { text: '', visible: false, timerBlink: false, timerBlackout: false },
	publicMessage: { text: '', visible: false },
	lowerMessage: { text: '', visible: false },
	externalMessage: { text: '', visible: false },
	onAir: false,
	loaded: {
		selectedEventIndex: null,
		selectedEventId: null,
		selectedPublicEventId: null,
		nextEventId: null,
		nextPublicEventId: null,
		numEvents: 0,
	},
	eventNow: null,
	publicEventNow: null,
	eventNext: null,
	publicEventNext: null,
}

export { stateobj }
