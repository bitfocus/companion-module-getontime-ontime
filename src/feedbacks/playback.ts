import type { CompanionFeedbackDefinitions } from '@companion-module/base'
import { Playback } from '@getontime/resolver'
import { PauseOrange, PlaybackGreen, White } from '../assets/colours.js'
import { feedbackId } from '../enums.js'
import type OntimeState from '../state.js'

export type PlaybackFeedbackSchema = {
	[feedbackId.ColorPlayback]: {
		type: 'boolean'
		options: {
			state: Playback[]
		}
	}
	[feedbackId.ColorAddRemove]: {
		type: 'boolean'
		options: {
			direction: 'add' | 'remove' | 'none' | 'both'
		}
	}
}

export function createPlaybackFeedbacks(state: OntimeState): CompanionFeedbackDefinitions<PlaybackFeedbackSchema> {
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
					type: 'multidropdown',
					label: 'State',
					id: 'state',
					choices: [
						{ id: Playback.Play, label: 'Play' },
						{ id: Playback.Pause, label: 'Pause' },
						{ id: Playback.Stop, label: 'Stop' },
						{ id: Playback.Armed, label: 'Armed' },
						{ id: Playback.Roll, label: 'Roll' },
					],
					default: [Playback.Play],
				},
			],
			callback: (feedback) => feedback.options.state.some((val) => state.timer.playback === val),
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
						{ id: 'both', label: 'Any change' },
					],
					default: 'both',
				},
			],
			callback: (feedback) => {
				const { direction } = feedback.options
				const { addedTime } = state.timer
				switch (direction) {
					case 'add': {
						return addedTime > 0
					}
					case 'remove': {
						return addedTime < 0
					}
					case 'both': {
						return addedTime != 0
					}
					case 'none': {
						return addedTime == 0
					}
					default: {
						direction satisfies never
					}
				}
				return false
			},
		},
	}
}
