import { OnTimeInstance } from '../../index'
import { CompanionActionDefinition, CompanionActionEvent } from '@companion-module/base'
import { socketSendJson } from '../connection'
import { variableId, ActionId } from '../../enums'
import { ActionCommand } from './commands'

export function createMessageActions(ontime: OnTimeInstance): { [id: string]: CompanionActionDefinition } {
	function messageVisibility(action: CompanionActionEvent): void {
		const visible =
			action.options.value === 2
				? !ontime.getVariableValue(`${action.options.destination}MessageVisible`)
				: action.options.value
		socketSendJson('message', { [action.options.destination as string]: { visible } })
	}

	function timerBlackout(action: CompanionActionEvent): void {
		const blackout =
			action.options.value === 2 ? !ontime.getVariableValue(variableId.TimerBlackout) : action.options.value
		socketSendJson(ActionCommand.Message, { timer: { blackout } })
	}

	function timerBlink(action: CompanionActionEvent): void {
		const blink = action.options.value === 2 ? !ontime.getVariableValue(variableId.TimerBlink) : action.options.value
		socketSendJson(ActionCommand.Message, { timer: { blink } })
	}

	return {
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
			callback: messageVisibility,
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
			callback: ({ options }) =>
				socketSendJson(ActionCommand.Message, {
					[options.destination as string]: { text: options.value },
				}),
		},

		[ActionId.TimerBlackout]: {
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
			callback: timerBlackout,
		},
		[ActionId.TimerBlink]: {
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
			callback: timerBlink,
		},
	}
}
