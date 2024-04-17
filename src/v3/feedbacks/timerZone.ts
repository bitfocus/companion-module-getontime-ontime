import { CompanionFeedbackDefinition, combineRgb } from '@companion-module/base'
import { TimerZone } from '../ontime-types.js'
import { feedbackId } from '../../enums.js'

export function createTimerZoneFeedback(ontime: { state: { companionSpecific: { timerZone: TimerZone } } }): {
	[id: string]: CompanionFeedbackDefinition
} {
	return {
		[feedbackId.TimerZone]: {
			type: 'boolean',
			name: 'Change color from timer zone',
			description: 'TODO: description',
			defaultStyle: {
				color: combineRgb(255, 255, 255),
				bgcolor: combineRgb(255, 0, 0),
			},
			options: [
				{
					type: 'dropdown',
					label: 'State',
					id: 'zone',
					choices: [
						{ id: TimerZone.None, label: 'None' },
						{ id: TimerZone.Normal, label: 'Normal' },
						{ id: TimerZone.Warning, label: 'Warning' },
						{ id: TimerZone.Danger, label: 'Danger' },
						{ id: TimerZone.Overtime, label: 'Overtime' },
					],
					default: TimerZone.Danger,
				},
			],
			callback: (feedback) => {
				return ontime.state.companionSpecific.timerZone === feedback.options.zone
			},
		},
	}
}
