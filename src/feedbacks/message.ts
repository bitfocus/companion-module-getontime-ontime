import type { CompanionFeedbackBooleanEvent, CompanionFeedbackDefinition } from '@companion-module/base'
import { feedbackId } from '../enums.js'
import { ActiveBlue, White } from '../assets/colours.js'
import type OntimeState from '../state.js'

export function createMessageFeedbacks(state: OntimeState): { [id: string]: CompanionFeedbackDefinition } {
	function messageVisible(feedback: CompanionFeedbackBooleanEvent): boolean {
		const { text, visible } = state.message.timer as { text: string; visible: boolean }
		return feedback.options.reqText ? visible && text === feedback.options.text : visible
	}

	function secondaryVisible(feedback: CompanionFeedbackBooleanEvent): boolean {
		const secondarySource = state.message.timer.secondarySource as string

		return (
			(feedback.options.source === 'any' && secondarySource !== null) || secondarySource === feedback.options.source
		)
	}

	return {
		[feedbackId.MessageVisible]: {
			type: 'boolean',
			name: 'Message visibility',
			description: 'Change the colors if message is visible',
			defaultStyle: {
				color: White,
				bgcolor: ActiveBlue,
			},
			options: [
				{ type: 'checkbox', id: 'reqText', default: false, label: 'Require matching text' },
				{ type: 'textinput', id: 'text', label: 'Text', isVisible: (options) => options.reqText == true },
			],
			callback: messageVisible,
		},
		[feedbackId.MessageSecondarySourceVisible]: {
			type: 'boolean',
			name: 'Message secondary source visibility',
			description: 'Change the colors if secondary source is visible',
			defaultStyle: {
				color: White,
				bgcolor: ActiveBlue,
			},
			options: [
				{
					type: 'dropdown',
					id: 'source',
					label: 'Source',
					default: 'external',
					choices: [
						{ id: 'external', label: 'External' },
						{ id: 'aux', label: 'Aux timer' },
						{ id: 'any', label: 'Any' },
					],
				},
			],
			callback: secondaryVisible,
		},
		[feedbackId.TimerBlink]: {
			type: 'boolean',
			name: 'Timer is blinking',
			description: 'Change the colors of a button if timer is blinking',
			defaultStyle: {
				color: White,
				bgcolor: ActiveBlue,
			},
			options: [],
			callback: () => state.message.timer.blink,
		},
		[feedbackId.TimerBlackout]: {
			type: 'boolean',
			name: 'Timer is blacked out',
			description: 'Change the colors of a button if timer is blacked out',
			defaultStyle: {
				bgcolor: ActiveBlue,
			},
			options: [],
			callback: () => state.message.timer.blackout,
		},
	}
}
