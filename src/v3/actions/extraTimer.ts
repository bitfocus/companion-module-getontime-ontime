import { CompanionActionDefinition, CompanionActionEvent } from '@companion-module/base'
import { socketSendJson } from '../connection'
import { ActionId } from '../../enums'
import { OntimeV3 } from '../ontimev3'
import { ActionCommand } from './commands'
import { RuntimeStore, SimplePlayback, SimpleTimerState } from '../ontime-types'

export function createExtraTimerActions(ontime: OntimeV3): { [id: string]: CompanionActionDefinition } {
	function togglePlayState(action: CompanionActionEvent) {
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
	}
}
