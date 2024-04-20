import { CompanionFeedbackBooleanEvent, CompanionFeedbackDefinition, combineRgb } from '@companion-module/base'
import { OntimeV3 } from '../ontimev3'
import { feedbackId } from '../../enums'
import { Playback } from '../ontime-types'

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
			name: 'Playback state',
			description: 'Indicator colour for playback state',
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
		[feedbackId.ColorAddRemove]: {
			type: 'boolean',
			name: 'Added/removed time',
			description: 'Indicator colour for whether timer has user added time',
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
						{ id: 'add', label: 'Only Added' },
						{ id: 'remove', label: 'Only Removed' },
						{ id: 'none', label: 'No change' },
					],
					default: 'both',
				},
			],
			callback: addTime,
		},
	}
}
