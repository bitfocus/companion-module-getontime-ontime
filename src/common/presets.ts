import {
	CompanionButtonPresetDefinition,
	CompanionButtonStyleProps,
	CompanionPresetDefinitions,
	combineRgb,
} from '@companion-module/base'
import * as icons from '../assets/icons'
import { ActionId, deprecatedActionId, deprecatedFeedbackId, feedbackId } from '../enums'

export function presets(): CompanionPresetDefinitions {
	return { ...playbackPresets }
}

const PlaybackGreen = combineRgb(51, 158, 78)
const PlaybackRed = combineRgb(228, 40, 30)
const PlaybackOrange = combineRgb(192, 86, 33)
const PlaybackBlue = combineRgb(2, 116, 182)
const White = combineRgb(255, 255, 255)
const Black = combineRgb(0, 0, 0)

const defaultStyle: CompanionButtonStyleProps = {
	pngalignment: 'center:top',
	size: '14',
	color: White,
	bgcolor: Black,
	text: '',
	alignment: 'center:bottom',
	// show_topbar: false,
}

const canPlayFeedback = [
	{
		feedbackId: feedbackId.ColorPlayback,
		options: {
			state: 'play',
		},
		style: {
			color: White,
			bgcolor: PlaybackGreen,
		},
	},
	{
		feedbackId: feedbackId.ColorPlayback,
		options: {
			state: 'armed',
		},
		style: {
			color: PlaybackGreen,
		},
	},
	{
		feedbackId: feedbackId.ColorPlayback,
		options: {
			state: 'pause',
		},
		style: {
			color: PlaybackGreen,
		},
	},
]

const playbackPresets: { [id: string]: CompanionButtonPresetDefinition } = {
	select_previous_event: {
		type: 'button',
		category: 'Playback',
		name: 'Selects previous event',
		style: {
			...defaultStyle,
			png64: icons.PlaybackPrevious,
		},
		steps: [
			{
				down: [
					{
						actionId: ActionId.Load,
						options: { method: 'previous' },
					},
				],
				up: [],
			},
		],
		feedbacks: [],
	},
	select_next_event: {
		type: 'button',
		category: 'Playback',
		name: 'Selects next event',
		style: {
			...defaultStyle,
			png64: icons.PlaybackNext,
		},
		steps: [
			{
				down: [
					{
						actionId: ActionId.Load,
						options: { method: 'next' },
					},
				],
				up: [],
			},
		],
		feedbacks: [],
	},
	stop_selected_event: {
		type: 'button',
		category: 'Playback',
		name: 'Stops running event',
		style: {
			...defaultStyle,
			png64: icons.PlaybackStop,
			text: 'STOP',
			color: PlaybackRed,
		},
		previewStyle: {
			...defaultStyle,
			png64: icons.PlaybackStop,
			text: 'STOP',
			bgcolor: PlaybackRed,
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
		feedbacks: [
			{
				feedbackId: feedbackId.ColorPlayback,
				options: {
					state: 'stop',
				},
				style: {
					bgcolor: PlaybackRed,
					color: White,
				},
			},
		],
	},
	pause_selected_event: {
		type: 'button',
		category: 'Playback',
		name: 'Pauses running event',
		style: {
			...defaultStyle,
			png64: icons.PlaybackPause,
			text: 'PAUSE',
		},
		previewStyle: {
			...defaultStyle,
			png64: icons.PlaybackPause,
			text: 'PAUSE',
			bgcolor: PlaybackOrange,
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
		feedbacks: [
			{
				feedbackId: feedbackId.ColorPlayback,
				options: {
					state: 'pause',
				},
				style: {
					color: White,
					bgcolor: PlaybackOrange,
				},
			},
			{
				feedbackId: feedbackId.ColorPlayback,
				options: {
					state: 'play',
				},
				style: {
					color: PlaybackOrange,
				},
			},
		],
	},
	start_selected_event: {
		type: 'button',
		category: 'Playback',
		name: 'Starts selected event',
		style: {
			...defaultStyle,
			png64: icons.PlaybackStart,
			text: 'START',
		},
		previewStyle: {
			...defaultStyle,
			png64: icons.PlaybackStart,
			text: 'START',
			bgcolor: PlaybackGreen,
		},
		steps: [
			{
				down: [
					{
						actionId: ActionId.Start,
						options: {
							method: 'loaded',
						},
					},
				],
				up: [],
			},
		],
		feedbacks: canPlayFeedback,
	},
	start_next_event: {
		type: 'button',
		category: 'Playback',
		name: 'Start next event',
		style: {
			...defaultStyle,
			png64: icons.PlaybackStart,
			text: 'NEXT',
		},
		previewStyle: {
			...defaultStyle,
			png64: icons.PlaybackStart,
			text: 'NEXT',
			bgcolor: PlaybackGreen,
		},
		steps: [
			{
				down: [
					{
						actionId: ActionId.Start,
						options: { method: 'next' },
					},
				],
				up: [],
			},
		],
		feedbacks: canPlayFeedback,
	},
	start_selected_or_next_event: {
		type: 'button',
		category: 'Playback',
		name: 'Start selected/next event',
		style: {
			...defaultStyle,
			png64: icons.PlaybackStart,
			text: 'GO',
		},
		previewStyle: {
			...defaultStyle,
			png64: icons.PlaybackStart,
			text: 'GO',
			bgcolor: PlaybackGreen,
		},
		steps: [
			{
				down: [
					{
						actionId: ActionId.Start,
						options: { method: 'go' },
					},
				],
				up: [],
			},
		],
		feedbacks: canPlayFeedback,
	},
	reload_selected_event: {
		type: 'button',
		category: 'Playback',
		name: 'Reload selected event',
		style: {
			...defaultStyle,
			png64: icons.PlaybackReload,
			text: 'RELOAD',
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
	},
	start_roll_mode: {
		type: 'button',
		category: 'Playback',
		name: 'Starts Roll Mode',
		style: {
			...defaultStyle,
			png64: icons.PlaybackRoll,
			text: 'ROLL',
			color: PlaybackBlue,
		},
		previewStyle: {
			...defaultStyle,
			png64: icons.PlaybackRoll,
			text: 'ROLL',
			bgcolor: PlaybackBlue,
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
		feedbacks: [
			{
				feedbackId: feedbackId.ColorPlayback,
				options: { state: 'roll' },
				style: {
					color: White,
					bgcolor: PlaybackBlue,
				},
			},
		],
	},
}

/*


	//Playback

	
	
	
	

	

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
						actionId: deprecatedActionId.SetOnAir,
						options: { value: 2 },
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
						actionId: ActionId.Add,
						options: {
							addremove: 'add',
							hours: 0,
							minutes: 1,
							seconds: 0,
						},
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
						actionId: ActionId.Add,
						options: {
							addremove: 'add',
							hours: 0,
							minutes: 5,
							seconds: 0,
						},
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
						actionId: ActionId.Add,
						options: {
							addremove: 'remove',
							hours: 0,
							minutes: 1,
							seconds: 0,
						},
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
						actionId: ActionId.Add,
						options: {
							addremove: 'remove',
							hours: 0,
							minutes: 5,
							seconds: 0,
						},
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
						actionId: deprecatedActionId.SetTimerMessageVisibility,
						options: { value: 2 },
					},
				],
				up: [],
			},
		],
		feedbacks: [
			{
				feedbackId: deprecatedFeedbackId.TimerMessageVisible,
				style: {
					color: combineRgb(255, 255, 255),
					bgcolor: combineRgb(43, 108, 176),
				},
				options: {},
			},
		],
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
						actionId: deprecatedActionId.SetPublicMessageVisibility,
						options: { value: 2 },
					},
				],
				up: [],
			},
		],
		feedbacks: [
			{
				feedbackId: deprecatedFeedbackId.PublicMessageVisible,
				style: {
					color: combineRgb(255, 255, 255),
					bgcolor: combineRgb(43, 108, 176),
				},
				options: {},
			},
		],
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
						actionId: deprecatedActionId.SetLowerMessageVisibility,
						options: { value: 2 },
					},
				],
				up: [],
			},
		],
		feedbacks: [
			{
				feedbackId: deprecatedFeedbackId.LowerMessageVisible,
				style: {
					color: combineRgb(255, 255, 255),
					bgcolor: combineRgb(43, 108, 176),
				},
				options: {},
			},
		],
	}
	presets['toggle_timer_blink'] = {
		type: 'button',
		category: 'Commands',
		name: 'Toggle the Timer Blink state',
		options: {
			stepAutoProgress: true,
		},
		style: {
			text: 'Timer Blink',
			alignment: 'center:center',
			size: '24',
			color: combineRgb(255, 255, 255),
			bgcolor: combineRgb(0, 0, 0),
		},
		steps: [
			{
				down: [
					{
						actionId: deprecatedActionId.SetTimerBlink,
						options: { value: 2 },
					},
				],
				up: [],
			},
		],
		feedbacks: [
			{
				feedbackId: feedbackId.TimerBlink,
				style: {
					color: combineRgb(255, 255, 255),
					bgcolor: combineRgb(229, 62, 62),
				},
				options: {},
			},
		],
	}
	presets['toggle_timer_blackout'] = {
		type: 'button',
		category: 'Commands',
		name: 'Toggle the Timer Blackout state',
		options: {
			stepAutoProgress: true,
		},
		style: {
			text: 'Timer Blackout',
			alignment: 'center:center',
			size: '14',
			color: combineRgb(255, 255, 255),
			bgcolor: combineRgb(0, 0, 0),
		},
		steps: [
			{
				down: [
					{
						actionId: deprecatedActionId.SetTimerBlackout,
						options: { value: 2 },
					},
				],
				up: [],
			},
		],
		feedbacks: [
			{
				feedbackId: feedbackId.TimerBlackout,
				style: {
					color: combineRgb(255, 255, 255),
					bgcolor: combineRgb(229, 62, 62),
				},
				options: {},
			},
		],
	}
	presets['display_timer_hhmmss'] = {
		type: 'button',
		category: 'Display',
		name: 'Timer Hours:Minutes:Seconds',
		style: {
			text: '$(timer:time)',
			size: '14',
			color: combineRgb(255, 255, 255),
			bgcolor: combineRgb(0, 0, 0),
		},
		steps: [],
		feedbacks: [
			{
				feedbackId: deprecatedFeedbackId.ColorRunning,
				style: {
					color: combineRgb(255, 255, 255),
					bgcolor: combineRgb(0, 204, 0),
				},
				options: {},
			},
			{
				feedbackId: deprecatedFeedbackId.ColorPaused,
				style: {
					color: combineRgb(255, 255, 255),
					bgcolor: combineRgb(237, 137, 54),
				},
				options: {},
			},
			{
				feedbackId: deprecatedFeedbackId.ColorStopped,
				style: {
					color: combineRgb(255, 255, 255),
					bgcolor: combineRgb(0, 0, 0),
				},
				options: {},
			},
			{
				feedbackId: deprecatedFeedbackId.ColorRoll,
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
		name: 'Timer Hours:Minutes',
		style: {
			text: '$(timer:time_hm)',
			size: '24',
			color: combineRgb(255, 255, 255),
			bgcolor: combineRgb(0, 0, 0),
		},
		steps: [],
		feedbacks: [
			{
				feedbackId: deprecatedFeedbackId.ColorRunning,
				style: {
					color: combineRgb(255, 255, 255),
					bgcolor: combineRgb(0, 204, 0),
				},
				options: {},
			},
			{
				feedbackId: deprecatedFeedbackId.ColorPaused,
				style: {
					color: combineRgb(255, 255, 255),
					bgcolor: combineRgb(237, 137, 54),
				},
				options: {},
			},
			{
				feedbackId: deprecatedFeedbackId.ColorStopped,
				style: {
					color: combineRgb(255, 255, 255),
					bgcolor: combineRgb(0, 0, 0),
				},
				options: {},
			},
			{
				feedbackId: deprecatedFeedbackId.ColorRoll,
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
		name: 'Timer Hours',
		style: {
			text: '$(timer:time_h)',
			size: '44',
			color: combineRgb(255, 255, 255),
			bgcolor: combineRgb(0, 0, 0),
		},
		steps: [],
		feedbacks: [
			{
				feedbackId: deprecatedFeedbackId.ColorRunning,
				style: {
					color: combineRgb(255, 255, 255),
					bgcolor: combineRgb(0, 204, 0),
				},
				options: {},
			},
			{
				feedbackId: deprecatedFeedbackId.ColorPaused,
				style: {
					color: combineRgb(255, 255, 255),
					bgcolor: combineRgb(237, 137, 54),
				},
				options: {},
			},
			{
				feedbackId: deprecatedFeedbackId.ColorStopped,
				style: {
					color: combineRgb(255, 255, 255),
					bgcolor: combineRgb(0, 0, 0),
				},
				options: {},
			},
			{
				feedbackId: deprecatedFeedbackId.ColorRoll,
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
		name: 'Timer Minutes',
		style: {
			text: '$(timer:time_m)',
			size: '44',
			color: combineRgb(255, 255, 255),
			bgcolor: combineRgb(0, 0, 0),
		},
		steps: [],
		feedbacks: [
			{
				feedbackId: deprecatedFeedbackId.ColorRunning,
				style: {
					color: combineRgb(255, 255, 255),
					bgcolor: combineRgb(0, 204, 0),
				},
				options: {},
			},
			{
				feedbackId: deprecatedFeedbackId.ColorPaused,
				style: {
					color: combineRgb(255, 255, 255),
					bgcolor: combineRgb(237, 137, 54),
				},
				options: {},
			},
			{
				feedbackId: deprecatedFeedbackId.ColorStopped,
				style: {
					color: combineRgb(255, 255, 255),
					bgcolor: combineRgb(0, 0, 0),
				},
				options: {},
			},
			{
				feedbackId: deprecatedFeedbackId.ColorRoll,
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
		name: 'Timer Seconds',
		style: {
			text: '$(timer:time_s)',
			size: '44',
			color: combineRgb(255, 255, 255),
			bgcolor: combineRgb(0, 0, 0),
		},
		steps: [],
		feedbacks: [
			{
				feedbackId: deprecatedFeedbackId.ColorRunning,
				style: {
					color: combineRgb(255, 255, 255),
					bgcolor: combineRgb(0, 204, 0),
				},
				options: {},
			},
			{
				feedbackId: deprecatedFeedbackId.ColorPaused,
				style: {
					color: combineRgb(255, 255, 255),
					bgcolor: combineRgb(237, 137, 54),
				},
				options: {},
			},
			{
				feedbackId: deprecatedFeedbackId.ColorStopped,
				style: {
					color: combineRgb(255, 255, 255),
					bgcolor: combineRgb(0, 0, 0),
				},
				options: {},
			},
			{
				feedbackId: deprecatedFeedbackId.ColorRoll,
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
	presets['display_added'] = {
		type: 'button',
		category: 'Display',
		name: 'Added Time',
		style: {
			text: '$(ontime:timer_added)',
			size: '14',
			color: combineRgb(255, 255, 255),
			bgcolor: combineRgb(0, 0, 0),
		},
		steps: [],
		feedbacks: [],
	}

*/
