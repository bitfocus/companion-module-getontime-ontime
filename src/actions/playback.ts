import type {
	CompanionActionDefinitions,
	CompanionActionEvent,
	CompanionMigrationAction,
	SomeCompanionFeedbackInputField,
} from '@companion-module/base'
import { ActionId, PICK_ONE } from '../enums.js'
import { eventPicker, type EventPickerOptions } from './eventPicker.js'
import { Playback } from '@getontime/resolver'
import type { OntimeModule } from '../index.js'
import { hmsValuesToMs, stringNumberOrFormatted, type EmptyOptions } from '../utilities.js'
import { ensureDefault, ensureDefaultMultiple } from '../upgrades.js'

type PlaybackToggleValues = {
	main: Playback
	secondary: Playback
}

type PlaybackAddTimerValues = {
	hours: number
	minutes: number
	seconds: number
	addremove: 'add' | 'remove' | 'string'
	stringValue: string
}

export function patchAddTimeAction(patch: Partial<PlaybackAddTimerValues>): PlaybackAddTimerValues {
	return {
		hours: 0,
		minutes: 0,
		seconds: 0,
		addremove: 'add',
		stringValue: '00:01:00',
		...patch,
	}
}

const playbackToggleOptions: (SomeCompanionFeedbackInputField & { id: keyof PlaybackToggleValues })[] = [
	{
		id: 'main',
		label: 'Main',
		description: 'if the playback is in any other state than this, it will go here',
		type: 'dropdown',
		choices: [
			{ id: Playback.Armed, label: 'Load' },
			{ id: Playback.Play, label: 'Play' },
			{ id: Playback.Pause, label: 'Pause' },
			{ id: Playback.Roll, label: 'Roll' },
		],
		default: Playback.Play,
	},
	{
		id: 'secondary',
		label: 'Secondary',
		description: 'if the playback is in the main state, it will go here',
		type: 'dropdown',
		choices: [
			{ id: Playback.Armed, label: 'Load' },
			{ id: Playback.Play, label: 'Play' },
			{ id: Playback.Pause, label: 'Pause' },
			{ id: Playback.Roll, label: 'Roll' },
		],
		default: Playback.Pause,
	},
]

export type PlaybackActionsSchema = {
	[ActionId.PlaybackToggle]: { options: PlaybackToggleValues }
	[ActionId.Start]: { options: EventPickerOptions }
	[ActionId.Load]: { options: EventPickerOptions }
	[ActionId.Pause]: EmptyOptions
	[ActionId.Stop]: EmptyOptions
	[ActionId.Reload]: EmptyOptions
	[ActionId.Roll]: EmptyOptions
	[ActionId.Add]: { options: PlaybackAddTimerValues }
}

export function createPlaybackActions(module: OntimeModule): CompanionActionDefinitions<PlaybackActionsSchema> {
	function toggle(action: CompanionActionEvent<PlaybackToggleValues>): void {
		const { main, secondary } = action.options
		const goToState = module.connection.state.timer.playback === main ? secondary : main
		switch (goToState) {
			case Playback.Armed:
				module.connection.sendSocket('reload', undefined)
				return
			case Playback.Play:
				module.connection.sendSocket('start', undefined)
				return
			case Playback.Pause:
				module.connection.sendSocket('pause', undefined)
				return
			case Playback.Roll:
				module.connection.sendSocket('pause', undefined)
				return
			default:
				goToState satisfies never | Playback.Stop // going to a stop state would leave the user unable to toggle back
				return
		}
	}

	function start(action: CompanionActionEvent<EventPickerOptions>): void {
		const { method, eventList, eventCue, eventId, eventIndex } = action.options
		switch (method) {
			case 'loaded': {
				module.connection.sendSocket('start', undefined)
				break
			}
			case 'next': {
				module.connection.sendSocket('start', 'next')
				break
			}
			case 'go': {
				if (
					module.connection.state.timer.playback === Playback.Armed ||
					module.connection.state.timer.playback === Playback.Pause
				) {
					module.connection.sendSocket('start', undefined)
				} else {
					module.connection.sendSocket('start', 'next')
				}
				break
			}
			case 'previous': {
				module.connection.sendSocket('start', 'previous')
				break
			}
			case 'list': {
				if (eventList === PICK_ONE) return
				module.connection.sendSocket('start', { id: eventList })
				break
			}
			case 'cue': {
				module.connection.sendSocket('start', { cue: eventCue })
				break
			}
			case 'id': {
				module.connection.sendSocket('start', { id: eventId })
				break
			}
			case 'index': {
				module.connection.sendSocket('start', { index: eventIndex })
				break
			}
			default: {
				method satisfies never
				break
			}
		}
	}

	function load(action: CompanionActionEvent<EventPickerOptions>): void {
		const { method, eventList, eventCue, eventId, eventIndex } = action.options
		switch (method) {
			case 'loaded': {
				module.connection.sendSocket('reload', undefined)
				break
			}
			case 'next': {
				module.connection.sendSocket('load', 'next')
				break
			}
			case 'previous': {
				module.connection.sendSocket('load', 'previous')
				break
			}
			case 'list': {
				if (eventList === PICK_ONE) return
				module.connection.sendSocket('load', { id: eventList })
				break
			}
			case 'cue': {
				module.connection.sendSocket('load', { cue: eventCue })
				break
			}
			case 'id': {
				module.connection.sendSocket('load', { id: eventId })
				break
			}
			case 'index': {
				module.connection.sendSocket('load', { index: eventIndex })
				break
			}
			default: {
				method satisfies never | 'go' // load action can not use the 'go' method
				break
			}
		}
	}

	function addTime(action: CompanionActionEvent<PlaybackAddTimerValues>): void {
		const { addremove } = action.options
		if (addremove === 'string') {
			const { stringValue } = action.options
			const maybeNumber = stringNumberOrFormatted(stringValue)
			if (maybeNumber !== null) {
				module.connection.sendSocket('addtime', maybeNumber)
			} else {
				module.log('warn', `failed to format value in playback addTime action: ${stringValue}`)
			}
		} else {
			const { hours, minutes, seconds, addremove } = action.options
			const val = hmsValuesToMs(hours, minutes, seconds) * (addremove == 'remove' ? -1 : 1)
			module.connection.sendSocket('addtime', val)
		}
	}

	return {
		[ActionId.PlaybackToggle]: {
			name: 'Toggle playback state',
			options: playbackToggleOptions,
			callback: toggle,
		},
		[ActionId.Start]: {
			name: 'Start an event',
			options: [
				...eventPicker(module.connection.state.events, [
					'list',
					'next',
					'previous',
					'loaded',
					'cue',
					'id',
					'index',
					'go',
				]),
			],
			callback: start,
		},
		[ActionId.Load]: {
			name: 'Load an event',
			options: [...eventPicker(module.connection.state.events)],
			callback: load,
		},

		[ActionId.Pause]: {
			name: 'Pause running timer',
			options: [],
			callback: () => module.connection.sendSocket('pause', undefined),
		},
		[ActionId.Stop]: {
			name: 'Stop running timer',
			options: [],
			callback: () => module.connection.sendSocket('stop', undefined),
		},
		[ActionId.Reload]: {
			name: 'Reload selected event',
			options: [],
			callback: () => module.connection.sendSocket('reload', undefined),
		},

		[ActionId.Roll]: {
			name: 'Start roll mode',
			options: [],
			callback: () => module.connection.sendSocket('roll', undefined),
		},
		[ActionId.Add]: {
			name: 'Add / remove time to running timer',
			options: [
				{
					id: 'addremove',
					type: 'dropdown',
					choices: [
						{ id: 'add', label: 'Add Time' },
						{ id: 'remove', label: 'Remove Time' },
						{ id: 'string', label: 'Expression/Text' },
					],
					label: 'Add or Remove',
					disableAutoExpression: true,
					default: 'add',
				},
				{
					type: 'textinput',
					id: 'stringValue',
					label: 'Value',
					useVariables: true,
					minLength: 1,
					default: '00:01:00',
					tooltip: 'Either as a straight number in ms or formatted "hh:mm:ss"',
					isVisibleExpression: '$(options:addremove) === "string"',
				},
				{
					type: 'number',
					id: 'hours',
					label: 'Hours',
					default: 0,
					step: 1,
					min: 0,
					max: 24,
					isVisibleExpression: '$(options:addremove) !== "string"',
				},
				{
					type: 'number',
					id: 'minutes',
					label: 'Minutes',
					default: 1,
					step: 1,
					min: 0,
					max: 1440,
					isVisibleExpression: '$(options:addremove) !== "string"',
				},
				{
					type: 'number',
					id: 'seconds',
					label: 'Seconds',
					default: 0,
					min: 0,
					max: 86400,
					step: 1,
					isVisibleExpression: '$(options:addremove) !== "string"',
				},
			],
			callback: addTime,
		},
	}
}

/**
 * v5.4.0 ensure value in playback action
 */
export function upgrade_ensurePlaybackActionDefaultValues(action: CompanionMigrationAction): boolean {
	if (action.actionId !== `${ActionId.Start}` && action.actionId !== `${ActionId.Load}`) return false
	const { options } = action
	const upgrade = ensureDefaultMultiple(options, {
		method: 'loaded',
		eventCue: '',
		eventId: '',
		eventIndex: 1,
		eventList: PICK_ONE,
	})
	return upgrade
}

/**
 * v5.4.0 ensure value in add remove time action
 */
export function upgrade_ensureAddRemoveTimeDefaultValue(action: CompanionMigrationAction): boolean {
	if (action.actionId !== `${ActionId.Add}`) return false
	const { options } = action
	const upgrade = ensureDefault(options, 'stringValue', '00:01:00')
	return upgrade
}
