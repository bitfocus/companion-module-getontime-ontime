import type {
	CompanionButtonStyleProps,
	CompanionPresetDefinition,
	CompanionPresetDefinitions,
	CompanionPresetSection,
} from '@companion-module/base'
import * as icons from './assets/icons.js'
import { ActionId, feedbackId, ToggleOnOff } from './enums.js'
import {
	ActiveBlue,
	Black,
	DangerRed,
	Gray,
	NormalGray,
	PauseOrange,
	PlaybackGreen,
	PlaybackRed,
	RollBlue,
	WarningOrange,
	White,
} from './assets/colours.js'
import { Playback, SimplePlayback } from '@getontime/resolver'
import type { OntimeTypes } from './index.js'
import { patchMessageAction } from './actions/message.js'
import { patchMessageFeedback } from './feedbacks/message.js'
import { patchAddTimeAction } from './actions/playback.js'

export function generatePresets(): [
	structure: CompanionPresetSection[],
	presets: CompanionPresetDefinitions<OntimeTypes>,
] {
	const presets = { ...wallClockPresets, ...messagePresets, ...timerPresets, ...auxTimerPresets, ...playbackPresets }

	const structure: CompanionPresetSection<OntimeTypes>[] = [
		{
			id: 'clock',
			name: 'Clock',
			definitions: Object.keys(wallClockPresets),
		},
		{
			id: 'message',
			name: 'Message',
			definitions: Object.keys(messagePresets),
		},
		{
			id: 'timer',
			name: 'Timer Management',
			definitions: Object.keys(timerPresets),
		},
		{
			id: 'playback',
			name: 'Playback',
			definitions: Object.keys(playbackPresets),
		},
		{
			id: 'auxtimer',
			name: 'Aux Timer',
			definitions: Object.keys(auxTimerPresets),
		},
	]

	return [structure, presets]
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

function generateWallClockPreset(name: string, format: string): CompanionPresetDefinition<OntimeTypes> {
	return {
		type: 'simple',
		name,
		style: {
			...defaultStyle,
			size: 'auto',
			textExpression: true,
			text: `msToTimestamp($(ontime:clock), "${format}")`,
		},
		steps: [],
		feedbacks: [],
	}
}

const wallClockPresets: CompanionPresetDefinitions<OntimeTypes> = {
	wall_clock: {
		type: 'simple',
		name: 'Wall Clock',
		style: {
			...defaultStyle,
			size: '14',
			textExpression: true,
			text: `\`Clock:\n\${msToTimestamp($(ontime:clock), "${'HH:mm:ss'}")}\``,
		},
		steps: [],
		feedbacks: [],
	},
	hh_wall_clock: generateWallClockPreset('HH Wall Clock', 'HH'),
	mm_wall_clock: generateWallClockPreset('MM Wall Clock', 'mm'),
	ss_wall_clock: generateWallClockPreset('SS Wall Clock', 'ss'),
}

const playbackPresets: CompanionPresetDefinitions<OntimeTypes> = {
	start_selected_or_next_event: {
		type: 'simple',
		name: 'Start selected/next event',
		style: {
			...defaultWithIconStyle,
			png64: icons.PlaybackStart,
			color: PlaybackGreen,
			text: 'GO (start)',
		},
		steps: [
			{
				down: [
					{
						actionId: ActionId.Start,
						options: {
							method: 'go',
							eventList: '',
							cuenote: '',
							eventCue: '',
							eventId: '',
							eventIndex: 0,
						},
					},
				],
				up: [],
			},
		],
		feedbacks: [
			{
				feedbackId: feedbackId.ColorPlayback,
				options: {
					state: [Playback.Play, Playback.Pause],
				},
				style: {
					color: White,
					bgcolor: PlaybackGreen,
					text: 'GO (next)',
				},
			},
			{
				feedbackId: feedbackId.ColorPlayback,
				options: {
					state: [Playback.Armed],
				},
				style: {
					text: 'GO (load)',
				},
			},
		],
	},
	start_event: {
		type: 'simple',
		name: 'Starts selected event',
		style: {
			...defaultWithIconStyle,
			png64: icons.PlaybackStart,
			text: 'START',
			color: Gray,
		},
		steps: [
			{
				down: [
					{
						actionId: ActionId.Start,

						options: {
							method: 'loaded',
							eventList: '',
							cuenote: '',
							eventCue: '',
							eventId: '',
							eventIndex: 0,
						},
					},
				],
				up: [],
			},
		],
		feedbacks: [
			{
				feedbackId: feedbackId.ColorPlayback,
				options: {
					state: [Playback.Play],
				},
				style: {
					color: White,
					bgcolor: PlaybackGreen,
				},
			},
			{
				feedbackId: feedbackId.ColorPlayback,
				options: {
					state: [Playback.Armed, Playback.Pause],
				},
				style: {
					color: PlaybackGreen,
				},
			},
		],
	},
	pause_selected_event: {
		type: 'simple',
		name: 'Pauses running event',
		style: {
			...defaultWithIconStyle,
			png64: icons.PlaybackPause,
			text: 'PAUSE',
			color: Gray,
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
					state: [Playback.Pause],
				},
				style: {
					color: White,
					bgcolor: PauseOrange,
				},
			},
			{
				feedbackId: feedbackId.ColorPlayback,
				options: {
					state: [Playback.Play],
				},
				style: {
					color: PauseOrange,
				},
			},
		],
	},
	select_previous_event: {
		type: 'simple',
		name: 'Selects previous event',
		style: {
			...defaultWithIconStyle,
			pngalignment: 'center:center',
			png64: icons.PlaybackPrevious,
		},
		steps: [
			{
				down: [
					{
						actionId: ActionId.Load,
						options: {
							method: 'previous',
							eventList: '',
							cuenote: '',
							eventCue: '',
							eventId: '',
							eventIndex: 0,
						},
					},
				],
				up: [],
			},
		],
		feedbacks: [],
	},
	select_next_event: {
		type: 'simple',
		name: 'Selects next event',
		style: {
			...defaultWithIconStyle,
			pngalignment: 'center:center',
			png64: icons.PlaybackNext,
		},
		steps: [
			{
				down: [
					{
						actionId: ActionId.Load,
						options: {
							method: 'next',
							eventList: '',
							cuenote: '',
							eventCue: '',
							eventId: '',
							eventIndex: 0,
						},
					},
				],
				up: [],
			},
		],
		feedbacks: [],
	},
	start_roll_mode: {
		type: 'simple',
		name: 'Starts Roll Mode',
		style: {
			...defaultWithIconStyle,
			png64: icons.PlaybackRoll,
			text: 'ROLL',
			color: RollBlue,
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
				options: { state: [Playback.Roll] },
				style: {
					color: White,
					bgcolor: RollBlue,
				},
			},
		],
	},
	reload_selected_event: {
		type: 'simple',
		name: 'Reload selected event',
		style: {
			...defaultWithIconStyle,
			png64: icons.PlaybackReload,
			text: 'RELOAD',
			color: Gray,
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
		feedbacks: [
			{
				feedbackId: feedbackId.ColorPlayback,
				options: {
					state: [Playback.Stop],
				},
				isInverted: true,
				style: {
					color: White,
				},
			},
		],
	},
	stop_selected_event: {
		type: 'simple',
		name: 'Stops running event',
		style: {
			...defaultWithIconStyle,
			png64: icons.PlaybackStop,
			text: 'STOP',
			color: Gray,
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
					state: [Playback.Stop],
				},
				isInverted: true,
				style: {
					bgcolor: PlaybackRed,
					color: White,
				},
			},
		],
	},
	pause_unpause: {
		type: 'simple',
		name: 'Pause/Unpause',
		style: {
			...defaultWithIconStyle,
			png64: icons.PlaybackPause,
			text: 'PAUSE',
			color: Gray,
		},
		steps: [
			{
				down: [
					{
						actionId: ActionId.PlaybackToggle,
						options: {
							main: Playback.Pause,
							secondary: Playback.Play,
						},
					},
				],
				up: [],
			},
		],
		feedbacks: [
			{
				feedbackId: feedbackId.ColorPlayback,
				options: {
					state: [Playback.Play],
				},
				isInverted: true,
				style: {
					text: 'PAUSE',
					color: PauseOrange,
				},
			},
			{
				feedbackId: feedbackId.ColorPlayback,
				options: {
					state: [Playback.Armed, Playback.Pause],
				},
				style: {
					color: White,
					text: 'UNPAUSE',
					bgcolor: PauseOrange,
				},
			},
		],
	},
}

const messagePresets: CompanionPresetDefinitions<OntimeTypes> = {
	toggle_message: {
		type: 'simple',
		name: 'Toggle Message',
		style: {
			...defaultStyle,
			size: '14',
			text: 'SHOW\n"$(ontime:message_text)"',
		},
		steps: [
			{
				down: [
					{
						actionId: ActionId.MessageAction,
						options: patchMessageAction({
							properties: ['visible'],
							visible: ToggleOnOff.Toggle,
						}),
					},
				],
				up: [],
			},
		],
		feedbacks: [
			{
				feedbackId: feedbackId.MessageFeedback,
				options: patchMessageFeedback({
					properties: ['visible'],
					visible: ToggleOnOff.On,
				}),
				style: {
					bgcolor: ActiveBlue,
					text: 'HIDE\n"$(ontime:message_text)"',
				},
			},
		],
	},
	set_message1: {
		type: 'simple',
		name: 'Set Message',
		style: {
			...defaultStyle,
			size: '14',
			text: 'Select\n"Message 1"',
		},
		steps: [
			{
				down: [
					{
						actionId: ActionId.MessageAction,
						options: patchMessageAction({
							properties: ['text'],
							text: 'Message 1',
						}),
					},
				],
				up: [],
			},
		],
		feedbacks: [
			{
				feedbackId: feedbackId.MessageFeedback,
				options: patchMessageFeedback({
					properties: ['visible', 'text'],
					visible: ToggleOnOff.On,
					text: 'Message 1',
				}),
				style: {
					bgcolor: ActiveBlue,
				},
			},
		],
	},
	set_message2: {
		type: 'simple',
		name: 'Set Message',
		style: {
			...defaultStyle,
			size: '14',
			text: 'Select\n"Message 2"',
		},
		steps: [
			{
				down: [
					{
						actionId: ActionId.MessageAction,
						options: patchMessageAction({
							properties: ['text'],
							text: 'Message 2',
						}),
					},
				],
				up: [],
			},
		],
		feedbacks: [
			{
				feedbackId: feedbackId.MessageFeedback,
				options: patchMessageFeedback({
					properties: ['visible', 'text'],
					visible: ToggleOnOff.On,
					text: 'Message 2',
				}),
				style: {
					bgcolor: ActiveBlue,
				},
			},
		],
	},
}

const timerPresets: CompanionPresetDefinitions<OntimeTypes> = {
	current_timer: {
		type: 'simple',
		name: 'Current Timer',
		style: {
			...defaultStyle,
			size: '14',
			text: 'Current:\n$(ontime:timer_current_hms)',
		},
		steps: [],
		feedbacks: [],
	},
	hh_current_timer: {
		type: 'simple',
		name: 'Current Timer HH',
		style: {
			...defaultStyle,
			size: 'auto',
			textExpression: true,
			text: 'msToTimestamp($(ontime:timer_current), "HH")',
		},
		steps: [],
		feedbacks: [],
	},
	mm_current_timer: {
		type: 'simple',
		name: 'Current Timer MM',
		style: {
			...defaultStyle,
			size: 'auto',
			textExpression: true,
			text: 'msToTimestamp($(ontime:timer_current), "mm")',
		},
		steps: [],
		feedbacks: [],
	},
	ss_current_timer: {
		type: 'simple',
		name: 'Current Timer SS',
		style: {
			...defaultStyle,
			size: 'auto',
			textExpression: true,
			text: 'msToTimestamp($(ontime:timer_current), "ss")',
		},
		steps: [],
		feedbacks: [],
	},

	add_1_min: {
		type: 'simple',
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
						options: patchAddTimeAction({
							addremove: 'add',
							minutes: 1,
							hours: 0,
							seconds: 0,
						}),
					},
				],
				up: [],
			},
		],
		feedbacks: [],
	},
	remove_1_min: {
		type: 'simple',
		name: 'Remove 1 minute to running timer',
		style: { ...defaultStyle, text: '-1', color: PauseOrange, alignment: 'center:center' },
		steps: [
			{
				down: [
					{
						actionId: ActionId.Add,
						options: patchAddTimeAction({ addremove: 'remove', minutes: 1, hours: 0, seconds: 0 }),
					},
				],
				up: [],
			},
		],
		feedbacks: [],
	},
	add_5_min: {
		type: 'simple',
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
						options: patchAddTimeAction({ addremove: 'add', minutes: 5, hours: 0, seconds: 0 }),
					},
				],
				up: [],
			},
		],
		feedbacks: [],
	},
	remove_5_min: {
		type: 'simple',
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
						options: patchAddTimeAction({ addremove: 'remove', minutes: 5, hours: 0, seconds: 0 }),
					},
				],
				up: [],
			},
		],
		feedbacks: [],
	},
	current_added: {
		type: 'simple',
		name: 'Amount of time added/removed from running timer',
		style: {
			...defaultStyle,
			text: '`Total added\n${msToTimestamp($(ontime:timer_added), "HH:mm:ss")}`',
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
	current_time_progress: {
		type: 'simple',
		name: 'Current time',
		style: {
			...defaultStyle,
			size: 14,
			text: 'msToTimestamp($(ontime:timer_current),"HH:mm:ss")',
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
				feedbackId: feedbackId.TimerProgressBar,
				options: {
					normal: NormalGray,
					warning: WarningOrange,
					danger: DangerRed,
					big: false,
				},
			},
		],
	},
}

function generateAuxTime(index: '1' | '2' | '3'): CompanionPresetDefinition<OntimeTypes> {
	return {
		type: 'simple',
		name: `Aux ${index}`,
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
					destination: indexToAuxTimerName(index),
				},
				style: {
					color: DangerRed,
				},
			},
		],
	}
}

function generateAuxStartPause(index: '1' | '2' | '3'): CompanionPresetDefinition<OntimeTypes> {
	return {
		type: 'simple',
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
					state: SimplePlayback.Start,
					destination: indexToAuxTimerName(index),
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

function generateAuxStop(index: '1' | '2' | '3'): CompanionPresetDefinition<OntimeTypes> {
	return {
		type: 'simple',
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
					state: SimplePlayback.Stop,
					destination: indexToAuxTimerName(index),
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

function generateAuxAddTime(index: '1' | '2' | '3'): CompanionPresetDefinition<OntimeTypes> {
	return {
		type: 'simple',
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
						options: { hours: 0, minutes: 5, seconds: 0, addremove: 'add', destination: index, stringValue: '' },
					},
				],
				up: [],
			},
		],
		feedbacks: [],
	}
}

function generateAuxSetTime(index: '1' | '2' | '3'): CompanionPresetDefinition<OntimeTypes> {
	return {
		type: 'simple',
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
						options: { destination: index, duration: '00:05:00' },
					},
				],
				up: [],
			},
		],
		feedbacks: [],
	}
}

const auxTimerPresets: CompanionPresetDefinitions<OntimeTypes> = {
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

function indexToAuxTimerName(index: '1' | '2' | '3'): 'auxtimer1' | 'auxtimer2' | 'auxtimer3' {
	return `auxtimer${index}`
}
