import { CompanionFeedbackBooleanEvent, CompanionFeedbackDefinition, combineRgb } from '@companion-module/base'
import { OntimeV3 } from '../ontimev3'
import { feedbackId } from '../../enums'
import { MessageState } from '../ontime-types'

export function createMessageFeedbacks(ontime: OntimeV3): { [id: string]: CompanionFeedbackDefinition } {
	function messageVisible(feedback: CompanionFeedbackBooleanEvent): boolean {
		const source = feedback.options.source as keyof MessageState
		const { text, visible } = ontime.state.message[source] as { text: string; visible: boolean }
		return feedback.options.reqText ? visible && text === feedback.options.text : visible
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
				{
					type: 'dropdown',
					id: 'source',
					label: 'Source',
					default: 'timer',
					choices: [
						{ id: 'timer', label: 'Timer' },
					],
				},
				{ type: 'checkbox', id: 'reqText', default: false, label: 'Require matching text' },
				{ type: 'textinput', id: 'text', label: 'Text', isVisible: (options) => options.reqText == true },
			],
			callback: messageVisible,
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
