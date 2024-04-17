import { CompanionActionDefinition, CompanionActionEvent } from '@companion-module/base'
import { socketSendJson } from '../connection'
import { ActionId } from '../../enums'
import { ActionCommand } from './commands'
import { eventPicker } from './eventPicker'
import { OntimeV3 } from '../ontimev3'
import { Playback } from '../ontime-types'

export function createPlaybackActions(ontime: OntimeV3): { [id: string]: CompanionActionDefinition } {
	function start(action: CompanionActionEvent): void {
		const { method, eventList, eventCue, eventId, eventIndex } = action.options
		switch (method) {
			case 'loaded': {
				socketSendJson(ActionCommand.Start)
				break
			}
			case 'next': {
				socketSendJson(ActionCommand.Start, 'next')
				break
			}
			case 'go': {
				if (ontime.state.timer.playback === Playback.Armed || ontime.state.timer.playback === Playback.Pause) {
					socketSendJson(ActionCommand.Start)
				} else {
					socketSendJson(ActionCommand.Start, 'next')
				}
				break
			}
			case 'previous': {
				socketSendJson(ActionCommand.Start, 'previous')
				break
			}
			case 'list': {
				socketSendJson(ActionCommand.Start, { id: eventList })
				break
			}
			case 'cue': {
				socketSendJson(ActionCommand.Start, { cue: eventCue })
				break
			}
			case 'id': {
				socketSendJson(ActionCommand.Start, { id: eventId })
				break
			}
			case 'index': {
				socketSendJson(ActionCommand.Start, { index: eventIndex })
				break
			}
		}
	}

	function load(action: CompanionActionEvent): void {
		const { method, eventList, eventCue, eventId, eventIndex } = action.options
		switch (method) {
			case 'loaded': {
				socketSendJson(ActionCommand.Reload)
				break
			}
			case 'next': {
				socketSendJson(ActionCommand.Load, 'next')
				break
			}
			case 'previous': {
				socketSendJson(ActionCommand.Load, 'previous')
				break
			}
			case 'list': {
				socketSendJson(ActionCommand.Load, { id: eventList })
				break
			}
			case 'cue': {
				socketSendJson(ActionCommand.Load, { cue: eventCue })
				break
			}
			case 'id': {
				socketSendJson(ActionCommand.Load, { id: eventId })
				break
			}
			case 'index': {
				socketSendJson(ActionCommand.Load, { index: eventIndex })
				break
			}
		}
	}

	function addTime(action: CompanionActionEvent): void {
		const { hours, minutes, seconds, addremove } = action.options
		const val = ((Number(hours) * 60 + Number(minutes)) * 60 + Number(seconds)) * (addremove == 'remove' ? -1 : 1)
		socketSendJson(ActionCommand.Add, val)
	}

	return {
		[ActionId.Start]: {
			name: 'Start an event',
			options: [...eventPicker(ontime.events, ['list', 'next', 'previous', 'loaded', 'cue', 'id', 'index', 'go'])],
			callback: start,
		},
		[ActionId.Load]: {
			name: 'Load an event',
			options: [...eventPicker(ontime.events)],
			callback: load,
		},

		[ActionId.Pause]: {
			name: 'Load an event',
			options: [],
			callback: () => socketSendJson(ActionCommand.Pause),
		},
		[ActionId.Stop]: {
			name: 'Stop running timer',
			options: [],
			callback: () => socketSendJson(ActionCommand.Stop),
		},
		[ActionId.Reload]: {
			name: 'Reload selected event',
			options: [],
			callback: () => socketSendJson(ActionCommand.Reload),
		},

		[ActionId.Roll]: {
			name: 'Start roll mode',
			options: [],
			callback: () => socketSendJson(ActionCommand.Roll),
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
