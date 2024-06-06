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
			name: 'Timer phase',
			description: 'Timer phase use Ontimes warn and danger times to change colour depending on timer progress',
			defaultStyle: {
				color: combineRgb(255, 255, 255),
				bgcolor: combineRgb(255, 0, 0),
			},
			options: [
				{
					type: 'multidropdown',
					label: 'State',
					id: 'phase',
					choices: [
						{ id: TimerPhase.None, label: 'None' },
						{ id: TimerPhase.Default, label: 'Default' },
						{ id: TimerPhase.Warning, label: 'Warning' },
						{ id: TimerPhase.Danger, label: 'Danger' },
						{ id: TimerPhase.Overtime, label: 'Overtime' },
						{ id: TimerPhase.Pending, label: 'Pending Roll' },
					],
					default: [TimerPhase.Danger],
				},
			],
			callback: (feedback) => {
				return (feedback.options.phase as TimerPhase[]).some((value) => value === ontime.state.timer.phase)
			},
		},
	}
}
