import { CompanionFeedbackDefinition, combineRgb } from '@companion-module/base'
import { OntimeV3 } from '../ontimev3'
import { feedbackId } from '../../enums'
import { graphics } from 'companion-module-utils'

export function createProgressFeedbacks(ontime: OntimeV3): { [id: string]: CompanionFeedbackDefinition } {
	return {
		[feedbackId.TimerProgressBar]: {
			type: 'advanced',
			name: 'Progressbar',
			description: 'Progressbar indicating the main timer progression',
			options: [],
			callback: (feedback) => {
				if (!feedback.image) {
					return {}
				}

				const { current, duration } = ontime.state.timer
				if (duration === null) {
					const options: graphics.OptionsBar = {
						width: feedback.image.width,
						height: feedback.image.height,
						colors: [
							{
								size: 100,
								color: combineRgb(207, 207, 207),
								background: combineRgb(54, 54, 54),
								backgroundOpacity: 255,
							},
						],
						barLength: feedback.image.width,
						barWidth: 10,
						value: 0,
						type: 'horizontal',
						offsetX: 0,
						offsetY: feedback.image.height - 10,
						opacity: 255,
					}

					return {
						imageBuffer: graphics.bar(options),
					}
				}

				const { timeDanger, timeWarning } = ontime.state?.eventNow ?? { timeDanger: 0, timeWarning: 0 }
				const val = current !== null ? (1 - current / duration) * 100 : 0

				const danger = (timeDanger / duration) * 100
				const warn = (timeWarning / duration) * 100 - danger

				const options: graphics.OptionsBar = {
					width: feedback.image.width,
					height: feedback.image.height,
					colors: [
						{
							size: 100 - warn - danger,
							color: combineRgb(207, 207, 207),
							background: combineRgb(54, 54, 54),
							backgroundOpacity: 255,
						},
						{ size: warn, color: combineRgb(255, 171, 51), background: combineRgb(64, 47, 23), backgroundOpacity: 255 },
						{ size: danger, color: combineRgb(255, 0, 0), background: combineRgb(60, 23, 23), backgroundOpacity: 255 },
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
