const { combineRgb } = require('@companion-module/base')
const icons = require('./assets/icons')

exports.getPresets = function () {
	const presets = {}

	presets['start_selecetd_timer'] = {
		type: 'button',
		category: 'Commands',
		name: 'Starts selected timer',
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
			},
		],
		feedbacks: [],
	}
	presets['pause_selecetd_timer'] = {
		type: 'button',
		category: 'Commands',
		name: 'Pauses selected timer',
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
	presets['pasue_selected_timer'] = {
		type: 'button',
		category: 'Commands',
		name: 'Stops selected timer',
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
	presets['reload_selected_timer'] = {
		type: 'button',
		category: 'Commands',
		name: 'Reload selected timer',
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
	presets['select_previous_timer'] = {
		type: 'button',
		category: 'Commands',
		name: 'Selects previous timer',
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
	presets['select_next_timer'] = {
		type: 'button',
		category: 'Commands',
		name: 'Selects next timer',
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
		name: 'Adds 1 min to running timer',
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
		name: 'Adds 5 min to running timer',
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
		name: 'Subtracts 1 min to running timer',
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
		name: 'Subtracts 5 min to running timer',
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
	presets['toggle_timer_message_visibility'] = {
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
						actionId: 'setTimerMessageVisibility',
						options: { value: true },
					},
				],
			},
			{
				down: [
					{
						actionId: 'setTimerMessageVisibility',
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
				feedbackId: 'state_color',
				options: {
					run_fg: combineRgb(255, 255, 255),
					run_bg: combineRgb(0, 204, 0),
					pause_fg: combineRgb(255, 255, 255),
					pause_bg: combineRgb(237, 137, 54),
					stop_fg: combineRgb(255, 255, 255),
					stop_bg: combineRgb(0, 0, 0),
					roll_fg: combineRgb(255, 255, 255),
					roll_bg: combineRgb(43, 108, 176),
					negative_fg: combineRgb(255, 255, 255),
					negative_bg: combineRgb(255, 0, 0),
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
				feedbackId: 'state_color',
				options: {
					run_fg: combineRgb(255, 255, 255),
					run_bg: combineRgb(0, 204, 0),
					pause_fg: combineRgb(255, 255, 255),
					pause_bg: combineRgb(237, 137, 54),
					stop_fg: combineRgb(255, 255, 255),
					stop_bg: combineRgb(0, 0, 0),
					roll_fg: combineRgb(255, 255, 255),
					roll_bg: combineRgb(43, 108, 176),
					negative_fg: combineRgb(255, 255, 255),
					negative_bg: combineRgb(255, 0, 0),
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
				feedbackId: 'state_color',
				options: {
					run_fg: combineRgb(255, 255, 255),
					run_bg: combineRgb(0, 204, 0),
					pause_fg: combineRgb(255, 255, 255),
					pause_bg: combineRgb(237, 137, 54),
					stop_fg: combineRgb(255, 255, 255),
					stop_bg: combineRgb(0, 0, 0),
					roll_fg: combineRgb(255, 255, 255),
					roll_bg: combineRgb(43, 108, 176),
					negative_fg: combineRgb(255, 255, 255),
					negative_bg: combineRgb(255, 0, 0),
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
				feedbackId: 'state_color',
				options: {
					run_fg: combineRgb(255, 255, 255),
					run_bg: combineRgb(0, 204, 0),
					pause_fg: combineRgb(255, 255, 255),
					pause_bg: combineRgb(237, 137, 54),
					stop_fg: combineRgb(255, 255, 255),
					stop_bg: combineRgb(0, 0, 0),
					roll_fg: combineRgb(255, 255, 255),
					roll_bg: combineRgb(43, 108, 176),
					negative_fg: combineRgb(255, 255, 255),
					negative_bg: combineRgb(255, 0, 0),
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
				feedbackId: 'state_color',
				options: {
					run_fg: combineRgb(255, 255, 255),
					run_bg: combineRgb(0, 204, 0),
					pause_fg: combineRgb(255, 255, 255),
					pause_bg: combineRgb(237, 137, 54),
					stop_fg: combineRgb(255, 255, 255),
					stop_bg: combineRgb(0, 0, 0),
					roll_fg: combineRgb(255, 255, 255),
					roll_bg: combineRgb(43, 108, 176),
					negative_fg: combineRgb(255, 255, 255),
					negative_bg: combineRgb(255, 0, 0),
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
