export enum ActionId {
	Start = 'start',
	Pause = 'pause',
	Stop = 'stop',
	Reload = 'reload',
	Roll = 'roll',
	Add = 'add',
	Change = 'change',
	TimerBlackout = 'TimerBlackout',
	TimerBlink = 'TimerBlink',
	Load = 'load',
	MessageVisibility = 'setMessageVisibility',
	MessageText = 'setMessage',

	//V3
	AuxTimerDuration = 'extraTimerDuration',
	AuxTimerPlayState = 'extraTimerPlayState',
	AuxTimerDirection = 'extraTimerDirection',
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
	ColorNegative = 'timer_negative',
	ColorAddRemove = 'state_color_add_remove',
	OnAir = 'onAir',
	MessageVisible = 'messageVisible',
	TimerBlink = 'timerBlink',
	TimerBlackout = 'timerBlackout',
	TimerZone = 'timerZone',

	//v3
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
}

export enum variableId {
	PlayState = 'playState',
	Clock = 'clock',
	TimerStart = 'timer_start',
	TimerFinish = 'timer_finish',
	TimerAdded = 'timer_added',
	TimerAddedNice = 'timer_added_nice',
	TimerTotalMs = 'timer_total_ms',
	TimerZone = 'time_zone',
	Time = 'time',
	TimeHM = 'time_hm',
	TimeH = 'time_h',
	TimeM = 'time_m',
	TimeS = 'time_s',
	IdNow = 'idNow',
	TitleNow = 'titleNow',
	NoteNow = 'noteNow',
	CueNow = 'cueNow',
	IdNext = 'idNext',
	TitleNext = 'titleNext',
	NoteNext = 'noteNext',
	CueNext = 'cueNext',
	OnAir = 'onAir',
	TimerMessage = 'timerMessage',
	PublicMessage = 'publicMessage',
	LowerMessage = 'lowerMessage',
	TimerMessageVisible = 'timerMessageVisible',
	PublicMessageVisible = 'publicMessageVisible',
	LowerMessageVisible = 'lowerMessageVisible',
	TimerBlink = 'timerBlink',
	TimerBlackout = 'timerBlackout',

	//V3
	AuxTimerDurationMs = 'extraTimer_duration_ms',
	AuxTimerDuration = 'extraTimer_duration',
	AuxTimerCurrentMs = 'extraTimer_current_hms',
	AuxTimerCurrent = 'extraTimer_current_hms',
	AuxTimerPalyback = 'extraTimer_playback',
	AuxTimerDirection = 'extraTimer_direction',
}

export enum deprecatedVariableId {
	SubtitleNow = 'subtitleNow',
	SpeakerNow = 'speakerNow',
	SubtitleNext = 'subtitleNext',
	SpeakerNext = 'speakerNext',
}
