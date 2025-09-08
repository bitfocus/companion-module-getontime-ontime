import type { CompanionFeedbackDefinition } from '@companion-module/base'
import { feedbackId } from '../../enums.js'
import { OntimeV3 } from '../../ontimev3.js'
import { DangerRed, White } from '../../assets/colours.js'
import { TimerPhase } from '@getontime/types'

export function createTimerPhaseFeedback(ontime: OntimeV3): {
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
			callback: (feedback) => {
				if (typeof feedback.options.phase === 'string') {
					return feedback.options.phase === ontime.state.timer.phase // eslint-disable-line @typescript-eslint/no-unsafe-enum-comparison
				}
				return (feedback.options.phase as TimerPhase[]).some((value) => value === ontime.state.timer.phase)
			},
		},
	}
}
