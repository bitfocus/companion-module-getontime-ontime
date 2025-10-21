import type {
	CompanionButtonPresetDefinition,
	CompanionButtonStyleProps,
	CompanionPresetDefinitions,
} from '@companion-module/base'
import * as icons from './assets/icons.js'
import { ActionId, feedbackId } from './enums.js'
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
} from './assets/colours.js'
import { SimplePlayback } from '@getontime/resolver'

export function generatePresets(): CompanionPresetDefinitions {
	return { ...wallClockPresets, ...playbackPresets, ...timerPresets, ...auxTimerPresets, ...messagePresets }
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
			state: ['play'],
		},
		style: {
			color: White,
			bgcolor: PlaybackGreen,
		},
	},
	{
		feedbackId: feedbackId.ColorPlayback,
		options: {
			state: ['armed'],
		},
		style: {
			color: PlaybackGreen,
		},
	},
	{
		feedbackId: feedbackId.ColorPlayback,
		options: {
			state: ['pause'],
		},
		style: {
			color: PlaybackGreen,
		},
	},
]

const wallClockPresets: { [id: string]: CompanionButtonPresetDefinition } = {
	wall_clock: {
		type: 'button',
		category: 'Clock',
		name: 'Wall Clock',
		style: {
			...defaultStyle,
			size: '14',
			textExpression: true,
			text: '`Clock:\n${msToTimestamp($(ontime:clock), "HH:mm:ss")}`',
		},
		steps: [],
		feedbacks: [],
	},
	hh_wall_clock: {
		type: 'button',
		category: 'Clock',
		name: 'HH Wall Clock',
		style: {
			...defaultStyle,
			size: 'auto',
			textExpression: true,
			text: 'msToTimestamp($(ontime:clock), "HH")',
		},
		steps: [],
		feedbacks: [],
	},
	mm_wall_clock: {
		type: 'button',
		category: 'Clock',
		name: 'mm Wall Clock',
		style: {
			...defaultStyle,
			size: 'auto',
			textExpression: true,
			text: 'msToTimestamp($(ontime:clock), "mm")',
		},
		steps: [],
		feedbacks: [],
	},
	ss_wall_clock: {
		type: 'button',
		category: 'Clock',
		name: 'Wall Clock',
		style: {
			...defaultStyle,
			size: 'auto',
			textExpression: true,
			text: 'msToTimestamp($(ontime:clock), "ss")',
		},
		steps: [],
		feedbacks: [],
	},
}

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
					state: ['stop'],
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
					state: ['pause'],
				},
				style: {
					color: White,
					bgcolor: PauseOrange,
				},
			},
			{
				feedbackId: feedbackId.ColorPlayback,
				options: {
					state: ['play'],
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
				options: { state: ['roll'] },
				style: {
					color: White,
					bgcolor: RollBlue,
				},
			},
		],
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
			text: 'Show\n$(ontime:message_text)',
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
			text: '`Total added\n${msToTimestamp($(ontime:timer_added), "hh:mm:ss")}`',
			size: 'auto',
			alignment: 'center:center',
			textExpression: true,
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
			text: 'msToTimestamp($(ontime:timer_current),"hh:mm:ss")',
			alignment: 'center:center',
			textExpression: true,
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
}

function generateAuxTime(index: '1' | '2' | '3'): CompanionButtonPresetDefinition {
	return {
		type: 'button',
		category: 'Aux Timer',
		name: 'Aux ' + index,
		style: {
			...defaultStyle,
			text: '`AUX ' + index + '\n${msToTimestamp($(ontime:aux_' + index + '_current),"HH:mm:ss")}`',
			size: '14',
			alignment: 'center:center',
			textExpression: true,
		},
		steps: [
			{
				down: [],
				up: [],
			},
		],
		feedbacks: [
			{
				feedbackId: feedbackId.AuxTimerNegative,
				options: {
					destination: 'auxtimer' + index,
				},
				style: {
					color: DangerRed,
				},
			},
		],
	}
}

function generateAuxStartPause(index: '1' | '2' | '3'): CompanionButtonPresetDefinition {
	return {
		type: 'button',
		category: 'Aux Timer',
		name: 'Start/Pause Aux Timer ' + index,
		style: {
			...defaultWithIconStyle,
			text: `AUX ${index}`,
			png64: icons.PlaybackStart,
			bgcolor: PlaybackGreen,
		},
		steps: [
			{
				down: [
					{
						actionId: ActionId.AuxTimerPlayState,
						options: { value: 'toggleSP', destination: index },
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
					destination: 'auxtimer' + index,
				},
				style: {
					bgcolor: PauseOrange,
					png64: icons.PlaybackPause,
					text: `AUX ${index}`,
				},
			},
		],
	}
}

function generateAuxStop(index: '1' | '2' | '3'): CompanionButtonPresetDefinition {
	return {
		type: 'button',
		category: 'Aux Timer',
		name: 'Stop Aux Timer ' + index,
		style: {
			...defaultWithIconStyle,
			text: `AUX ${index}`,
			png64: icons.PlaybackStop,
		},
		steps: [
			{
				down: [
					{
						actionId: ActionId.AuxTimerPlayState,
						options: { value: SimplePlayback.Stop, destination: index },
					},
				],
				up: [],
			},
		],
		feedbacks: [
			{
				feedbackId: feedbackId.AuxTimerPlayback,
				options: {
					state: 'stop',
					destination: 'auxtimer' + index,
				},
				isInverted: true,
				style: {
					bgcolor: PlaybackRed,
					png64: icons.PlaybackStop,
					text: `AUX ${index}`,
				},
			},
		],
	}
}

function generateAuxAddTime(index: '1' | '2' | '3'): CompanionButtonPresetDefinition {
	return {
		type: 'button',
		category: 'Aux Timer',
		name: 'Add timer to Aux Timer ' + index,
		style: {
			...defaultStyle,
			size: '18',
			text: `AUX ${index}\\n+5m`,
		},
		steps: [
			{
				down: [
					{
						actionId: ActionId.AuxTimerAdd,
						options: { hours: 0, minutes: 5, seconds: 0, addremove: 'add', destination: index },
					},
				],
				up: [],
			},
		],
		feedbacks: [],
	}
}

function generateAuxSetTime(index: '1' | '2' | '3'): CompanionButtonPresetDefinition {
	return {
		type: 'button',
		category: 'Aux Timer',
		name: 'Set Aux Duration ' + index,
		style: {
			...defaultStyle,
			size: '18',
			text: `AUX ${index}\\n5m`,
		},
		steps: [
			{
				down: [
					{
						actionId: ActionId.AuxTimerDuration,
						options: { hours: 0, minutes: 5, seconds: 0, addremove: 'add', destination: index },
					},
				],
				up: [],
			},
		],
		feedbacks: [],
	}
}

const auxTimerPresets: { [id: string]: CompanionButtonPresetDefinition } = {
	current_auxtime1_hms: generateAuxTime('1'),
	current_auxtime2_hms: generateAuxTime('2'),
	current_auxtime3_hms: generateAuxTime('3'),
	start_pause_auxtimer1: generateAuxStartPause('1'),
	start_pause_auxtimer2: generateAuxStartPause('2'),
	start_pause_auxtimer3: generateAuxStartPause('3'),
	stop_auxtimer1: generateAuxStop('1'),
	stop_auxtimer2: generateAuxStop('2'),
	stop_auxtimer3: generateAuxStop('3'),
	add_auxtimer1: generateAuxAddTime('1'),
	add_auxtimer2: generateAuxAddTime('2'),
	add_auxtimer3: generateAuxAddTime('3'),
	set_auxtimer1: generateAuxSetTime('1'),
	set_auxtimer2: generateAuxSetTime('2'),
	set_auxtimer3: generateAuxSetTime('3'),
}
