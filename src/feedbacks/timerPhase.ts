import type { CompanionFeedbackDefinition } from '@companion-module/base'
import { TimerPhase } from '@getontime/resolver'
import { feedbackId } from '../enums.js'
import { DangerRed, White } from '../assets/colours.js'
import type OntimeState from '../state.js'

export function createTimerPhaseFeedback(state: OntimeState): {
	[id: string]: CompanionFeedbackDefinition
} {
	return {
		[feedbackId.TimerPhase]: {
			type: 'boolean',
			name: 'Timer phase',
			description: 'Timer phase use Ontimes warn and danger times to change colour depending on timer progress',
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
			callback: (feedback) => (feedback.options.phase as TimerPhase[]).some((value) => value === state.timer.phase),
		},
	}
}
