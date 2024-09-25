import { CompanionFeedbackBooleanEvent, CompanionFeedbackDefinition, combineRgb } from '@companion-module/base'
import { OntimeV3 } from '../ontimev3'
import { feedbackId } from '../../enums'

export function createMessageFeedbacks(ontime: OntimeV3): { [id: string]: CompanionFeedbackDefinition } {
	function messageVisible(feedback: CompanionFeedbackBooleanEvent): boolean {
		const { text, visible } = ontime.state.message.timer as { text: string; visible: boolean }
		return feedback.options.reqText ? visible && text === feedback.options.text : visible
	}

	function secondaryVisible(feedback: CompanionFeedbackBooleanEvent): boolean {
		const secondarySource = ontime.state.message.timer.secondarySource as string
		return secondarySource === feedback.options.source
	}

	return {
		[feedbackId.MessageVisible]: {
			type: 'boolean',
			name: 'Message visibility',
			description: 'Change the colors if message is visible',
			defaultStyle: {
				color: combineRgb(255, 255, 255),
				bgcolor: combineRgb(255, 0, 0),
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
				color: combineRgb(255, 255, 255),
				bgcolor: combineRgb(255, 0, 0),
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
				color: combineRgb(255, 255, 255),
				bgcolor: combineRgb(229, 62, 62),
			},
			options: [],
			callback: () => ontime.state.message.timer.blink,
		},
		[feedbackId.TimerBlackout]: {
			type: 'boolean',
			name: 'Timer is blacked out',
			description: 'Change the colors of a button if timer is blacked out',
			defaultStyle: {
				color: combineRgb(255, 255, 255),
				bgcolor: combineRgb(229, 62, 62),
			},
			options: [],
			callback: () => ontime.state.message.timer.blackout,
		},
	}
}
