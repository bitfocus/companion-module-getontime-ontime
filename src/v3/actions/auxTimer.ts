import { CompanionActionDefinition, CompanionActionEvent } from '@companion-module/base'
import { socketSendJson } from '../connection'
import { ActionId } from '../../enums'
import { OntimeV3 } from '../ontimev3'
import { ActionCommand } from './commands'
import { SimpleDirection, SimplePlayback } from '../ontime-types'
import { getAuxTimerState } from '../../utilities'

export function createAuxTimerActions(ontime: OntimeV3): { [id: string]: CompanionActionDefinition } {
	function togglePlayState(action: CompanionActionEvent): void {
		const id = (action.options.destination ?? '1') as string
		const timer = getAuxTimerState(ontime)
		if (action.options.value === 'toggleSS') {
			socketSendJson(ActionCommand.AuxTimer, {
				[id]: timer.playback === SimplePlayback.Start ? SimplePlayback.Stop : SimplePlayback.Start,
			})
			return
		}

		if (action.options.value === 'toggleSP') {
			socketSendJson(ActionCommand.AuxTimer, {
				[id]: timer.playback === SimplePlayback.Start ? SimplePlayback.Pause : SimplePlayback.Start,
			})
			return
		}

		socketSendJson(ActionCommand.AuxTimer, { [id]: action.options.value })
	}

	function duration(action: CompanionActionEvent): void {
		const id = action.options.destination as string
		const { hours, minutes, seconds } = action.options
		const val = (Number(hours) * 60 + Number(minutes)) * 60 + Number(seconds)
		socketSendJson(ActionCommand.AuxTimer, { [id]: { duration: val } })
	}

	function addTime(action: CompanionActionEvent): void {
		const id = action.options.destination as string
		const { hours, minutes, seconds, addremove } = action.options
		const val = ((Number(hours) * 60 + Number(minutes)) * 60 + Number(seconds)) * (addremove == 'remove' ? -1 : 1)
		socketSendJson(ActionCommand.AuxTimer, { [id]: { addtime: val } })
	}

	return {
		[ActionId.AuxTimerPlayState]: {
			name: 'Start/Stop/Pause the aux timer',
			options: [
				{
					type: 'dropdown',
					choices: [{ id: '1', label: 'Aux Timer 1' }],
					default: '1',
					id: 'destination',
					label: 'Select Aux Timer',
					isVisible: () => false, //This Stays hidden for now
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
					choices: [{ id: '1', label: 'Aux Timer 1' }],
					default: '1',
					id: 'destination',
					label: 'Select Aux Timer',
					isVisible: () => false, //This Stays hidden for now
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
			callback: duration,
		},
		[ActionId.AuxTimerDirection]: {
			name: 'Set the aux timer direction',
			options: [
				{
					type: 'dropdown',
					choices: [{ id: '1', label: 'Aux Timer 1' }],
					default: '1',
					id: 'destination',
					label: 'Select Aux Timer',
					isVisible: () => false, //This Stays hidden for now
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
				socketSendJson(ActionCommand.AuxTimer, { [options.destination as string]: { direction: options.direction } }),
		},
		[ActionId.AuxTimerAdd]: {
			name: 'Add / remove time to aux timer',
			options: [
				{
					type: 'dropdown',
					choices: [{ id: '1', label: 'Aux Timer 1' }],
					default: '1',
					id: 'destination',
					label: 'Select Aux Timer',
					isVisible: () => false, //This Stays hidden for now
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
