import { CompanionFeedbackDefinition } from '@companion-module/base'
import { OntimeV3 } from '../ontimev3'
import { feedbackId } from '../../enums'
import { ActiveBlue, White } from '../../assets/colours'

export function createFrozenFeedbacks(ontime: OntimeV3): { [id: string]: CompanionFeedbackDefinition } {
	return {
		[feedbackId.Frozen]: {
			type: 'boolean',
			name: 'Frozen state',
			description: 'Indicator colour for frozen state',
			defaultStyle: {
				color: White,
				bgcolor: ActiveBlue,
			},
			options: [],
			callback: () => ontime.state.frozen,
		},
	}
}
