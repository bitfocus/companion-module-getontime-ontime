import type { CompanionActionDefinitions, CompanionActionEvent, CompanionMigrationAction } from '@companion-module/base'
import { ActionId, ToggleOnOff } from '../enums.js'
import type { OntimeConnection } from '../connection.js'
import { ensureDefaultMultiple } from '../upgrades.js'

type MessageActionProperties = {
	text: string
	visible: ToggleOnOff
	blink: ToggleOnOff
	blackout: ToggleOnOff
	secondarySource: 'aux1' | 'aux2' | 'aux3' | 'secondary'
	secondary: string
	secondaryToggle: ToggleOnOff
}

type MessagePatch = {
	timer: Partial<{
		blink: 0 | 1 | boolean
		blackout: 0 | 1 | boolean
		text: string
		visible: 0 | 1 | boolean
		secondarySource: string | null
	}>
	secondary: undefined | string
}

type MessageActionOptions = MessageActionProperties & { properties: (keyof MessageActionProperties)[] }

export type MessageActionsSchema = {
	[ActionId.MessageAction]: { options: MessageActionOptions }
}

export function patchMessageAction(patch: Partial<MessageActionOptions>): MessageActionOptions {
	return {
		properties: [],
		text: '',
		visible: ToggleOnOff.On,
		blink: ToggleOnOff.On,
		blackout: ToggleOnOff.On,
		secondarySource: 'secondary',
		secondary: '',
		secondaryToggle: ToggleOnOff.On,
		...patch,
	}
}

export function createMessageActions(connection: OntimeConnection): CompanionActionDefinitions<MessageActionsSchema> {
	return {
		[ActionId.MessageAction]: {
			name: 'Message control',
			options: [
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
					disableAutoExpression: true,
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
					id: 'blackout',
					type: 'dropdown',
					choices: [
						{ id: ToggleOnOff.Toggle, label: 'Toggle' },
						{ id: ToggleOnOff.On, label: 'On' },
						{ id: ToggleOnOff.Off, label: 'Off' },
					],
					default: ToggleOnOff.On,
					isVisibleExpression: 'arrayIncludes($(options:properties), `blackout`)',
					label: 'Blackout timer',
				},
				{
					id: 'blink',
					type: 'dropdown',
					choices: [
						{ id: ToggleOnOff.Toggle, label: 'Toggle' },
						{ id: ToggleOnOff.On, label: 'On' },
						{ id: ToggleOnOff.Off, label: 'Off' },
					],
					default: ToggleOnOff.On,
					label: 'Blinking timer',
					isVisibleExpression: 'arrayIncludes($(options:properties), `blink`)',
				},
				{
					id: 'secondarySource',
					type: 'dropdown',
					choices: [
						{ id: 'aux1', label: 'Aux timer 1' },
						{ id: 'aux2', label: 'Aux timer 2' },
						{ id: 'aux3', label: 'Aux timer 3' },
						{ id: 'secondary', label: 'Secondary message' },
					],
					default: 'secondary',
					label: 'Secondary source',
					isVisibleExpression: 'arrayIncludes($(options:properties), `secondarySource`)',
				},
				{
					id: 'secondaryToggle',
					type: 'dropdown',
					choices: [
						{ id: ToggleOnOff.Toggle, label: 'Toggle' },
						{ id: ToggleOnOff.On, label: 'On' },
						{ id: ToggleOnOff.Off, label: 'Off' },
					],
					default: ToggleOnOff.On,
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
			],
			callback: (action: CompanionActionEvent<MessageActionOptions>) => {
				const { options } = action
				if (!options.properties.length) return

				const patch: MessagePatch = {
					timer: {},
					secondary: undefined,
				}
				for (const property of options.properties) {
					switch (property) {
						case 'text':
							patch.timer.text = options.text
							break
						case 'secondary':
							patch.secondary = options.secondary
							break
						case 'blackout':
						case 'blink':
						case 'visible':
							patch.timer[property] =
								options[property] === ToggleOnOff.Toggle
									? !connection.state.message.timer[property]
									: (options[property] as 0 | 1)
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
						default:
							property satisfies never | 'properties' | 'secondaryToggle'
					}
				}

				connection.sendSocket('message', patch)
			},
		},
	}
}

/**
 * v5.4.1 ensure value in message action
 */
export function upgrade_ensureMessageActionDefaultValues(action: CompanionMigrationAction): boolean {
	if (action.actionId !== `${ActionId.MessageAction}`) return false
	const { options } = action

	return ensureDefaultMultiple(options, {
		text: '',
		visible: ToggleOnOff.On,
		blackout: ToggleOnOff.On,
		blink: ToggleOnOff.On,
		secondaryToggle: ToggleOnOff.On,
		secondarySource: 'secondary',
		secondary: '',
	})
}

/**
 * For v5.2.0 collet all message actions into on selectable with a dropdown
 */
export function upgrade_collectMessageActions(action: CompanionMigrationAction): boolean {
	if (action.actionId === 'setMessageSecondarySource') {
		action.actionId = ActionId.MessageAction
		if (!action.options.source) return false
		if (!action.options.value) return false
		action.options.properties = { isExpression: false, value: ['secondarySource'] }
		action.options.secondaryToggle = { isExpression: false, value: action.options.value.value }
		action.options.secondarySource = {
			isExpression: false,
			value: action.options.source.value === 'aux' ? 'aux1' : 'secondary',
		}
		delete action.options.source
		delete action.options.value
		return true
	}

	if (action.actionId === 'TimerBlink') {
		action.actionId = ActionId.MessageAction
		if (!action.options.value) return false
		action.options.properties = { isExpression: false, value: ['blink'] }
		action.options.blink = { isExpression: false, value: action.options.value.value }
		delete action.options.value
		return true
	}

	if (action.actionId === 'TimerBlackout') {
		action.actionId = ActionId.MessageAction
		if (!action.options.value) return false
		action.options.properties = { isExpression: false, value: ['blackout'] }
		action.options.blackout = { isExpression: false, value: action.options.value.value }
		delete action.options.value
		return true
	}

	if (action.actionId === 'setMessageVisibilityAndText') {
		action.actionId = ActionId.MessageAction
		if (!action.options.value) return false
		action.options.properties = { isExpression: false, value: ['text', 'visible'] }
		action.options.visible = { isExpression: false, value: action.options.value.value }
		delete action.options.value
		return true
	}

	if (action.actionId === 'setMessage') {
		action.actionId = ActionId.MessageAction
		if (!action.options.value) return false
		action.options.properties = { isExpression: false, value: ['text'] }
		action.options.text = { isExpression: false, value: action.options.value.value }
		delete action.options.value
		return true
	}

	if (action.actionId === 'setMessageVisibility') {
		action.actionId = ActionId.MessageAction
		if (!action.options.value) return false
		action.options.properties = { isExpression: false, value: ['visible'] }
		action.options.visible = { isExpression: false, value: action.options.value.value }
		delete action.options.value
		return true
	}

	return false
}
