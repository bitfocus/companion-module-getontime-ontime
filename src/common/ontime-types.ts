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
