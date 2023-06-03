import { OnTimeInstance } from '../index'
import { CompanionActionDefinition, CompanionActionDefinitions } from '@companion-module/base'
import { socketSendJson } from './connection'
import { ActionId } from '../enums'

enum ActionCommand {
	Start = 'start',
	StartId = 'startid',
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
	Delay = 'delay',
	SetOnAir = 'set-onair',
	SetSpeakerMessageVisibility = 'set-timer-message-visible',
	SetSpeakerMessage = 'set-timer-message-text',
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
		[ActionId.Delay]: {
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
				socketSendJson(ActionCommand.Delay, action.options.value)
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
				socketSendJson(ActionCommand.SetOnAir, action.options.value)
			},
		},
		[ActionId.SetSpeakerMessageVisibility]: {
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
				socketSendJson(ActionCommand.SetSpeakerMessageVisibility, action.options.value)
			},
		},
		[ActionId.SetSpeakerMessage]: {
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
				socketSendJson(ActionCommand.SetSpeakerMessage, action.options.value)
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
				socketSendJson(ActionCommand.SetPublicMessageVisibility, action.options.value)
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
				socketSendJson(ActionCommand.SetPublicMessage, action.options.value)
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
				socketSendJson(ActionCommand.SetLowerMessageVisibility, action.options.value)
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
				socketSendJson(ActionCommand.SetLowerMessage, action.options.value)
			},
		},
	}
	return actions
}
