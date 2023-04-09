import { CompanionFeedbackDefinition, CompanionFeedbackDefinitions, combineRgb } from '@companion-module/base'
import { OnTimeInstance } from '../index'
import { feedbackId } from '../enums'

export function GetFeedbacks(self: OnTimeInstance): CompanionFeedbackDefinitions {
	const feedbacks: { [id: string]: CompanionFeedbackDefinition | undefined } = {}

	feedbacks[feedbackId.ColorRunning] = {
		type: 'boolean',
		name: 'Change color from timer state running',
		description: 'Change the colors of a bank according if the timer is running',
		defaultStyle: {
			color: combineRgb(255, 255, 255),
			bgcolor: combineRgb(0, 204, 0),
		},
		options: [],
		callback: (_feedback) => {
			if (self.states.playback === 'play') {
				return true
			} else {
				return false
			}
		},
	}
	feedbacks[feedbackId.ColorPaused] = {
		type: 'boolean',
		name: 'Change color from timer state paused',
		description: 'Change the colors of a bank according if the timer is paused',
		defaultStyle: {
			color: combineRgb(255, 255, 255),
			bgcolor: combineRgb(237, 137, 54),
		},
		options: [],
		callback: (_feedback) => {
			if (self.states.playback == 'pause') {
				return true
			} else {
				return false
			}
		},
	}
	feedbacks[feedbackId.ColorStopped] = {
		type: 'boolean',
		name: 'Change color from timer state stopped',
		description: 'Change the colors of a bank according if the timer is stopped',
		defaultStyle: {
			color: combineRgb(255, 255, 255),
			bgcolor: combineRgb(0, 0, 0),
		},
		options: [],
		callback: (_feedback) => {
			if (self.states.playback == 'stop') {
				return true
			} else {
				return false
			}
		},
	}
	feedbacks[feedbackId.ColorRoll] = {
		type: 'boolean',
		name: 'Change color from timer state roll',
		description: 'Change the colors of a bank according if the timer is in roll',
		defaultStyle: {
			color: combineRgb(255, 255, 255),
			bgcolor: combineRgb(43, 108, 176),
		},
		options: [],
		callback: (_feedback) => {
			if (self.states.playback == 'roll') {
				return true
			} else {
				return false
			}
		},
	}
	feedbacks[feedbackId.ColorNegative] = {
		type: 'boolean',
		name: 'Change color from timer negative',
		description: 'Change the colors of a bank according if the timer runs into negative time',
		defaultStyle: {
			color: combineRgb(255, 255, 255),
			bgcolor: combineRgb(255, 0, 0),
		},
		options: [],
		callback: (_feedback) => {
			if (self.states.isNegative) {
				return true
			} else {
				return false
			}
		},
	}
	feedbacks[feedbackId.OnAir] = {
		type: 'boolean',
		name: 'Change color from onAir',
		description: 'Change the colors of a bank if onAir is turned on',
		defaultStyle: {
			color: combineRgb(255, 255, 255),
			bgcolor: combineRgb(255, 0, 0),
		},
		options: [],
		callback: (_feedback) => {
			if (self.states.onAir) {
				return true
			} else {
				return false
			}
		},
	}
	feedbacks[feedbackId.SpeakerMessageVisible] = {
		type: 'boolean',
		name: 'Change color from speaker message visibility',
		description: 'Change the colors of a bank if speaker message is visible',
		defaultStyle: {
			color: combineRgb(255, 255, 255),
			bgcolor: combineRgb(255, 0, 0),
		},
		options: [],
		callback: () => {
			if (self.states.timerMessage.visible) {
				return true
			} else {
				return false
			}
		},
	}
	feedbacks[feedbackId.PublicMessageVisible] = {
		type: 'boolean',
		name: 'Change color from public message visibility',
		description: 'Change the colors of a bank if public message is visible',
		defaultStyle: {
			color: combineRgb(255, 255, 255),
			bgcolor: combineRgb(255, 0, 0),
		},
		options: [],
		callback: () => {
			if (self.states.publicMessage.visible) {
				return true
			} else {
				return false
			}
		},
	}
	feedbacks[feedbackId.LowerMessageVisible] = {
		type: 'boolean',
		name: 'Change color from lower message visibility',
		description: 'Change the colors of a bank if lower message is visible',
		defaultStyle: {
			color: combineRgb(255, 255, 255),
			bgcolor: combineRgb(255, 0, 0),
		},
		options: [],
		callback: () => {
			if (self.states.lowerMessage.visible) {
				return true
			} else {
				return false
			}
		},
	}
	return feedbacks
}
