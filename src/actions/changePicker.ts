import type {
	CompanionInputFieldCheckbox,
	CompanionInputFieldColor,
	CompanionInputFieldDropdown,
	CompanionInputFieldMultiDropdown,
	CompanionInputFieldNumber,
	CompanionInputFieldStaticText,
	CompanionInputFieldTextInput,
} from '@companion-module/base'
import { combineRgb } from '@companion-module/base'
import { type CustomFields } from '@getontime/resolver'

const throttledEndpointText = 'This property will cause a recalculation of the rundown\nand is throttled by ontime'

export function changePicker(
	customFields: CustomFields,
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
			useVariables: true,
			isVisibleExpression: 'arrayIncludes($(options:properties),"title")',
		},
		{
			type: 'textinput',
			label: 'Note',
			id: 'note',
			useVariables: true,
			isVisibleExpression: 'arrayIncludes($(options:properties),"note")',
		},
		{
			type: 'textinput',
			label: 'Cue',
			id: 'cue',
			isVisibleExpression: 'arrayIncludes($(options:properties),"cue")',
		},
		{
			type: 'checkbox',
			label: 'Skip',
			tooltip: throttledEndpointText,
			id: 'skip',
			default: false,
			isVisibleExpression: 'arrayIncludes($(options:properties),"skip")',
		},
		{
			type: 'colorpicker',
			label: 'Colour',
			id: 'colour',
			default: combineRgb(255, 255, 255),
			returnType: 'string',
			isVisibleExpression: 'arrayIncludes($(options:properties),"colour")',
		},
		{
			type: 'textinput',
			label: 'Duration',
			tooltip: 'In milliseconds or hh:mm:ss\n' + throttledEndpointText,
			id: 'duration_hhmmss',
			default: '00:00:00',
			useVariables: true,
			isVisibleExpression: `arrayIncludes($(options:properties), 'duration_hhmmss')`,
		},
		{
			type: 'checkbox',
			label: 'Link start time',
			tooltip: 'Link the events start time to the end time of the previous event',
			id: 'linkStart',
			default: false,
			isVisibleExpression: `arrayIncludes($(options:properties), 'timeStart_hhmmss')`,
		},
		{
			type: 'textinput',
			label: 'Start Time',
			tooltip: 'In milliseconds or hh:mm:ss\n' + throttledEndpointText,
			id: 'timeStart_hhmmss',
			default: '00:00:00',
			useVariables: true,
			isVisibleExpression: `arrayIncludes($(options:properties), 'timeStart_hhmmss') && !$(options:linkStart)`,
		},
		{
			type: 'textinput',
			label: 'End Time',
			tooltip: 'In milliseconds or hh:mm:ss\n' + throttledEndpointText,
			id: 'timeEnd_hhmmss',
			default: '00:00:00',
			useVariables: true,
			isVisibleExpression: `arrayIncludes($(options:properties), 'timeEnd_hhmmss')`,
		},
		{
			type: 'textinput',
			label: 'Warning Time',
			tooltip: 'In milliseconds or hh:mm:ss\n' + throttledEndpointText,
			id: 'timeWarning_hhmmss',
			default: '00:00:00',
			isVisibleExpression: 'arrayIncludes($(options:properties),"timeWarning_hhmmss")',
			useVariables: true,
		},

		{
			type: 'textinput',
			label: 'Danger Time',
			tooltip: 'In milliseconds or hh:mm:ss\n' + throttledEndpointText,
			id: 'timeDanger_hhmmss',
			default: '00:00:00',
			isVisibleExpression: 'arrayIncludes($(options:properties),"timeDanger_hhmmss")',
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
			isVisibleExpression: 'arrayIncludes($(options:properties),"endAction")',
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
			isVisibleExpression: 'arrayIncludes($(options:properties),"timerType")',
		},
		...generateCustomFieldsOptions(customFields),
	]

	return [
		{
			type: 'multidropdown',
			id: 'properties',
			label: 'Properties',
			minSelection: 1,
			default: [],
			choices: allProps.map((p) => ({ id: p.id, label: p.label })).filter((p) => p.id !== 'linkStart'),
		},
		...allProps,
	]
}

function generateCustomFieldsOptions(customFields: CustomFields): Array<CompanionInputFieldTextInput> {
	const customProps: ReturnType<typeof generateCustomFieldsOptions> = []

	for (const field in customFields) {
		const id = `custom:${field}`
		customProps.push({
			type: 'textinput',
			id,
			label: `Custom: ${customFields[field].label}`,
			isVisibleExpression: `arrayIncludes($(options:properties), '${id}')`,
			useVariables: true,
		})
	}

	return customProps
}
