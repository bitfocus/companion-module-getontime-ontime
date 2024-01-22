import { OnTimeInstance } from '../index'
import {
	CompanionActionDefinition,
	CompanionActionDefinitions,
	CompanionInputFieldCheckbox,
	CompanionInputFieldColor,
	CompanionInputFieldDropdown,
	CompanionInputFieldMultiDropdown,
	CompanionInputFieldNumber,
	CompanionInputFieldStaticText,
	CompanionInputFieldTextInput,
} from '@companion-module/base'
import { socketSendChange, socketSendJson } from './connection'
import { ActionId, variableId } from '../enums'

enum ActionCommand {
	Start = 'start',
	StartId = 'startid',
	StartCue = 'startcue',
	LoadCue = 'loadcue',
	StartIndex = 'startindex',
	StartNext = 'start-next',
	LoadId = 'loadid',
	LoadIndex = 'loadindex',
	Pause = 'pause',
	Stop = 'stop',
	Reload = 'reload',
	Next = 'next',
	Previous = 'previous',
	Roll = 'roll',
	Add = 'addtime',
	SetOnAir = 'set-onair',
	SetTimerMessageVisibility = 'set-timer-message-visible',
	SetTimerMessage = 'set-timer-message-text',
	SetPublicMessageVisibility = 'set-public-message-visible',
	SetPublicMessage = 'set-public-message-text',
	SetLowerMessageVisibility = 'set-lower-message-visible',
	SetLowerMessage = 'set-lower-message-text',
	SetTimerBlackout = 'set-timer-blackout',
	SetTimerBlink = 'set-timer-blink',
	Change = 'change',
}
// {
// 	type: 'multidropdown',
// 	choices: [
// 		{ id: 'title', label: 'Title' },
// 		{ id: 'subtitle', label: 'Subtitle' },
// 		{ id: 'presenter', label: 'Presenter' },
// 		{ id: 'note', label: 'Note' },
// 		{ id: 'cue', label: 'Cue' },
// 		{ id: 'duration', label: 'Duration' },
// 		{ id: 'isPublic', label: 'Public' },
// 		{ id: 'skip', label: 'Skip' },
// 		{ id: 'colour', label: 'Colour' },
// 		{ id: 'user0', label: 'User 0' },
// 		{ id: 'user1', label: 'User 1' },
// 		{ id: 'user2', label: 'User 2' },
// 		{ id: 'user3', label: 'User 3' },
// 		{ id: 'user4', label: 'User 4' },
// 		{ id: 'user5', label: 'User 5' },
// 		{ id: 'user6', label: 'User 6' },
// 		{ id: 'user7', label: 'User 7' },
// 		{ id: 'user8', label: 'User 8' },
// 		{ id: 'user9', label: 'User 9' },
// 	],
// 	default: 'title',
// 	id: 'property',
// 	label: 'Property',
// },
function ChangePropertiesPicker(): Array<
	| CompanionInputFieldNumber
	| CompanionInputFieldCheckbox
	| CompanionInputFieldDropdown
	| CompanionInputFieldMultiDropdown
	| CompanionInputFieldColor
	| CompanionInputFieldTextInput
	| CompanionInputFieldStaticText
> {
	const allProps: ReturnType<typeof ChangePropertiesPicker> = [
		{
			type: 'static-text',
			label: 'Pick an Option',
			id: 'pickOne',
			value: 'Pick Options',
			isVisible: () => false,
		},
		{
			type: 'textinput',
			label: 'Title',
			id: 'title',
			isVisible: (opts) => Array.isArray(opts.properties) && opts.properties.includes('title'),
		},
		{
			type: 'textinput',
			label: 'Subtitle',
			id: 'subtitle',
			isVisible: (opts) => Array.isArray(opts.properties) && opts.properties.includes('subtitle'),
		},
		{
			type: 'textinput',
			label: 'Presenter',
			id: 'presenter',
			isVisible: (opts) => Array.isArray(opts.properties) && opts.properties.includes('presenter'),
		},
		{
			type: 'textinput',
			label: 'Note',
			id: 'note',
			isVisible: (opts) => Array.isArray(opts.properties) && opts.properties.includes('note'),
		},
		{
			type: 'textinput',
			label: 'Cue',
			id: 'cue',
			isVisible: (opts) => Array.isArray(opts.properties) && opts.properties.includes('cue'),
		},
		{
			type: 'number',
			label: 'Duration',
			id: 'duration',
			default: 0,
			min: 0,
			max: 100,
			isVisible: (opts) => Array.isArray(opts.properties) && opts.properties.includes('duration'),
		},
		{
			type: 'checkbox',
			label: 'Is Public',
			id: 'isPublic',
			default: false,
			isVisible: (opts) => Array.isArray(opts.properties) && opts.properties.includes('isPublic'),
		},
		{
			type: 'checkbox',
			label: 'Skip',
			id: 'skip',
			default: false,
			isVisible: (opts) => Array.isArray(opts.properties) && opts.properties.includes('skip'),
		},
		{
			type: 'colorpicker',
			label: 'Color',
			id: 'color',
			default: '#fffff',
			isVisible: (opts) => Array.isArray(opts.properties) && opts.properties.includes('color'),
		},
		{
			type: 'textinput',
			label: 'User 0',
			id: 'user0',
			isVisible: (opts) => Array.isArray(opts.properties) && opts.properties.includes('user0'),
		},
		{
			type: 'textinput',
			label: 'User 1',
			id: 'user1',
			isVisible: (opts) => Array.isArray(opts.properties) && opts.properties.includes('user1'),
		},
		{
			type: 'textinput',
			label: 'User 2',
			id: 'user2',
			isVisible: (opts) => Array.isArray(opts.properties) && opts.properties.includes('user2'),
		},
		{
			type: 'textinput',
			label: 'User 3',
			id: 'user3',
			isVisible: (opts) => Array.isArray(opts.properties) && opts.properties.includes('user3'),
		},
		{
			type: 'textinput',
			label: 'User 4',
			id: 'user4',
			isVisible: (opts) => Array.isArray(opts.properties) && opts.properties.includes('user4'),
		},
		{
			type: 'textinput',
			label: 'User 5',
			id: 'user5',
			isVisible: (opts) => Array.isArray(opts.properties) && opts.properties.includes('user5'),
		},
		{
			type: 'textinput',
			label: 'User 6',
			id: 'user6',
			isVisible: (opts) => Array.isArray(opts.properties) && opts.properties.includes('user6'),
		},
		{
			type: 'textinput',
			label: 'User 7',
			id: 'user7',
			isVisible: (opts) => Array.isArray(opts.properties) && opts.properties.includes('user7'),
		},
		{
			type: 'textinput',
			label: 'User 8',
			id: 'user8',
			isVisible: (opts) => Array.isArray(opts.properties) && opts.properties.includes('user8'),
		},
		{
			type: 'textinput',
			label: 'User 9',
			id: 'user9',
			isVisible: (opts) => Array.isArray(opts.properties) && opts.properties.includes('user9'),
		},
	]

	return [
		{
			type: 'multidropdown',
			id: 'properties',
			label: 'Properties',
			minSelection: 1,
			default: ['pickOne'],
			choices: allProps.map((p) => ({ id: p.id, label: p.label })),
		},
		...allProps,
	]
}

/**
 * Returns all implemented actions.
 * @param self reference to the BaseInstance
 * @constructor
 * @returns CompanionActions
 */
export function actions(self: OnTimeInstance): CompanionActionDefinitions {
	const actions: { [id: string]: CompanionActionDefinition } = {
		[ActionId.Start]: {
			name: 'Start selected event',
			options: [],
			callback: () => {
				socketSendJson(ActionCommand.Start)
			},
		},
		[ActionId.StartId]: {
			name: 'Start event with given ID',
			options: [
				{
					type: 'textinput',
					label: 'Event ID',
					id: 'value',
					required: true,
				},
			],
			callback: (action) => {
				socketSendJson(ActionCommand.StartId, action.options.value)
			},
		},
		[ActionId.StartIndex]: {
			name: 'Start event at position',
			options: [
				{
					type: 'number',
					label: 'Position',
					id: 'value',
					default: 1,
					min: 1,
					max: self.states.loaded.numEvents,
					step: 1,
					range: true,
					required: true,
				},
			],
			callback: (action) => {
				socketSendJson(ActionCommand.StartIndex, action.options.value)
			},
		},
		[ActionId.StartNext]: {
			name: 'Start next event',
			options: [],
			callback: () => {
				socketSendJson(ActionCommand.StartNext)
			},
		},
		[ActionId.StartSelect]: {
			name: 'Start event dropdown',
			options: [
				{
					type: 'dropdown',
					choices: self.events,
					id: 'value',
					label: 'Event',
					default: self.events[0]?.id,
				},
			],
			callback: (action) => {
				socketSendJson(ActionCommand.StartId, action.options.value)
			},
		},
		[ActionId.StartCue]: {
			name: 'Start event with Cue',
			options: [
				{
					type: 'textinput',
					label: 'Event Cue',
					id: 'value',
					required: true,
				},
			],
			callback: (action) => {
				socketSendJson(ActionCommand.StartCue, action.options.value)
			},
		},
		[ActionId.LoadId]: {
			name: 'Load event with given ID',
			options: [
				{
					type: 'textinput',
					label: 'Event ID',
					id: 'value',
					required: true,
				},
			],
			callback: (action) => {
				socketSendJson(ActionCommand.LoadId, action.options.value)
			},
		},
		[ActionId.LoadSelect]: {
			name: 'Load event dropdown',
			options: [
				{
					type: 'dropdown',
					choices: self.events,
					id: 'value',
					label: 'Event',
					default: self.events[0]?.id,
				},
			],
			callback: (action) => {
				socketSendJson(ActionCommand.LoadId, action.options.value)
			},
		},
		[ActionId.LoadIndex]: {
			name: 'Load event at position',
			options: [
				{
					type: 'number',
					label: 'Position',
					id: 'value',
					default: 1,
					min: 1,
					max: self.states.loaded.numEvents,
					step: 1,
					range: true,
					required: true,
				},
			],
			callback: (action) => {
				socketSendJson(ActionCommand.LoadIndex, action.options.value)
			},
		},
		[ActionId.LoadCue]: {
			name: 'Load event with Cue',
			options: [
				{
					type: 'textinput',
					label: 'Event Cue',
					id: 'value',
					required: true,
				},
			],
			callback: (action) => {
				socketSendJson(ActionCommand.LoadCue, action.options.value)
			},
		},
		[ActionId.Pause]: {
			name: 'Pause running timer',
			options: [],
			callback: () => {
				socketSendJson(ActionCommand.Pause)
			},
		},
		[ActionId.Stop]: {
			name: 'Stop running timer',
			options: [],
			callback: () => {
				socketSendJson(ActionCommand.Stop)
			},
		},
		[ActionId.Reload]: {
			name: 'Reload selected event',
			options: [],
			callback: () => {
				socketSendJson(ActionCommand.Reload)
			},
		},
		[ActionId.Next]: {
			name: 'Select next event',
			options: [],
			callback: () => {
				socketSendJson(ActionCommand.Next)
			},
		},
		[ActionId.Previous]: {
			name: 'Select previous event',
			options: [],
			callback: () => {
				socketSendJson(ActionCommand.Previous)
			},
		},
		[ActionId.Roll]: {
			name: 'Start roll mode',
			options: [],
			callback: () => {
				socketSendJson(ActionCommand.Roll)
			},
		},
		[ActionId.Add]: {
			name: 'Add / remove time to running timer',
			options: [
				{
					id: 'addremove',
					type: 'dropdown',
					choices: [
						{ id: 'add', label: 'Add Time' },
						{ id: 'remove', label: 'Remove Time' },
					],
					label: 'Add or Remove',
					default: 'add',
				},
				{
					type: 'number',
					id: 'hours',
					label: 'Hours',
					default: 0,
					step: 1,
					min: 0,
					max: 24,
					required: true,
				},
				{
					type: 'number',
					id: 'minutes',
					label: 'Minutes',
					default: 1,
					step: 1,
					min: 0,
					max: 1440,
					required: true,
				},
				{
					type: 'number',
					id: 'seconds',
					label: 'Seconds',
					default: 0,
					min: 0,
					max: 86400,
					step: 1,
					required: true,
				},
			],
			callback: (action) => {
				let val =
					(Number(action.options.hours) * 60 + Number(action.options.minutes)) * 60 + Number(action.options.seconds)
				if (action.options.addremove === 'remove') {
					val = val * -1
				}
				socketSendJson(ActionCommand.Add, val)
			},
		},
		[ActionId.SetOnAir]: {
			name: 'Toggle/On/Off On Air',
			options: [
				{
					type: 'dropdown',
					choices: [
						{ id: 2, label: 'Toggle' },
						{ id: 1, label: 'On' },
						{ id: 0, label: 'Off' },
					],
					default: 2,
					id: 'value',
					label: 'On Air',
				},
			],
			callback: (action) => {
				const val = action.options.value === 2 ? !self.getVariableValue(variableId.OnAir) : action.options.value
				socketSendJson(ActionCommand.SetOnAir, val)
			},
		},
		[ActionId.SetTimerMessageVisibility]: {
			name: 'Toggle/On/Off visibility of Timer message',
			options: [
				{
					type: 'dropdown',
					choices: [
						{ id: 2, label: 'Toggle' },
						{ id: 1, label: 'On' },
						{ id: 0, label: 'Off' },
					],
					default: 2,
					id: 'value',
					label: 'Timer message',
				},
			],
			callback: (action) => {
				const val =
					action.options.value === 2 ? !self.getVariableValue(variableId.TimerMessageVisible) : action.options.value
				socketSendJson(ActionCommand.SetTimerMessageVisibility, val)
			},
		},
		[ActionId.SetTimerMessage]: {
			name: 'Set text for Timer message',
			options: [
				{
					type: 'textinput',
					label: 'Timer message',
					id: 'value',
					required: true,
				},
			],
			callback: (action) => {
				socketSendJson(ActionCommand.SetTimerMessage, action.options?.value ?? '')
			},
		},
		[ActionId.SetPublicMessageVisibility]: {
			name: 'Toggle/On/Off visibility of Public screens message',
			options: [
				{
					type: 'dropdown',
					choices: [
						{ id: 2, label: 'Toggle' },
						{ id: 1, label: 'On' },
						{ id: 0, label: 'Off' },
					],
					default: 2,
					id: 'value',
					label: 'Public screens message',
				},
			],
			callback: (action) => {
				const val =
					action.options.value === 2 ? !self.getVariableValue(variableId.PublicMessageVisible) : action.options.value
				socketSendJson(ActionCommand.SetPublicMessageVisibility, val)
			},
		},
		[ActionId.SetPublicMessage]: {
			name: 'Set text for Public screens message',
			options: [
				{
					type: 'textinput',
					label: 'Public screens message',
					id: 'value',
					required: true,
				},
			],
			callback: (action) => {
				socketSendJson(ActionCommand.SetPublicMessage, action.options?.value ?? '')
			},
		},
		[ActionId.SetLowerMessageVisibility]: {
			name: 'Toggle/On/Off visibility of Lower Third message',
			options: [
				{
					type: 'dropdown',
					choices: [
						{ id: 2, label: 'Toggle' },
						{ id: 1, label: 'On' },
						{ id: 0, label: 'Off' },
					],
					default: 2,
					id: 'value',
					label: 'Lower Third message',
				},
			],
			callback: (action) => {
				const val =
					action.options.value === 2 ? !self.getVariableValue(variableId.LowerMessageVisible) : action.options.value
				socketSendJson(ActionCommand.SetLowerMessageVisibility, val)
			},
		},
		[ActionId.SetLowerMessage]: {
			name: 'Set text for Lower Third message',
			options: [
				{
					type: 'textinput',
					label: 'Lower Third message',
					id: 'value',
					required: true,
				},
			],
			callback: (action) => {
				socketSendJson(ActionCommand.SetLowerMessage, action.options?.value ?? '')
			},
		},
		[ActionId.SetTimerBlackout]: {
			name: 'Toggle/On/Off Blackout of timer',
			options: [
				{
					type: 'dropdown',
					choices: [
						{ id: 2, label: 'Toggle' },
						{ id: 1, label: 'Blackout On' },
						{ id: 0, label: 'Blackout Off' },
					],
					default: 2,
					id: 'value',
					label: 'Blackout of timer',
				},
			],
			callback: (action) => {
				const val = action.options.value === 2 ? !self.getVariableValue(variableId.TimerBlackout) : action.options.value
				socketSendJson(ActionCommand.SetTimerBlackout, val)
			},
		},
		[ActionId.SetTimerBlink]: {
			name: 'Toggle/On/Off blinking of timer',
			options: [
				{
					type: 'dropdown',
					choices: [
						{ id: 2, label: 'Toggle' },
						{ id: 1, label: 'On' },
						{ id: 0, label: 'Off' },
					],
					default: 2,
					id: 'value',
					label: 'Blink timer',
				},
			],
			callback: (action) => {
				const val = action.options.value === 2 ? !self.getVariableValue(variableId.TimerBlink) : action.options.value
				socketSendJson(ActionCommand.SetTimerBlink, val)
			},
		},
		[ActionId.Change]: {
			name: 'Change event property',
			options: [
				{
					type: 'dropdown',
					choices: [
						{ id: 'selected', label: '--| Selected |--' },
						{ id: 'next', label: '--| Next |--' },
						...self.events,
					],
					id: 'eventId',
					label: 'Event',
					default: 'next',
				},
				...ChangePropertiesPicker(),
			],
			callback: (action) => {
				if (
					action.options.eventId !== undefined &&
					action.options.property !== undefined &&
					action.options.val !== undefined
				) {
					const eventId =
						action.options.eventId === 'selected'
							? self.states.loaded.selectedEventId
							: action.options.eventId === 'next'
							? self.states.loaded.nextEventId
							: action.options.eventId

					if (typeof eventId === 'string') {
						socketSendChange(ActionCommand.Change, eventId, action.options.property, action.options.val)
					}
				}
			},
		},
	}
	return actions
}
