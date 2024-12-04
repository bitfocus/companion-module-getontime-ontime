import {
	CompanionButtonPresetDefinition,
	CompanionButtonStyleProps,
	CompanionPresetDefinitions,
} from '@companion-module/base'
import * as icons from '../assets/icons'
import { ActionId, feedbackId } from '../enums'
import { TimerPhase } from './ontime-types'
import { graphics } from 'companion-module-utils'
import {
	ActiveBlue,
	Black,
	DangerRed,
	NormalGray,
	PauseOrange,
	PlaybackGreen,
	PlaybackRed,
	RollBlue,
	WarningOrange,
	White,
} from '../assets/colours'

export function presets(): CompanionPresetDefinitions {
	return { ...playbackPresets, ...timerPresets, ...auxTimerPresets, ...rundownPresets, ...messagePresets }
}

const defaultStyle: CompanionButtonStyleProps = {
	size: '24',
	color: White,
	bgcolor: Black,
	text: '',
	alignment: 'center:center',
	// show_topbar: false,
}

const defaultWithIconStyle: CompanionButtonStyleProps = {
	pngalignment: 'center:top',
	size: '14',
	color: White,
	bgcolor: Black,
	text: '',
	alignment: 'center:bottom',
	// show_topbar: false,
}

const canPlayFeedback = [
	{
		feedbackId: feedbackId.ColorPlayback,
		options: {
			state: 'play',
		},
		style: {
			color: White,
			bgcolor: PlaybackGreen,
		},
	},
	{
		feedbackId: feedbackId.ColorPlayback,
		options: {
			state: 'armed',
		},
		style: {
			color: PlaybackGreen,
		},
	},
	{
		feedbackId: feedbackId.ColorPlayback,
		options: {
			state: 'pause',
		},
		style: {
			color: PlaybackGreen,
		},
	},
]

const playbackPresets: { [id: string]: CompanionButtonPresetDefinition } = {
	select_previous_event: {
		type: 'button',
		category: 'Playback',
		name: 'Selects previous event',
		style: {
			...defaultWithIconStyle,
			png64: icons.PlaybackPrevious,
		},
		steps: [
			{
				down: [
					{
						actionId: ActionId.Load,
						options: { method: 'previous' },
					},
				],
				up: [],
			},
		],
		feedbacks: [],
	},
	select_next_event: {
		type: 'button',
		category: 'Playback',
		name: 'Selects next event',
		style: {
			...defaultWithIconStyle,
			png64: icons.PlaybackNext,
		},
		steps: [
			{
				down: [
					{
						actionId: ActionId.Load,
						options: { method: 'next' },
					},
				],
				up: [],
			},
		],
		feedbacks: [],
	},
	stop_selected_event: {
		type: 'button',
		category: 'Playback',
		name: 'Stops running event',
		style: {
			...defaultWithIconStyle,
			png64: icons.PlaybackStop,
			text: 'STOP',
			color: PlaybackRed,
		},
		previewStyle: {
			...defaultWithIconStyle,
			png64: icons.PlaybackStop,
			text: 'STOP',
			bgcolor: PlaybackRed,
		},
		steps: [
			{
				down: [
					{
						actionId: ActionId.Stop,
						options: {},
					},
				],
				up: [],
			},
		],
		feedbacks: [
			{
				feedbackId: feedbackId.ColorPlayback,
				options: {
					state: 'stop',
				},
				style: {
					bgcolor: PlaybackRed,
					color: White,
				},
			},
		],
	},
	pause_selected_event: {
		type: 'button',
		category: 'Playback',
		name: 'Pauses running event',
		style: {
			...defaultWithIconStyle,
			png64: icons.PlaybackPause,
			text: 'PAUSE',
		},
		previewStyle: {
			...defaultWithIconStyle,
			png64: icons.PlaybackPause,
			text: 'PAUSE',
			bgcolor: PauseOrange,
		},
		steps: [
			{
				down: [
					{
						actionId: ActionId.Pause,
						options: {},
					},
				],
				up: [],
			},
		],
		feedbacks: [
			{
				feedbackId: feedbackId.ColorPlayback,
				options: {
					state: 'pause',
				},
				style: {
					color: White,
					bgcolor: PauseOrange,
				},
			},
			{
				feedbackId: feedbackId.ColorPlayback,
				options: {
					state: 'play',
				},
				style: {
					color: PauseOrange,
				},
			},
		],
	},
	start_selected_event: {
		type: 'button',
		category: 'Playback',
		name: 'Starts selected event',
		style: {
			...defaultWithIconStyle,
			png64: icons.PlaybackStart,
			text: 'START',
		},
		previewStyle: {
			...defaultWithIconStyle,
			png64: icons.PlaybackStart,
			text: 'START',
			bgcolor: PlaybackGreen,
		},
		steps: [
			{
				down: [
					{
						actionId: ActionId.Start,
						options: {
							method: 'loaded',
						},
					},
				],
				up: [],
			},
		],
		feedbacks: canPlayFeedback,
	},
	start_next_event: {
		type: 'button',
		category: 'Playback',
		name: 'Start next event',
		style: {
			...defaultWithIconStyle,
			png64: icons.PlaybackStart,
			text: 'NEXT',
		},
		previewStyle: {
			...defaultWithIconStyle,
			png64: icons.PlaybackStart,
			text: 'NEXT',
			bgcolor: PlaybackGreen,
		},
		steps: [
			{
				down: [
					{
						actionId: ActionId.Start,
						options: { method: 'next' },
					},
				],
				up: [],
			},
		],
		feedbacks: canPlayFeedback,
	},
	start_selected_or_next_event: {
		type: 'button',
		category: 'Playback',
		name: 'Start selected/next event',
		style: {
			...defaultWithIconStyle,
			png64: icons.PlaybackStart,
			text: 'GO',
		},
		previewStyle: {
			...defaultWithIconStyle,
			png64: icons.PlaybackStart,
			text: 'GO',
			bgcolor: PlaybackGreen,
		},
		steps: [
			{
				down: [
					{
						actionId: ActionId.Start,
						options: { method: 'go' },
					},
				],
				up: [],
			},
		],
		feedbacks: canPlayFeedback,
	},
	reload_selected_event: {
		type: 'button',
		category: 'Playback',
		name: 'Reload selected event',
		style: {
			...defaultWithIconStyle,
			png64: icons.PlaybackReload,
			text: 'RELOAD',
		},
		steps: [
			{
				down: [
					{
						actionId: ActionId.Reload,
						options: {},
					},
				],
				up: [],
			},
		],
		feedbacks: [],
	},
	start_roll_mode: {
		type: 'button',
		category: 'Playback',
		name: 'Starts Roll Mode',
		style: {
			...defaultWithIconStyle,
			png64: icons.PlaybackRoll,
			text: 'ROLL',
			color: RollBlue,
		},
		previewStyle: {
			...defaultWithIconStyle,
			png64: icons.PlaybackRoll,
			text: 'ROLL',
			bgcolor: RollBlue,
		},
		steps: [
			{
				down: [
					{
						actionId: ActionId.Roll,
						options: {},
					},
				],
				up: [],
			},
		],
		feedbacks: [
			{
				feedbackId: feedbackId.ColorPlayback,
				options: { state: 'roll' },
				style: {
					color: White,
					bgcolor: RollBlue,
				},
			},
		],
	},
}

const timerPhaseFeedback = [
	{
		feedbackId: feedbackId.TimerPhase,
		options: { phase: [TimerPhase.Default] },
		style: { bgcolor: NormalGray, color: Black },
	},
	{
		feedbackId: feedbackId.TimerPhase,
		options: { phase: [TimerPhase.Warning] },
		style: { bgcolor: WarningOrange, color: Black },
	},
	{
		feedbackId: feedbackId.TimerPhase,
		options: { phase: [TimerPhase.Danger] },
		style: { bgcolor: DangerRed, color: Black },
	},
	{
		feedbackId: feedbackId.TimerPhase,
		options: { phase: [TimerPhase.Overtime] },
		style: { bgcolor: Black, color: DangerRed },
	},
]

const timerPhaseAndPauseFeedback = [
	...timerPhaseFeedback,
	{
		feedbackId: feedbackId.ColorPlayback,
		options: { state: 'pause' },
		style: { color: PauseOrange },
	},
]

const rundownPresets: { [id: string]: CompanionButtonPresetDefinition } = {
	currentBlock: {
		type: 'button',
		category: 'Rundown',
		name: 'Title of current block',
		style: {
			...defaultStyle,
			size: 'auto',
			text: '$(ontime:currentBlockTitle)',
		},
		previewStyle: {
			...defaultStyle,
			size: 'auto',
			text: 'Current Block',
		},
		steps: [
			{
				down: [],
				up: [],
			},
		],
		feedbacks: [],
	},
}

const messagePresets: { [id: string]: CompanionButtonPresetDefinition } = {
	showMessage: {
		type: 'button',
		category: 'Message',
		name: 'Show Message',
		style: {
			...defaultStyle,
			size: '18',
			text: "Time's up",
		},
		previewStyle: {
			...defaultStyle,
			size: '18',
			text: "Time's up",
		},
		steps: [
			{
				down: [
					{ actionId: ActionId.MessageText, options: { value: 'Your time is up' } },
					{ actionId: ActionId.MessageVisibility, options: { value: 2 } },
				],
				up: [],
			},
		],
		feedbacks: [
			{
				feedbackId: feedbackId.MessageVisible,
				options: { reqText: true, text: 'Your time is up' },
				style: {
					bgcolor: ActiveBlue,
				},
			},
		],
	},
	showSelectedMessage: {
		type: 'button',
		category: 'Message',
		name: 'Show Selected Message',
		style: {
			...defaultStyle,
			size: 'auto',
			text: 'Show\n$(ontime:timerMessage)',
		},
		previewStyle: {
			...defaultStyle,
			size: 'auto',
			text: 'Show\nSelected Message',
		},
		steps: [
			{
				down: [{ actionId: ActionId.MessageVisibility, options: { value: 2 } }],
				up: [],
			},
		],
		feedbacks: [
			{
				feedbackId: feedbackId.MessageVisible,
				options: {},
				style: {
					bgcolor: ActiveBlue,
				},
			},
		],
	},
	selectMessage1: {
		type: 'button',
		category: 'Message',
		name: 'Selected Message 1',
		style: {
			...defaultStyle,
			size: 'auto',
			text: 'Select Msg 1',
		},
		previewStyle: {
			...defaultStyle,
			size: 'auto',
			text: 'Select Msg 1',
		},
		steps: [
			{
				down: [{ actionId: ActionId.MessageText, options: { value: 'Message 1' } }],
				up: [],
			},
		],
		feedbacks: [
			{
				feedbackId: feedbackId.MessageVisible,
				options: { reqText: true, text: 'Message 1' },
				style: {
					bgcolor: ActiveBlue,
				},
			},
		],
	},
	selectMessage2: {
		type: 'button',
		category: 'Message',
		name: 'Selected Message 2',
		style: {
			...defaultStyle,
			size: 'auto',
			text: 'Select Msg 2',
		},
		previewStyle: {
			...defaultStyle,
			size: 'auto',
			text: 'Select Msg 2',
		},
		steps: [
			{
				down: [{ actionId: ActionId.MessageText, options: { value: 'Message 2' } }],
				up: [],
			},
		],
		feedbacks: [
			{
				feedbackId: feedbackId.MessageVisible,
				options: { reqText: true, text: 'Message 2' },
				style: {
					bgcolor: ActiveBlue,
				},
			},
		],
	},
}

const timerPresets: { [id: string]: CompanionButtonPresetDefinition } = {
	add_1_min: {
		type: 'button',
		category: 'Timer Management',
		name: 'Add 1 minute to running timer',
		style: {
			...defaultStyle,
			text: '+1',
			color: PauseOrange,
			alignment: 'center:center',
		},
		steps: [
			{
				down: [
					{
						actionId: ActionId.Add,
						options: { addremove: 'add', minutes: 1, hours: 0, seconds: 0 },
					},
				],
				up: [],
			},
		],
		feedbacks: [],
	},
	remove_1_min: {
		type: 'button',
		category: 'Timer Management',
		name: 'Remove 1 minute to running timer',
		style: { ...defaultStyle, text: '-1', color: PauseOrange, alignment: 'center:center' },
		steps: [
			{
				down: [
					{
						actionId: ActionId.Add,
						options: { addremove: 'remove', minutes: 1, hours: 0, seconds: 0 },
					},
				],
				up: [],
			},
		],
		feedbacks: [],
	},
	add_5_min: {
		type: 'button',
		category: 'Timer Management',
		name: 'Add 5 minute to running timer',
		style: {
			...defaultStyle,
			text: '+5',
			color: PauseOrange,
			alignment: 'center:center',
		},
		steps: [
			{
				down: [
					{
						actionId: ActionId.Add,
						options: { addremove: 'add', minutes: 5, hours: 0, seconds: 0 },
					},
				],
				up: [],
			},
		],
		feedbacks: [],
	},
	remove_5_min: {
		type: 'button',
		category: 'Timer Management',
		name: 'Remove 5 minute to running timer',
		style: {
			...defaultStyle,
			text: '-5',
			color: PauseOrange,
			alignment: 'center:center',
		},
		steps: [
			{
				down: [
					{
						actionId: ActionId.Add,
						options: { addremove: 'remove', minutes: 5, hours: 0, seconds: 0 },
					},
				],
				up: [],
			},
		],
		feedbacks: [],
	},
	current_added: {
		type: 'button',
		category: 'Timer Management',
		name: 'Amount of time added/removed from running timer',
		style: {
			...defaultStyle,
			text: `Total added\n$(ontime:timer_added_nice)`,
			size: 'auto',
			alignment: 'center:center',
		},
		previewStyle: {
			...defaultStyle,
			text: 'Total added\n00',
			size: 'auto',
			alignment: 'center:center',
			bgcolor: PauseOrange,
		},
		steps: [
			{
				down: [],
				up: [],
			},
		],
		feedbacks: [
			{ feedbackId: feedbackId.ColorAddRemove, options: { direction: 'both' }, style: { bgcolor: PauseOrange } },
		],
	},
	current_time_hms: {
		type: 'button',
		category: 'Timer Management',
		name: 'Current time',
		style: {
			...defaultStyle,
			size: 14,
			text: `$(ontime:time)`,
			alignment: 'center:center',
		},
		previewStyle: {
			...defaultStyle,
			size: 14,
			text: 'HH:MM:SS',
			alignment: 'center:center',
			png64: graphics.toPNG64({
				image: graphics.bar({
					width: 72,
					height: 72,
					colors: [
						{
							size: 100,
							color: NormalGray,
							background: NormalGray,
							backgroundOpacity: 150,
						},
					],
					barLength: 72,
					barWidth: 10,
					value: 50,
					type: 'horizontal',
					offsetX: 0,
					offsetY: 72 - 10,
					opacity: 255,
				}),
				width: 72,
				height: 72,
			}),
		},
		steps: [
			{
				down: [],
				up: [],
			},
		],
		feedbacks: [
			{
				feedbackId: feedbackId.TimerProgressBar,
				options: {
					normal: NormalGray,
					warning: WarningOrange,
					danger: DangerRed,
				},
			},
		],
	},
	current_time_h: {
		type: 'button',
		category: 'Timer Management',
		name: 'Current timer hour',
		style: {
			...defaultStyle,
			size: 44,
			text: `$(ontime:time_sign)$(ontime:time_h)`,
			alignment: 'center:center',
		},
		previewStyle: {
			...defaultStyle,
			size: 'auto',
			text: '+/-HH',
			alignment: 'center:center',
			bgcolor: NormalGray,
			color: Black,
		},
		steps: [
			{
				down: [],
				up: [],
			},
		],
		feedbacks: timerPhaseAndPauseFeedback,
	},
	current_time_m: {
		type: 'button',
		category: 'Timer Management',
		name: 'Current timer minutes',
		style: {
			...defaultStyle,
			size: 44,
			text: `$(ontime:time_m)`,
			alignment: 'center:center',
		},
		previewStyle: {
			...defaultStyle,
			size: 28,
			text: 'MM',
			alignment: 'center:center',
			bgcolor: NormalGray,
			color: Black,
		},
		steps: [
			{
				down: [],
				up: [],
			},
		],
		feedbacks: timerPhaseAndPauseFeedback,
	},
	current_time_s: {
		type: 'button',
		category: 'Timer Management',
		name: 'Current timer seconds',
		style: {
			...defaultStyle,
			size: 44,
			text: `$(ontime:time_s)`,
			alignment: 'center:center',
		},
		previewStyle: {
			...defaultStyle,
			size: 28,
			text: 'SS',
			alignment: 'center:center',
			bgcolor: NormalGray,
			color: Black,
		},
		steps: [
			{
				down: [],
				up: [],
			},
		],
		feedbacks: timerPhaseAndPauseFeedback,
	},
}

const auxTimerNegative = [
	{
		feedbackId: feedbackId.AuxTimerNegative,
		options: {},
		style: {
			color: DangerRed,
		},
	},
]

const auxTimerPresets: { [id: string]: CompanionButtonPresetDefinition } = {
	current_auxtime_hms: {
		type: 'button',
		category: 'Aux Timer',
		name: 'Current aux time',
		style: {
			...defaultStyle,
			text: `$(ontime:auxTimer_current_hms-1)`,
			size: '14',
			alignment: 'center:center',
		},
		previewStyle: {
			...defaultStyle,
			text: 'HH:MM:SS',
			size: '14',
			alignment: 'center:center',
		},
		steps: [
			{
				down: [],
				up: [],
			},
		],
		feedbacks: auxTimerNegative,
	},
	start_stop_auxtimer: {
		type: 'button',
		category: 'Aux Timer',
		name: 'Start/Stop Aux Timer',
		style: {
			...defaultWithIconStyle,
			png64: icons.PlaybackStart,
			text: 'START',
			color: PlaybackGreen,
		},
		previewStyle: {
			...defaultWithIconStyle,
			png64: icons.PlaybackStart,
			text: 'START/STOP',
			bgcolor: PlaybackGreen,
		},
		steps: [
			{
				down: [
					{
						actionId: ActionId.AuxTimerPlayState,
						options: { value: 'toggleSS', destination: '1' },
					},
				],
				up: [],
			},
		],
		feedbacks: [
			{
				feedbackId: feedbackId.AuxTimerPlayback,
				options: {
					state: 'start',
				},
				style: {
					color: PlaybackRed,
					png64: icons.PlaybackStop,
					text: 'STOP',
				},
			},
		],
	},
	pause_auxtimer: {
		type: 'button',
		category: 'Aux Timer',
		name: 'Pause Aux Timer',
		style: {
			...defaultWithIconStyle,
			png64: icons.PlaybackPause,
			text: 'PAUSE',
			color: PauseOrange,
		},
		previewStyle: {
			...defaultWithIconStyle,
			png64: icons.PlaybackPause,
			text: 'PAUSE',
			bgcolor: PauseOrange,
		},
		steps: [
			{
				down: [
					{
						actionId: ActionId.AuxTimerPlayState,
						options: { value: 'pause', destination: '1' },
					},
				],
				up: [],
			},
		],
		feedbacks: [
			{
				feedbackId: feedbackId.AuxTimerPlayback,
				options: {
					state: 'pause',
				},
				style: {
					bgcolor: PauseOrange,
					color: White,
				},
			},
		],
	},
	add_auxtimer: {
		type: 'button',
		category: 'Aux Timer',
		name: 'Add timer to Aux Timer',
		style: {
			...defaultStyle,
			text: '+5m',
		},
		previewStyle: {
			...defaultStyle,
			text: '+5m',
		},
		steps: [
			{
				down: [
					{
						actionId: ActionId.AuxTimerAdd,
						options: { hours: 0, minutes: 5, seconds: 0, addremove: 'add', destination: '1' },
					},
				],
				up: [],
			},
		],
		feedbacks: [],
	},
	remove_auxtimer: {
		type: 'button',
		category: 'Aux Timer',
		name: 'Remove timer to Aux Timer',
		style: {
			...defaultStyle,
			text: '-5m',
		},
		previewStyle: {
			...defaultStyle,
			text: '-5m',
		},
		steps: [
			{
				down: [
					{
						actionId: ActionId.AuxTimerAdd,
						options: { hours: 0, minutes: 5, seconds: 0, addremove: 'remove', destination: '1' },
					},
				],
				up: [],
			},
		],
		feedbacks: [],
	},
}
