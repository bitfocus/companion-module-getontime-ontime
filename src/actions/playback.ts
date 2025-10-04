import type { CompanionActionDefinition, CompanionActionEvent } from '@companion-module/base'
import { ActionId } from '../enums.js'
import { eventPicker } from './eventPicker.js'
import { Playback } from '@getontime/resolver'
import type { OntimeModule } from '../index.js'

export function createPlaybackActions(module: OntimeModule): { [id: string]: CompanionActionDefinition } {
	const timerState = module.ontime.state.timer

	function start(action: CompanionActionEvent): void {
		const { method, eventList, eventCue, eventId, eventIndex } = action.options
		switch (method) {
			case 'loaded': {
				module.ontime.sendSocket('start', undefined)
				break
			}
			case 'next': {
				module.ontime.sendSocket('start', 'next')
				break
			}
			case 'go': {
				if (timerState.playback === Playback.Armed || timerState.playback === Playback.Pause) {
					module.ontime.sendSocket('start', undefined)
				} else {
					module.ontime.sendSocket('start', 'next')
				}
				break
			}
			case 'previous': {
				module.ontime.sendSocket('start', 'previous')
				break
			}
			case 'list': {
				module.ontime.sendSocket('start', { id: eventList as string })
				break
			}
			case 'cue': {
				module.ontime.sendSocket('start', { cue: eventCue as string })
				break
			}
			case 'id': {
				module.ontime.sendSocket('start', { id: eventId as string })
				break
			}
			case 'index': {
				module.ontime.sendSocket('start', { index: eventIndex as number })
				break
			}
		}
	}

	function load(action: CompanionActionEvent): void {
		const { method, eventList, eventCue, eventId, eventIndex } = action.options
		switch (method) {
			case 'loaded': {
				module.ontime.sendSocket('reload', undefined)
				break
			}
			case 'next': {
				module.ontime.sendSocket('load', 'next')
				break
			}
			case 'previous': {
				module.ontime.sendSocket('load', 'previous')
				break
			}
			case 'list': {
				module.ontime.sendSocket('load', { id: eventList as string })
				break
			}
			case 'cue': {
				module.ontime.sendSocket('load', { cue: eventCue as string })
				break
			}
			case 'id': {
				module.ontime.sendSocket('load', { id: eventId as string })
				break
			}
			case 'index': {
				module.ontime.sendSocket('load', { index: eventIndex as number })
				break
			}
		}
	}

	function addTime(action: CompanionActionEvent): void {
		const { hours, minutes, seconds, addremove } = action.options
		const val =
			((Number(hours) * 60 + Number(minutes)) * 60 + Number(seconds)) * 1000 * (addremove == 'remove' ? -1 : 1)
		module.ontime.sendSocket('addtime', val)
	}

	return {
		[ActionId.Start]: {
			name: 'Start an event',
			options: [
				...eventPicker(module.ontime.state.events, ['list', 'next', 'previous', 'loaded', 'cue', 'id', 'index', 'go']),
			],
			callback: start,
		},
		[ActionId.Load]: {
			name: 'Load an event',
			options: [...eventPicker(module.ontime.state.events)],
			callback: load,
		},

		[ActionId.Pause]: {
			name: 'Pause running timer',
			options: [],
			callback: () => module.ontime.sendSocket('pause', undefined),
		},
		[ActionId.Stop]: {
			name: 'Stop running timer',
			options: [],
			callback: () => module.ontime.sendSocket('stop', undefined),
		},
		[ActionId.Reload]: {
			name: 'Reload selected event',
			options: [],
			callback: () => module.ontime.sendSocket('reload', undefined),
		},

		[ActionId.Roll]: {
			name: 'Start roll mode',
			options: [],
			callback: () => module.ontime.sendSocket('roll', undefined),
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
