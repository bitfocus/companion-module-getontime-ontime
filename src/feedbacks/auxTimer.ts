import type { CompanionFeedbackDefinition } from '@companion-module/base'
import { feedbackId } from '../enums.js'
import { SimplePlayback } from '@getontime/resolver'
import { DangerRed, PlaybackGreen, White } from '../assets/colours.js'
import type OntimeState from '../state.js'

export function createAuxTimerFeedbacks(state: OntimeState): { [id: string]: CompanionFeedbackDefinition } {
	return {
		[feedbackId.AuxTimerPlayback]: {
			type: 'boolean',
			name: 'Aux Timer Playback state',
			description: 'Indicator colour for playback state',
			defaultStyle: {
				color: White,
				bgcolor: PlaybackGreen,
			},
			options: [
				{
					type: 'dropdown',
					choices: [
						{ id: 'auxtimer1', label: 'Aux Timer 1' },
						{ id: 'auxtimer2', label: 'Aux Timer 2' },
						{ id: 'auxtimer3', label: 'Aux Timer 3' },
					],
					default: 'auxtimer1',
					id: 'destination',
					label: 'Select Aux Timer',
				},
				{
					type: 'dropdown',
					label: 'State',
					id: 'state',
					choices: [
						{ id: SimplePlayback.Start, label: 'Play' },
						{ id: SimplePlayback.Pause, label: 'Pause' },
						{ id: SimplePlayback.Stop, label: 'Stop' },
					],
					default: SimplePlayback.Start,
				},
			],
			callback: (feedback) =>
				state[feedback.options.destination as 'auxtimer1' | 'auxtimer2' | 'auxtimer3'].playback ===
				feedback.options.state,
		},
		[feedbackId.AuxTimerNegative]: {
			type: 'boolean',
			name: 'Aux Timer negative',
			description: 'Indicator colour for Aux Timer negative',
			defaultStyle: {
				color: White,
				bgcolor: DangerRed,
			},
			options: [
				{
					type: 'dropdown',
					choices: [
						{ id: 'auxtimer1', label: 'Aux Timer 1' },
						{ id: 'auxtimer2', label: 'Aux Timer 2' },
						{ id: 'auxtimer3', label: 'Aux Timer 3' },
					],
					default: 'auxtimer1',
					id: 'destination',
					label: 'Select Aux Timer',
				},
			],
			callback: (feedback) =>
				state[feedback.options.destination as 'auxtimer1' | 'auxtimer2' | 'auxtimer3'].current < 0,
		},
	}
}
