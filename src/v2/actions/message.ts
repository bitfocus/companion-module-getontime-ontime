import { CompanionActionDefinition, CompanionActionEvent } from '@companion-module/base'
import { socketSendJson } from '../connection'
import { ActionId } from '../../enums'
import { ActionCommand } from './commands'
import { OntimeV2 } from '../ontimev2'

const namesToV2names: Record<string, keyof OntimeV2['state']> = {
	timer: 'timerMessage',
	lower: 'lowerMessage',
	public: 'publicMessage',
}

export function createMessageActions(ontime: OntimeV2): { [id: string]: CompanionActionDefinition } {
	function messageVisibility(action: CompanionActionEvent): void {
		const dest = namesToV2names[action.options.destination as keyof typeof namesToV2names]
		const messageDest = ontime.state[dest] as { text: string; visible: boolean }
		const visible = action.options.value === 2 ? !messageDest.visible : action.options.value
		socketSendJson(`set-${action.options.destination}-message-visible`, visible)
	}

	function messageText(action: CompanionActionEvent): void {
		socketSendJson(`set-${action.options.destination}-message-text`, action.options.value)
	}

	function timerBlackout(action: CompanionActionEvent): void {
		const blackout = action.options.value === 2 ? !ontime.state.timerMessage.timerBlackout : action.options.value
		socketSendJson(ActionCommand.SetTimerBlackout, blackout)
	}

	function timerBlink(action: CompanionActionEvent): void {
		const blink = action.options.value === 2 ? !ontime.state.timerMessage.timerBlink : action.options.value
		socketSendJson(ActionCommand.SetTimerBlink, blink)
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
			callback: messageText,
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
