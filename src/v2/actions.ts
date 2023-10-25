import { OnTimeInstance } from '../index'
import { CompanionActionDefinition, CompanionActionDefinitions } from '@companion-module/base'
import { socketSendJson } from './connection'
import { ActionId, variableId } from '../enums'

enum ActionCommand {
	Start = 'start',
	StartId = 'startid',
	StartCue = 'startcue',
	LoadCue = 'loadcue',
	StartIndex = 'startindex',
	StartNext = 'start-next',
	LoadId = 'loadid',
	LoadIndex = 'loadindex',
	Pause = 'pause',
	Stop = 'stop',
	Reload = 'reload',
	Next = 'next',
	Previous = 'previous',
	Roll = 'roll',
	Add = 'delay',
	SetOnAir = 'set-onair',
	SetTimerMessageVisibility = 'set-timer-message-visible',
	SetTimerMessage = 'set-timer-message-text',
	SetPublicMessageVisibility = 'set-public-message-visible',
	SetPublicMessage = 'set-public-message-text',
	SetLowerMessageVisibility = 'set-lower-message-visible',
	SetLowerMessage = 'set-lower-message-text',
	SetTimerBlackout = 'set-timer-blackout',
	SetTimerBlink = 'set-timer-blink',
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
			name: 'Start selected event',
			options: [],
			callback: () => {
				socketSendJson(ActionCommand.Start)
			},
		},
		[ActionId.StartId]: {
			name: 'Start event with given ID',
			options: [
				{
					type: 'textinput',
					label: 'Event ID',
					id: 'value',
					required: true,
				},
			],
			callback: (action) => {
				socketSendJson(ActionCommand.StartId, action.options.value)
			},
		},
		[ActionId.StartIndex]: {
			name: 'Start event at position',
			options: [
				{
					type: 'number',
					label: 'Position',
					id: 'value',
					default: 1,
					min: 1,
					max: self.states.loaded.numEvents,
					step: 1,
					range: true,
					required: true,
				},
			],
			callback: (action) => {
				socketSendJson(ActionCommand.StartIndex, action.options.value)
			},
		},
		[ActionId.StartNext]: {
			name: 'Start next event',
			options: [],
			callback: () => {
				socketSendJson(ActionCommand.StartNext)
			},
		},
		[ActionId.StartSelect]: {
			name: 'Start event dropdown',
			options: [
				{
					type: 'dropdown',
					choices: self.states.events,
					id: 'value',
					label: 'Event',
					default: self.states.events[0]?.id,
				},
			],
			callback: (action) => {
				socketSendJson(ActionCommand.StartId, action.options.value)
			},
		},
		[ActionId.StartCue]: {
			name: 'Start event with Cue',
			options: [
				{
					type: 'textinput',
					label: 'Event Cue',
					id: 'value',
					required: true,
				},
			],
			callback: (action) => {
				socketSendJson(ActionCommand.StartCue, action.options.value)
			},
		},
		[ActionId.LoadId]: {
			name: 'Load event with given ID',
			options: [
				{
					type: 'textinput',
					label: 'Event ID',
					id: 'value',
					required: true,
				},
			],
			callback: (action) => {
				socketSendJson(ActionCommand.LoadId, action.options.value)
			},
		},
		[ActionId.LoadSelect]: {
			name: 'Load event dropdown',
			options: [
				{
					type: 'dropdown',
					choices: self.states.events,
					id: 'value',
					label: 'Event',
					default: self.states.events[0]?.id,
				},
			],
			callback: (action) => {
				socketSendJson(ActionCommand.LoadId, action.options.value)
			},
		},
		[ActionId.LoadIndex]: {
			name: 'Load event at position',
			options: [
				{
					type: 'number',
					label: 'Position',
					id: 'value',
					default: 1,
					min: 1,
					max: self.states.loaded.numEvents,
					step: 1,
					range: true,
					required: true,
				},
			],
			callback: (action) => {
				socketSendJson(ActionCommand.LoadIndex, action.options.value)
			},
		},
		[ActionId.LoadCue]: {
			name: 'Load event with Cue',
			options: [
				{
					type: 'textinput',
					label: 'Event Cue',
					id: 'value',
					required: true,
				},
			],
			callback: (action) => {
				socketSendJson(ActionCommand.LoadCue, action.options.value)
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
		[ActionId.Next]: {
			name: 'Select next event',
			options: [],
			callback: () => {
				socketSendJson(ActionCommand.Next)
			},
		},
		[ActionId.Previous]: {
			name: 'Select previous event',
			options: [],
			callback: () => {
				socketSendJson(ActionCommand.Previous)
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
					Number(action.options.hours) * 60 + Number(action.options.minutes) + Number(action.options.seconds) / 60
				if (action.options.addremove === 'remove') {
					val = val * -1
				}
				socketSendJson(ActionCommand.Add, val)
			},
		},
		[ActionId.SetOnAir]: {
			name: 'Toggle/On/Off On Air',
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
					label: 'On Air',
				},
			],
			callback: (action) => {
				const val = action.options.value === 2 ? !self.getVariableValue(variableId.OnAir) : action.options.value
				socketSendJson(ActionCommand.SetOnAir, val)
			},
		},
		[ActionId.SetTimerMessageVisibility]: {
			name: 'Toggle/On/Off visibility of Timer message',
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
					label: 'Timer message',
				},
			],
			callback: (action) => {
				const val =
					action.options.value === 2 ? !self.getVariableValue(variableId.TimerMessageVisible) : action.options.value
				socketSendJson(ActionCommand.SetTimerMessageVisibility, val)
			},
		},
		[ActionId.SetTimerMessage]: {
			name: 'Set text for Timer message',
			options: [
				{
					type: 'textinput',
					label: 'Timer message',
					id: 'value',
					required: true,
				},
			],
			callback: (action) => {
				socketSendJson(ActionCommand.SetTimerMessage, action.options.value)
			},
		},
		[ActionId.SetPublicMessageVisibility]: {
			name: 'Toggle/On/Off visibility of Public screens message',
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
					label: 'Public screens message',
				},
			],
			callback: (action) => {
				const val =
					action.options.value === 2 ? !self.getVariableValue(variableId.PublicMessageVisible) : action.options.value
				socketSendJson(ActionCommand.SetPublicMessageVisibility, val)
			},
		},
		[ActionId.SetPublicMessage]: {
			name: 'Set text for Public screens message',
			options: [
				{
					type: 'textinput',
					label: 'Public screens message',
					id: 'value',
					required: true,
				},
			],
			callback: (action) => {
				socketSendJson(ActionCommand.SetPublicMessage, action.options.value)
			},
		},
		[ActionId.SetLowerMessageVisibility]: {
			name: 'Toggle/On/Off visibility of Lower Third message',
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
					label: 'Lower Third message',
				},
			],
			callback: (action) => {
				const val =
					action.options.value === 2 ? !self.getVariableValue(variableId.LowerMessageVisible) : action.options.value
				socketSendJson(ActionCommand.SetLowerMessageVisibility, val)
			},
		},
		[ActionId.SetLowerMessage]: {
			name: 'Set text for Lower Third message',
			options: [
				{
					type: 'textinput',
					label: 'Lower Third message',
					id: 'value',
					required: true,
				},
			],
			callback: (action) => {
				socketSendJson(ActionCommand.SetLowerMessage, action.options.value)
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
				const val = action.options.value === 2 ? !self.getVariableValue(variableId.TimerBlackout) : action.options.value
				socketSendJson(ActionCommand.SetTimerBlackout, val)
			},
		},
		[ActionId.SetTimerBlink]: {
			name: 'Toggle blinking of timer',
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
				const val = action.options.value === 2 ? !self.getVariableValue(variableId.TimerBlink) : action.options.value
				socketSendJson(ActionCommand.SetTimerBlink, val)
			},
		},
	}
	return actions
}
