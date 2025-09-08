import type { CompanionFeedbackBooleanEvent, CompanionFeedbackDefinition } from '@companion-module/base'
import { OntimeV3 } from '../../ontimev3.js'
import { feedbackId, OffsetState } from '../../enums.js'
import { DangerRed, White } from '../../assets/colours.js'

export function createOffsetFeedbacks(ontime: OntimeV3): { [id: string]: CompanionFeedbackDefinition } {
	function offset(feedback: CompanionFeedbackBooleanEvent): boolean {
		const state = feedback.options.state as OffsetState | undefined
		if (!state) return false
		if (ontime.state.offset.absolute === null || ontime.state.offset.absolute === undefined) return false
		const margin = Number(feedback.options.margin)
		const offset = ontime.state.offset.absolute / 1000
		switch (state) {
			case OffsetState.On:
				return offset > -margin && offset < margin
			case OffsetState.Both:
				return offset < -margin || offset > margin
			case OffsetState.Behind:
				return offset < -margin
			case OffsetState.Ahead:
				return offset > margin
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
						{ id: OffsetState.Behind, label: 'Behind schedule' },
						{ id: OffsetState.Ahead, label: 'Ahead of schedule' },
						{ id: OffsetState.Both, label: 'Behind or Ahead of schedule' },
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
