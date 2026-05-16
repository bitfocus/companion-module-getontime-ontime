import type {
	CompanionButtonStyleProps,
	CompanionPresetAction,
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
import type { ActionsSchema } from './actions.js'
import type { OntimeTypes } from './index.js'
import { patchEventPickerOptions } from './actions/eventPicker.js'
import { patchMessageAction } from './actions/message.js'
import { patchAuxAddTimeAction } from './actions/auxTimer.js'
import { patchMessageFeedback } from './feedbacks/message.js'
import { patchAddTimeAction } from './actions/playback.js'

//TODO: Actions missing presets:
// - Aux timer direction

//TODO: Feedback missing presets:
// - TimerPhase
// - TimerProgressBarMulti
// - RundownOffset
// - CustomFieldsValue - might be difficult when we dont know the fields of the users project

function singleActionStep<K extends keyof ActionsSchema>(
	actionId: K,
	options: ActionsSchema[K]['options'],
): CompanionPresetDefinition<OntimeTypes>['steps'] {
	const action = { actionId, options } as CompanionPresetAction<ActionsSchema>
	return [{ down: [action], up: [] }]
}

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
}

const defaultWithIconStyle: CompanionButtonStyleProps = {
	pngalignment: 'center:top',
	size: '14',
	color: White,
	bgcolor: Black,
	text: '',
	alignment: 'center:bottom',
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

function generateTimerComponentPreset(name: string, format: string): CompanionPresetDefinition<OntimeTypes> {
	return {
		type: 'simple',
		name,
		style: {
			...defaultStyle,
			size: 'auto',
			textExpression: true,
			text: `msToTimestamp($(ontime:timer_current), "${format}")`,
		},
		steps: [],
		feedbacks: [],
	}
}

function generateAddRemoveTimePreset(
	name: string,
	label: string,
	minutes: number,
	addremove: 'add' | 'remove',
): CompanionPresetDefinition<OntimeTypes> {
	return {
		type: 'simple',
		name,
		style: {
			...defaultStyle,
			text: label,
			color: PauseOrange,
		},
		steps: singleActionStep(ActionId.Add, patchAddTimeAction({ addremove, minutes, hours: 0, seconds: 0 })),
		feedbacks: [],
	}
}

function generateSetMessagePreset(n: 1 | 2): CompanionPresetDefinition<OntimeTypes> {
	const label = `Message ${n}`
	return {
		type: 'simple',
		name: 'Set Message',
		style: {
			...defaultStyle,
			size: '14',
			text: `Select\n"${label}"`,
		},
		steps: singleActionStep(ActionId.MessageAction, patchMessageAction({ properties: ['text'], text: label })),
		feedbacks: [
			{
				feedbackId: feedbackId.MessageFeedback,
				options: patchMessageFeedback({
					properties: ['visible', 'text'],
					visible: ToggleOnOff.On,
					text: label,
				}),
				style: {
					bgcolor: ActiveBlue,
				},
			},
		],
	}
}

function generateToggleMessagePropertyPreset(
	property: 'blink' | 'blackout',
	name: string,
	label: string,
): CompanionPresetDefinition<OntimeTypes> {
	return {
		type: 'simple',
		name,
		style: {
			...defaultStyle,
			size: '14',
			text: label,
		},
		steps: singleActionStep(
			ActionId.MessageAction,
			patchMessageAction({
				properties: [property],
				[property]: ToggleOnOff.Toggle,
			}),
		),
		feedbacks: [
			{
				feedbackId: feedbackId.MessageFeedback,
				options: patchMessageFeedback({
					properties: [property],
					[property]: ToggleOnOff.On,
				}),
				style: {
					bgcolor: ActiveBlue,
					text: label,
				},
			},
		],
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
		steps: singleActionStep(ActionId.Start, patchEventPickerOptions({ method: 'go' })),
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
		steps: singleActionStep(ActionId.Start, patchEventPickerOptions({ method: 'loaded' })),
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
	select_previous_event: {
		type: 'simple',
		name: 'Selects previous event',
		style: {
			...defaultWithIconStyle,
			pngalignment: 'center:center',
			png64: icons.PlaybackPrevious,
		},
		steps: singleActionStep(ActionId.Load, patchEventPickerOptions({ method: 'previous' })),
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
		steps: singleActionStep(ActionId.Load, patchEventPickerOptions({ method: 'next' })),
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
		steps: singleActionStep(ActionId.Roll, {}),
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
		steps: singleActionStep(ActionId.Reload, {}),
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
		steps: singleActionStep(ActionId.Stop, {}),
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
		steps: singleActionStep(ActionId.PlaybackToggle, {
			main: Playback.Pause,
			secondary: Playback.Play,
		}),
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
		steps: singleActionStep(
			ActionId.MessageAction,
			patchMessageAction({
				properties: ['visible'],
				visible: ToggleOnOff.Toggle,
			}),
		),
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
	set_message1: generateSetMessagePreset(1),
	set_message2: generateSetMessagePreset(2),
	toggle_message_blink: generateToggleMessagePropertyPreset('blink', 'Toggle Message Blink', 'BLINK'),
	toggle_message_blackout: generateToggleMessagePropertyPreset('blackout', 'Toggle Message Blackout', 'BLACKOUT'),
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
	hh_current_timer: generateTimerComponentPreset('Current Timer HH', 'HH'),
	mm_current_timer: generateTimerComponentPreset('Current Timer MM', 'mm'),
	ss_current_timer: generateTimerComponentPreset('Current Timer SS', 'ss'),
	add_1_min: generateAddRemoveTimePreset('Add 1 minute to running timer', '+1', 1, 'add'),
	remove_1_min: generateAddRemoveTimePreset('Remove 1 minute to running timer', '-1', 1, 'remove'),
	add_5_min: generateAddRemoveTimePreset('Add 5 minute to running timer', '+5', 5, 'add'),
	remove_5_min: generateAddRemoveTimePreset('Remove 5 minute to running timer', '-5', 5, 'remove'),
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

const AUX_INDICES = ['1', '2', '3'] as const

function indexToAuxTimerName(index: (typeof AUX_INDICES)[number]): 'auxtimer1' | 'auxtimer2' | 'auxtimer3' {
	return `auxtimer${index}`
}

function generateAuxTime(index: (typeof AUX_INDICES)[number]): CompanionPresetDefinition<OntimeTypes> {
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

function generateAuxStartPause(index: (typeof AUX_INDICES)[number]): CompanionPresetDefinition<OntimeTypes> {
	return {
		type: 'simple',
		name: 'Start/Pause Aux Timer ' + index,
		style: {
			...defaultWithIconStyle,
			text: `AUX ${index}`,
			png64: icons.PlaybackStart,
			bgcolor: PlaybackGreen,
		},
		steps: singleActionStep(ActionId.AuxTimerPlayState, { value: 'toggleSP', destination: index }),
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

function generateAuxStop(index: (typeof AUX_INDICES)[number]): CompanionPresetDefinition<OntimeTypes> {
	return {
		type: 'simple',
		name: 'Stop Aux Timer ' + index,
		style: {
			...defaultWithIconStyle,
			text: `AUX ${index}`,
			png64: icons.PlaybackStop,
		},
		steps: singleActionStep(ActionId.AuxTimerPlayState, { value: SimplePlayback.Stop, destination: index }),
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

function generateAuxAddTime(index: (typeof AUX_INDICES)[number]): CompanionPresetDefinition<OntimeTypes> {
	return {
		type: 'simple',
		name: 'Add timer to Aux Timer ' + index,
		style: {
			...defaultStyle,
			size: '18',
			text: `AUX ${index}\\n+5m`,
		},
		steps: singleActionStep(
			ActionId.AuxTimerAdd,
			patchAuxAddTimeAction({ destination: index, minutes: 5, hours: 0, seconds: 0, addremove: 'add' }),
		),
		feedbacks: [],
	}
}

function generateAuxSetTime(index: (typeof AUX_INDICES)[number]): CompanionPresetDefinition<OntimeTypes> {
	return {
		type: 'simple',
		name: 'Set Aux Duration ' + index,
		style: {
			...defaultStyle,
			size: '18',
			text: `AUX ${index}\\n5m`,
		},
		steps: singleActionStep(ActionId.AuxTimerDuration, { destination: index, duration: '00:05:00' }),
		feedbacks: [],
	}
}

function buildAuxTimerPresets(): CompanionPresetDefinitions<OntimeTypes> {
	const presets: CompanionPresetDefinitions<OntimeTypes> = {}
	for (const index of AUX_INDICES) {
		presets[`current_auxtime${index}_hms`] = generateAuxTime(index)
		presets[`start_pause_auxtimer${index}`] = generateAuxStartPause(index)
		presets[`stop_auxtimer${index}`] = generateAuxStop(index)
		presets[`add_auxtimer${index}`] = generateAuxAddTime(index)
		presets[`set_auxtimer${index}`] = generateAuxSetTime(index)
	}
	return presets
}

const auxTimerPresets = buildAuxTimerPresets()
