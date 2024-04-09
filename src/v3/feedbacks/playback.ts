import { CompanionFeedbackBooleanEvent, CompanionFeedbackDefinition, combineRgb } from '@companion-module/base'
import { OntimeV3 } from '../ontimev3'
import { feedbackId } from '../../enums'
import { Playback } from '../../common/ontime-types'

export function createPlaybackFeedbacks(ontime: OntimeV3): { [id: string]: CompanionFeedbackDefinition } {
	function addTime(feedback: CompanionFeedbackBooleanEvent): boolean {
		const { direction } = feedback.options

		if (direction === 'add') {
			return ontime.state.timer.addedTime > 0
		}
		if (direction === 'remove') {
			return ontime.state.timer.addedTime < 0
		}
		if (direction === 'both') {
			return ontime.state.timer.addedTime != 0
		}
		if (direction === 'none') {
			return ontime.state.timer.addedTime == 0
		}

		return false
	}
	return {
		[feedbackId.ColorPlayback]: {
			type: 'boolean',
			name: 'Change color from playback state',
			description: 'TODO: description',
			defaultStyle: {
				color: combineRgb(255, 255, 255),
				bgcolor: combineRgb(0, 204, 0),
			},
			options: [
				{
					type: 'dropdown',
					label: 'State',
					id: 'state',
					choices: [
						{ id: Playback.Play, label: 'Play' },
						{ id: Playback.Pause, label: 'Pause' },
						{ id: Playback.Stop, label: 'Stop' },
						{ id: Playback.Armed, label: 'Armed' },
						{ id: Playback.Roll, label: 'Roll' },
					],
					default: Playback.Play,
				},
			],
			callback: (feedback) => ontime.state.timer.playback === feedback.options.state,
		},
		[feedbackId.ColorNegative]: {
			type: 'boolean',
			name: 'Change color from timer negative',
			description: 'TODO: better wording - Change the colors of a button if the timer runs into negative time',
			defaultStyle: {
				color: combineRgb(255, 255, 255),
				bgcolor: combineRgb(255, 0, 0),
			},
			options: [],
			callback: () => (ontime.state.timer.current ? ontime.state.timer.current < 0 : false),
		},
		[feedbackId.ColorAddRemove]: {
			type: 'boolean',
			name: 'Change color from added/removed time',
			description:
				'TODO: better names in dropdown Change the colors of a button according if time has been added/removed',
			defaultStyle: {
				color: combineRgb(255, 255, 255),
				bgcolor: combineRgb(254, 124, 19),
			},
			options: [
				{
					type: 'dropdown',
					label: 'Direction',
					id: 'direction',
					choices: [
						{ id: 'both', label: 'Added and Removed' },
						{ id: 'add', label: 'Only Added' },
						{ id: 'remove', label: 'Only Removed' },
						{ id: 'none', label: 'No change' },
					],
					default: 'both',
				},
			],
			callback: addTime,
		},
		[feedbackId.OnAir]: {
			type: 'boolean',
			name: 'Change color from onAir',
			description: 'TODO: ',
			defaultStyle: {
				color: combineRgb(255, 255, 255),
				bgcolor: combineRgb(255, 0, 0),
			},
			options: [],
			callback: () => ontime.state.onAir,
		},
	}
}
