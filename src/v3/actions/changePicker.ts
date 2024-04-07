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

export function changePicker(): Array<
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
			label: 'Duration in Seconds',
			id: 'duration',
			default: 0,
			min: 0,
			max: 3600,
			step: 1,
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
			label: 'Colour',
			id: 'colour',
			default: combineRgb(255, 255, 255),
			returnType: 'string',
			isVisible: (opts) => Array.isArray(opts.properties) && opts.properties.includes('colour'),
		},
		//TODO: replace with custom
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
