import { CompanionFeedbackDefinition, CompanionFeedbackDefinitions, combineRgb } from '@companion-module/base'
import { OnTimeInstance } from '../index'
import { feedbackId } from '../enums'

export function feedbacks(self: OnTimeInstance): CompanionFeedbackDefinitions {
	const feedbacks: { [id: string]: CompanionFeedbackDefinition | undefined } = {}

	feedbacks[feedbackId.ColorRunning] = {
		type: 'boolean',
		name: 'Change color from timer state running',
		description: 'Change the colors of a button according if the timer is running',
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
		description: 'Change the colors of a button according if the timer is paused',
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
		description: 'Change the colors of a button according if the timer is stopped',
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
		description: 'Change the colors of a button according if the timer is in roll',
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
		description: 'Change the colors of a button according if the timer runs into negative time',
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
	feedbacks[feedbackId.ColorAddRemove] = {
		type: 'boolean',
		name: 'Change color from added/removed time',
		description: 'Change the colors of a button according if time has been added/removed',
		defaultStyle: {
			color: combineRgb(255, 255, 255),
			bgcolor: combineRgb(254, 124, 19),
		},
		options: [],
		callback: (_feedback) => {
			if (self.states.timer.addedTime != 0) {
				return true
			} else {
				return false
			}
		},
	}
	feedbacks[feedbackId.OnAir] = {
		type: 'boolean',
		name: 'Change color from onAir',
		description: 'Change the colors of a button if onAir is turned on',
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
		description: 'Change the colors of a button if public message is visible',
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
		description: 'Change the colors of a button if lower message is visible',
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
			if (self.states.timerMessage.timerBlink) {
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
			if (self.states.timerMessage.timerBlackout) {
				return true
			} else {
				return false
			}
		},
	}
	return feedbacks
}
