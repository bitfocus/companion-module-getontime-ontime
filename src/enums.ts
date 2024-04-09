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
	TimerTotalMs = 'timer_total_ms',
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
	ExtraTimerDurationMs = 'extraTimer_duration_ms',
	ExtraTimerDuration = 'extraTimer_duration',
	ExtraTimerCurrentMs = 'extraTimer_current_hms',
	ExtraTimerCurrent = 'extraTimer_current_hms',
	ExtraTimerPalyback = 'extraTimer_playback',
	ExtraTimerDirection = 'extraTimer_direction',
}

export enum deprecatedVariableId {
	SubtitleNow = 'subtitleNow',
	SpeakerNow = 'speakerNow',
	SubtitleNext = 'subtitleNext',
	SpeakerNext = 'speakerNext',
}
