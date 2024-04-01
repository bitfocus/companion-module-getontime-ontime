import { OnTimeInstance } from '../../index'
import { SomeCompanionActionInputField, DropdownChoice } from '@companion-module/base'

type SelectOptions = 'list' | 'loaded' | 'previous' | 'next' | 'cue' | 'id' | 'index'
const selectOptions: DropdownChoice[] = [
	{ id: 'list', label: 'From list' },
	{ id: 'loaded', label: 'Loaded Event' },
	{ id: 'next', label: 'Next Event' },
	{ id: 'previous', label: 'Previous Event' },
	{ id: 'cue', label: 'CUE' },
	{ id: 'id', label: 'ID' },
	{ id: 'index', label: 'Index' },
]

export function eventPicker(
	ontime: OnTimeInstance,
	options: SelectOptions[] = ['list', 'next', 'previous', 'loaded', 'cue', 'id', 'index']
): SomeCompanionActionInputField[] {
	const selectChoices = new Array<DropdownChoice>()
	selectOptions.forEach((choice) => {
		if (options.includes(choice.id as SelectOptions)) {
			selectChoices.push(choice)
		}
	})
	ontime.log('debug', JSON.stringify(selectChoices))
	ontime.log('debug', JSON.stringify(options))
	return [
		{
			type: 'dropdown',
			id: 'method',
			label: 'Event Selection',
			choices: selectChoices,

			default: 'loaded',
		},
		{
			type: 'dropdown',
			choices: ontime.events,
			id: 'eventList',
			label: 'Event',
			default: ontime.events[0].id,
			isVisible: (options) => options['method'] === 'list',
		},
		{
			type: 'static-text',
			value: '',
			id: 'cuenote',
			label: 'Note! this will target the first event with a matching CUE name',
			isVisible: (options) => options['method'] === 'cue',
		},
		{
			type: 'textinput',
			id: 'eventCue',
			label: 'Event Cue',
			default: '',
			isVisible: (options) => options['method'] === 'cue',
		},
		{
			type: 'textinput',
			id: 'eventId',
			label: 'Event Id',
			default: '',
			isVisible: (options) => options['method'] === 'id',
		},
		{
			type: 'number',
			id: 'eventIndex',
			label: 'Event Index',
			default: 1,
			min: 1,
			max: ontime.events.length,
			isVisible: (options) => options['method'] === 'index',
		},
	]
}
