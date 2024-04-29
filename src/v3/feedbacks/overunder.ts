import { CompanionFeedbackBooleanEvent, CompanionFeedbackDefinition, combineRgb } from '@companion-module/base'
import { OntimeV3 } from '../ontimev3'
import { feedbackId } from '../../enums'

export function createOverUnderFeedbacks(ontime: OntimeV3): { [id: string]: CompanionFeedbackDefinition } {
	function overUnder(feedback: CompanionFeedbackBooleanEvent): boolean {
		const state = feedback.options.state
		const margin = Number(feedback.options.margin)
		const offset = (ontime.state.runtime.offset ?? 0) / 1000
		switch (state) {
			case 'on':
				return offset > -margin && offset < margin
			case 'any':
				return offset < -margin || offset > margin
			case 'over':
				return offset < -margin
			case 'under':
				return offset > margin
		}

		return false
	}

	return {
		[feedbackId.RundownOffset]: {
			type: 'boolean',
			name: 'Rundown Over/Under Offset',
			description: 'Colour of indicator for  rundown offset state',
			defaultStyle: {
				bgcolor: combineRgb(255, 0, 0),
			},
			options: [
				{
					type: 'dropdown',
					label: 'State',
					id: 'state',
					choices: [
						{ id: 'on', label: 'Ontime' },
						{ id: 'over', label: 'Overtime' },
						{ id: 'under', label: 'Undertime' },
						{ id: 'any', label: 'Any' },
					],
					default: 'over',
				},
				{
					type: 'number',
					label: 'Margin',
					id: 'margin',
					default: 10,
					min: 0,
					max: 120,
					tooltip: 'How many seconds in over/under time to allow before triggering',
				},
			],
			callback: overUnder,
		},
	}
}
