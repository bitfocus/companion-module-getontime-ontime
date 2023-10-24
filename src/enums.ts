export enum ActionId {
	Start = 'start',
	StartId = 'startId',
	StartSelect = 'startSelect',
	StartIndex = 'startIndex',
	StartNext = 'startNext',
	StartCue = 'startCue',
	LoadId = 'loadId',
	LoadSelect = 'loadSelect',
	LoadIndex = 'loadIndex',
	LoadCue = 'loadCue',
	Pause = 'pause',
	Stop = 'stop',
	Reload = 'reload',
	Next = 'next',
	Previous = 'previous',
	Roll = 'roll',
	Delay = 'delay',
	SetOnAir = 'setOnAir',
	SetTimerMessageVisibility = 'setTimerMessageVisibility',
	SetTimerMessage = 'setTimerMessage',
	SetPublicMessageVisibility = 'setPublicMessageVisibility',
	SetPublicMessage = 'setPublicMessage',
	SetLowerMessageVisibility = 'setLowerMessageVisibility',
	SetLowerMessage = 'setLowerMessage',
	SetTimerBlackout = 'setTimerBlackout',
	SetTimerBlink = 'setTimerBlink',
}

export enum feedbackId {
	ColorRunning = 'state_color_running',
	ColorPaused = 'state_color_paused',
	ColorStopped = 'state_color_stopped',
	ColorRoll = 'state_color_roll',
	ColorNegative = 'timer_negative',
	OnAir = 'onAir',
	TimerMessageVisible = 'timerMessageVisible',
	PublicMessageVisible = 'publicMessageVisible',
	LowerMessageVisible = 'lowerMessageVisible',
	TimerBlink = 'timerBlink',
	TimerBlackout = 'timerBlackout',
}

export enum variableId {
	PlayState = 'playState',
	Clock = 'clock',
	TimerStart = 'timer_start',
	TimerFinish = 'timer_finish',
	TimerDelay = 'timer_delay',
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
}
