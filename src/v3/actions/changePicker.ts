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
import { MAX_TIME_SECONDS } from '../../enums'

const throttledEndpointText =
	'This property will cause a recalculation of the rundwon\nand id therfor throttled by ontime'

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
			tooltip: throttledEndpointText,
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
			tooltip: 'In Seconds\n' + throttledEndpointText,
			id: 'duration',
			default: 0,
			min: 0,
			max: MAX_TIME_SECONDS,
			step: 1,
			isVisible: (opts) => Array.isArray(opts.properties) && opts.properties.includes('duration'),
		},
		{
			type: 'textinput',
			label: 'Duration (hh:mm:ss)',
			tooltip: throttledEndpointText,
			id: 'duration_hhmmss',
			default: '00:00:00',
			isVisible: (opts) => Array.isArray(opts.properties) && opts.properties.includes('duration_hhmmss'),
			useVariables: true,
		},
		{
			type: 'number',
			label: 'Start Time',
			tooltip: 'In Seconds\n' + throttledEndpointText,
			id: 'timeStart',
			default: 0,
			min: 0,
			max: MAX_TIME_SECONDS,
			step: 1,
			isVisible: (opts) => Array.isArray(opts.properties) && opts.properties.includes('timeStart'),
		},
		{
			type: 'textinput',
			label: 'Start Time (hh:mm:ss)',
			tooltip: 'The variable should result in (hh:mm:ss)\n' + throttledEndpointText,
			id: 'timeStart_hhmmss',
			default: '00:00:00',
			isVisible: (opts) => Array.isArray(opts.properties) && opts.properties.includes('timeStart_hhmmss'),
			useVariables: true,
		},
		{
			type: 'number',
			label: 'End Time',
			tooltip: 'In Seconds\n' + throttledEndpointText,
			id: 'timeEnd',
			default: 0,
			min: 0,
			max: MAX_TIME_SECONDS,
			step: 1,
			isVisible: (opts) => Array.isArray(opts.properties) && opts.properties.includes('timeEnd'),
		},
		{
			type: 'textinput',
			label: 'End Time (hh:mm:ss)',
			tooltip: throttledEndpointText,
			id: 'timeEnd_hhmmss',
			default: '00:00:00',
			isVisible: (opts) => Array.isArray(opts.properties) && opts.properties.includes('timeEnd_hhmmss'),
			useVariables: true,
		},
		{
			type: 'number',
			label: 'Warning Time',
			id: 'timeWarning',
			default: 0,
			min: 0,
			max: MAX_TIME_SECONDS,
			step: 1,
			isVisible: (opts) => Array.isArray(opts.properties) && opts.properties.includes('timeWarning'),
		},
		{
			type: 'textinput',
			label: 'Warning Time (hh:mm:ss)',
			id: 'timeWarning_hhmmss',
			default: '00:00:00',
			isVisible: (opts) => Array.isArray(opts.properties) && opts.properties.includes('timeWarning_hhmmss'),
			useVariables: true,
		},
		{
			type: 'number',
			label: 'Danger Time',
			id: 'timeDanger',
			default: 0,
			min: 0,
			max: MAX_TIME_SECONDS,
			step: 1,
			isVisible: (opts) => Array.isArray(opts.properties) && opts.properties.includes('timeDanger'),
		},
		{
			type: 'textinput',
			label: 'Danger Time (hh:mm:ss)',
			id: 'timeDanger_hhmmss',
			default: '00:00:00',
			isVisible: (opts) => Array.isArray(opts.properties) && opts.properties.includes('timeDanger_hhmmss'),
			useVariables: true,
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
		{
			type: 'dropdown',
			label: 'Timer Type',
			id: 'timerType',
			choices: [
				{ id: 'count-down', label: 'Count Down' },
				{ id: 'count-up', label: 'Count Up' },
				{ id: 'time-to-end', label: 'Time To End' },
				{ id: 'clock', label: 'Clock' },
			],
			default: 'count-down',
			isVisible: (opts) => Array.isArray(opts.properties) && opts.properties.includes('timerType'),
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
