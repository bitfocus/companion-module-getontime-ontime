import type { CompanionActionDefinition, CompanionActionEvent } from '@companion-module/base'
import { ActionId } from '../enums.js'
import { eventPicker } from './eventPicker.js'
import { Playback } from '@getontime/resolver'
import type { OntimeModule } from '../index.js'

export function createPlaybackActions(module: OntimeModule): { [id: string]: CompanionActionDefinition } {
	const timerState = module.connection.state.timer

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
				if (timerState.playback === Playback.Armed || timerState.playback === Playback.Pause) {
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
		const { hours, minutes, seconds, addremove } = action.options
		const val =
			((Number(hours) * 60 + Number(minutes)) * 60 + Number(seconds)) * 1000 * (addremove == 'remove' ? -1 : 1)
		module.connection.sendSocket('addtime', val)
	}

	return {
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
					],
					label: 'Add or Remove',
					default: 'add',
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
				},
			],
			callback: addTime,
		},
	}
}
