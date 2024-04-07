import { OnTimeInstance } from '../../index'
import { CompanionActionDefinition, CompanionActionDefinitions } from '@companion-module/base'

// import { createPlaybackActions } from './playback'
// import { createMessageActions } from './message'
// import { createChangeActions } from './change'
import { OntimeV2 } from '../ontimev2'
import { ActionId, deprecatedActionId } from '../../enums'

import { socketSendJson } from '../connection'
import { eventsToChoices } from '../../utilities'

import { ActionCommand } from './commands'
import { createChangeActions } from './change'
import { createPlaybackActions } from './playback'

/**
 * Returns all implemented actions.
 * @param self reference to the BaseInstance
 * @param ontime reference to the Ontime versiond
 * @constructor
 * @returns CompanionActions
 */
export function actions(_self: OnTimeInstance, ontime: OntimeV2): CompanionActionDefinitions {
	const actions: { [id: string]: CompanionActionDefinition } = {
		...createChangeActions(ontime),
		...createPlaybackActions(ontime),
		[ActionId.Start]: {
			name: 'Start selected event',
			options: [],
			callback: () => {
				socketSendJson(ActionCommand.Start)
			},
		},
		[deprecatedActionId.StartId]: {
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
		[deprecatedActionId.StartIndex]: {
			name: 'Start event at position',
			options: [
				{
					type: 'number',
					label: 'Position',
					id: 'value',
					default: 1,
					min: 1,
					max: ontime.state.loaded.numEvents,
					step: 1,
					range: true,
					required: true,
				},
			],
			callback: (action) => {
				socketSendJson(ActionCommand.StartIndex, action.options.value)
			},
		},
		[deprecatedActionId.StartNext]: {
			name: 'Start next event',
			options: [],
			callback: () => {
				socketSendJson(ActionCommand.StartNext)
			},
		},
		[deprecatedActionId.StartSelect]: {
			name: 'Start event dropdown',
			options: [
				{
					type: 'dropdown',
					choices: eventsToChoices(ontime.events),
					id: 'value',
					label: 'Event',
					default: ontime.events[0]?.id,
				},
			],
			callback: (action) => {
				socketSendJson(ActionCommand.StartId, action.options.value)
			},
		},
		[deprecatedActionId.StartCue]: {
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
					(Number(action.options.hours) * 60 + Number(action.options.minutes)) * 60 + Number(action.options.seconds)
				if (action.options.addremove === 'remove') {
					val = val * -1
				}
				socketSendJson(ActionCommand.Add, val)
			},
		},
		[deprecatedActionId.SetOnAir]: {
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
				const val = action.options.value === 2 ? !ontime.state.onAir : action.options.value
				socketSendJson(ActionCommand.SetOnAir, val)
			},
		},
		[deprecatedActionId.SetTimerMessageVisibility]: {
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
				const val = action.options.value === 2 ? !ontime.state.timerMessage.visible : action.options.value
				socketSendJson(ActionCommand.SetTimerMessageVisibility, val)
			},
		},
		[deprecatedActionId.SetTimerMessage]: {
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
				socketSendJson(ActionCommand.SetTimerMessage, action.options?.value ?? '')
			},
		},
		[deprecatedActionId.SetPublicMessageVisibility]: {
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
				const val = action.options.value === 2 ? !ontime.state.publicMessage.visible : action.options.value
				socketSendJson(ActionCommand.SetPublicMessageVisibility, val)
			},
		},
		[deprecatedActionId.SetPublicMessage]: {
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
				socketSendJson(ActionCommand.SetPublicMessage, action.options?.value ?? '')
			},
		},
		[deprecatedActionId.SetLowerMessageVisibility]: {
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
				const val = action.options.value === 2 ? !ontime.state.lowerMessage.visible : action.options.value
				socketSendJson(ActionCommand.SetLowerMessageVisibility, val)
			},
		},
		[deprecatedActionId.SetLowerMessage]: {
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
				socketSendJson(ActionCommand.SetLowerMessage, action.options?.value ?? '')
			},
		},
		[deprecatedActionId.SetTimerBlackout]: {
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
				const val = action.options.value === 2 ? !ontime.state.timerMessage.timerBlackout : action.options.value
				socketSendJson(ActionCommand.SetTimerBlackout, val)
			},
		},
		[deprecatedActionId.SetTimerBlink]: {
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
				const val = action.options.value === 2 ? !ontime.state.timerMessage.timerBlink : action.options.value
				socketSendJson(ActionCommand.SetTimerBlink, val)
			},
		},
	}
	return actions
}
