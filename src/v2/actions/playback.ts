import { CompanionActionDefinition, CompanionActionEvent } from '@companion-module/base'
import { socketSendJson } from '../connection'
import { ActionId } from '../../enums'
import { ActionCommand } from './commands'
import { eventPicker } from '../../common/eventPicker'
import { OntimeV2 } from '../ontimev2'
import { Playback } from '../../common/ontime-types'

export function createPlaybackActions(ontime: OntimeV2): { [id: string]: CompanionActionDefinition } {
	function start(action: CompanionActionEvent): void {
		const { method, eventList, eventCue, eventId, eventIndex } = action.options
		switch (method) {
			case 'loaded': {
				socketSendJson(ActionCommand.Start)
				break
			}
			case 'next': {
				socketSendJson(ActionCommand.StartNext)
				break
			}
			case 'go': {
				if (ontime.state.playback === Playback.Armed || ontime.state.playback === Playback.Pause) {
					socketSendJson(ActionCommand.Start)
				} else {
					socketSendJson(ActionCommand.Start, 'next')
				}
				break
			}
			case 'list': {
				socketSendJson(ActionCommand.StartId, eventList)
				break
			}
			case 'cue': {
				socketSendJson(ActionCommand.StartCue, eventCue)
				break
			}
			case 'id': {
				socketSendJson(ActionCommand.StartId, eventId)
				break
			}
			case 'index': {
				socketSendJson(ActionCommand.StartIndex, eventIndex)
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
				socketSendJson(ActionCommand.Next)
				break
			}
			case 'previous': {
				socketSendJson(ActionCommand.Previous)
				break
			}
			case 'list': {
				socketSendJson(ActionCommand.LoadId, eventList)
				break
			}
			case 'cue': {
				socketSendJson(ActionCommand.LoadCue, eventCue)
				break
			}
			case 'id': {
				socketSendJson(ActionCommand.LoadId, eventId)
				break
			}
			case 'index': {
				socketSendJson(ActionCommand.LoadIndex, eventIndex)
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
			name: 'Pause running timer',
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
