import { CompanionFeedbackDefinition, combineRgb } from '@companion-module/base'
import { TimerPhase } from '../ontime-types.js'
import { feedbackId } from '../../enums.js'
import { OntimeV3 } from '../ontimev3.js'

export function createTimerPhaseFeedback(ontime: OntimeV3): {
	[id: string]: CompanionFeedbackDefinition
} {
	return {
		[feedbackId.TimerPhase]: {
			type: 'boolean',
			name: 'Timer zone',
			description: 'Timer zones use Ontimes warn and danger times to change colour depending on timer progress',
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
						{ id: TimerPhase.None, label: 'None' },
						{ id: TimerPhase.Default, label: 'Normal' },
						{ id: TimerPhase.Warning, label: 'Warning' },
						{ id: TimerPhase.Danger, label: 'Danger' },
						{ id: TimerPhase.Negative, label: 'Overtime' },
					],
					default: TimerPhase.Danger,
				},
			],
			callback: (feedback) => {
				return ontime.state.timer.phase === feedback.options.zone
			},
		},
	}
}
