import { CompanionFeedbackDefinition, CompanionFeedbackDefinitions, combineRgb } from '@companion-module/base'
import { OnTimeInstance } from './index'

export function GetFeedbacks(self: OnTimeInstance): CompanionFeedbackDefinitions {
	const feedbacks: { [id: string]: CompanionFeedbackDefinition | undefined } = {}

	feedbacks['state_color_running'] = {
		type: 'boolean',
		name: 'Change color from timer state running',
		description: 'Change the colors of a bank according if the timer is running',
		defaultStyle: {
			color: combineRgb(255, 255, 255),
			bgcolor: combineRgb(0, 204, 0),
		},
		options: [],
		callback: (_feedback) => {
			if (self.states.playstate == 'start') {
				return true
			} else {
				return false
			}
		},
	}
	feedbacks['state_color_paused'] = {
		type: 'boolean',
		name: 'Change color from timer state paused',
		description: 'Change the colors of a bank according if the timer is paused',
		defaultStyle: {
			color: combineRgb(255, 255, 255),
			bgcolor: combineRgb(237, 137, 54),
		},
		options: [],
		callback: (_feedback) => {
			if (self.states.playstate == 'pause') {
				return true
			} else {
				return false
			}
		},
	}
	feedbacks['state_color_stopped'] = {
		type: 'boolean',
		name: 'Change color from timer state stopped',
		description: 'Change the colors of a bank according if the timer is stopped',
		defaultStyle: {
			color: combineRgb(255, 255, 255),
			bgcolor: combineRgb(0, 0, 0),
		},
		options: [],
		callback: (_feedback) => {
			if (self.states.playstate == 'stop') {
				return true
			} else {
				return false
			}
		},
	}
	feedbacks['state_color_roll'] = {
		type: 'boolean',
		name: 'Change color from timer state roll',
		description: 'Change the colors of a bank according if the timer is in roll',
		defaultStyle: {
			color: combineRgb(255, 255, 255),
			bgcolor: combineRgb(43, 108, 176),
		},
		options: [],
		callback: (_feedback) => {
			if (self.states.playstate == 'roll') {
				return true
			} else {
				return false
			}
		},
	}
	feedbacks['timer_negative'] = {
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
	feedbacks['onAir'] = {
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
	return feedbacks
}
