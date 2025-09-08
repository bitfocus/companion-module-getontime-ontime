/**
 * maximum allowed time 23:59:59 as seconds
 */
export const MAX_TIME_SECONDS = 23 * 60 * 60 + 59 * 60 + 59

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
	MessageVisibilityAndText = 'setMessageVisibilityAndText',
	MessageSecondarySource = 'setMessageSecondarySource',
	MessageText = 'setMessage',

	AuxTimerDuration = 'auxTimerDuration',
	AuxTimerPlayState = 'auxTimerPlayState',
	AuxTimerDirection = 'auxTimerDirection',
	AuxTimerAdd = 'auxTimerAdd',
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
	MessageSecondarySourceVisible = 'messageSecondarySourceVisible',
	TimerBlink = 'timerBlink',
	TimerBlackout = 'timerBlackout',
	TimerPhase = 'timerPhase',

	TimerProgressBar = 'timerProgressBar',
	TimerProgressBarMulti = 'timerProgressBarMulti',

	RundownOffset = 'rundownOffset',

	CustomFieldsValue = 'customFieldsValue',

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
	TimerZone = 'timerZone',
}

export enum variableId {
	/** Clock */
	Clock = 'clock',
	ClockMs = 'clock_ms',

	/** Timer */
	TimerAdded = 'timer_added',
	TimerAddedNice = 'timer_added_nice',
	PlayState = 'playState',
	/** Timer.current */
	TimerTotalMs = 'timer_total_ms',
	Time = 'time',
	TimeHM = 'time_hm',
	TimeH = 'time_h',
	TimeM = 'time_m',
	TimeS = 'time_s',
	TimeN = 'time_sign',

	TimerFinish = 'timer_finish',
	TimerStart = 'timer_start',
	TimerPhase = 'timer_phase',

	/** Event Now */
	IdNow = 'idNow',
	TitleNow = 'titleNow',
	NoteNow = 'noteNow',
	CueNow = 'cueNow',

	/** Event Next */
	IdNext = 'idNext',
	TitleNext = 'titleNext',
	NoteNext = 'noteNext',
	CueNext = 'cueNext',

	/** Event Prev <- calculated local */
	IdPrevious = 'idPrevious',
	TitlePrevious = 'titlePrevious',
	NotePrevious = 'notePrevious',
	CuePrevious = 'cuePrevious',

	/** Message */
	/** message.timer.text */
	TimerMessage = 'timerMessage',
	/** message.timer.visible */
	TimerMessageVisible = 'timerMessageVisible',
	/** message.timer.blink */
	TimerBlink = 'timerBlink',
	/** message.timer.blackout */
	TimerBlackout = 'timerBlackout',
	/** message.timer.secondarySource */
	TimerSecondarySource = 'timerSecondarySource',
	/** message.secondary */
	ExternalMessage = 'externalMessage',

	/** Rundown */
	SelectedEventIndex = 'selectedEventIndex',
	NumberOfEvents = 'numEvents',
	PlannedStart = 'plannedStart_hms',
	ActualStart = 'actualStart_hms',
	PlannedEnd = 'plannedEnd_hms',

	/** Offset */
	RundownOffset = 'rundown_offset_hms',
	//TODO: absolute relative
	ExpectedEnd = 'expectedEnd_hms',
	//TODO: mode, expectedGroupEnd, expectedRundownEnd, expectedFlagStart

	AuxTimerDurationMs = 'auxTimer_duration_ms',
	AuxTimerPlayback = 'auxTimer_playback',
	AuxTimerCurrentMs = 'auxTimer_current_ms',
	AuxTimerCurrent = 'auxTimer_current_hms',
	AuxTimerDirection = 'auxTimer_direction',
}

export enum OffsetState {
	On = 'on',
	Behind = 'behind',
	Ahead = 'ahead',
	Both = 'both',
}

export enum deprecatedVariableId {
	SubtitleNow = 'subtitleNow',
	SpeakerNow = 'speakerNow',
	SubtitleNext = 'subtitleNext',
	SpeakerNext = 'speakerNext',
}
