import { OnTimeInstance } from './index'
import { CompanionActionDefinition, CompanionActionDefinitions } from '@companion-module/base'

export enum ActionId {
	Start = 'start',
	StartId = 'startId',
	StartIndex = 'startIndex',
	LoadId = 'loadId',
	LoadIndex = 'loadIndex',
	Pause = 'pause',
	Stop = 'stop',
	Reload = 'reload',
	Next = 'next',
	Previous = 'previous',
	Roll = 'roll',
	Delay = 'delay',
	SetOnAir = 'setOnAir',
	SetSpeakerMessageVisibility = 'setSpeakerMessageVisibility',
	SetSpeakerMessage = 'setSpeakerMessage',
	SetPublicMessageVisibility = 'setPublicMessageVisibility',
	SetPublicMessage = 'setPublicMessage',
	SetLowerMessageVisibility = 'setLowerMessageVisibility',
	SetLowerMessage = 'setLowerMessage',
}

/**
 * Returns all implemented actions.
 * @param self reference to the BaseInstance
 * @constructor
 * @returns CompanionActions
 */
export function getActionDefinitions(self: OnTimeInstance): CompanionActionDefinitions {
	const actions: { [id in ActionId]: CompanionActionDefinition | undefined } = {
		[ActionId.Start]: {
			name: 'Start selected event',
			options: [],
			callback: () => {
				self.sendcmd('set-start')
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
				self.sendcmd('set-startid', action.options.value)
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
				self.sendcmd('set-startindex', Number(action.options.value) - 1)
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
				self.sendcmd('set-loadid', action.options.value)
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
				self.sendcmd('set-loadindex', Number(action.options.value) - 1)
			},
		},
		[ActionId.Pause]: {
			name: 'Pause running timer',
			options: [],
			callback: () => {
				self.sendcmd('set-pause')
			},
		},
		[ActionId.Stop]: {
			name: 'Stop running timer',
			options: [],
			callback: () => {
				self.sendcmd('set-stop')
			},
		},
		[ActionId.Reload]: {
			name: 'Reload selected event',
			options: [],
			callback: () => {
				self.sendcmd('set-reload')
			},
		},
		[ActionId.Next]: {
			name: 'Select next event',
			options: [],
			callback: () => {
				self.sendcmd('set-next')
			},
		},
		[ActionId.Previous]: {
			name: 'Select previous event',
			options: [],
			callback: () => {
				self.sendcmd('set-previous')
			},
		},
		[ActionId.Roll]: {
			name: 'Start roll mode',
			options: [],
			callback: () => {
				self.sendcmd('set-roll')
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
				self.sendcmd('set-delay', action.options.value)
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
				self.sendcmd('set-onAir', action.options.value)
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
				self.sendcmd('set-timer-message-visible', action.options.value)
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
				self.sendcmd('set-timer-message-text', action.options.value)
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
				self.sendcmd('set-public-message-visible', action.options.value)
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
				self.sendcmd('set-public-message-text', action.options.value)
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
				self.sendcmd('set-lower-message-visible', action.options.value)
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
				self.sendcmd('set-lower-message-text', action.options.value)
			},
		},
	}
	return actions
}
