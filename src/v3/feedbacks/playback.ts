import type { CompanionFeedbackBooleanEvent, CompanionFeedbackDefinition } from '@companion-module/base'
import { OntimeV3 } from '../ontimev3.js'
import { feedbackId } from '../../enums.js'
import { Playback } from '../ontime-types.js'
import { PauseOrange, PlaybackGreen, White } from '../../assets/colours.js'

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
				color: White,
				bgcolor: PlaybackGreen,
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
				color: White,
				bgcolor: PauseOrange,
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
