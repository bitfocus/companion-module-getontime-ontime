import { CompanionFeedbackDefinition, combineRgb } from '@companion-module/base'
import { OntimeV3 } from '../ontimev3'
import { feedbackId } from '../../enums'
import { SimplePlayback } from '../ontime-types'
import { getAuxTimerState } from '../../utilities'

export function createAuxTimerFeedbacks(ontime: OntimeV3): { [id: string]: CompanionFeedbackDefinition } {
	return {
		[feedbackId.AuxTimerPlayback]: {
			type: 'boolean',
			name: 'Aux Timer Playback state',
			description: 'Indicator colour for playback state',
			defaultStyle: {
				color: combineRgb(255, 255, 255),
				bgcolor: combineRgb(0, 204, 0),
			},
			options: [
				{
					type: 'dropdown',
					choices: [{ id: 'auxtimer1', label: 'Aux Timer 1' }],
					default: 'auxtimer1',
					id: 'destination',
					label: 'Select Aux Timer',
					isVisible: () => false, //This Stays hidden for now
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
				getAuxTimerState(ontime, feedback.options.id as string).playback === feedback.options.state,
		},
		[feedbackId.AuxTimerNegative]: {
			type: 'boolean',
			name: 'Aux Timer negative',
			description: 'Indicator colour for Aux Timer negative',
			defaultStyle: {
				color: combineRgb(255, 255, 255),
				bgcolor: combineRgb(0, 204, 0),
			},
			options: [
				{
					type: 'dropdown',
					choices: [{ id: 'auxtimer1', label: 'Aux Timer 1' }],
					default: 'auxtimer1',
					id: 'destination',
					label: 'Select Aux Timer',
					isVisible: () => false, //This Stays hidden for now
				},
			],
			callback: (feedback) => getAuxTimerState(ontime, feedback.options.id as string).current < 0,
		},
	}
}
