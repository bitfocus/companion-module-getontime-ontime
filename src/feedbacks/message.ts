import type {
	CompanionFeedbackDefinition,
	CompanionFeedbackInfo,
	CompanionMigrationFeedback,
	SomeCompanionFeedbackInputField,
} from '@companion-module/base'
import { feedbackId, ToggleOnOff } from '../enums.js'
import { ActiveBlue, White } from '../assets/colours.js'
import type OntimeState from '../state.js'

type MessageOptions = {
	properties: string[]
	text: string
	visible: ToggleOnOff
	blink: ToggleOnOff
	blackout: ToggleOnOff
	secondarySource: ('aux1' | 'aux2' | 'aux3' | 'secondary')[]
	secondary: string
}

type MessageFeedbackEvent = CompanionFeedbackInfo & {
	readonly options: MessageOptions
}

type MessageFeedbackInputFields = SomeCompanionFeedbackInputField & { id: keyof MessageOptions }

const messageFeedbackOptions: MessageFeedbackInputFields[] = [
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
			{ id: ToggleOnOff.On, label: 'On' },
			{ id: ToggleOnOff.Off, label: 'Off' },
		],
		default: ToggleOnOff.On,
		id: 'blink',
		label: 'Blinking timer',
		isVisibleExpression: 'arrayIncludes($(options:properties), `blink`)',
	},
	{
		type: 'multidropdown',
		choices: [
			{ id: 'aux1', label: 'Aux timer 1' },
			{ id: 'aux2', label: 'Aux timer 2' },
			{ id: 'aux3', label: 'Aux timer 3' },
			{ id: 'secondary', label: 'Secondary message' },
		],
		default: ['secondary'],
		id: 'secondarySource',
		label: 'Secondary source visible',
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

export function createMessageFeedbacks(state: OntimeState): { [id: string]: CompanionFeedbackDefinition } {
	function messageFeedbackCallback(feedback: CompanionFeedbackInfo) {
		const { options } = feedback as MessageFeedbackEvent
		if (!options.properties || !Array.isArray(options.properties) || !options.properties.length) return false
		const properties = options.properties as (keyof MessageOptions)[]

		for (const property of properties) {
			switch (property) {
				case 'text':
				case 'blackout':
				case 'blink':
				case 'visible':
					if (options[property] != state.message.timer[property]) return false
					break
				case 'secondary':
					if (options.secondary != state.message.secondary) return false
					break
				case 'secondarySource':
					if (options.secondarySource.length === 0 && state.message.timer.secondarySource !== null) return false
					if (options.secondarySource.findIndex((e) => e === state.message.timer.secondarySource) === -1) return false
					break
				default:
					property satisfies never | 'properties'
			}
		}
		return true
	}

	return {
		[feedbackId.MessageFeedback]: {
			type: 'boolean',
			name: 'Message feedback',
			defaultStyle: {
				color: White,
				bgcolor: ActiveBlue,
			},
			options: messageFeedbackOptions,
			callback: messageFeedbackCallback,
		},
	}
}
