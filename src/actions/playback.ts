import type {
	CompanionActionDefinition,
	CompanionActionEvent,
	SomeCompanionFeedbackInputField,
} from '@companion-module/base'
import { ActionId } from '../enums.js'
import { eventPicker } from './eventPicker.js'
import { Playback } from '@getontime/resolver'
import type { OntimeModule } from '../index.js'
import { hmsValuesToMs, stringNumberOrFormatted } from '../utilities.js'

type PlaybackToggleOptions = {
	main: Playback
	secondary: Playback
	nb: string
}

type PlaybackAddTimerOption = {
	hours: number
	minutes: number
	seconds: number
	addremove: 'add' | 'remove' | 'string'
	stringValue: string
}

const playbackToggleOptions: (SomeCompanionFeedbackInputField & { id: keyof PlaybackToggleOptions })[] = [
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

export function createPlaybackActions(module: OntimeModule): { [id: string]: CompanionActionDefinition } {
	function toggle(action: CompanionActionEvent): void {
		const { main, secondary } = action.options as PlaybackToggleOptions
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

	function start(action: CompanionActionEvent): void {
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
				module.connection.sendSocket('start', { id: eventList as string })
				break
			}
			case 'cue': {
				module.connection.sendSocket('start', { cue: eventCue as string })
				break
			}
			case 'id': {
				module.connection.sendSocket('start', { id: eventId as string })
				break
			}
			case 'index': {
				module.connection.sendSocket('start', { index: eventIndex as number })
				break
			}
		}
	}

	function load(action: CompanionActionEvent): void {
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
				module.connection.sendSocket('load', { id: eventList as string })
				break
			}
			case 'cue': {
				module.connection.sendSocket('load', { cue: eventCue as string })
				break
			}
			case 'id': {
				module.connection.sendSocket('load', { id: eventId as string })
				break
			}
			case 'index': {
				module.connection.sendSocket('load', { index: eventIndex as number })
				break
			}
		}
	}

	function addTime(action: CompanionActionEvent): void {
		const { hours, minutes, seconds, addremove, stringValue } = action.options as PlaybackAddTimerOption
		if (addremove === 'string') {
			const maybeNumber = stringNumberOrFormatted(stringValue)
			if (maybeNumber !== null) {
				module.connection.sendSocket('addtime', maybeNumber)
			} else {
				module.log('warn', `failed to format value in playback addTime action: ${stringValue}`)
			}
		} else {
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
					default: 'add',
				},
				{
					type: 'textinput',
					id: 'stringValue',
					label: 'Value',
					useVariables: true,
					required: true,
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
					required: true,
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
					required: true,
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
					required: true,
					isVisibleExpression: '$(options:addremove) !== "string"',
				},
			],
			callback: addTime,
		},
	}
}
