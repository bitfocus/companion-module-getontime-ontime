import { CompanionButtonPresetDefinition, CompanionPresetDefinitions, combineRgb } from '@companion-module/base'
import * as icons from '../assets/icons'
import { ActionId, feedbackId } from '../enums'

export function presets(): CompanionPresetDefinitions {
	const presets: { [id: string]: CompanionButtonPresetDefinition | undefined } = {}

	presets['start_selected_event'] = {
		type: 'button',
		category: 'Commands',
		name: 'Starts selected event',
		style: {
			png64: icons.PlaybackStart,
			pngalignment: 'center:top',
			text: 'START',
			alignment: 'center:bottom',
			size: '7',
			color: combineRgb(75, 255, 171),
			bgcolor: combineRgb(0, 0, 0),
		},
		steps: [
			{
				down: [
					{
						actionId: ActionId.Start,
						options: {},
					},
				],
				up: [],
			},
		],
		feedbacks: [],
	}
	presets['pause_selected_event'] = {
		type: 'button',
		category: 'Commands',
		name: 'Pauses selected event',
		style: {
			png64: icons.PlaybackPause,
			pngalignment: 'center:top',
			text: 'PAUSE',
			alignment: 'center:bottom',
			size: '7',
			color: combineRgb(255, 255, 255),
			bgcolor: combineRgb(237, 137, 54),
		},
		steps: [
			{
				down: [
					{
						actionId: ActionId.Pause,
						options: {},
					},
				],
				up: [],
			},
		],
		feedbacks: [],
	}
	presets['stop_selected_event'] = {
		type: 'button',
		category: 'Commands',
		name: 'Stops selected event',
		style: {
			png64: icons.PlaybackStop,
			pngalignment: 'center:top',
			text: 'STOP',
			alignment: 'center:bottom',
			size: '7',
			color: combineRgb(255, 255, 255),
			bgcolor: combineRgb(229, 62, 62),
		},
		steps: [
			{
				down: [
					{
						actionId: ActionId.Stop,
						options: {},
					},
				],
				up: [],
			},
		],
		feedbacks: [],
	}
	presets['reload_selected_event'] = {
		type: 'button',
		category: 'Commands',
		name: 'Reload selected event',
		style: {
			png64: icons.PlaybackReload,
			pngalignment: 'center:top',
			text: 'RELOAD',
			alignment: 'center:bottom',
			size: '7',
			color: combineRgb(255, 255, 255),
			bgcolor: combineRgb(0, 0, 0),
		},
		steps: [
			{
				down: [
					{
						actionId: ActionId.Reload,
						options: {},
					},
				],
				up: [],
			},
		],
		feedbacks: [],
	}
	presets['select_previous_event'] = {
		type: 'button',
		category: 'Commands',
		name: 'Selects previous event',
		style: {
			png64: icons.PlaybackPrevious,
			pngalignment: 'center:top',
			text: 'PREVIOUS',
			alignment: 'center:bottom',
			size: '7',
			color: combineRgb(255, 255, 255),
			bgcolor: combineRgb(0, 0, 0),
		},
		steps: [
			{
				down: [
					{
						actionId: ActionId.Previous,
						options: {},
					},
				],
				up: [],
			},
		],
		feedbacks: [],
	}
	presets['select_next_event'] = {
		type: 'button',
		category: 'Commands',
		name: 'Selects next event',
		style: {
			png64: icons.PlaybackNext,
			pngalignment: 'center:top',
			text: 'NEXT',
			alignment: 'center:bottom',
			size: '7',
			color: combineRgb(255, 255, 255),
			bgcolor: combineRgb(0, 0, 0),
		},
		steps: [
			{
				down: [
					{
						actionId: ActionId.Next,
						options: {},
					},
				],
				up: [],
			},
		],
		feedbacks: [],
	}
	presets['start_roll_mode'] = {
		type: 'button',
		category: 'Commands',
		name: 'Starts Roll Mode',
		style: {
			png64: icons.PlaybackRoll,
			pngalignment: 'center:top',
			text: 'ROLL MODE',
			alignment: 'center:bottom',
			size: '7',
			color: combineRgb(255, 255, 255),
			bgcolor: combineRgb(43, 108, 176),
		},
		steps: [
			{
				down: [
					{
						actionId: ActionId.Roll,
						options: {},
					},
				],
				up: [],
			},
		],
		feedbacks: [],
	}
	presets['toggle_on_air'] = {
		type: 'button',
		category: 'Commands',
		name: 'Toggle On Air state',
		options: {
			stepAutoProgress: true,
		},
		style: {
			png64: icons.OnAir,
			pngalignment: 'center:top',
			text: 'ON AIR',
			alignment: 'center:bottom',
			size: '7',
			color: combineRgb(255, 255, 255),
			bgcolor: combineRgb(0, 0, 0),
		},
		steps: [
			{
				down: [
					{
						actionId: ActionId.SetOnAir,
						options: { value: true },
					},
				],
				up: [],
			},
			{
				down: [
					{
						actionId: ActionId.SetOnAir,
						options: { value: false },
					},
				],
				up: [],
			},
		],
		feedbacks: [
			{
				feedbackId: 'onAir',
				options: {},
				style: {
					color: combineRgb(255, 255, 255),
					bgcolor: combineRgb(255, 0, 0),
				},
			},
		],
	}
	presets['delay_add_1'] = {
		type: 'button',
		category: 'Commands',
		name: 'Adds 1 min to running event',
		style: {
			text: '+1 MIN',
			size: '18',
			color: combineRgb(221, 107, 32),
			bgcolor: combineRgb(0, 0, 0),
		},
		steps: [
			{
				down: [
					{
						actionId: ActionId.Delay,
						options: { value: 1 },
					},
				],
				up: [],
			},
		],
		feedbacks: [],
	}
	presets['delay_add_5'] = {
		type: 'button',
		category: 'Commands',
		name: 'Adds 5 min to running event',
		style: {
			text: '+5 MIN',
			size: '18',
			color: combineRgb(221, 107, 32),
			bgcolor: combineRgb(0, 0, 0),
		},
		steps: [
			{
				down: [
					{
						actionId: ActionId.Delay,
						options: { value: 5 },
					},
				],
				up: [],
			},
		],
		feedbacks: [],
	}
	presets['delay_subtract_1'] = {
		type: 'button',
		category: 'Commands',
		name: 'Subtracts 1 min from running event',
		style: {
			text: '-1 MIN',
			size: '18',
			color: combineRgb(221, 107, 32),
			bgcolor: combineRgb(0, 0, 0),
		},
		steps: [
			{
				down: [
					{
						actionId: ActionId.Delay,
						options: { value: -1 },
					},
				],
				up: [],
			},
		],
		feedbacks: [],
	}
	presets['delay_subtract_5'] = {
		type: 'button',
		category: 'Commands',
		name: 'Subtracts 5 min from running event',
		style: {
			text: '-5 MIN',
			size: '18',
			color: combineRgb(221, 107, 32),
			bgcolor: combineRgb(0, 0, 0),
		},
		steps: [
			{
				down: [
					{
						actionId: ActionId.Delay,
						options: { value: -5 },
					},
				],
				up: [],
			},
		],
		feedbacks: [],
	}
	presets['toggle_speaker_message_visibility'] = {
		type: 'button',
		category: 'Commands',
		name: 'Toggle visibility of Speaker message',
		options: {
			stepAutoProgress: true,
		},
		style: {
			png64: icons.MessageSpeaker,
			pngalignment: 'center:top',
			text: 'SPEAKER MSG',
			alignment: 'center:bottom',
			size: '7',
			color: combineRgb(255, 255, 255),
			bgcolor: combineRgb(0, 0, 0),
		},
		steps: [
			{
				down: [
					{
						actionId: ActionId.SetTimerMessageVisibility,
						options: { value: true },
					},
				],
				up: [],
			},
			{
				down: [
					{
						actionId: ActionId.SetTimerMessageVisibility,
						options: { value: false },
					},
				],
				up: [],
			},
		],
		feedbacks: [],
	}
	presets['toggle_public_message_visibility'] = {
		type: 'button',
		category: 'Commands',
		name: 'Toggle visibility of Public screens message',
		options: {
			stepAutoProgress: true,
		},
		style: {
			png64: icons.MessagePublic,
			pngalignment: 'center:top',
			text: 'PUBLIC MSG',
			alignment: 'center:bottom',
			size: '7',
			color: combineRgb(255, 255, 255),
			bgcolor: combineRgb(0, 0, 0),
		},
		steps: [
			{
				down: [
					{
						actionId: ActionId.SetPublicMessageVisibility,
						options: { value: true },
					},
				],
				up: [],
			},
			{
				down: [
					{
						actionId: ActionId.SetPublicMessageVisibility,
						options: { value: false },
					},
				],
				up: [],
			},
		],
		feedbacks: [],
	}
	presets['toggle_lower_message_visibility'] = {
		type: 'button',
		category: 'Commands',
		name: 'Toggle visibility of Lower Third message',
		options: {
			stepAutoProgress: true,
		},
		style: {
			png64: icons.MessageLower,
			pngalignment: 'center:top',
			text: 'L3 MSG',
			alignment: 'center:bottom',
			size: '7',
			color: combineRgb(255, 255, 255),
			bgcolor: combineRgb(0, 0, 0),
		},
		steps: [
			{
				down: [
					{
						actionId: ActionId.SetLowerMessageVisibility,
						options: { value: true },
					},
				],
				up: [],
			},
			{
				down: [
					{
						actionId: ActionId.SetLowerMessageVisibility,
						options: { value: false },
					},
				],
				up: [],
			},
		],
		feedbacks: [],
	}
	presets['display_timer_hhmmss'] = {
		type: 'button',
		category: 'Display',
		name: 'Hours:Minutes:Seconds',
		style: {
			text: '$(timer:time)',
			size: '14',
			color: combineRgb(255, 255, 255),
			bgcolor: combineRgb(0, 0, 0),
		},
		steps: [],
		feedbacks: [
			{
				feedbackId: feedbackId.ColorRunning,
				style: {
					color: combineRgb(255, 255, 255),
					bgcolor: combineRgb(0, 204, 0),
				},
				options: {},
			},
			{
				feedbackId: feedbackId.ColorPaused,
				style: {
					color: combineRgb(255, 255, 255),
					bgcolor: combineRgb(237, 137, 54),
				},
				options: {},
			},
			{
				feedbackId: feedbackId.ColorStopped,
				style: {
					color: combineRgb(255, 255, 255),
					bgcolor: combineRgb(0, 0, 0),
				},
				options: {},
			},
			{
				feedbackId: feedbackId.ColorRoll,
				style: {
					color: combineRgb(255, 255, 255),
					bgcolor: combineRgb(43, 108, 176),
				},
				options: {},
			},
			{
				feedbackId: feedbackId.ColorNegative,
				style: {
					color: combineRgb(255, 255, 255),
					bgcolor: combineRgb(255, 0, 0),
				},
				options: {},
			},
		],
	}
	presets['display_timer_hhmm'] = {
		type: 'button',
		category: 'Display',
		name: 'Hours:Minutes',
		style: {
			text: '$(timer:time_hm)',
			size: '24',
			color: combineRgb(255, 255, 255),
			bgcolor: combineRgb(0, 0, 0),
		},
		steps: [],
		feedbacks: [
			{
				feedbackId: feedbackId.ColorRunning,
				style: {
					color: combineRgb(255, 255, 255),
					bgcolor: combineRgb(0, 204, 0),
				},
				options: {},
			},
			{
				feedbackId: feedbackId.ColorPaused,
				style: {
					color: combineRgb(255, 255, 255),
					bgcolor: combineRgb(237, 137, 54),
				},
				options: {},
			},
			{
				feedbackId: feedbackId.ColorStopped,
				style: {
					color: combineRgb(255, 255, 255),
					bgcolor: combineRgb(0, 0, 0),
				},
				options: {},
			},
			{
				feedbackId: feedbackId.ColorRoll,
				style: {
					color: combineRgb(255, 255, 255),
					bgcolor: combineRgb(43, 108, 176),
				},
				options: {},
			},
			{
				feedbackId: feedbackId.ColorNegative,
				style: {
					color: combineRgb(255, 255, 255),
					bgcolor: combineRgb(255, 0, 0),
				},
				options: {},
			},
		],
	}
	presets['display_timer_hh'] = {
		type: 'button',
		category: 'Display',
		name: 'Hours',
		style: {
			text: '$(timer:time_h)',
			size: '44',
			color: combineRgb(255, 255, 255),
			bgcolor: combineRgb(0, 0, 0),
		},
		steps: [],
		feedbacks: [
			{
				feedbackId: feedbackId.ColorRunning,
				style: {
					color: combineRgb(255, 255, 255),
					bgcolor: combineRgb(0, 204, 0),
				},
				options: {},
			},
			{
				feedbackId: feedbackId.ColorPaused,
				style: {
					color: combineRgb(255, 255, 255),
					bgcolor: combineRgb(237, 137, 54),
				},
				options: {},
			},
			{
				feedbackId: feedbackId.ColorStopped,
				style: {
					color: combineRgb(255, 255, 255),
					bgcolor: combineRgb(0, 0, 0),
				},
				options: {},
			},
			{
				feedbackId: feedbackId.ColorRoll,
				style: {
					color: combineRgb(255, 255, 255),
					bgcolor: combineRgb(43, 108, 176),
				},
				options: {},
			},
			{
				feedbackId: feedbackId.ColorNegative,
				style: {
					color: combineRgb(255, 255, 255),
					bgcolor: combineRgb(255, 0, 0),
				},
				options: {},
			},
		],
	}
	presets['display_timer_mm'] = {
		type: 'button',
		category: 'Display',
		name: 'Minutes',
		style: {
			text: '$(timer:time_m)',
			size: '44',
			color: combineRgb(255, 255, 255),
			bgcolor: combineRgb(0, 0, 0),
		},
		steps: [],
		feedbacks: [
			{
				feedbackId: feedbackId.ColorRunning,
				style: {
					color: combineRgb(255, 255, 255),
					bgcolor: combineRgb(0, 204, 0),
				},
				options: {},
			},
			{
				feedbackId: feedbackId.ColorPaused,
				style: {
					color: combineRgb(255, 255, 255),
					bgcolor: combineRgb(237, 137, 54),
				},
				options: {},
			},
			{
				feedbackId: feedbackId.ColorStopped,
				style: {
					color: combineRgb(255, 255, 255),
					bgcolor: combineRgb(0, 0, 0),
				},
				options: {},
			},
			{
				feedbackId: feedbackId.ColorRoll,
				style: {
					color: combineRgb(255, 255, 255),
					bgcolor: combineRgb(43, 108, 176),
				},
				options: {},
			},
			{
				feedbackId: feedbackId.ColorNegative,
				style: {
					color: combineRgb(255, 255, 255),
					bgcolor: combineRgb(255, 0, 0),
				},
				options: {},
			},
		],
	}
	presets['display_timer_ss'] = {
		type: 'button',
		category: 'Display',
		name: 'Seconds',
		style: {
			text: '$(timer:time_s)',
			size: '44',
			color: combineRgb(255, 255, 255),
			bgcolor: combineRgb(0, 0, 0),
		},
		steps: [],
		feedbacks: [
			{
				feedbackId: feedbackId.ColorRunning,
				style: {
					color: combineRgb(255, 255, 255),
					bgcolor: combineRgb(0, 204, 0),
				},
				options: {},
			},
			{
				feedbackId: feedbackId.ColorPaused,
				style: {
					color: combineRgb(255, 255, 255),
					bgcolor: combineRgb(237, 137, 54),
				},
				options: {},
			},
			{
				feedbackId: feedbackId.ColorStopped,
				style: {
					color: combineRgb(255, 255, 255),
					bgcolor: combineRgb(0, 0, 0),
				},
				options: {},
			},
			{
				feedbackId: feedbackId.ColorRoll,
				style: {
					color: combineRgb(255, 255, 255),
					bgcolor: combineRgb(43, 108, 176),
				},
				options: {},
			},
			{
				feedbackId: feedbackId.ColorNegative,
				style: {
					color: combineRgb(255, 255, 255),
					bgcolor: combineRgb(255, 0, 0),
				},
				options: {},
			},
		],
	}
	return presets
}
