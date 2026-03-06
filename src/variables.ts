import type { CompanionVariableDefinitions } from '@companion-module/base'
import { variableId } from './enums.js'
import type { CustomFields } from '@getontime/resolver'

const timerVariables: CompanionVariableDefinitions = {
	[variableId.TimerCurrent]: { name: 'Current timer (milliseconds)' },
	[variableId.TimerCurrentHMS]: { name: 'Current timer (HH:mm:ss)' },
	[variableId.TimerCurrentN]: { name: 'Current timer (Negative sign)' },
	[variableId.TimerCurrentH]: { name: 'Current timer (HH)' },
	[variableId.TimerCurrentM]: { name: 'Current timer (mm)' },
	[variableId.TimerCurrentS]: { name: 'Current timer (ss)' },
	[variableId.TimerDuration]: { name: 'Timer duration (milliseconds)' },
	[variableId.TimerAdded]: { name: 'User added time to current timer (milliseconds)' },
	[variableId.TimerPhase]: { name: 'Current timer phase (None/Default/Warning/Danger/Overtime/Pending)' },
	[variableId.PlayState]: { name: 'Playback state (Running, Paused, Stopped, Roll)' },
	[variableId.TimerExpectedFinish]: { name: 'Expected finish of the current timer (milliseconds)' },
}

const messageVariables: CompanionVariableDefinitions = {
	[variableId.MessageText]: { name: 'Message text' },
	[variableId.MessageVisible]: { name: 'Message Visible' },
	[variableId.MessageBlink]: { name: 'Message Blinking' },
	[variableId.MessageBlackout]: { name: 'Message Blackout' },
	[variableId.MessageSecondarySource]: { name: 'Secondary Message source' },
	[variableId.MessageSecondary]: { name: 'Secondary Message' },
}

const rundownVariables: CompanionVariableDefinitions = {
	[variableId.TotalEvents]: { name: 'Total number of events' },
	[variableId.SelectedIndex]: { name: 'Selected event index' },
}

const offsetVariables: CompanionVariableDefinitions = {
	[variableId.Offset]: { name: 'Offset aka Over/Under (milliseconds)' },
	[variableId.ExpectedGroupEnd]: { name: 'Expected end time of current group (milliseconds)' },
	[variableId.ExpectedRundownEnd]: { name: 'Expected end time of rundown (milliseconds)' },
	[variableId.ExpectedFlagStart]: { name: 'Expected start time of next flagged event (milliseconds)' },
}

/**
 * CustomField variables for an event `event_[infix]_custom_[data]`
 */
function generateCustomFieldVariables(
	name: string,
	infix: string,
	customFields: CustomFields,
): CompanionVariableDefinitions {
	const customVariables: CompanionVariableDefinitions = {}
	if (customFields) {
		for (const customId in customFields) {
			const { label } = customFields[customId]
			customVariables[variableGen('event', infix, 'custom', customId)] = {
				name: `Custom value "${label}" value of ${name} event`,
			}
		}
	}
	return customVariables
}

/**
 * event variables as split into `event_[infix]_[data]`
 */
function generateEventVariables(name: string, infix: string, customFields: CustomFields): CompanionVariableDefinitions {
	return {
		[variableGen('event', infix, 'id')]: { name: `ID of ${name} event` },
		[variableGen('event', infix, 'title')]: { name: `Title of ${name} event` },
		[variableGen('event', infix, 'note')]: { name: `Note of ${name} event` },
		[variableGen('event', infix, 'cue')]: { name: `Cue of ${name} event` },
		...generateCustomFieldVariables(name, infix, customFields),
	}
}

/**
 * group variables as split into `group_[infix]_[data]`
 */
function generateGroupVariables(name: string, infix: string, customFields: CustomFields): CompanionVariableDefinitions {
	return {
		[variableGen('group', infix, 'id')]: { name: `ID of ${name} group` },
		[variableGen('group', infix, 'title')]: { name: `Title of ${name} group` },
		[variableGen('group', infix, 'note')]: { name: `Note of ${name} group` },
		...generateCustomFieldVariables(name, infix, customFields),
	}
}

/**
 * aux timer variables as split into `aux_[index]_[data]`
 */
function generateAuxTimerVariables(infix: string): CompanionVariableDefinitions {
	return {
		[variableGen('aux', infix, 'duration')]: { name: `Aux timer ${infix} duration (milliseconds)` },
		[variableGen('aux', infix, 'current')]: { name: `Aux timer ${infix} current (milliseconds)` },
		[variableGen('aux', infix, 'playback')]: { name: `Aux timer ${infix} playback` },
		[variableGen('aux', infix, 'direction')]: { name: `Aux timer ${infix} direction (count-up/count-down)` },
	}
}

/**
 * Generates variables
 */
export function generateVariables(customFields: CustomFields): CompanionVariableDefinitions {
	return {
		[variableId.Clock]: {
			name: 'Wall Clock (milliseconds)',
		},
		...timerVariables,
		...messageVariables,
		...rundownVariables,
		...offsetVariables,
		...generateEventVariables('current', 'now', customFields),
		...generateEventVariables('next', 'next', customFields),
		...generateEventVariables('previous', 'prev', customFields),
		...generateEventVariables('flag', 'flag', customFields),
		...generateGroupVariables('current', 'now', customFields),
		...generateAuxTimerVariables('1'),
		...generateAuxTimerVariables('2'),
		...generateAuxTimerVariables('3'),
	}
}

type item = 'event' | 'aux' | 'group'

type prop = {
	aux: 'duration' | 'current' | 'playback' | 'direction'
	event: 'id' | 'title' | 'note' | 'cue' | 'custom'
	group: 'id' | 'title' | 'note' | 'custom'
}

/**
 * A helper function that ensures spelling and correct combinations for generated variables
 */
export function variableGen<T extends item>(item: T, infix: string, prop: prop[T], extra?: string): string {
	if (extra) return `${item}_${infix}_${prop}_${extra}`
	return `${item}_${infix}_${prop}`
}
