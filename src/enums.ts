/**
 * maximum allowed time 23:59:59 as seconds
 */
export const MAX_TIME_MS = (23 * 60 * 60 + 59 * 60 + 59) * 1000

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
	Clock = 'clock',

	TimerCurrent = 'timer_current',

	TimerCurrentHMS = 'timer_current_hms',
	TimerCurrentN = 'timer_current_n',
	TimerCurrentH = 'timer_current_h',
	TimerCurrentM = 'timer_current_m',
	TimerCurrentS = 'timer_current_s',

	TimerDuration = 'timer_duration',
	TimerElapsed = 'timer_elapsed',
	TimerAdded = 'timer_added',
	TimerPhase = 'timer_phase',
	TimerExpectedFinish = 'timer_expected_finish',
	PlayState = 'playState',

	MessageText = 'message_text',
	MessageVisible = 'message_visible',
	MessageBlink = 'timer_blink',
	MessageBlackout = 'timer_blackout',
	MessageSecondarySource = 'message_secondary_source',
	MessageSecondary = 'message_secondary',

	TotalEvents = 'total_events',
	SelectedIndex = 'selected_index',

	Offset = 'offset',

	AuxTimerDuration = 'aux_duration',
	AuxTimerPlayback = 'aux_playback',
	AuxTimerCurrent = 'aux_current',
	AuxTimerDirection = 'aux_direction',
}
