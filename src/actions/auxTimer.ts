import type { CompanionActionDefinition, CompanionActionEvent, CompanionMigrationAction } from '@companion-module/base'
import { ActionId } from '../enums.js'
import { SimplePlayback, SimpleDirection } from '@getontime/resolver'
import type { OntimeModule } from '../index.js'
import { hmsValuesToMs, stringNumberOrFormatted } from '../utilities.js'

type AuxIds = '1' | '2' | '3'

type AuxDurationOption = {
	duration: string
	destination: AuxIds
}

type AuxAddOption = {
	hours: number
	minutes: number
	seconds: number
	addremove: 'add' | 'remove' | 'string'
	stringValue: string
	destination: AuxIds
}

export function createAuxTimerActions(module: OntimeModule): { [id: string]: CompanionActionDefinition } {
	function togglePlayState(action: CompanionActionEvent): void {
		const id = action.options.destination as AuxIds
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

	function duration(action: CompanionActionEvent): void {
		const { duration, destination } = action.options as AuxDurationOption
		const maybeNumber = stringNumberOrFormatted(duration)
		if (maybeNumber !== null) {
			module.connection.sendSocket('auxtimer', { [destination]: { duration: maybeNumber } })
		} else {
			module.log('warn', `failed to format value in aux duration action: ${duration}`)
		}
	}

	function addTime(action: CompanionActionEvent): void {
		const { hours, minutes, seconds, addremove, stringValue, destination } = action.options as AuxAddOption
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
					required: true,
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
					[options.destination as '1']: { direction: options.direction as SimpleDirection },
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
				},
				{
					type: 'textinput',
					id: 'stringValue',
					label: 'Value',
					useVariables: true,
					required: true,
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
					required: true,
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
					required: true,
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
					required: true,
					isVisibleExpression: '$(options:addremove) !== "string"',
				},
			],
			callback: addTime,
		},
	}
}

/**
 * v5.0.0 allow user expressions in auxtimer actions
 */
export function upgrade_auxTimerDurationTakesExpressions(action: CompanionMigrationAction): boolean {
	if (action.actionId !== `${ActionId.AuxTimerDuration}`) {
		return false
	}
	const { hours, minutes, seconds } = action.options
	action.options.duration =
		hours?.toString().padStart(2, '0') +
		':' +
		minutes?.toString().padStart(2, '0') +
		':' +
		seconds?.toString().padStart(2, '0')

	return true
}
