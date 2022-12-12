const { combineRgb } = require('@companion-module/base')
import { states } from './index'

exports.getFeedbacks = function () {
  const feedbacks = {}

  feedbacks['state_color'] = {
		type: 'advanced',
		name: 'Change color from state',
		description: 'Change the colors of a bank according to the timer state',
		options: [
			{
				type: 'colorpicker',
				name: 'Running: Foreground color',
				id: 'run_fg',
				default: combineRgb(255, 255, 255),
			},
			{
				type: 'colorpicker',
				name: 'Running: Background color',
				id: 'run_bg',
				default: combineRgb(0, 204, 0),
			},
			{
				type: 'colorpicker',
				name: 'Paused: Foreground color',
				id: 'pause_fg',
				default: combineRgb(255, 255, 255),
			},
			{
				type: 'colorpicker',
				name: 'Paused: Background color',
				id: 'pause_bg',
				default: combineRgb(237, 137, 54),
			},
			{
				type: 'colorpicker',
				name: 'Stopped: Foreground color',
				id: 'stop_fg',
				default: combineRgb(255, 255, 255),
			},
			{
				type: 'colorpicker',
				name: 'Stopped: Background color',
				id: 'stop_bg',
				default: combineRgb(0, 0, 0),
			},
			{
				type: 'colorpicker',
				name: 'Roll: Foreground color',
				id: 'roll_fg',
				default: combineRgb(255, 255, 255),
			},
			{
				type: 'colorpicker',
				name: 'Roll: Background color',
				id: 'roll_bg',
				default: combineRgb(43, 108, 176),
			},
		],
		callback: (feedback) => {
			if (status.state == 'start') {
				return {
					color: feedback.options.run_fg,
					bgcolor: feedback.options.run_bg,
				}
			} else if (states.playstate == 'pause') {
				return {
					color: feedback.options.pause_fg,
					bgcolor: feedback.options.pause_bg,
				}
			} else if (states.playstate == 'stop') {
				return {
					color: feedback.options.stop_fg,
					bgcolor: feedback.options.stop_bg,
				}
			} else if (states.playstate == 'roll') {
				return {
					color: feedback.options.roll_fg,
					bgcolor: feedback.options.roll_bg,
				}
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
		callback: (feedback) => {
			if (states.isNegative) {
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
		callback: (feedback) => {
			if (states.onAir) {
				return true
			} else {
				return false
			}
		},
	}
  return feedbacks
}
