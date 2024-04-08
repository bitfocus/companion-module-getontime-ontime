import { CompanionFeedbackDefinition, CompanionFeedbackDefinitions, combineRgb } from '@companion-module/base'
import { feedbackId } from '../../enums'
import { OntimeV2 } from '../ontimev2'

export function feedbacks(ontime: OntimeV2): CompanionFeedbackDefinitions {
	const feedbacks: { [id: string]: CompanionFeedbackDefinition | undefined } = {}

	feedbacks[feedbackId.TimerMessageVisible] = {
		type: 'boolean',
		name: 'Change color from timer message visibility',
		description: 'Change the colors of a button if timer message is visible',
		defaultStyle: {
			color: combineRgb(255, 255, 255),
			bgcolor: combineRgb(255, 0, 0),
		},
		options: [],
		callback: () => {
			if (ontime.state.timerMessage.visible) {
				return true
			} else {
				return false
			}
		},
	}
	feedbacks[feedbackId.ThisTimerMessageVisible] = {
		type: 'boolean',
		name: 'Change color from this timer message visibility',
		description: 'Change the colors of a button if timer message is visible and matches this message',
		defaultStyle: {
			color: combineRgb(255, 255, 255),
			bgcolor: combineRgb(255, 0, 0),
		},
		options: [
			{
				type: 'textinput',
				id: 'msg',
				default: '',
				required: true,
				label: 'Message to match',
			},
		],
		callback: (feedback) => {
			if (ontime.state.timerMessage.visible && ontime.state.timerMessage.text === feedback.options.msg) {
				return true
			} else {
				return false
			}
		},
	}
	feedbacks[feedbackId.PublicMessageVisible] = {
		type: 'boolean',
		name: 'Change color from public message visibility',
		description: 'Change the colors of a button if public message is visible',
		defaultStyle: {
			color: combineRgb(255, 255, 255),
			bgcolor: combineRgb(255, 0, 0),
		},
		options: [],
		callback: () => {
			if (ontime.state.publicMessage.visible) {
				return true
			} else {
				return false
			}
		},
	}
	feedbacks[feedbackId.LowerMessageVisible] = {
		type: 'boolean',
		name: 'Change color from lower message visibility',
		description: 'Change the colors of a button if lower message is visible',
		defaultStyle: {
			color: combineRgb(255, 255, 255),
			bgcolor: combineRgb(255, 0, 0),
		},
		options: [],
		callback: () => {
			if (ontime.state.lowerMessage.visible) {
				return true
			} else {
				return false
			}
		},
	}
	feedbacks[feedbackId.TimerBlink] = {
		type: 'boolean',
		name: 'Change color if timer is blinking',
		description: 'Change the colors of a button if timer is blinking',
		defaultStyle: {
			color: combineRgb(255, 255, 255),
			bgcolor: combineRgb(229, 62, 62),
		},
		options: [],
		callback: () => {
			if (ontime.state.timerMessage.timerBlink) {
				return true
			} else {
				return false
			}
		},
	}
	feedbacks[feedbackId.TimerBlackout] = {
		type: 'boolean',
		name: 'Change color if timer is blacked out',
		description: 'Change the colors of a button if timer is blacked out',
		defaultStyle: {
			color: combineRgb(255, 255, 255),
			bgcolor: combineRgb(229, 62, 62),
		},
		options: [],
		callback: () => {
			if (ontime.state.timerMessage.timerBlackout) {
				return true
			} else {
				return false
			}
		},
	}
	return feedbacks
}
