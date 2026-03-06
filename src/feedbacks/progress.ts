import type { CompanionFeedbackAdvancedEvent, CompanionFeedbackDefinitions } from '@companion-module/base'
import { feedbackId } from '../enums.js'
import { graphics } from 'companion-module-utils'
import { TimerPhase } from '@getontime/resolver'
import { DangerRed, NormalGray, WarningOrange } from '../assets/colours.js'
import type OntimeState from '../state.js'

export type ProgressFeedbackSchema = {
	[feedbackId.TimerProgressBar]: {
		type: 'advanced'
		options: {
			big: boolean
			normal: number
			warning: number
			danger: number
		}
	}
	[feedbackId.TimerProgressBarMulti]: {
		type: 'advanced'
		options: {
			big: boolean
			normal: number
			warning: number
			danger: number
			index: number
			amount: number
		}
	}
}

function generateProgressBar(
	feedback: CompanionFeedbackAdvancedEvent<
		ProgressFeedbackSchema[feedbackId.TimerProgressBar | feedbackId.TimerProgressBarMulti]['options']
	>,
	phase: TimerPhase,
	value: number,
) {
	if (!feedback.image) return {}
	let colour = 0
	const { normal, warning, danger, big } = feedback.options
	switch (phase) {
		case TimerPhase.None:
		case TimerPhase.Default:
		case TimerPhase.Pending:
			colour = normal
			break
		case TimerPhase.Warning:
			colour = warning
			break
		case TimerPhase.Danger:
		case TimerPhase.Overtime:
			colour = danger
			break
	}
	const options: graphics.OptionsBar = {
		width: feedback.image.width,
		height: feedback.image.height,
		colors: [
			{
				size: 100,
				color: colour,
				background: colour,
				backgroundOpacity: 150,
			},
		],
		barLength: feedback.image.width,
		barWidth: big ? feedback.image.height - 40 : 10,
		value,
		type: 'horizontal',
		offsetX: 0,
		offsetY: big ? 20 : feedback.image.height - 10,
		opacity: 255,
	}

	return {
		imageBuffer: graphics.bar(options) as unknown as string,
	}
}

export function createProgressFeedbacks(state: OntimeState): CompanionFeedbackDefinitions<ProgressFeedbackSchema> {
	return {
		[feedbackId.TimerProgressBar]: {
			type: 'advanced',
			name: 'Progressbar',
			description: 'Progressbar indicating the main timer progression',
			options: [
				{ type: 'checkbox', id: 'big', label: 'Big graphic', default: false, disableAutoExpression: true },
				{ type: 'colorpicker', id: 'normal', label: 'Normal', default: NormalGray, disableAutoExpression: true },
				{ type: 'colorpicker', id: 'warning', label: 'Warning', default: WarningOrange, disableAutoExpression: true },
				{ type: 'colorpicker', id: 'danger', label: 'Danger', default: DangerRed, disableAutoExpression: true },
			],
			callback: (feedback) => {
				const { current, duration, phase } = state.timer
				const value = current !== null && duration !== null ? (1 - current / duration) * 100 : 0
				return generateProgressBar(feedback, phase, value)
			},
		},
		[feedbackId.TimerProgressBarMulti]: {
			type: 'advanced',
			name: 'Multi Progressbar',
			description: 'Progressbar across multiple buttons indicating the main timer progression',
			options: [
				{ type: 'checkbox', id: 'big', label: 'Big graphic', default: true, disableAutoExpression: true },
				{ type: 'colorpicker', id: 'normal', label: 'Normal', default: NormalGray, disableAutoExpression: true },
				{ type: 'colorpicker', id: 'warning', label: 'Warning', default: WarningOrange, disableAutoExpression: true },
				{ type: 'colorpicker', id: 'danger', label: 'Danger', default: DangerRed, disableAutoExpression: true },
				{ type: 'number', id: 'amount', label: 'Amount', default: 3, min: 1, max: 8, disableAutoExpression: true },
				{
					type: 'number',
					id: 'index',
					label: 'Index',
					tooltip: 'this buttons index in the array',
					default: 1,
					min: 1,
					max: 8,
					disableAutoExpression: true,
				},
			],
			callback: (feedback) => {
				const { current, duration, phase } = state.timer
				const amount = feedback.options.amount
				const index = feedback.options.index - 1
				const val = current !== null && duration !== null ? (1 - current / duration) * 100 : 0
				const scaledVal = val * amount - 100 * index
				return generateProgressBar(feedback, phase, scaledVal)
			},
		},
	}
}
