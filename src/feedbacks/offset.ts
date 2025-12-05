import type {
	CompanionFeedbackBooleanEvent,
	CompanionFeedbackDefinition,
	CompanionMigrationFeedback,
} from '@companion-module/base'
import { feedbackId } from '../enums.js'
import { DangerRed, White } from '../assets/colours.js'
import type OntimeState from '../state.js'

enum OffsetState {
	On = 'on',
	Under = 'under',
	Over = 'Over',
	Both = 'both',
}

export function createOffsetFeedbacks(state: OntimeState): { [id: string]: CompanionFeedbackDefinition } {
	function offset(feedback: CompanionFeedbackBooleanEvent): boolean {
		const offsetState = feedback.options.state as OffsetState | undefined
		if (!offsetState) return false
		if (state.helper.offset === null || state.helper.offset === undefined) return false
		const margin = Number(feedback.options.margin)
		const offset = state.helper.offset / 1000
		switch (offsetState) {
			case OffsetState.On:
				return offset > -margin && offset < margin
			case OffsetState.Both:
				return offset < -margin || offset > margin
			case OffsetState.Over:
				return offset > margin
			case OffsetState.Under:
				return offset < -margin
		}

		return false
	}

	return {
		[feedbackId.RundownOffset]: {
			type: 'boolean',
			name: 'Rundown Offset',
			description: 'Colour of indicator for rundown offset state',
			defaultStyle: {
				color: White,
				bgcolor: DangerRed,
			},
			options: [
				{
					type: 'dropdown',
					label: 'State',
					id: 'state',
					choices: [
						{ id: OffsetState.On, label: 'On time' },
						{ id: OffsetState.Over, label: 'Over time' },
						{ id: OffsetState.Under, label: 'Under time' },
						{ id: OffsetState.Both, label: 'Over or Under timer' },
					],
					default: 'behind',
				},
				{
					type: 'number',
					label: 'Margin',
					id: 'margin',
					default: 10,
					min: 0,
					max: 120,
					tooltip: 'How many seconds in offset time to allow before triggering',
				},
			],
			callback: offset,
		},
	}
}

/**
 * v5.0.0 the offset value has been inverted
 */
export function upgrade_offsetIsInvertedFeedback(feedback: CompanionMigrationFeedback): boolean {
	if (feedback.feedbackId !== `${feedbackId.RundownOffset}`) {
		return false
	}

	const currentChoice = feedback.options.state ?? 'on'

	feedback.options.state = {
		on: OffsetState.On,
		behind: OffsetState.Over,
		ahead: OffsetState.Under,
		Both: OffsetState.Both,
	}[currentChoice as string]

	return true
}
