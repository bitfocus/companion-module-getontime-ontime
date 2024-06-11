import {
	CompanionInputFieldCheckbox,
	CompanionInputFieldColor,
	CompanionInputFieldDropdown,
	CompanionInputFieldMultiDropdown,
	CompanionInputFieldNumber,
	CompanionInputFieldStaticText,
	CompanionInputFieldTextInput,
	combineRgb,
} from '@companion-module/base'
import { OntimeV3 } from '../ontimev3'

export function changePicker(
	ontime: OntimeV3
): Array<
	| CompanionInputFieldNumber
	| CompanionInputFieldCheckbox
	| CompanionInputFieldDropdown
	| CompanionInputFieldMultiDropdown
	| CompanionInputFieldColor
	| CompanionInputFieldTextInput
	| CompanionInputFieldStaticText
> {
	const allProps: ReturnType<typeof changePicker> = [
		{
			type: 'textinput',
			label: 'Title',
			id: 'title',
			isVisible: (opts) => Array.isArray(opts.properties) && opts.properties.includes('title'),
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
			label: 'Colour',
			id: 'colour',
			default: combineRgb(255, 255, 255),
			returnType: 'string',
			isVisible: (opts) => Array.isArray(opts.properties) && opts.properties.includes('colour'),
		},
		{
			type: 'number',
			label: 'Duration',
			id: 'duration',
			default: 0,
			min: 0,
			max: 86399,
			step: 1,
			isVisible: (opts) => Array.isArray(opts.properties) && opts.properties.includes('duration'),
		},
		{
			type: 'number',
			label: 'Start Time',
			id: 'timeStart',
			default: 0,
			min: 0,
			max: 86399,
			step: 1,
			isVisible: (opts) => Array.isArray(opts.properties) && opts.properties.includes('timeStart'),
		},
		{
			type: 'number',
			label: 'End Time',
			id: 'timeEnd',
			default: 0,
			min: 0,
			max: 86399,
			step: 1,
			isVisible: (opts) => Array.isArray(opts.properties) && opts.properties.includes('timeEnd'),
		},
		{
			type: 'number',
			label: 'Warning Time',
			id: 'timeWarning',
			default: 0,
			min: 0,
			max: 86399,
			step: 1,
			isVisible: (opts) => Array.isArray(opts.properties) && opts.properties.includes('timeWarning'),
		},
		{
			type: 'number',
			label: 'Danger Time',
			id: 'timeDanger',
			default: 0,
			min: 0,
			max: 86399,
			step: 1,
			isVisible: (opts) => Array.isArray(opts.properties) && opts.properties.includes('timeDanger'),
		},
		{
			type: 'dropdown',
			label: 'End Action',
			id: 'endAction',
			choices: [
				{ id: 'load-next', label: 'Load Next' },
				{ id: 'none', label: 'None' },
				{ id: 'stop', label: 'Stop' },
				{ id: 'play-next', label: 'Play Next' },
			],
			default: 'none',
			isVisible: (opts) => Array.isArray(opts.properties) && opts.properties.includes('endAction'),
		},
		
		...generateCustomFieldsOptions(ontime),
	]

	return [
		{
			type: 'multidropdown',
			id: 'properties',
			label: 'Properties',
			minSelection: 1,
			default: [],
			choices: allProps.map((p) => ({ id: p.id, label: p.label })),
		},
		...allProps,
	]
}

function generateCustomFieldsOptions(ontime: OntimeV3): Array<CompanionInputFieldTextInput> {
	const { customFields } = ontime
	const customProps: ReturnType<typeof generateCustomFieldsOptions> = []

	for (const field in customFields) {
		const id = `custom:${field}`
		customProps.push({
			type: 'textinput',
			id,
			label: `Custom: ${customFields[field].label}`,
			isVisibleData: id,
			isVisible: (opts, data) => Array.isArray(opts.properties) && opts.properties.includes(data),
		})
	}

	return customProps
}
