import { CompanionFeedbackDefinition, combineRgb } from '@companion-module/base'
import { OntimeV3 } from '../ontimev3'
import { feedbackId } from '../../enums'
import { graphics } from 'companion-module-utils'
import { TimerPhase } from '../ontime-types'

export function createProgressFeedbacks(ontime: OntimeV3): { [id: string]: CompanionFeedbackDefinition } {
	return {
		[feedbackId.TimerProgressBar]: {
			type: 'advanced',
			name: 'Progressbar',
			description: 'Progressbar indicating the main timer progression',
			options: [
				{ type: 'colorpicker', id: 'normal', label: 'Normal', default: combineRgb(207, 207, 207) },
				{ type: 'colorpicker', id: 'warning', label: 'Warning', default: combineRgb(255, 171, 51) },
				{ type: 'colorpicker', id: 'danger', label: 'Danger', default: combineRgb(237, 51, 51) },
			],
			callback: (feedback) => {
				if (!feedback.image) {
					return {}
				}

				const { current, duration } = ontime.state.timer
				const { phase } = ontime.state.timer
				const val = current !== null && duration !== null ? (1 - current / duration) * 100 : 0

				let colour = 0

				const { normal, warning, danger } = feedback.options as { [key: string]: number }

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
					barWidth: 10,
					value: val,
					type: 'horizontal',
					offsetX: 0,
					offsetY: feedback.image.height - 10,
					opacity: 255,
				}

				return {
					imageBuffer: graphics.bar(options),
				}
			},
		},
	}
}
