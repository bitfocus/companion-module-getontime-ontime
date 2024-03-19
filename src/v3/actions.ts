import { OnTimeInstance } from '../index'
import { CompanionActionDefinition, CompanionActionDefinitions } from '@companion-module/base'
import { socketSendChange, socketSendJson } from './connection'
import { ActionId, variableId } from '../enums'

enum ActionCommand {
	Start = 'start',
	Load = 'load',
	Reload = 'reload',
	Pause = 'pause',
	Stop = 'stop',
	Roll = 'roll',
	Add = 'addtime',
	SetOnAir = 'set-onair',
	Message = 'message',
	Change = 'change',
}

/**
 * Returns all implemented actions.
 * @param self reference to the BaseInstance
 * @constructor
 * @returns CompanionActions
 */
export function actions(self: OnTimeInstance): CompanionActionDefinitions {
	const actions: { [id: string]: CompanionActionDefinition } = {
		[ActionId.Start]: {
			name: 'Start an event',
			options: [
				{
					type: 'dropdown',
					id: 'method',
					label: 'Event Selection',
					choices: [
						{ id: 'loaded', label: 'Loaded Event' },
						{ id: 'next', label: 'Next Event' },
						{ id: 'list', label: 'From list' },
						{ id: 'cue', label: 'CUE' },
						{ id: 'id', label: 'ID' },
						{ id: 'index', label: 'Index' },
					],
					default: 'loaded',
				},
				{
					type: 'dropdown',
					choices: self.events,
					id: 'eventList',
					label: 'Event',
					default: self.events[0].id,
					isVisible: (options) => options['method'] === 'list',
				},
				{
					type: 'static-text',
					value: '',
					id: 'cuenote',
					label: 'Note! this will start the first event with a matching CUE name',
					isVisible: (options) => options['method'] === 'cue',
				},
				{
					type: 'textinput',
					id: 'eventCue',
					label: 'Event Cue',
					default: '',
					isVisible: (options) => options['method'] === 'cue',
				},
				{
					type: 'textinput',
					id: 'eventId',
					label: 'Event Id',
					default: self.events[0].id,
					isVisible: (options) => options['method'] === 'id',
				},
				{
					type: 'number',
					id: 'eventIndex',
					label: 'Event Index',
					default: 1,
					min: 1,
					max: self.events.length,
					isVisible: (options) => options['method'] === 'index',
				},
			],
			callback: (action) => {
				switch (action.options.method) {
					case 'loaded': {
						socketSendJson(ActionCommand.Start)
						break
					}
					case 'next': {
						socketSendJson(ActionCommand.Start, { next: '' })
						break
					}
					case 'list': {
						socketSendJson(ActionCommand.Start, { id: action.options.eventList })
						break
					}
					case 'cue': {
						socketSendJson(ActionCommand.Start, { cue: action.options.eventCue })
						break
					}
					case 'id': {
						socketSendJson(ActionCommand.Start, { id: action.options.eventId })
						break
					}
					case 'index': {
						socketSendJson(ActionCommand.Start, { index: action.options.eventIndex })
						break
					}
				}
			},
		},
		[ActionId.Load]: {
			name: 'Load an event',
			options: [
				{
					type: 'dropdown',
					id: 'method',
					label: 'label',
					choices: [
						{ id: 'next', label: 'Next Event' },
						{ id: 'previous', label: 'Previous Event' },
						{ id: 'list', label: 'From list' },
						{ id: 'cue', label: 'CUE' },
						{ id: 'id', label: 'ID' },
						{ id: 'index', label: 'Index' },
					],
					default: 'id',
				},
				{
					type: 'dropdown',
					choices: self.events,
					id: 'eventList',
					label: 'Event',
					default: self.events[0].id,
					isVisible: (options) => options['method'] === 'list',
				},
				{
					type: 'static-text',
					value: '',
					id: 'cuenote',
					label: 'Note! this will load the first event with a matching CUE name',
					isVisible: (options) => options['method'] === 'cue',
				},
				{
					type: 'textinput',
					id: 'eventCue',
					label: 'Event Cue',
					default: '',
					isVisible: (options) => options['method'] === 'cue',
				},
				{
					type: 'textinput',
					id: 'eventId',
					label: 'Event Id',
					default: self.events[0].id,
					isVisible: (options) => options['method'] === 'id',
				},
				{
					type: 'number',
					id: 'eventIndex',
					label: 'Event Index',
					default: 1,
					min: 1,
					max: self.events.length,
					isVisible: (options) => options['method'] === 'index',
				},
			],
			callback: (action) => {
				switch (action.options.method) {
					case 'next': {
						socketSendJson(ActionCommand.Load, { next: '' })
						break
					}
					case 'previous': {
						socketSendJson(ActionCommand.Load, { previous: '' })
						break
					}
					case 'list': {
						socketSendJson(ActionCommand.Load, { id: action.options.eventList })
						break
					}
					case 'cue': {
						socketSendJson(ActionCommand.Load, { cue: action.options.eventCue })
						break
					}
					case 'id': {
						socketSendJson(ActionCommand.Load, { id: action.options.eventId })
						break
					}
					case 'index': {
						socketSendJson(ActionCommand.Load, { index: action.options.eventIndex })
						break
					}
				}
			},
		},

		[ActionId.Pause]: {
			name: 'Pause running timer',
			options: [],
			callback: () => {
				socketSendJson(ActionCommand.Pause)
			},
		},
		[ActionId.Stop]: {
			name: 'Stop running timer',
			options: [],
			callback: () => {
				socketSendJson(ActionCommand.Stop)
			},
		},
		[ActionId.Reload]: {
			name: 'Reload selected event',
			options: [],
			callback: () => {
				socketSendJson(ActionCommand.Reload)
			},
		},

		[ActionId.Roll]: {
			name: 'Start roll mode',
			options: [],
			callback: () => {
				socketSendJson(ActionCommand.Roll)
			},
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
			callback: (action) => {
				let val =
					(Number(action.options.hours) * 60 + Number(action.options.minutes)) * 60 + Number(action.options.seconds)
				if (action.options.addremove === 'remove') {
					val = val * -1
				}
				socketSendJson(ActionCommand.Add, val)
			},
		},
		[ActionId.MessageVisibility]: {
			name: 'Toggle/On/Off visibility of message',
			options: [
				{
					type: 'dropdown',
					choices: [
						{ id: 'timer', label: 'Timer' },
						{ id: 'lower', label: 'Lower' },
						{ id: 'public', label: 'Public' },
					],
					default: 'timer',
					id: 'destination',
					label: 'Message Destination',
				},
				{
					type: 'dropdown',
					choices: [
						{ id: 2, label: 'Toggle' },
						{ id: 1, label: 'On' },
						{ id: 0, label: 'Off' },
					],
					default: 2,
					id: 'value',
					label: 'Action',
				},
			],
			callback: (action) => {
				const visible =
					action.options.value === 2
						? !self.getVariableValue(`${action.options.destination}MessageVisible`)
						: action.options.value
				socketSendJson(ActionCommand.Message, { [action.options.destination as string]: { visible } })
			},
		},
		[ActionId.MessageText]: {
			name: 'Set text for message',
			options: [
				{
					type: 'dropdown',
					choices: [
						{ id: 'timer', label: 'Timer' },
						{ id: 'lower', label: 'Lower' },
						{ id: 'public', label: 'Public' },
					],
					default: 'timer',
					id: 'destination',
					label: 'Message Destination',
				},
				{
					type: 'textinput',
					label: 'Timer message',
					id: 'value',
					required: true,
				},
			],
			callback: (action) => {
				socketSendJson(ActionCommand.Message, {
					[action.options.destination as string]: { text: action.options.value },
				})
			},
		},

		[ActionId.SetTimerBlackout]: {
			name: 'Toggle/On/Off Blackout of timer',
			options: [
				{
					type: 'dropdown',
					choices: [
						{ id: 2, label: 'Toggle' },
						{ id: 1, label: 'Blackout On' },
						{ id: 0, label: 'Blackout Off' },
					],
					default: 2,
					id: 'value',
					label: 'Blackout of timer',
				},
			],
			callback: (action) => {
				const blackout =
					action.options.value === 2 ? !self.getVariableValue(variableId.TimerBlackout) : action.options.value
				socketSendJson(ActionCommand.Message, { timer: { blackout } })
			},
		},
		[ActionId.SetTimerBlink]: {
			name: 'Toggle/On/Off blinking of timer',
			options: [
				{
					type: 'dropdown',
					choices: [
						{ id: 2, label: 'Toggle' },
						{ id: 1, label: 'On' },
						{ id: 0, label: 'Off' },
					],
					default: 2,
					id: 'value',
					label: 'Blink timer',
				},
			],
			callback: (action) => {
				const blink = action.options.value === 2 ? !self.getVariableValue(variableId.TimerBlink) : action.options.value
				socketSendJson(ActionCommand.Message, { timer: { blink } })
			},
		},
		[ActionId.Change]: {
			name: 'Change event property',
			options: [
				{
					type: 'dropdown',
					choices: [
						{ id: 'selected', label: '--| Selected |--' },
						{ id: 'next', label: '--| Next |--' },
						...self.events,
					],
					id: 'eventId',
					label: 'Event',
					default: 'next',
				},
				{
					type: 'dropdown',
					choices: [
						{ id: 'title', label: 'Title' },
						{ id: 'subtitle', label: 'Subtitle' },
						{ id: 'presenter', label: 'Presenter' },
						{ id: 'note', label: 'Note' },
						{ id: 'cue', label: 'Cue' },
						{ id: 'duration', label: 'Duration' },
						{ id: 'isPublic', label: 'Public' },
						{ id: 'skip', label: 'Skip' },
						{ id: 'colour', label: 'Colour' },
						//TODO: add custom
					],
					default: 'title',
					id: 'property',
					label: 'Property',
				},
				{
					type: 'textinput',
					id: 'val',
					label: 'Value',
					default: '',
				},
			],
			callback: (action) => {
				if (
					action.options.eventId !== undefined &&
					action.options.property !== undefined &&
					action.options.val !== undefined
				) {
					const eventId =
						action.options.eventId === 'selected'
							? self.getVariableValue(variableId.IdNow)
							: action.options.eventId === 'next'
							? self.getVariableValue(variableId.IdNext)
							: action.options.eventId

					if (typeof eventId === 'string') {
						socketSendChange(ActionCommand.Change, eventId, action.options.property, action.options.val)
					}
				}
			},
		},
	}
	return actions
}
