import type {
	CompanionActionContext,
	CompanionActionDefinition,
	CompanionActionEvent,
	CompanionMigrationAction,
} from '@companion-module/base'
import { ActionId } from '../enums.js'
import { SimplePlayback, SimpleDirection } from '@getontime/resolver'
import type { OntimeModule } from '../index.js'
import { strictTimerStringToMs } from '../utilities.js'

export function createAuxTimerActions(module: OntimeModule): { [id: string]: CompanionActionDefinition } {
	function togglePlayState(action: CompanionActionEvent): void {
		const id = action.options.destination as '1' | '2' | '3'
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

	async function duration(action: CompanionActionEvent, context: CompanionActionContext): Promise<void> {
		const id = action.options.destination as '1' | '2' | '3'
		const durationString = await context.parseVariablesInString(action.options.duration as string)
		const maybeNumber = Number(durationString)
		const duration = isNaN(maybeNumber) ? strictTimerStringToMs(durationString) : maybeNumber
		if (duration === null) {
			module.log('error', `Invalid value in aux timer duration: ${durationString}`)
			return
		}
		module.connection.sendSocket('auxtimer', { [id]: { duration } })
	}

	function addTime(action: CompanionActionEvent): void {
		const id = action.options.destination as '1' | '2' | '3'
		const { hours, minutes, seconds, addremove } = action.options as {
			hours: number
			minutes: number
			seconds: number
			addremove: 'add' | 'remove'
		}
		const val = ((hours * 60 + minutes) * 60 + seconds) * 1000 * (addremove == 'remove' ? -1 : 1)
		module.connection.sendSocket('auxtimer', { [id]: { addtime: val } })
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
					],
					label: 'Add or Remove',
					default: 'add',
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
				},
			],
			callback: addTime,
		},
	}
}

export function tryAuxTimerDurationTakesExpressions(action: CompanionMigrationAction): boolean {
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
