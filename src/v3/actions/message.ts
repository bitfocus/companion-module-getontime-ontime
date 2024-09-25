import { CompanionActionDefinition, CompanionActionEvent } from '@companion-module/base'
import { socketSendJson } from '../connection'
import { ActionId } from '../../enums'
import { ActionCommand } from './commands'
import { OntimeV3 } from '../ontimev3'

export function createMessageActions(ontime: OntimeV3): { [id: string]: CompanionActionDefinition } {
	function messageVisibility(action: CompanionActionEvent): void {
		const visible = action.options.value === 2 ? !ontime.state.message.timer.visible : action.options.value
		socketSendJson('message', { timer: { visible } })
	}

	function timerBlackout(action: CompanionActionEvent): void {
		const blackout = action.options.value === 2 ? !ontime.state.message.timer.blackout : action.options.value
		socketSendJson(ActionCommand.Message, { timer: { blackout } })
	}

	function timerBlink(action: CompanionActionEvent): void {
		const blink = action.options.value === 2 ? !ontime.state.message.timer.blink : action.options.value
		socketSendJson(ActionCommand.Message, { timer: { blink } })
	}

	function setSecondarySource(action: CompanionActionEvent): void {
		const source = action.options.source
		const isActive = ontime.state.message.timer.secondarySource === source
		const shouldShow = action.options.value === 2 ? !isActive : action.options.value
		const secondarySource = shouldShow ? source : 'off'
		socketSendJson(ActionCommand.Message, { timer: { secondarySource } })
	}

	return {
		[ActionId.MessageVisibility]: {
			name: 'Toggle/On/Off visibility of message',
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
					label: 'Action',
				},
			],
			callback: messageVisibility,
		},
		[ActionId.MessageText]: {
			name: 'Set text for message',
			options: [
				{
					type: 'textinput',
					label: 'Timer message',
					id: 'value',
					required: true,
				},
			],
			callback: ({ options }) =>
				socketSendJson(ActionCommand.Message, {
					timer: { text: options.value },
				}),
		},

		[ActionId.TimerBlackout]: {
			name: 'Toggle/On/Off blackout timer',
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
		[ActionId.MessageSecondarySource]: {
			name: 'Toggle/On/Off visibility of secondary source',
			options: [
				{
					type: 'dropdown',
					choices: [
						{ id: 'external', label: 'External' },
						{ id: 'aux', label: 'Aux timer' },
					],
					default: 'external',
					id: 'source',
					label: 'Source',
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
			callback: setSecondarySource,
		},
	}
}
