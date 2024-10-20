import { CompanionFeedbackDefinition } from '@companion-module/base'
import { OntimeV3 } from '../ontimev3'
import { feedbackId } from '../../enums'
import { ActiveBlue, White } from '../../assets/colours'

export function createCustomFieldsFeedbacks(ontime: OntimeV3): { [id: string]: CompanionFeedbackDefinition } {
	const { customFields } = ontime
	return {
		[feedbackId.CustomFieldsValue]: {
			type: 'boolean',
			name: 'Custom Field',
			description: 'Colour of indicator for rundown offset state',
			defaultStyle: {
				color: White,
				bgcolor: ActiveBlue,
			},
			options: [
				{
					type: 'dropdown',
					id: 'target',
					label: 'Target',
					choices: [
						{ id: 'now', label: 'Current Event' },
						{ id: 'next', label: 'Next Event' },
					],
					default: 'now',
				},
				{
					type: 'dropdown',
					id: 'field',
					label: 'Custom Field',
					choices: Object.entries(customFields).map(([key, field]) => {
						return { id: key, label: field.label }
					}),
					default: '',
				},
				{
					type: 'checkbox',
					id: 'requireValue',
					label: 'Match specific value',
					default: false,
				},
				{
					type: 'textinput',
					id: 'match',
					label: 'Value to match',
					isVisible: (opts) => opts.requireValue === true,
				},
			],
			learn: (action) => {
				const target = action.options.target as string
				const field = action.options.field as string
				const fieldValue =
					target === 'now' ? ontime.state.eventNow?.custom[field] : ontime.state.eventNext?.custom[field]
				return { ...action.options, requireValue: true, match: fieldValue ?? '' }
			},
			callback: (feedback) => {
				const target = feedback.options.target as string
				const field = feedback.options.field as string
				const requireValue = feedback.options.requireValue as string
				const match = feedback.options.match as string
				const fieldValue =
					target === 'now' ? ontime.state.eventNow?.custom[field] : ontime.state.eventNext?.custom[field]

				if (fieldValue === undefined || fieldValue === '') {
					return false
				}

				if (!requireValue) {
					return true
				}

				if (match === fieldValue) {
					return true
				}
				return false
			},
		},
	}
}
