import type { CompanionFeedbackDefinitions, CompanionFeedbackInfo } from '@companion-module/base'
import { feedbackId } from '../enums.js'
import { ActiveBlue, White } from '../assets/colours.js'
import type OntimeState from '../state.js'
import type { CustomFields } from '@getontime/resolver'

type CustomFieldsOption = {
	target: 'now' | 'next'
	field: keyof CustomFields
	requireValue: boolean
	match: string
}

export type CustomFieldsFeedbacksSchema = {
	[feedbackId.CustomFieldsValue]: {
		type: 'boolean'
		options: CustomFieldsOption
	}
}

export function createCustomFieldsFeedbacks(
	state: OntimeState,
): CompanionFeedbackDefinitions<CustomFieldsFeedbacksSchema> {
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
					choices: Object.entries(state.customFields).map(([key, field]) => {
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
					isVisibleExpression: '$(options:requireValue)',
				},
			],
			learn: (action) => {
				const target = action.options.target as string
				const field = action.options.field
				const fieldValue = target === 'now' ? state.eventNow?.custom[field] : state.eventNext?.custom[field]
				return { requireValue: true, match: fieldValue ?? '' }
			},
			callback: (feedback: CompanionFeedbackInfo<CustomFieldsOption>) => {
				const target = feedback.options.target
				const field = feedback.options.field
				const requireValue = feedback.options.requireValue
				const match = feedback.options.match
				const fieldValue = target === 'now' ? state.eventNow?.custom[field] : state.eventNext?.custom[field]

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
