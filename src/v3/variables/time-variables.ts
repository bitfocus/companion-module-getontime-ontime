import {
	CompanionConfigField,
	CompanionInputFieldMultiDropdown,
	CompanionVariableDefinition,
	CompanionVariableValues,
} from '@companion-module/base'
import { OntimeConfig } from '../../config'
import { TIME_VARIABLES } from '../../enums'
import { msToSplitTime } from '../../utilities'

const timeDisplayLabels = {
	ms: { label: 'ms', extension: '_ms' },
	combine: { label: 'hh:mm:ss', extension: '' },
	hh: { label: 'hh', extension: '_hh' },
	mm: { label: 'mm', extension: '_mm' },
	ss: { label: 'ss', extension: '_ss' },
	hhmm: { label: 'hh:mm', extension: '_hhmm' },
	sign: { label: 'sign', extension: '_sign' },
	nice: { label: 'smallest unit', extension: '_nice' },
} as const

type TtimeDisplayLabels = typeof timeDisplayLabels

type TtimerVariables = typeof TIME_VARIABLES
type TimerVariableKeys = keyof TtimerVariables

export type TimeDisplayTypes = keyof TtimeDisplayLabels

export function createTimeVariables(
	description: string,
	variableName: string,
	types: TimeDisplayTypes[]
): CompanionVariableDefinition[] {
	return types.map((type) => {
		const { label, extension } = timeDisplayLabels[type]
		return { name: `${description} (${label})`, variableId: `${variableName}${extension}` }
	})
}

export function getTimeVariablesConfigOption(
	label: string,
	id: string,
	defaultValues?: TimeDisplayTypes[]
): CompanionInputFieldMultiDropdown & CompanionConfigField {
	return {
		id: `time_variable_${id}`,
		type: 'multidropdown',
		label,
		choices: [
			{ id: 'combine', label: 'hh:mm:ss' },
			{ id: 'hh', label: 'Hours' },
			{ id: 'mm', label: 'Minutes' },
			{ id: 'ss', label: 'Seconds' },
			{ id: 'hhmm', label: 'hh:mm' },
			{ id: 'sign', label: 'Sign' },
			{ id: 'ms', label: 'Milliseconds' },
			{ id: 'nice', label: 'smallest unit' },
		],
		default: defaultValues ?? ['combine'],
		width: 4,
	}
}

let timeVariableConfig: Record<string, TimeDisplayTypes[]> = {}

export function createTimeVariablesFromConfig(config: OntimeConfig): CompanionVariableDefinition[] {
	const result = new Array<CompanionVariableDefinition>()
	timeVariableConfig = {}
	Object.entries(config)
		.filter(([key, _]) => key.startsWith('time_variable_'))
		.forEach(([configId, value]) => {
			const id = configId.split('time_variable_')[1]
			timeVariableConfig[id] = value
		})

	Object.entries(timeVariableConfig).forEach(([id, value]) => {
		const { description } = TIME_VARIABLES[id as TimerVariableKeys]
		return result.push(...createTimeVariables(description, id, value))
	})

	return result
}

export function getTimeVariableUpdate(id: TimerVariableKeys, value: number | null): CompanionVariableValues {
	const variableValues: CompanionVariableValues = {}
	const splitTime = msToSplitTime(value)
	timeVariableConfig[id].forEach((type) => {
		variableValues[id + timeDisplayLabels[type].extension] = splitTime[type]
	})
	return variableValues
}
