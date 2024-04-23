import {
	CompanionButtonPresetDefinition,
	CompanionButtonStyleProps,
	CompanionPresetDefinitions,
	combineRgb,
} from '@companion-module/base'
import * as icons from '../assets/icons'
import { ActionId, feedbackId } from '../enums'
import { TimerZone } from './ontime-types'

export function presets(): CompanionPresetDefinitions {
	return { ...playbackPresets, ...timerPresets }
}

const White = combineRgb(255, 255, 255)
const Black = combineRgb(0, 0, 0)

const PlaybackGreen = combineRgb(51, 158, 78)
const PlaybackRed = combineRgb(228, 40, 30)
const PauseOrange = combineRgb(192, 86, 33)
const RollBlue = combineRgb(2, 116, 182)

const NormalGray = combineRgb(211, 211, 211)
const WarningOrange = combineRgb(255, 171, 51)
const DangerRed = combineRgb(237, 51, 51)

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

const timerZoneFeedback = [
	{
		feedbackId: feedbackId.TimerZone,
		options: { zone: TimerZone.Normal },
		style: { bgcolor: NormalGray, color: Black },
	},
	{
		feedbackId: feedbackId.TimerZone,
		options: { zone: TimerZone.Warning },
		style: { bgcolor: WarningOrange, color: Black },
	},
	{
		feedbackId: feedbackId.TimerZone,
		options: { zone: TimerZone.Danger },
		style: { bgcolor: DangerRed, color: Black },
	},
	{
		feedbackId: feedbackId.TimerZone,
		options: { zone: TimerZone.Overtime },
		style: { bgcolor: Black, color: DangerRed },
	},
]

const timerZoneAndPauseFeedback = [
	...timerZoneFeedback,
	{
		feedbackId: feedbackId.ColorPlayback,
		options: { state: 'pause' },
		style: { color: PauseOrange },
	},
]

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
		name: 'Current timer ',
		style: {
			...defaultStyle,
			text: `$(ontime:time)`,
			size: '14',
			alignment: 'center:center',
		},
		previewStyle: {
			...defaultStyle,
			text: 'HH:MM:SS',
			size: '14',
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
		feedbacks: timerZoneAndPauseFeedback,
	},
	current_time_h: {
		type: 'button',
		category: 'Timer Management',
		name: 'Current timer hour',
		style: {
			...defaultStyle,
			size: 44,
			text: `$(ontime:time_h)`,
			alignment: 'center:center',
		},
		previewStyle: {
			...defaultStyle,
			size: 44,
			text: 'HH',
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
		feedbacks: timerZoneAndPauseFeedback,
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
		feedbacks: timerZoneAndPauseFeedback,
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
		feedbacks: timerZoneAndPauseFeedback,
	},
}
