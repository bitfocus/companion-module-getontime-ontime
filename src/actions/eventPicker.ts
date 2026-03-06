import type { DropdownChoice, CompanionActionDefinition } from '@companion-module/base'
import type { OntimeEvent } from '@getontime/resolver'
import { PICK_ONE } from '../enums.js'

type SelectOptions = 'list' | 'loaded' | 'previous' | 'next' | 'cue' | 'id' | 'index' | 'go'
const selectOptions: DropdownChoice[] = [
	{ id: 'list', label: 'From list' },
	{ id: 'loaded', label: 'Loaded Event' },
	{ id: 'next', label: 'Next Event' },
	{ id: 'go', label: 'GO (Next/Loaded Event)' },
	{ id: 'previous', label: 'Previous Event' },
	{ id: 'cue', label: 'CUE' },
	{ id: 'id', label: 'ID' },
	{ id: 'index', label: 'Index' },
]

export type EventPickerOptions = {
	method: SelectOptions
	eventList: string
	cuenote: string
	eventCue: string
	eventId: string
	eventIndex: number
}

export function eventPicker(
	events: OntimeEvent[],
	options: SelectOptions[] = ['list', 'next', 'previous', 'loaded', 'cue', 'id', 'index'],
): CompanionActionDefinition<EventPickerOptions>['options'] {
	const selectChoices = new Array<DropdownChoice>()
	selectOptions.forEach((choice) => {
		if (options.includes(choice.id as SelectOptions)) {
			selectChoices.push(choice)
		}
	})
	return [
		{
			id: 'method',
			type: 'dropdown',
			label: 'Event Selection',
			choices: selectChoices,
			default: 'loaded',
			disableAutoExpression: true,
		},
		{
			id: 'eventList',
			type: 'dropdown',
			choices: [
				{ id: PICK_ONE, label: 'Pick One' },
				...events.map(({ id, cue, title }) => {
					return { id, label: `${cue} | ${title}` }
				}),
			],
			label: 'Event',
			default: PICK_ONE,
			isVisibleExpression: '$(options:method) === "list"',
		},
		{
			type: 'static-text',
			value:
				'NB! Ontime will match the next cue. Counting from the currently loaded event or from the beginning if nothing is loaded',
			id: 'cuenote',
			label: '',
			isVisibleExpression: '$(options:method) === "cue"',
		},
		{
			id: 'eventCue',
			type: 'textinput',
			label: 'Event Cue',
			default: '',
			isVisibleExpression: '$(options:method) === "cue"',
		},
		{
			type: 'textinput',
			id: 'eventId',
			label: 'Event Id',
			useVariables: true,
			default: '',
			isVisibleExpression: '$(options:method) === "id"',
		},
		{
			type: 'number',
			id: 'eventIndex',
			label: 'Event Index',
			default: 1,
			min: 1,
			max: events.length,
			isVisibleExpression: '$(options:method) === "index"',
		},
	]
}
