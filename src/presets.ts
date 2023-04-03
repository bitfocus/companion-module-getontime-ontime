import { CompanionButtonPresetDefinition, CompanionPresetDefinitions, InstanceBase, combineRgb } from '@companion-module/base'
import * as icons from './assets/icons'
import { OntimeConfig } from './config'

export function GetPresetList(_instance: InstanceBase<OntimeConfig>): CompanionPresetDefinitions {
	const presets:{[id: string]: CompanionButtonPresetDefinition | undefined }= {}

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
						actionId: 'start',
					},
				],
				up : [],
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
						actionId: 'pause',
					},
				],
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
						actionId: 'stop',
					},
				],
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
						actionId: 'reload',
					},
				],
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
						actionId: 'previous',
					},
				],
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
						actionId: 'next',
					},
				],
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
						actionId: 'roll',
					},
				],
			},
		],
		feedbacks: [],
	}
	presets['toggle_on_air'] = {
		type: 'button',
		category: 'Commands',
		name: 'Toggle On Air state',
		style: {
			png64: icons.OnAir,
			pngalignment: 'center:top',
			text: 'ON AIR',
			alignment: 'center:bottom',
			size: '7',
			color: combineRgb(255, 255, 255),
			bgcolor: combineRgb(0, 0, 0),
			latch: true,
		},
		steps: [
			{
				down: [
					{
						actionId: 'setOnAir',
						options: { value: true },
					},
				],
			},
			{
				down: [
					{
						actionId: 'setOnAir',
						options: { value: false },
					},
				],
			},
		],
		feedbacks: [
			{
				feedbackId: 'onAir',
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
			style: 'text',
			text: '+1 MIN',
			size: '18',
			color: combineRgb(221, 107, 32),
			bgcolor: combineRgb(0, 0, 0),
		},
		steps: [
			{
				down: [
					{
						actionId: 'delay',
						options: { value: 1 },
					},
				],
			},
		],
		feedbacks: [],
	}
	presets['delay_add_5'] = {
		type: 'button',
		category: 'Commands',
		name: 'Adds 5 min to running event',
		style: {
			style: 'text',
			text: '+5 MIN',
			size: '18',
			color: combineRgb(221, 107, 32),
			bgcolor: combineRgb(0, 0, 0),
		},
		steps: [
			{
				down: [
					{
						actionId: 'delay',
						options: { value: 5 },
					},
				],
			},
		],
		feedbacks: [],
	}
	presets['delay_subtract_1'] = {
		type: 'button',
		category: 'Commands',
		name: 'Subtracts 1 min from running event',
		style: {
			style: 'text',
			text: '-1 MIN',
			size: '18',
			color: combineRgb(221, 107, 32),
			bgcolor: combineRgb(0, 0, 0),
		},
		steps: [
			{
				down: [
					{
						actionId: 'delay',
						options: { value: -1 },
					},
				],
			},
		],
		feedbacks: [],
	}
	presets['delay_subtract_5'] = {
		type: 'button',
		category: 'Commands',
		name: 'Subtracts 5 min from running event',
		style: {
			style: 'text',
			text: '-5 MIN',
			size: '18',
			color: combineRgb(221, 107, 32),
			bgcolor: combineRgb(0, 0, 0),
		},
		steps: [
			{
				down: [
					{
						actionId: 'delay',
						options: { value: -5 },
					},
				],
			},
		],
		feedbacks: [],
	}
	presets['toggle_speaker_message_visibility'] = {
		type: 'button',
		category: 'Commands',
		name: 'Toggle visibility of Speaker message',
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
						actionId: 'setSpeakerMessageVisibility',
						options: { value: true },
					},
				],
			},
			{
				down: [
					{
						actionId: 'setSpeakerMessageVisibility',
						options: { value: false },
					},
				],
			},
		],
		feedbacks: [],
	}
	presets['toggle_public_message_visibility'] = {
		type: 'button',
		category: 'Commands',
		name: 'Toggle visibility of Public screens message',
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
						actionId: 'setPublicMessageVisibility',
						options: { value: true },
					},
				],
			},
			{
				down: [
					{
						actionId: 'setPublicMessageVisibility',
						options: { value: false },
					},
				],
			},
		],
		feedbacks: [],
	}
	presets['toggle_lower_message_visibility'] = {
		type: 'button',
		category: 'Commands',
		name: 'Toggle visibility of Lower Third message',
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
						actionId: 'setLowerMessageVisibility',
						options: { value: true },
					},
				],
			},
			{
				down: [
					{
						actionId: 'setLowerMessageVisibility',
						options: { value: false },
					},
				],
			},
		],
		feedbacks: [],
	}
	presets['display_timer_hhmmss'] = {
		type: 'button',
		category: 'Display',
		name: 'Time',
		style: {
			text: '$(timer:time)',
			size: '18',
			color: combineRgb(255, 255, 255),
			bgcolor: combineRgb(0, 0, 0),
		},
		steps: [],
		feedbacks: [
			{
				feedbackId: 'state_color_running',
				style: {
					color: combineRgb(255, 255, 255),
					bgcolor: combineRgb(0, 204, 0),
				},
			},
			{
				feedbackId: 'state_color_paused',
				style: {
					color: combineRgb(255, 255, 255),
					bgcolor: combineRgb(237, 137, 54),
				},
			},
			{
				feedbackId: 'state_color_stopped',
				style: {
					color: combineRgb(255, 255, 255),
					bgcolor: combineRgb(0, 0, 0),
				},
			},
			{
				feedbackId: 'state_color_roll',
				style: {
					color: combineRgb(255, 255, 255),
					bgcolor: combineRgb(43, 108, 176),
				},
			},
			{
				feedbackId: 'timer_negative',
				style: {
					color: combineRgb(255, 255, 255),
					bgcolor: combineRgb(255, 0, 0),
				},
			},
		],
	}
	presets['display_timer_hhmm'] = {
		type: 'button',
		category: 'Display',
		name: 'Hours:Minutes',
		style: {
			style: 'text',
			text: '$(timer:time_hm)',
			size: '24',
			color: combineRgb(255, 255, 255),
			bgcolor: combineRgb(0, 0, 0),
		},
		steps: [],
		feedbacks: [
			{
				feedbackId: 'state_color_running',
				style: {
					color: combineRgb(255, 255, 255),
					bgcolor: combineRgb(0, 204, 0),
				},
			},
			{
				feedbackId: 'state_color_paused',
				style: {
					color: combineRgb(255, 255, 255),
					bgcolor: combineRgb(237, 137, 54),
				},
			},
			{
				feedbackId: 'state_color_stopped',
				style: {
					color: combineRgb(255, 255, 255),
					bgcolor: combineRgb(0, 0, 0),
				},
			},
			{
				feedbackId: 'state_color_roll',
				style: {
					color: combineRgb(255, 255, 255),
					bgcolor: combineRgb(43, 108, 176),
				},
			},
			{
				feedbackId: 'timer_negative',
				style: {
					color: combineRgb(255, 255, 255),
					bgcolor: combineRgb(255, 0, 0),
				},
			},
		],
	}
	presets['display_timer_hh'] = {
		type: 'button',
		category: 'Display',
		name: 'Hours',
		style: {
			style: 'text',
			text: '$(timer:time_h)',
			color: combineRgb(255, 255, 255),
			bgcolor: combineRgb(0, 0, 0),
		},
		steps: [],
		feedbacks: [
			{
				feedbackId: 'state_color_running',
				style: {
					color: combineRgb(255, 255, 255),
					bgcolor: combineRgb(0, 204, 0),
				},
			},
			{
				feedbackId: 'state_color_paused',
				style: {
					color: combineRgb(255, 255, 255),
					bgcolor: combineRgb(237, 137, 54),
				},
			},
			{
				feedbackId: 'state_color_stopped',
				style: {
					color: combineRgb(255, 255, 255),
					bgcolor: combineRgb(0, 0, 0),
				},
			},
			{
				feedbackId: 'state_color_roll',
				style: {
					color: combineRgb(255, 255, 255),
					bgcolor: combineRgb(43, 108, 176),
				},
			},
			{
				feedbackId: 'timer_negative',
				style: {
					color: combineRgb(255, 255, 255),
					bgcolor: combineRgb(255, 0, 0),
				},
			},
		],
	}
	presets['display_timer_mm'] = {
		type: 'button',
		category: 'Display',
		name: 'Minutes',
		style: {
			style: 'text',
			text: '$(timer:time_m)',
			color: combineRgb(255, 255, 255),
			bgcolor: combineRgb(0, 0, 0),
		},
		steps: [],
		feedbacks: [
			{
				feedbackId: 'state_color_running',
				style: {
					color: combineRgb(255, 255, 255),
					bgcolor: combineRgb(0, 204, 0),
				},
			},
			{
				feedbackId: 'state_color_paused',
				style: {
					color: combineRgb(255, 255, 255),
					bgcolor: combineRgb(237, 137, 54),
				},
			},
			{
				feedbackId: 'state_color_stopped',
				style: {
					color: combineRgb(255, 255, 255),
					bgcolor: combineRgb(0, 0, 0),
				},
			},
			{
				feedbackId: 'state_color_roll',
				style: {
					color: combineRgb(255, 255, 255),
					bgcolor: combineRgb(43, 108, 176),
				},
			},
			{
				feedbackId: 'timer_negative',
				style: {
					color: combineRgb(255, 255, 255),
					bgcolor: combineRgb(255, 0, 0),
				},
			},
		],
	}
	presets['display_timer_ss'] = {
		type: 'button',
		category: 'Display',
		name: 'Seconds',
		style: {
			style: 'text',
			text: '$(timer:time_s)',
			color: combineRgb(255, 255, 255),
			bgcolor: combineRgb(0, 0, 0),
		},
		steps: [],
		feedbacks: [
			{
				feedbackId: 'state_color_running',
				style: {
					color: combineRgb(255, 255, 255),
					bgcolor: combineRgb(0, 204, 0),
				},
			},
			{
				feedbackId: 'state_color_paused',
				style: {
					color: combineRgb(255, 255, 255),
					bgcolor: combineRgb(237, 137, 54),
				},
			},
			{
				feedbackId: 'state_color_stopped',
				style: {
					color: combineRgb(255, 255, 255),
					bgcolor: combineRgb(0, 0, 0),
				},
			},
			{
				feedbackId: 'state_color_roll',
				style: {
					color: combineRgb(255, 255, 255),
					bgcolor: combineRgb(43, 108, 176),
				},
			},
			{
				feedbackId: 'timer_negative',
				style: {
					color: combineRgb(255, 255, 255),
					bgcolor: combineRgb(255, 0, 0),
				},
			},
		],
	}
	return presets
}
