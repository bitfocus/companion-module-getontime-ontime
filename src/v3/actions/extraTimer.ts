import { CompanionActionDefinition, CompanionActionEvent } from '@companion-module/base'
import { socketSendJson } from '../connection'
import { ActionId } from '../../enums'
import { OntimeV3 } from '../ontimev3'
import { ActionCommand } from './commands'
import { RuntimeStore, SimpleDirection, SimplePlayback, SimpleTimerState } from '../ontime-types'

export function createExtraTimerActions(ontime: OntimeV3): { [id: string]: CompanionActionDefinition } {
	function togglePlayState(action: CompanionActionEvent): void {
		const id = action.options.destination as string
		const timer = ontime.state[('timer' + id) as keyof RuntimeStore] as SimpleTimerState

		if (action.options.value === 'toggleSS') {
			socketSendJson(ActionCommand.ExtraTimer, {
				[id]: timer.playback === SimplePlayback.Start ? SimplePlayback.Stop : SimplePlayback.Start,
			})
			return
		}

		if (action.options.value === 'toggleSP') {
			socketSendJson(ActionCommand.ExtraTimer, {
				[id]: timer.playback === SimplePlayback.Start ? SimplePlayback.Pause : SimplePlayback.Start,
			})
			return
		}

		socketSendJson(ActionCommand.ExtraTimer, { [id]: action.options.value })
	}

	function duration(action: CompanionActionEvent): void {
		const id = action.options.destination as string
		const { hours, minutes, seconds } = action.options
		const val = (Number(hours) * 60 + Number(minutes)) * 60 + Number(seconds)
		socketSendJson(ActionCommand.ExtraTimer, { [id]: { duration: val } })
	}

	return {
		[ActionId.ExtraTimerPlayState]: {
			name: 'Start/Stop/Pause the extra timer',
			options: [
				{
					type: 'dropdown',
					choices: [{ id: '1', label: 'Extra Timer 1' }],
					default: '1',
					id: 'destination',
					label: 'Select Extra Timer',
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
		[ActionId.ExtraTimerDuration]: {
			name: 'Set the extra timer duration',
			options: [
				{
					type: 'dropdown',
					choices: [{ id: '1', label: 'Extra Timer 1' }],
					default: '1',
					id: 'destination',
					label: 'Select Extra Timer',
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
		[ActionId.ExtraTimerDirection]: {
			name: 'Set the extra timer direction',
			options: [
				{
					type: 'dropdown',
					choices: [{ id: '1', label: 'Extra Timer 1' }],
					default: '1',
					id: 'destination',
					label: 'Select Extra Timer',
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
				socketSendJson(ActionCommand.ExtraTimer, { [options.destination as string]: { direction: options.direction } }),
		},
	}
}
