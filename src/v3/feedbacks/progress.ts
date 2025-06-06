import type { CompanionFeedbackAdvancedEvent, CompanionFeedbackDefinition } from '@companion-module/base'
import { OntimeV3 } from '../ontimev3.js'
import { feedbackId } from '../../enums.js'
import { graphics } from 'companion-module-utils'
import { TimerPhase } from '../ontime-types.js'
import { DangerRed, NormalGray, WarningOrange } from '../../assets/colours.js'

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
				{ type: 'colorpicker', id: 'normal', label: 'Normal', default: NormalGray },
				{ type: 'colorpicker', id: 'warning', label: 'Warning', default: WarningOrange },
				{ type: 'colorpicker', id: 'danger', label: 'Danger', default: DangerRed },
			],
			callback: (feedback) => progressbar(feedback),
		},
		[feedbackId.TimerProgressBarMulti]: {
			type: 'advanced',
			name: 'Multi Progressbar',
			description: 'Progressbar across multiple buttons indicating the main timer progression',
			options: [
				{ type: 'checkbox', id: 'big', label: 'Big graphic', default: true },
				{ type: 'colorpicker', id: 'normal', label: 'Normal', default: NormalGray },
				{ type: 'colorpicker', id: 'warning', label: 'Warning', default: WarningOrange },
				{ type: 'colorpicker', id: 'danger', label: 'Danger', default: DangerRed },
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
