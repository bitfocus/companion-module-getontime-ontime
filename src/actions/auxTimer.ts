import type { CompanionActionDefinitions, CompanionActionEvent, CompanionMigrationAction } from '@companion-module/base'
import { ActionId } from '../enums.js'
import { SimplePlayback, SimpleDirection } from '@getontime/resolver'
import type { OntimeModule } from '../index.js'
import { hmsValuesToMs, stringNumberOrFormatted } from '../utilities.js'

type AuxIds = '1' | '2' | '3'

type AuxPlayStateValues = {
	destination: AuxIds
	value: 'toggleSS' | 'toggleSP' | SimplePlayback.Start | SimplePlayback.Stop | SimplePlayback.Pause
}
type AuxDurationValues = {
	duration: string
	destination: AuxIds
}

type AuxDirectionValues = {
	direction: SimpleDirection.CountDown | SimpleDirection.CountUp
	destination: AuxIds
}

type AuxAddValues = {
	hours: number
	minutes: number
	seconds: number
	addremove: 'add' | 'remove' | 'string'
	stringValue: string
	destination: AuxIds
}

export type AuxTimerActionsSchema = {
	[ActionId.AuxTimerPlayState]: { options: AuxPlayStateValues }
	[ActionId.AuxTimerDuration]: { options: AuxDurationValues }
	[ActionId.AuxTimerDirection]: { options: AuxDirectionValues }
	[ActionId.AuxTimerAdd]: { options: AuxAddValues }
}

export function createAuxTimerActions(module: OntimeModule): CompanionActionDefinitions<AuxTimerActionsSchema> {
	function togglePlayState(action: CompanionActionEvent<AuxPlayStateValues>): void {
		const id = action.options.destination
		const timer = module.connection.state[`auxtimer${id}`]
		if (action.options.value === 'toggleSS') {
			module.connection.sendSocket('auxtimer', {
				[id]: timer.playback === SimplePlayback.Start ? SimplePlayback.Stop : SimplePlayback.Start,
			})
			return
		}

		if (action.options.value === 'toggleSP') {
			module.connection.sendSocket('auxtimer', {
				[id]: timer.playback === SimplePlayback.Start ? SimplePlayback.Pause : SimplePlayback.Start,
			})
			return
		}

		module.connection.sendSocket('auxtimer', { [id]: action.options.value as SimplePlayback })
	}

	function duration(action: CompanionActionEvent<AuxDurationValues>): void {
		const { duration, destination } = action.options
		const maybeNumber = stringNumberOrFormatted(duration)
		if (maybeNumber !== null) {
			module.connection.sendSocket('auxtimer', { [destination]: { duration: maybeNumber } })
		} else {
			module.log('warn', `failed to format value in aux duration action: ${duration}`)
		}
	}

	function addTime(action: CompanionActionEvent<AuxAddValues>): void {
		const { hours, minutes, seconds, addremove, stringValue, destination } = action.options
		if (addremove === 'string') {
			const maybeNumber = stringNumberOrFormatted(stringValue)
			if (maybeNumber !== null) {
				module.connection.sendSocket('auxtimer', { [destination]: { addtime: maybeNumber } })
			} else {
				module.log('warn', `failed to format value in aux addTime action: ${stringValue}`)
			}
		} else {
			const val = hmsValuesToMs(hours, minutes, seconds) * (addremove == 'remove' ? -1 : 1)
			module.connection.sendSocket('auxtimer', { [destination]: { addtime: val } })
		}
	}

	return {
		[ActionId.AuxTimerPlayState]: {
			name: 'Start/Stop/Pause the aux timer',
			options: [
				{
					type: 'dropdown',
					choices: [
						{ id: '1', label: 'Aux Timer 1' },
						{ id: '2', label: 'Aux Timer 2' },
						{ id: '3', label: 'Aux Timer 3' },
					],
					default: '1',
					id: 'destination',
					label: 'Select Aux Timer',
				},
				{
					type: 'dropdown',
					choices: [
						{ id: 'toggleSS', label: 'Toggle Start/Stop' },
						{ id: 'toggleSP', label: 'Toggle Start/Pause' },
						{ id: SimplePlayback.Start, label: 'Start' },
						{ id: SimplePlayback.Stop, label: 'Stop' },
						{ id: SimplePlayback.Pause, label: 'Pause' },
					],
					default: SimplePlayback.Start,
					id: 'value',
					label: 'Action',
				},
			],
			callback: togglePlayState,
		},
		[ActionId.AuxTimerDuration]: {
			name: 'Set the aux timer duration',
			options: [
				{
					type: 'dropdown',
					choices: [
						{ id: '1', label: 'Aux Timer 1' },
						{ id: '2', label: 'Aux Timer 2' },
						{ id: '3', label: 'Aux Timer 3' },
					],
					default: '1',
					id: 'destination',
					label: 'Select Aux Timer',
				},
				{
					type: 'textinput',
					id: 'duration',
					label: 'Duration',
					default: '00:00:00',
					tooltip: 'Either as a straight number in ms or formatted "hh:mm:ss"',
					useVariables: true,
					minLength: 1,
				},
			],
			callback: duration,
		},
		[ActionId.AuxTimerDirection]: {
			name: 'Set the aux timer direction',
			options: [
				{
					type: 'dropdown',
					choices: [
						{ id: '1', label: 'Aux Timer 1' },
						{ id: '2', label: 'Aux Timer 2' },
						{ id: '3', label: 'Aux Timer 3' },
					],
					default: '1',
					id: 'destination',
					label: 'Select Aux Timer',
				},
				{
					type: 'dropdown',
					choices: [
						{ id: SimpleDirection.CountDown, label: 'Count Down' },
						{ id: SimpleDirection.CountUp, label: 'Count Up' },
					],
					default: SimpleDirection.CountDown,
					id: 'direction',
					label: 'Direction',
				},
			],
			callback: ({ options }) =>
				module.connection.sendSocket('auxtimer', {
					[options.destination]: { direction: options.direction },
				}),
		},
		[ActionId.AuxTimerAdd]: {
			name: 'Add / remove time to aux timer',
			options: [
				{
					type: 'dropdown',
					choices: [
						{ id: '1', label: 'Aux Timer 1' },
						{ id: '2', label: 'Aux Timer 2' },
						{ id: '3', label: 'Aux Timer 3' },
					],
					default: '1',
					id: 'destination',
					label: 'Select Aux Timer',
				},
				{
					id: 'addremove',
					type: 'dropdown',
					choices: [
						{ id: 'add', label: 'Add Time' },
						{ id: 'remove', label: 'Remove Time' },
						{ id: 'string', label: 'Expression/Text' },
					],
					label: 'Add or Remove',
					default: 'add',
					disableAutoExpression: true,
				},
				{
					type: 'textinput',
					id: 'stringValue',
					label: 'Value',
					useVariables: true,
					default: '00:00:00',
					minLength: 1,
					tooltip: 'Either as a straight number in ms or formatted "hh:mm:ss"',
					isVisibleExpression: '$(options:addremove) === "string"',
				},
				{
					type: 'number',
					id: 'hours',
					label: 'Hours',
					default: 0,
					step: 1,
					min: 0,
					max: 24,
					isVisibleExpression: '$(options:addremove) !== "string"',
				},
				{
					type: 'number',
					id: 'minutes',
					label: 'Minutes',
					default: 1,
					step: 1,
					min: 0,
					max: 1440,
					isVisibleExpression: '$(options:addremove) !== "string"',
				},
				{
					type: 'number',
					id: 'seconds',
					label: 'Seconds',
					default: 0,
					min: 0,
					max: 86400,
					step: 1,
					isVisibleExpression: '$(options:addremove) !== "string"',
				},
			],
			callback: addTime,
		},
	}
}

/**
 * v5.4.1 ensure value in add time string
 */
export function upgrade_auxTimerAddTimeString(action: CompanionMigrationAction): boolean {
	if (action.actionId !== `${ActionId.AuxTimerAdd}`) return false
	if (action.options.stringValue?.value) return false
	action.options.stringValue = { isExpression: false, value: '00:00:00' }
	return true
}

/**
 * v5.0.0 allow user expressions in auxtimer actions
 */
export function upgrade_auxTimerDurationTakesExpressions(action: CompanionMigrationAction): boolean {
	if (action.actionId !== `${ActionId.AuxTimerDuration}`) return false
	if (!action.options.hours || !action.options.minutes || !action.options.seconds) return false

	const hours = action.options.hours.value as string
	const minutes = action.options.minutes.value as string
	const seconds = action.options.seconds.value as string
	action.options.duration = {
		isExpression: false,
		value: `${hours?.toString().padStart(2, '0')}:${minutes?.toString().padStart(2, '0')}:${seconds?.toString().padStart(2, '0')}`,
	}
	delete action.options.hours
	delete action.options.minutes
	delete action.options.seconds
	return true
}
