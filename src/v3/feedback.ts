import { CompanionFeedbackDefinition, CompanionFeedbackDefinitions, combineRgb } from '@companion-module/base'
import { OnTimeInstance } from '../index'
import { deprecatedFeedbackId, feedbackId, variableId } from '../enums'
import { Playback } from './state'

export function feedbacks(self: OnTimeInstance): CompanionFeedbackDefinitions {
	const feedbacks: { [id: string]: CompanionFeedbackDefinition | undefined } = {}

	feedbacks[feedbackId.ColorPlayback] = {
		type: 'boolean',
		name: 'Change color from timer playbeck state',
		description: 'Change the colors of a button according if the timer is stop/play/pause/armed',
		defaultStyle: {
			color: combineRgb(255, 255, 255),
			bgcolor: combineRgb(0, 204, 0),
		},
		options: [
			{
				id: 'state',
				type: 'dropdown',
				label: 'State',
				choices: [
					{ id: Playback.Play, label: 'Playing' },
					{ id: Playback.Stop, label: 'Stoped' },
					{ id: Playback.Pause, label: 'Paused' },
					{ id: Playback.Roll, label: 'Rolling' },
					{ id: Playback.Armed, label: 'Armed' },
				],
				default: Playback.Play,
			},
		],
		callback: (feedback) => {
			return self.getVariableValue(variableId.PlayState) === feedback.options.state
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
			return Number(self.getVariableValue(variableId.TimerTotalMs)) < 0
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
			return self.getVariableValue(variableId.TimerAdded) != '00:00:00'
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
			return Boolean(self.getVariableValue(variableId.OnAir))
		},
	}
	feedbacks[feedbackId.MessageVisible] = {
		type: 'boolean',
		name: 'Change color from message visibility',
		description: 'Change the colors of a button if message is visible',
		defaultStyle: {
			color: combineRgb(255, 255, 255),
			bgcolor: combineRgb(255, 0, 0),
		},
		options: [
			{
				id: 'src',
				type: 'dropdown',
				label: 'Message Source',
				choices: [
					{ id: 'timer', label: 'Timer' },
					{ id: 'lower', label: 'Lower' },
					{ id: 'public', label: 'Public' },
				],
				default: 'timer',
			},
		],
		callback: (feedback) => {
			switch (feedback.options.src) {
				case 'timer': {
					return Boolean(self.getVariableValue(variableId.TimerMessageVisible))
				}
				case 'lower': {
					return Boolean(self.getVariableValue(variableId.LowerMessageVisible))
				}
				case 'public': {
					return Boolean(self.getVariableValue(variableId.PublicMessageVisible))
				}
				default: {
					return false
				}
			}
		},
	}
	feedbacks[deprecatedFeedbackId.ThisMessageVisible] = {
		type: 'boolean',
		name: 'Change color from this message visibility',
		description: 'Change the colors of a button if message is visible and matches this message',
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
			{
				id: 'src',
				type: 'dropdown',
				label: 'Message Source',
				choices: [
					{ id: 'timer', label: 'Timer' },
					{ id: 'lower', label: 'Lower' },
					{ id: 'public', label: 'Public' },
				],
				default: 'timer',
			},
		],
		callback: (feedback) => {
			switch (feedback.options.src) {
				case 'timer': {
					return (
						Boolean(self.getVariableValue(variableId.TimerMessageVisible)) &&
						self.getVariableValue(variableId.TimerMessage) === feedback.options.msg
					)
				}
				case 'lower': {
					return (
						Boolean(self.getVariableValue(variableId.LowerMessageVisible)) &&
						self.getVariableValue(variableId.LowerMessage) === feedback.options.msg
					)
				}
				case 'public': {
					return (
						Boolean(self.getVariableValue(variableId.PublicMessageVisible)) &&
						self.getVariableValue(variableId.PublicMessage) === feedback.options.msg
					)
				}
				default: {
					return false
				}
			}
		},
	}
	feedbacks[feedbackId.TimerBlink] = {
		type: 'boolean',
		name: 'Change color if timer is blinking',
		description: 'Change the colors of a button if timer is blinking',
		defaultStyle: {
			color: combineRgb(255, 255, 255),
			bgcolor: combineRgb(255, 0, 0),
		},
		options: [],
		callback: () => {
			return Boolean(self.getVariableValue(variableId.TimerBlink))
		},
	}
	feedbacks[feedbackId.TimerBlackout] = {
		type: 'boolean',
		name: 'Change color if timer is blacked out',
		description: 'Change the colors of a button if timer is blacked out',
		defaultStyle: {
			color: combineRgb(255, 255, 255),
			bgcolor: combineRgb(255, 0, 0),
		},
		options: [],
		callback: () => {
			return Boolean(self.getVariableValue(variableId.TimerBlackout))
		},
	}
	return feedbacks
}
