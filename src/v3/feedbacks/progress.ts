import { CompanionFeedbackAdvancedEvent, CompanionFeedbackDefinition, combineRgb } from '@companion-module/base'
import { OntimeV3 } from '../ontimev3'
import { feedbackId } from '../../enums'
import { graphics } from 'companion-module-utils'
import { TimerPhase } from '../ontime-types'

export function createProgressFeedbacks(ontime: OntimeV3): { [id: string]: CompanionFeedbackDefinition } {
	function progressbar(feedback: CompanionFeedbackAdvancedEvent) {
		if (!feedback.image) {
			return {}
		}

		const { current, duration } = ontime.state.timer
		const { phase } = ontime.state.timer
		const { normal, warning, danger } = feedback.options as { [key: string]: number }

		const amount = (feedback.options.amount as number) ?? 1
		const index = ((feedback.options.index as number) ?? 1) - 1
		const big = feedback.options.index as boolean

		const val = current !== null && duration !== null ? (1 - current / duration) * 100 : 0

		const scaledVal = val * amount - 100 * index

		let colour = 0

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
			value: scaledVal,
			type: 'horizontal',
			offsetX: 0,
			offsetY: big ? 20 : feedback.image.height - 10,
			opacity: 255,
		}

		return {
			imageBuffer: graphics.bar(options),
		}
	}
	return {
		[feedbackId.TimerProgressBar]: {
			type: 'advanced',
			name: 'Progressbar',
			description: 'Progressbar indicating the main timer progression',
			options: [
				{ type: 'checkbox', id: 'big', label: 'Big graphic', default: false },
				{ type: 'colorpicker', id: 'normal', label: 'Normal', default: combineRgb(207, 207, 207) },
				{ type: 'colorpicker', id: 'warning', label: 'Warning', default: combineRgb(255, 171, 51) },
				{ type: 'colorpicker', id: 'danger', label: 'Danger', default: combineRgb(237, 51, 51) },
			],
			callback: (feedback) => progressbar(feedback),
		},
		[feedbackId.TimerProgressBarMulti]: {
			type: 'advanced',
			name: 'Multi Progressbar',
			description: 'Progressbar across multiple buttons indicating the main timer progression',
			options: [
				{ type: 'checkbox', id: 'big', label: 'Big graphic', default: true },
				{ type: 'colorpicker', id: 'normal', label: 'Normal', default: combineRgb(207, 207, 207) },
				{ type: 'colorpicker', id: 'warning', label: 'Warning', default: combineRgb(255, 171, 51) },
				{ type: 'colorpicker', id: 'danger', label: 'Danger', default: combineRgb(237, 51, 51) },
				{ type: 'number', id: 'amount', label: 'Amount', default: 3, min: 1, max: 8 },
				{
					type: 'number',
					id: 'index',
					label: 'Index',
					tooltip: 'this buttons index in the array',
					default: 1,
					min: 1,
					max: 8,
				},
			],
			callback: (feedback) => progressbar(feedback),
		},
	}
}
