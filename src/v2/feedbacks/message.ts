import { CompanionFeedbackBooleanEvent, CompanionFeedbackDefinition, combineRgb } from '@companion-module/base'
import { OntimeV2 } from '../ontimev2'
import { feedbackId } from '../../enums'

const namesToV2names: Record<string, keyof OntimeV2['state']> = {
	timer: 'timerMessage',
	lower: 'lowerMessage',
	public: 'publicMessage',
}

export function createMessageFeedbacks(ontime: OntimeV2): { [id: string]: CompanionFeedbackDefinition } {
	function messageVisible(feedback: CompanionFeedbackBooleanEvent): boolean {
		const source = namesToV2names[feedback.options.source as keyof typeof namesToV2names]
		const { text, visible } = ontime.state[source] as { text: string; visible: boolean }
		return feedback.options.reqText ? visible && text === feedback.options.text : visible
	}

	return {
		[feedbackId.MessageVisible]: {
			type: 'boolean',
			name: 'Change color from message visibility',
			description: 'Change the colors of a button if message is visible',
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
						{ id: 'lower', label: 'Lower Third' },
						{ id: 'public', label: 'Public' },
					],
				},
				{ type: 'checkbox', id: 'reqText', default: false, label: 'Requere matching text' },
				{ type: 'textinput', id: 'text', label: 'Text', isVisible: (options) => options.reqText == true },
			],
			callback: messageVisible,
		},
		[feedbackId.TimerBlink]: {
			type: 'boolean',
			name: 'Change color if timer is blinking',
			description: 'Change the colors of a button if timer is blinking',
			defaultStyle: {
				color: combineRgb(255, 255, 255),
				bgcolor: combineRgb(229, 62, 62),
			},
			options: [],
			callback: () => ontime.state.timerMessage.timerBlink,
		},
		[feedbackId.TimerBlackout]: {
			type: 'boolean',
			name: 'Change color if timer is blacked out',
			description: 'Change the colors of a button if timer is blacked out',
			defaultStyle: {
				color: combineRgb(255, 255, 255),
				bgcolor: combineRgb(229, 62, 62),
			},
			options: [],
			callback: () => ontime.state.timerMessage.timerBlackout,
		},
	}
}
