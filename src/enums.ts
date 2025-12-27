/**
 * maximum allowed time 23:59:59 as seconds
 */
export const MAX_TIME_MS = (23 * 60 * 60 + 59 * 60 + 59) * 1000
export const SecondsMs = 1000
export const MinutesMs = 1000 * 60
export const HoursMs = 1000 * 60 * 60

export enum ActionId {
	Start = 'start',
	Load = 'load',
	Pause = 'pause',
	Stop = 'stop',
	Reload = 'reload',
	Roll = 'roll',
	PlaybackToggle = 'playback-toggle',

	Add = 'add',

	Change = 'change',

	MessageAction = 'messageAction',

	AuxTimerDuration = 'auxTimerDuration',
	AuxTimerPlayState = 'auxTimerPlayState',
	AuxTimerDirection = 'auxTimerDirection',
	AuxTimerAdd = 'auxTimerAdd',
}

export enum feedbackId {
	ColorPlayback = 'colorPlayback',
	ColorAddRemove = 'state_color_add_remove',
	OnAir = 'onAir',

	MessageFeedback = 'messageFeedback',

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
	ExpectedGroupEnd = 'expected_group_end',
	ExpectedRundownEnd = 'expected_rundown_end',
	ExpectedFlagStart = 'expected_flag_start',

	AuxTimerDuration = 'aux_duration',
	AuxTimerPlayback = 'aux_playback',
	AuxTimerCurrent = 'aux_current',
	AuxTimerDirection = 'aux_direction',
}

export enum ToggleOnOff {
	Off = 0,
	On = 1,
	Toggle = 2,
}
