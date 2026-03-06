import type { CompanionFeedbackDefinitions } from '@companion-module/base'
import { TimerPhase } from '@getontime/resolver'
import { feedbackId } from '../enums.js'
import { DangerRed, White } from '../assets/colours.js'
import type OntimeState from '../state.js'

export type TimerPhaseFeedbackSchema = {
	[feedbackId.TimerPhase]: {
		type: 'boolean'
		options: {
			phase: TimerPhase[]
		}
	}
}

export function createTimerPhaseFeedback(state: OntimeState): CompanionFeedbackDefinitions<TimerPhaseFeedbackSchema> {
	return {
		[feedbackId.TimerPhase]: {
			type: 'boolean',
			name: 'Timer phase',
			description: "Timer phase use Ontime's warn and danger times to change colour depending on timer progress",
			defaultStyle: {
				color: White,
				bgcolor: DangerRed,
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
			callback: (feedback) => feedback.options.phase.some((value) => value === state.timer.phase),
		},
	}
}
