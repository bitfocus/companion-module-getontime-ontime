import type { CompanionActionDefinition, CompanionActionEvent } from '@companion-module/base'
import { ActionId } from '../enums.js'
import type { OntimeV4 } from '../ontime.js'

enum ToggleOnOff {
	Off = 0,
	On = 1,
	Toggle = 2,
}

export function createMessageActions(ontime: OntimeV4): { [id: string]: CompanionActionDefinition } {
	function messageVisibility(action: CompanionActionEvent): void {
		const value = action.options.value as ToggleOnOff
		const visible = value === ToggleOnOff.Toggle ? !ontime.state.message.timer.visible : value
		ontime.sendSocket('message', { timer: { visible } })
	}

	function messageVisibilityAndText(action: CompanionActionEvent): void {
		const value = action.options.value as ToggleOnOff
		const text = action.options.text as string
		const textIsDifferent = text !== ontime.state.message.timer.text
		const thisTextIsVisible = ontime.state.message.timer.visible && !textIsDifferent
		switch (value) {
			case ToggleOnOff.Off:
				if (thisTextIsVisible) {
					ontime.sendSocket('message', { timer: { visible: false } })
				}
				break
			case ToggleOnOff.On:
				ontime.sendSocket('message', { timer: { visible: true, text } })
				break
			case ToggleOnOff.Toggle:
				if (thisTextIsVisible) {
					ontime.sendSocket('message', { timer: { visible: false, text } })
				} else {
					ontime.sendSocket('message', { timer: { visible: true, text } })
				}
				break
		}
	}

	function timerBlackout(action: CompanionActionEvent): void {
		const value = action.options.value as ToggleOnOff
		const blackout = value === ToggleOnOff.Toggle ? !ontime.state.message.timer.blackout : value
		ontime.sendSocket('message', { timer: { blackout } })
	}

	function timerBlink(action: CompanionActionEvent): void {
		const value = action.options.value as ToggleOnOff
		const blink = value === ToggleOnOff.Toggle ? !ontime.state.message.timer.blink : value
		ontime.sendSocket('message', { timer: { blink } })
	}

	function setSecondarySource(action: CompanionActionEvent): void {
		const value = action.options.value as ToggleOnOff
		const source = action.options.source
		const isActive = ontime.state.message.timer.secondarySource === source
		const shouldShow = value === ToggleOnOff.Toggle ? !isActive : value
		const secondarySource = shouldShow ? source : 'off'
		ontime.sendSocket('message', { timer: { secondarySource } })
	}

	return {
		[ActionId.MessageVisibility]: {
			name: 'Toggle/On/Off visibility of message',
			options: [
				{
					type: 'dropdown',
					choices: [
						{ id: ToggleOnOff.Toggle, label: 'Toggle' },
						{ id: ToggleOnOff.On, label: 'On' },
						{ id: ToggleOnOff.Off, label: 'Off' },
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
				ontime.sendSocket('message', {
					timer: { text: options.value },
				}),
		},
		[ActionId.MessageVisibilityAndText]: {
			name: 'Toggle/On/Off visibility and text for message',
			description:
				'Combined action for setting the text and visibility. "Toggle" will replace the current message. "Off" will disable the message visibility',
			options: [
				{
					type: 'textinput',
					label: 'Timer message',
					id: 'text',
					required: true,
				},
				{
					type: 'dropdown',
					choices: [
						{ id: ToggleOnOff.Toggle, label: 'Toggle' },
						{ id: ToggleOnOff.On, label: 'On' },
						{ id: ToggleOnOff.Off, label: 'Off' },
					],
					default: 2,
					id: 'value',
					label: 'Action',
				},
			],
			callback: messageVisibilityAndText,
		},
		[ActionId.TimerBlackout]: {
			name: 'Toggle/On/Off blackout timer',
			options: [
				{
					type: 'dropdown',
					choices: [
						{ id: ToggleOnOff.Toggle, label: 'Toggle' },
						{ id: ToggleOnOff.On, label: 'On' },
						{ id: ToggleOnOff.Off, label: 'Off' },
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
						{ id: ToggleOnOff.Toggle, label: 'Toggle' },
						{ id: ToggleOnOff.On, label: 'On' },
						{ id: ToggleOnOff.Off, label: 'Off' },
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
						{ id: ToggleOnOff.Toggle, label: 'Toggle' },
						{ id: ToggleOnOff.On, label: 'On' },
						{ id: ToggleOnOff.Off, label: 'Off' },
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
