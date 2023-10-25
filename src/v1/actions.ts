import { OnTimeInstance } from '../index'
import { CompanionActionDefinition, CompanionActionDefinitions } from '@companion-module/base'
import { sendCommand } from './connection'
import { ActionId } from '../enums'

enum ActionCommand {
	Start = 'set-start',
	StartId = 'set-startid',
	StartIndex = 'set-startindex',
	LoadId = 'set-loadid',
	LoadIndex = 'set-loadindex',
	Pause = 'set-pause',
	Stop = 'set-stop',
	Reload = 'set-reload',
	Next = 'set-next',
	Previous = 'set-previous',
	Roll = 'set-roll',
	Add = 'set-delay',
	SetOnAir = 'set-onAir',
	SetTimerMessageVisibility = 'set-timer-message-visible',
	SetTimerMessage = 'set-timer-message-text',
	SetPublicMessageVisibility = 'set-public-message-visible',
	SetPublicMessage = 'set-public-message-text',
	SetLowerMessageVisibility = 'set-lower-message-visible',
	SetLowerMessage = 'set-lower-message-text',
}

/**
 * Returns all implemented actions.
 * @param self reference to the BaseInstance
 * @constructor
 * @returns CompanionActions
 */
export function actions(_self: OnTimeInstance): CompanionActionDefinitions {
	const actions: { [id: string]: CompanionActionDefinition | undefined } = {
		[ActionId.Start]: {
			name: 'Start selected event',
			options: [],
			callback: () => {
				sendCommand(ActionCommand.Start)
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
				sendCommand(ActionCommand.StartId, action.options.value)
			},
		},
		[ActionId.StartIndex]: {
			name: 'Start event at position (1-256)',
			options: [
				{
					type: 'number',
					label: 'Position',
					id: 'value',
					default: 1,
					min: 1,
					max: 256,
					step: 1,
					range: true,
					required: true,
				},
			],
			callback: (action) => {
				sendCommand(ActionCommand.StartIndex, Number(action.options.value) - 1)
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
				sendCommand(ActionCommand.LoadId, action.options.value)
			},
		},
		[ActionId.LoadIndex]: {
			name: 'Load event at position (1-256)',
			options: [
				{
					type: 'number',
					label: 'Position',
					id: 'value',
					default: 1,
					min: 1,
					max: 256,
					step: 1,
					range: true,
					required: true,
				},
			],
			callback: (action) => {
				sendCommand(ActionCommand.LoadIndex, Number(action.options.value) - 1)
			},
		},
		[ActionId.Pause]: {
			name: 'Pause running timer',
			options: [],
			callback: () => {
				sendCommand(ActionCommand.Pause)
			},
		},
		[ActionId.Stop]: {
			name: 'Stop running timer',
			options: [],
			callback: () => {
				sendCommand(ActionCommand.Stop)
			},
		},
		[ActionId.Reload]: {
			name: 'Reload selected event',
			options: [],
			callback: () => {
				sendCommand(ActionCommand.Reload)
			},
		},
		[ActionId.Next]: {
			name: 'Select next event',
			options: [],
			callback: () => {
				sendCommand(ActionCommand.Next)
			},
		},
		[ActionId.Previous]: {
			name: 'Select previous event',
			options: [],
			callback: () => {
				sendCommand(ActionCommand.Previous)
			},
		},
		[ActionId.Roll]: {
			name: 'Start roll mode',
			options: [],
			callback: () => {
				sendCommand(ActionCommand.Roll)
			},
		},
		[ActionId.Add]: {
			name: 'Add / remove time (min) to running timer',
			options: [
				{
					type: 'number',
					id: 'value',
					label: 'Time',
					default: 0,
					min: -60,
					max: 60,
					step: 1,
					required: true,
					range: true,
				},
			],
			callback: (action) => {
				sendCommand(ActionCommand.Add, action.options.value)
			},
		},
		[ActionId.SetOnAir]: {
			name: 'Toggle On Air',
			options: [
				{
					type: 'checkbox',
					default: true,
					id: 'value',
					label: 'On Air',
				},
			],
			callback: (action) => {
				sendCommand(ActionCommand.SetOnAir, action.options.value)
			},
		},
		[ActionId.SetTimerMessageVisibility]: {
			name: 'Toggle visibility of Stage Timer message',
			options: [
				{
					type: 'checkbox',
					default: true,
					id: 'value',
					label: 'Show Message',
				},
			],
			callback: (action) => {
				sendCommand(ActionCommand.SetTimerMessageVisibility, action.options.value)
			},
		},
		[ActionId.SetTimerMessage]: {
			name: 'Set text for Stage Timer message',
			options: [
				{
					type: 'textinput',
					label: 'Stage Timer message',
					id: 'value',
					required: true,
				},
			],
			callback: (action) => {
				sendCommand(ActionCommand.SetTimerMessage, action.options.value)
			},
		},
		[ActionId.SetPublicMessageVisibility]: {
			name: 'Toggle visibility of Public screens message',
			options: [
				{
					type: 'checkbox',
					id: 'value',
					label: 'Show Message',
					default: true,
				},
			],
			callback: (action) => {
				sendCommand(ActionCommand.SetPublicMessageVisibility, action.options.value)
			},
		},
		[ActionId.SetPublicMessage]: {
			name: 'Set text for Public screens message',
			options: [
				{
					type: 'textinput',
					label: 'Stage Timer message',
					id: 'value',
					required: true,
				},
			],
			callback: (action) => {
				sendCommand(ActionCommand.SetPublicMessage, action.options.value)
			},
		},
		[ActionId.SetLowerMessageVisibility]: {
			name: 'Toggle visibility of Lower Third message',
			options: [
				{
					type: 'checkbox',
					id: 'value',
					label: 'Show Message',
					default: true,
				},
			],
			callback: (action) => {
				sendCommand(ActionCommand.SetLowerMessageVisibility, action.options.value)
			},
		},
		[ActionId.SetLowerMessage]: {
			name: 'Set text for Lower Third message',
			options: [
				{
					type: 'textinput',
					label: 'Stage Timer message',
					id: 'value',
					required: true,
				},
			],
			callback: (action) => {
				sendCommand(ActionCommand.SetLowerMessage, action.options.value)
			},
		},
	}
	return actions
}
