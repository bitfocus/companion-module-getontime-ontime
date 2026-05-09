import type {
	CompanionFeedbackBooleanEvent,
	CompanionFeedbackDefinitions,
	CompanionMigrationFeedback,
	SomeCompanionFeedbackInputField,
} from '@companion-module/base'
import { feedbackId, ToggleOnOff } from '../enums.js'
import { ActiveBlue, White } from '../assets/colours.js'
import type OntimeState from '../state.js'
import { ensureDefaultMultiple } from '../upgrades.js'

type MessageFeedbackProperties = {
	text: string
	visible: ToggleOnOff
	blink: ToggleOnOff
	blackout: ToggleOnOff
	secondarySource: ('aux1' | 'aux2' | 'aux3' | 'secondary')[]
	secondary: string
}

type MessageFeedbackOptions = MessageFeedbackProperties & { properties: (keyof MessageFeedbackProperties)[] }

export type MessageFeedbackSchema = {
	[feedbackId.MessageFeedback]: {
		type: 'boolean'
		options: MessageFeedbackOptions
	}
}

export function patchMessageFeedback(patch: Partial<MessageFeedbackOptions>): MessageFeedbackOptions {
	return {
		properties: [],
		text: '',
		visible: ToggleOnOff.On,
		blink: ToggleOnOff.On,
		blackout: ToggleOnOff.On,
		secondarySource: [],
		secondary: '',
		...patch,
	}
}

const messageFeedbackOptions: (SomeCompanionFeedbackInputField & { id: keyof MessageFeedbackOptions })[] = [
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
			{ id: ToggleOnOff.On, label: 'On' },
			{ id: ToggleOnOff.Off, label: 'Off' },
		],
		default: ToggleOnOff.On,
		label: 'Blinking timer',
		isVisibleExpression: 'arrayIncludes($(options:properties), `blink`)',
	},
	{
		id: 'secondarySource',
		type: 'multidropdown',
		choices: [
			{ id: 'aux1', label: 'Aux timer 1' },
			{ id: 'aux2', label: 'Aux timer 2' },
			{ id: 'aux3', label: 'Aux timer 3' },
			{ id: 'secondary', label: 'Secondary message' },
		],
		default: ['secondary'],
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

export function createMessageFeedbacks(state: OntimeState): CompanionFeedbackDefinitions<MessageFeedbackSchema> {
	return {
		[feedbackId.MessageFeedback]: {
			type: 'boolean',
			name: 'Message feedback',
			defaultStyle: {
				color: White,
				bgcolor: ActiveBlue,
			},
			description: 'Checks that ALL the selected properties match',
			options: messageFeedbackOptions,
			callback: (feedback: CompanionFeedbackBooleanEvent<MessageFeedbackOptions>) => {
				const { options } = feedback
				for (const property of options.properties) {
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
							if (options.secondarySource.findIndex((e) => e === state.message.timer.secondarySource) === -1)
								return false
							break
						default:
							property satisfies never
					}
				}
				return true
			},
		},
	}
}

/**
 * v5.4.0 ensure value in message feedback
 */
export function upgrade_ensureMessageFeedbackDefaultValues(feedback: CompanionMigrationFeedback): boolean {
	if (feedback.feedbackId !== `${feedbackId.MessageFeedback}`) return false
	const { options } = feedback

	return ensureDefaultMultiple(options, {
		properties: [],
		text: '',
		visible: ToggleOnOff.On,
		blackout: ToggleOnOff.On,
		blink: ToggleOnOff.On,
		secondarySource: ['secondary'],
		secondary: '',
	})
}

/**
 * v5.2.0 collect all message feedback into one
 */
export function upgrade_collectMessageFeedback(feedback: CompanionMigrationFeedback): boolean {
	if (feedback.feedbackId === 'timerBlackout') {
		feedback.feedbackId = feedbackId.MessageFeedback
		feedback.options.properties = { value: ['blackout'], isExpression: false }
		feedback.options.blackout = { value: 1, isExpression: false }
		return true
	}
	if (feedback.feedbackId === 'timerBlink') {
		feedback.feedbackId = feedbackId.MessageFeedback
		feedback.options.properties = { value: ['blink'], isExpression: false }
		feedback.options.blink = { value: 1, isExpression: false }
		return true
	}
	if (feedback.feedbackId === 'messageSecondarySourceVisible') {
		feedback.feedbackId = feedbackId.MessageFeedback
		feedback.options.properties = { value: ['secondarySource'], isExpression: false }
		if (feedback.options.source?.value === 'any') {
			feedback.options.secondarySource = { value: ['aux1', 'aux2', 'aux3', 'secondary'], isExpression: false }
		} else if (feedback.options.source?.value === 'external') {
			feedback.options.secondarySource = { value: ['secondary'], isExpression: false }
		} else {
			feedback.options.secondarySource = { value: ['aux1'], isExpression: false }
		}
		delete feedback.options.source
		return true
	}
	if (feedback.feedbackId === 'messageVisible') {
		feedback.feedbackId = feedbackId.MessageFeedback
		feedback.options.visible = { value: 1, isExpression: false }
		if (feedback.options.reqText && feedback.options.reqText.value) {
			feedback.options.properties = { value: ['visible', 'text'], isExpression: false }
		} else {
			feedback.options.properties = { value: ['visible'], isExpression: false }
		}
		delete feedback.options.reqText
		return true
	}
	return false
}
