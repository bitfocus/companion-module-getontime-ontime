import type { CompanionFeedbackDefinitions } from '@companion-module/base'
import { ActiveBlue, White } from '../assets/colours.js'
import { feedbackId } from '../enums.js'
import type OntimeState from '../state.js'

export type TeleprompterFeedbackSchema = {
	[feedbackId.TeleprompterPlayback]: {
		type: 'boolean'
		options: { playback: 'play' | 'pause' }
	}
	[feedbackId.TeleprompterMode]: {
		type: 'boolean'
		options: { mode: 'event' | 'script' }
	}
	[feedbackId.TeleprompterHoldingAtEnd]: {
		type: 'boolean'
		options: { mode: 'event' | 'script' | 'any' }
	}
}

export function createTeleprompterFeedbacks(
	state: OntimeState,
): CompanionFeedbackDefinitions<TeleprompterFeedbackSchema> {
	return {
		[feedbackId.TeleprompterPlayback]: {
			type: 'boolean',
			name: 'Teleprompter Playback State',
			description: 'Indicator colour for teleprompter playback state',
			defaultStyle: {
				color: White,
				bgcolor: ActiveBlue,
			},
			options: [
				{
					type: 'dropdown',
					label: 'State',
					id: 'playback',
					choices: [
						{ id: 'play', label: 'Playing' },
						{ id: 'pause', label: 'Paused' },
					],
					default: 'play',
				},
			],
			callback: (feedback) => {
				const { playback } = feedback.options
				return playback === state.teleprompter.playback
			},
		},
		[feedbackId.TeleprompterMode]: {
			type: 'boolean',
			name: 'Teleprompter Mode',
			description: 'Indicator colour for teleprompter hold mode',
			defaultStyle: {
				color: White,
				bgcolor: ActiveBlue,
			},
			options: [
				{
					type: 'dropdown',
					label: 'State',
					id: 'mode',
					choices: [
						{ id: 'event', label: 'Event' },
						{ id: 'script', label: 'Script' },
					],
					default: 'event',
				},
			],
			callback: (feedback) => {
				const { mode } = feedback.options
				return mode === state.teleprompter.mode
			},
		},
		[feedbackId.TeleprompterHoldingAtEnd]: {
			type: 'boolean',
			name: 'Teleprompter is holding at end',
			description: 'Indicator colour for teleprompter hold mode',
			defaultStyle: {
				color: White,
				bgcolor: ActiveBlue,
			},
			options: [
				{
					type: 'dropdown',
					label: 'State',
					id: 'mode',
					choices: [
						{ id: 'event', label: 'Event' },
						{ id: 'script', label: 'Script' },
						{ id: 'any', label: 'Any' },
					],
					default: 'any',
				},
			],
			callback: ({ options }) => {
				const { mode } = options
				if (mode === 'any') {
					return state.teleprompter.ended !== null
				}
				return state.teleprompter.ended === mode
			},
		},
	}
}
