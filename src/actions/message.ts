import type {
	CompanionActionDefinition,
	CompanionActionEvent,
	CompanionMigrationAction,
	SomeCompanionActionInputField,
} from '@companion-module/base'
import { ActionId, ToggleOnOff } from '../enums.js'
import type { OntimeConnection } from '../connection.js'

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
	function messageActionCallback(action: CompanionActionEvent) {
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
	}
}

export function tryCollectMessageActions(action: CompanionMigrationAction): boolean {
	if (action.actionId === 'setMessageSecondarySource') {
		action.actionId = ActionId.MessageAction
		const { source, value } = action.options as { source: 'aux' | 'external'; value: 'Toggle' | 'On' | 'Off' }
		action.options.properties = ['secondarySource']
		action.options.secondaryToggle = value
		action.options.secondarySource = source === 'aux' ? 'aux1' : 'secondary'
		delete action.options.source
		delete action.options.value
		return true
	}

	if (action.actionId === 'TimerBlink') {
		action.actionId = ActionId.MessageAction
		const { value } = action.options as { value: 'Toggle' | 'On' | 'Off' }
		action.options.properties = ['blink']
		action.options.blink = value
		delete action.options.value
		return true
	}

	if (action.actionId === 'TimerBlackout') {
		action.actionId = ActionId.MessageAction
		const { value } = action.options as { value: 'Toggle' | 'On' | 'Off' }
		action.options.properties = ['blackout']
		action.options.blackout = value
		delete action.options.value
		return true
	}

	if (action.actionId === 'setMessageVisibilityAndText') {
		action.actionId = ActionId.MessageAction
		const { value } = action.options as { text: string; value: 'Toggle' | 'On' | 'Off' }
		action.options.properties = ['text', 'visible']
		action.options.visible = value
		delete action.options.value
		return true
	}

	if (action.actionId === 'setMessage') {
		action.actionId = ActionId.MessageAction
		const { value } = action.options as { value: string }
		action.options.properties = ['text']
		action.options.text = value
		delete action.options.value
		return true
	}

	if (action.actionId === 'setMessageVisibility') {
		action.actionId = ActionId.MessageAction
		const { value } = action.options as { value: 'Toggle' | 'On' | 'Off' }
		action.options.properties = ['visible']
		action.options.visible = value
		delete action.options.value
		return true
	}

	return false
}
