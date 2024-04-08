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
	TimerMessageVisible = 'timerMessageVisible',
	ThisTimerMessageVisible = 'thisTimerMessageVisible',
	PublicMessageVisible = 'publicMessageVisible',
	LowerMessageVisible = 'lowerMessageVisible',
	TimerBlink = 'timerBlink',
	TimerBlackout = 'timerBlackout',
	
	//v3
	MessageVisible = 'messageVisible',
	ThisMessageVisible = 'thisMessageVisible',
}

export enum deprecatedFeedbackId {
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
	Time = 'time',
	TimeHM = 'time_hm',
	TimeH = 'time_h',
	TimeM = 'time_m',
	TimeS = 'time_s',
	TitleNow = 'titleNow',
	SubtitleNow = 'subtitleNow',
	SpeakerNow = 'speakerNow',
	NoteNow = 'noteNow',
	CueNow = 'cueNow',
	TitleNext = 'titleNext',
	SubtitleNext = 'subtitleNext',
	SpeakerNext = 'speakerNext',
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

	//v3
	TimerTotalMs = 'timer_total_ms',
	IdNow = 'idNow',
	IdNext = 'idNext',
}
