exports.getActions = function () {
	const actions = {}

	actions['start'] = {
		name: 'Start selected event',
		options: [],
		callback: (action) => {
			this.sendcmd('set-start')
		},
	}
	actions['startId'] = {
		name: 'Start event with given ID',
		options: [
			{
				type: 'textinput',
				name: 'Event ID',
				id: 'value',
				required: true,
			},
		],
		callback: (action) => {
			this.sendcmd('set-startid', action.options.value)
		},
	}
	actions['startIndex'] = {
		name: 'Start event at position (1-256)',
		options: [
			{
				type: 'number',
				name: 'Position',
				id: 'value',
				default: 1,
				min: 1,
				max: 256,
				step: 1,
				range: true,
				required: true,
			},
		],
		callback: (action) => {
			this.sendcmd('set-startindex', action.options.value - 1)
		},
	}
	actions['loadId'] = {
		name: 'Load event with given ID',
		options: [
			{
				type: 'textinput',
				name: 'Event ID',
				id: 'value',
				required: true,
			},
		],
		callback: (action) => {
			this.sendcmd('set-loadid', action.options.value)
		},
	}
	actions['loadIndex'] = {
		name: 'Load event at position (1-256)',
		options: [
			{
				type: 'number',
				name: 'Position',
				id: 'value',
				default: 1,
				min: 1,
				max: 256,
				step: 1,
				range: true,
				required: true,
			},
		],
		callback: (action) => {
			this.sendcmd('set-loadindex', action.options.value - 1)
		},
	}
	actions['pause'] = {
		name: 'Pause running timer',
		options: [],
		callback: (action) => {
			this.sendcmd('set-pause')
		},
	}
	actions['stop'] = {
		name: 'Stop running timer',
		options: [],
		callback: (action) => {
			this.sendcmd('set-stop')
		},
	}
	actions['reload'] = {
		name: 'Reload selected event',
		options: [],
		callback: (action) => {
			this.sendcmd('set-reload')
		},
	}
	actions['previous'] = {
		name: 'Select previous event',
		options: [],
		callback: (action) => {
			this.sendcmd('set-previous')
		},
	}
	actions['next'] = {
		name: 'Select next event',
		options: [],
		callback: (action) => {
			this.sendcmd('set-next')
		},
	}
	actions['roll'] = {
		name: 'Start roll mode',
		options: [],
		callback: (action) => {
			this.sendcmd('set-roll')
		},
	}
	actions['delay'] = {
		name: 'Add / remove time (min) to running timer',
		options: [
			{
				type: 'number',
				id: 'value',
				name: 'Time',
				default: 0,
				min: -60,
				max: 60,
				step: 1,
				required: true,
				range: true,
			},
		],
		callback: (action) => {
			this.sendcmd('set-delay', action.options.value)
		},
	}
	actions['setOnAir'] = {
		name: 'Toggle On Air',
		options: [
			{
				type: 'checkbox',
				id: 'value',
				name: 'On Air',
			},
		],
		callback: (action) => {
			this.sendcmd('set-onAir', action.options.value)
		},
	}
	actions['setTimerMessageVisibility'] = {
		name: 'Toggle visibility of Stage Timer message',
		options: [
			{
				type: 'checkbox',
				id: 'value',
				name: 'Show Message',
			},
		],
		callback: (action) => {
			this.sendcmd('set-timer-message-visible', action.options.value)
		},
	}
	actions['setTimerMessage'] = {
		name: 'Set text for Stage Timer message',
		options: [
			{
				type: 'textinput',
				name: 'Stage Timer message',
				placeholder: 'Only the Presenter sees this',
				id: 'value',
				required: true,
			},
		],
		callback: (action) => {
			this.sendcmd('set-timer-message-text', action.options.value)
		},
	}
	actions['setPublicMessageVisibility'] = {
		name: 'Toggle visibility of Public screens message',
		options: [
			{
				type: 'checkbox',
				id: 'value',
				name: 'Show Message',
			},
		],
		callback: (action) => {
			this.sendcmd('set-public-message-visible', action.options.value)
		},
	}
	actions['setPublicMessage'] = {
		name: 'Set text for Public screens message',
		options: [
			{
				type: 'textinput',
				name: 'Stage Timer message',
				placeholder: 'Only the Presenter sees this',
				id: 'value',
				required: true,
			},
		],
		callback: (action) => {
			this.sendcmd('set-public-message-text', action.options.value)
		},
	}
	actions['setLowerMessageVisibility'] = {
		name: 'Toggle visibility of Lower Third message',
		options: [
			{
				type: 'checkbox',
				id: 'value',
				name: 'Show Message',
			},
		],
		callback: (action) => {
			this.sendcmd('set-lower-message-visible', action.options.value)
		},
	}
	actions['setLowerMessage'] = {
		name: 'Set text for Lower Third message',
		options: [
			{
				type: 'textinput',
				name: 'Stage Timer message',
				placeholder: 'Only the Presenter sees this',
				id: 'value',
				required: true,
			},
		],
		callback: (action) => {
			this.sendcmd('set-lower-message-text', action.options.value)
		},
	}
	return actions
}
