// import { TimeDisplayTypes } from './v3/variables/time-variables'

export enum ActionId {
	Start = 'start',
	Load = 'load',
	Pause = 'pause',
	Stop = 'stop',
	Reload = 'reload',
	Roll = 'roll',

	Add = 'add',

	Change = 'change',

	TimerBlackout = 'TimerBlackout',
	TimerBlink = 'TimerBlink',
	MessageVisibility = 'setMessageVisibility',
	MessageText = 'setMessage',

	AuxTimerDuration = 'auxTimerDuration',
	AuxTimerPlayState = 'auxTimerPlayState',
	AuxTimerDirection = 'auxTimerDirection',
}

export enum deprecatedActionId {
	Next = 'next',
	Previous = 'previous',
	SetOnAir = 'setOnAir',
	SetTimerMessageVisibility = 'setTimerMessageVisibility',
	SetTimerMessage = 'setTimerMessage',
	SetPublicMessageVisibility = 'setPublicMessageVisibility',
	SetPublicMessage = 'setPublicMessage',
	SetLowerMessageVisibility = 'setLowerMessageVisibility',
	SetLowerMessage = 'setLowerMessage',
	StartId = 'startId',
	StartSelect = 'startSelect',
	StartIndex = 'startIndex',
	StartNext = 'startNext',
	StartCue = 'startCue',
	LoadId = 'loadId',
	LoadSelect = 'loadSelect',
	LoadIndex = 'loadIndex',
	LoadCue = 'loadCue',
	SetTimerBlackout = 'setTimerBlackout',
	SetTimerBlink = 'setTimerBlink',
}

export enum feedbackId {
	ColorPlayback = 'colorPlayback',
	ColorAddRemove = 'state_color_add_remove',
	OnAir = 'onAir',
	MessageVisible = 'messageVisible',
	TimerBlink = 'timerBlink',
	TimerBlackout = 'timerBlackout',
	TimerZone = 'timerZone',

	RundownOffset = 'rundownOffset',

	AuxTimerPlayback = 'auxTimerPlayback',
	AuxTimerNegative = 'auxTimerNegativePlayback',
}

export enum deprecatedFeedbackId {
	ThisMessageVisible = 'thisMessageVisible',
	TimerMessageVisible = 'timerMessageVisible',
	ThisTimerMessageVisible = 'thisTimerMessageVisible',
	PublicMessageVisible = 'publicMessageVisible',
	LowerMessageVisible = 'lowerMessageVisible',
	ColorRunning = 'state_color_running',
	ColorPaused = 'state_color_paused',
	ColorStopped = 'state_color_stopped',
	ColorRoll = 'state_color_roll',
	ColorNegative = 'timer_negative',
}

export const TIME_VARIABLES = {
	clock: { label: 'Clock', description: 'System clock', defaultValues: ['combine'] },
	timer_added: {
		label: 'Added time',
		description: 'User added time to current event',
		defaultValues: ['combine', 'nice'],
	},
	timer_start: {
		label: 'Start time',
		description: 'Start time of current timer',
		defaultValues: ['combine'],
	},
	timer_finish: {
		label: 'Finish time',
		description: 'Expected finish of current timer',
		defaultValues: ['combine'],
	},
	timer: {
		label: 'Current timer',
		description: 'Current timer',
		defaultValues: ['combine', 'ms', 'hh', 'mm', 'ss', 'sign', 'hhmm'],
	},
} as const

export enum variableId {
	PlayState = 'playState',

	// Clock = 'clock',

	// TimerStart = 'timer_start',
	// TimerFinish = 'timer_finish',
	// TimerAdded = 'timer_added',
	// TimerAddedNice = 'timer_added_nice',
	TimerTotalMs = 'timer_total_ms',
	TimerZone = 'time_zone',
	Time = 'time',
	TimeHM = 'time_hm',
	TimeH = 'time_h',
	TimeM = 'time_m',
	TimeS = 'time_s',
	TimeN = 'time_sign',

	IdNow = 'idNow',
	TitleNow = 'titleNow',
	NoteNow = 'noteNow',
	CueNow = 'cueNow',

	IdNext = 'idNext',
	TitleNext = 'titleNext',
	NoteNext = 'noteNext',
	CueNext = 'cueNext',

	TimerMessage = 'timerMessage',
	TimerMessageVisible = 'timerMessageVisible',
	TimerBlink = 'timerBlink',
	TimerBlackout = 'timerBlackout',

	AuxTimerDurationMs = 'auxTimer_duration_ms',
	AuxTimerPlayback = 'auxTimer_playback',
	AuxTimerCurrentMs = 'auxTimer_current_hms',
	AuxTimerCurrent = 'auxTimer_current_hms',
	AuxTimerPalyback = 'auxTimer_playback',
	AuxTimerDirection = 'auxTimer_direction',

	NumberOfEvents = 'numEvents',
	SelectedEventIndex = 'selectedEventIndex',
	RundownOffset = 'rundown_offset_hms',
	PlannedStart = 'plannedStart_hms',
	ActualStart = 'actualStart_hms',
	PlannedEnd = 'plannedEnd_hms',
	ExpectedEnd = 'expectedEnd_hms',
}

export enum deprecatedVariableId {
	SubtitleNow = 'subtitleNow',
	SpeakerNow = 'speakerNow',
	SubtitleNext = 'subtitleNext',
	SpeakerNext = 'speakerNext',
}
