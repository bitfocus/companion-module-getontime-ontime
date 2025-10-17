import type {
	CompanionActionDefinition,
	CompanionActionEvent,
	SomeCompanionActionInputField,
} from '@companion-module/base'
import { ActionId } from '../enums.js'
import type { OntimeConnection } from '../connection.js'

enum ToggleOnOff {
	Off = 0,
	On = 1,
	Toggle = 2,
}

type MessageOptions = {
	properties: string[]
	text: string
	visible: ToggleOnOff
	blink: ToggleOnOff
	blackout: ToggleOnOff
	secondarySource: 'aux1' | 'aux2' | 'aux3' | 'secondary'
	secondary: string
	secondaryToggle: ToggleOnOff
}

type MessageActionEvent = CompanionActionEvent & {
	readonly options: MessageOptions
}

type MessageActionInputFields = SomeCompanionActionInputField & { id: keyof MessageOptions }

const messageActionOptions: MessageActionInputFields[] = [
	{
		id: 'properties',
		label: 'Properties',
		type: 'multidropdown',
		choices: [
			{ id: 'text', label: 'Text' },
			{ id: 'visible', label: 'Visible' },
			{ id: 'blackout', label: 'Blackout' },
			{ id: 'blink', label: 'Blink' },
			{ id: 'secondarySource', label: 'Secondary Visible' },
			{ id: 'secondary', label: 'Secondary Text' },
		],
		default: [],
	},
	{
		id: 'text',
		type: 'textinput',
		useVariables: true,
		isVisibleExpression: 'arrayIncludes($(options:properties), `text`)',
		label: 'Timer message',
	},
	{
		id: 'visible',
		type: 'dropdown',
		choices: [
			{ id: ToggleOnOff.Toggle, label: 'Toggle' },
			{ id: ToggleOnOff.On, label: 'On' },
			{ id: ToggleOnOff.Off, label: 'Off' },
		],
		default: ToggleOnOff.On,
		label: 'Visibility of timer message',
		isVisibleExpression: 'arrayIncludes($(options:properties), `visible`)',
	},
	{
		type: 'dropdown',
		choices: [
			{ id: ToggleOnOff.Toggle, label: 'Toggle' },
			{ id: ToggleOnOff.On, label: 'On' },
			{ id: ToggleOnOff.Off, label: 'Off' },
		],
		default: ToggleOnOff.On,
		id: 'blackout',
		isVisibleExpression: 'arrayIncludes($(options:properties), `blackout`)',
		label: 'Blackout timer',
	},
	{
		type: 'dropdown',
		choices: [
			{ id: ToggleOnOff.Toggle, label: 'Toggle' },
			{ id: ToggleOnOff.On, label: 'On' },
			{ id: ToggleOnOff.Off, label: 'Off' },
		],
		default: ToggleOnOff.On,
		id: 'blink',
		label: 'Blinking timer',
		isVisibleExpression: 'arrayIncludes($(options:properties), `blink`)',
	},
	{
		type: 'dropdown',
		choices: [
			{ id: 'aux1', label: 'Aux timer 1' },
			{ id: 'aux2', label: 'Aux timer 2' },
			{ id: 'aux3', label: 'Aux timer 3' },
			{ id: 'secondary', label: 'Secondary message' },
		],
		default: 'secondary',
		id: 'secondarySource',
		label: 'Secondary source',
		isVisibleExpression: 'arrayIncludes($(options:properties), `secondarySource`)',
	},
	{
		type: 'dropdown',
		choices: [
			{ id: ToggleOnOff.Toggle, label: 'Toggle' },
			{ id: ToggleOnOff.On, label: 'On' },
			{ id: ToggleOnOff.Off, label: 'Off' },
		],
		default: ToggleOnOff.On,
		id: 'secondaryToggle',
		label: 'Visibility of secondary source',
		isVisibleExpression: 'arrayIncludes($(options:properties), `secondarySource`)',
	},
	{
		id: 'secondary',
		type: 'textinput',
		useVariables: true,
		isVisibleExpression: 'arrayIncludes($(options:properties), `secondary`)',
		label: 'Secondary message',
	},
]

export function createMessageActions(connection: OntimeConnection): { [id: string]: CompanionActionDefinition } {
	function messageVisibility(action: CompanionActionEvent): void {
		const value = action.options.value as ToggleOnOff
		const visible = value === ToggleOnOff.Toggle ? !connection.state.message.timer.visible : value
		connection.sendSocket('message', { timer: { visible } })
	}

	function messageVisibilityAndText(action: CompanionActionEvent): void {
		const value = action.options.value as ToggleOnOff
		const text = action.options.text as string
		const textIsDifferent = text !== connection.state.message.timer.text
		const thisTextIsVisible = connection.state.message.timer.visible && !textIsDifferent
		switch (value) {
			case ToggleOnOff.Off:
				if (thisTextIsVisible) {
					connection.sendSocket('message', { timer: { visible: false } })
				}
				break
			case ToggleOnOff.On:
				connection.sendSocket('message', { timer: { visible: true, text } })
				break
			case ToggleOnOff.Toggle:
				if (thisTextIsVisible) {
					connection.sendSocket('message', { timer: { visible: false, text } })
				} else {
					connection.sendSocket('message', { timer: { visible: true, text } })
				}
				break
		}
	}

	function timerBlackout(action: CompanionActionEvent): void {
		const value = action.options.value as ToggleOnOff
		const blackout = value === ToggleOnOff.Toggle ? !connection.state.message.timer.blackout : value
		connection.sendSocket('message', { timer: { blackout } })
	}

	function timerBlink(action: CompanionActionEvent): void {
		const value = action.options.value as ToggleOnOff
		const blink = value === ToggleOnOff.Toggle ? !connection.state.message.timer.blink : value
		connection.sendSocket('message', { timer: { blink } })
	}

	function setSecondarySource(action: CompanionActionEvent): void {
		const value = action.options.value as ToggleOnOff
		const source = action.options.source
		const isActive = connection.state.message.timer.secondarySource === source
		const shouldShow = value === ToggleOnOff.Toggle ? !isActive : value
		const secondarySource = shouldShow ? source : 'off'
		connection.sendSocket('message', { timer: { secondarySource } })
	}

	async function messageActionCallback(action: CompanionActionEvent) {
		const { options } = action as MessageActionEvent
		if (!options.properties || !Array.isArray(options.properties) || !options.properties.length) return
		const properties = options.properties as (keyof MessageOptions)[]
		const patch: {
			timer: Partial<{
				blink: 0 | 1 | boolean
				blackout: 0 | 1 | boolean
				text: string
				visible: 0 | 1 | boolean
				secondarySource: string | null
			}>
			secondary: undefined | string
		} = {
			timer: {},
			secondary: undefined,
		}

		for (const prop of properties) {
			switch (prop) {
				case 'text':
					patch.timer.text = options.text as string
					break
				case 'secondary':
					patch.secondary = options.secondary as string
					break
				case 'blackout':
				case 'blink':
				case 'visible':
					patch.timer[prop] =
						options[prop] === ToggleOnOff.Toggle ? !connection.state.message.timer[prop] : (options[prop] as 0 | 1)
					break
				case 'secondarySource': {
					switch (options.secondaryToggle) {
						case ToggleOnOff.Toggle:
							patch.timer.secondarySource =
								connection.state.message.timer.secondarySource === null
									? options.secondarySource
									: connection.state.message.timer.secondarySource === options.secondarySource
										? null
										: options.secondarySource
							break
						case ToggleOnOff.Off:
							patch.timer.secondarySource = null
							break
						case ToggleOnOff.On:
							patch.timer.secondarySource = options.secondarySource
							break
					}
					break
				}
			}
		}

		connection.sendSocket('message', patch)
	}

	return {
		[ActionId.MessageAction]: {
			name: 'Message control',
			options: messageActionOptions,
			callback: messageActionCallback,
		},
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
				connection.sendSocket('message', {
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
