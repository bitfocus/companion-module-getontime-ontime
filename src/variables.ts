import type { CompanionVariableDefinition } from '@companion-module/base'
import { variableId } from './enums.js'
import type { CustomFields } from '@getontime/resolver'

const timerVariables: CompanionVariableDefinition[] = [
	{
		name: 'Current timer (milliseconds)',
		variableId: variableId.TimerCurrent,
	},
	{
		name: 'Timer duration (milliseconds)',
		variableId: variableId.TimerDuration,
	},
	{
		name: 'User added time to current event (milliseconds)',
		variableId: variableId.TimerAdded,
	},
	{
		name: 'Current timer phase (None/Default/Warning/Danger/Overtime/Pending)',
		variableId: variableId.TimerPhase,
	},

	{
		name: 'Playback state (Running, Paused, Stopped, Roll)',
		variableId: variableId.PlayState,
	},
]

const messageVariables: CompanionVariableDefinition[] = [
	{
		name: 'Message text',
		variableId: variableId.MessageText,
	},
	{
		name: 'Message Visible',
		variableId: variableId.MessageVisible,
	},
	{
		name: 'Message Blinking',
		variableId: variableId.MessageBlink,
	},
	{
		name: 'Message Blackout',
		variableId: variableId.MessageBlackout,
	},
	{
		name: 'Secondary Message source',
		variableId: variableId.MessageSecondarySource,
	},
	{
		name: 'Secondary Message',
		variableId: variableId.MessageSecondary,
	},
]

const rundownVariables: CompanionVariableDefinition[] = [
	{
		name: 'Total number of events',
		variableId: variableId.TotalEvents,
	},
	{
		name: 'Selected event index',
		variableId: variableId.SelectedIndex,
	},
]

const offsetVariables: CompanionVariableDefinition[] = [
	{
		name: 'Offset aka Over/Under (milliseconds)',
		variableId: variableId.Offset,
	},
]

const eventVariables: (name: string, infix: string, customFields: CustomFields) => CompanionVariableDefinition[] = (
	name: string,
	infix: string,
	customFields?: CustomFields,
) => {
	const customVariables: CompanionVariableDefinition[] = customFields
		? Object.entries(customFields).map(([customId, custom]) => {
				return {
					name: `Custom value "${custom.label}" value of ${name} event`,
					variableId: variableGen('event', infix, 'custom', customId),
				}
			})
		: []

	return [
		{
			name: `ID of ${name} event`,
			variableId: variableGen('event', infix, 'id'),
		},
		{
			name: `Title of ${name} event`,
			variableId: variableGen('event', infix, 'title'),
		},
		{
			name: `Note of ${name} event`,
			variableId: variableGen('event', infix, 'note'),
		},
		{
			name: `Cue of ${name} event`,
			variableId: variableGen('event', infix, 'cue'),
		},
		...customVariables,
	]
}

/**
 * aut timer variables as split into `aux_[index]_[data]`
 * @param infix
 * @returns variable definitions
 */
const auxTimerVariables: (infix: string) => CompanionVariableDefinition[] = (infix: string) => {
	return [
		{
			name: `Aux timer ${infix} duration (milliseconds)`,
			variableId: variableGen('aux', infix, 'duration'),
		},
		{
			name: `Aux timer ${infix} current (milliseconds)`,
			variableId: variableGen('aux', infix, 'current'),
		},
		{
			name: `Aux timer ${infix} playback`,
			variableId: variableGen('aux', infix, 'playback'),
		},
		{
			name: `Aux timer ${infix} direction (count-up/count-down)`,
			variableId: variableGen('aux', infix, 'direction'),
		},
	]
}

/**
 * Generates variables
 * @param customFields include if they should be included
 * @returns
 */
export function generateVariables(customFields: CustomFields): CompanionVariableDefinition[] {
	return [
		{
			name: 'Wall Clock',
			variableId: variableId.Clock,
		},
		...timerVariables,
		...messageVariables,
		...rundownVariables,
		...offsetVariables,
		...eventVariables('current', 'now', customFields),
		...eventVariables('next', 'next', customFields),
		...eventVariables('previous', 'prev', customFields), //TODO: logic fot this
		...auxTimerVariables('1'),
		...auxTimerVariables('2'),
		...auxTimerVariables('3'),
		//TODO: add flag
		//TODO: replace current block with group
	]
}

type item = 'event' | 'aux'

type prop = {
	aux: 'duration' | 'current' | 'playback' | 'direction'
	event: 'id' | 'title' | 'note' | 'cue' | 'custom'
}

/**
 * A helper function that ensures spelling and correct combinations for generated variables
 * @param item
 * @param infix
 * @param prop
 * @param extra
 * @returns
 */
export function variableGen<T extends item>(item: T, infix: string, prop: prop[T], extra?: string): string {
	if (extra) return `${item}_${infix}_${prop}_${extra}`
	return `${item}_${infix}_${prop}`
}
