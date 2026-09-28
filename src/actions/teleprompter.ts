import type { CompanionActionDefinitions } from '@companion-module/base'
import { ActionId } from '../enums.js'
import type { OntimeModule } from '../index.js'

export type TeleprompterActionsSchema = {
	[ActionId.TeleprompterTogglePlay]: {
		options: {
			value: 'toggle' | 'play' | 'pause'
		}
	}
	[ActionId.TeleprompterSetSpeed]: { options: { speed: number } }
	[ActionId.TeleprompterChangeSpeed]: { options: { speedBy: number } }
	[ActionId.TeleprompterScroll]: { options: { scroll: number } }
	[ActionId.TeleprompterMode]: { options: { mode: 'event' | 'script' | 'toggle' } }
}

export function createTeleprompterActions(module: OntimeModule): CompanionActionDefinitions<TeleprompterActionsSchema> {
	const connection = module.connection

	return {
		[ActionId.TeleprompterTogglePlay]: {
			name: 'Play/Pause/Toggle Teleprompter',
			options: [
				{
					type: 'dropdown',
					choices: [
						{ id: 'play', label: 'Start' },
						{ id: 'pause', label: 'Pause' },
						{ id: 'toggle', label: 'Toggle' },
					],
					default: 'toggle',
					id: 'value',
					label: 'Action',
				},
			],
			callback: (action) => {
				const { value } = action.options
				connection.sendSocket('teleprompter', value)
			},
		},
		[ActionId.TeleprompterSetSpeed]: {
			name: 'Set Speed Teleprompter',
			options: [
				{
					type: 'number',
					default: 10,
					id: 'speed',
					label: 'Speed',
					min: 1,
					max: 100,
					tooltip: 'Speed (Lines Per Minute)',
				},
			],
			callback: (action) => {
				const { speed } = action.options
				connection.sendSocket('teleprompter', { speed })
			},
		},
		[ActionId.TeleprompterChangeSpeed]: {
			name: 'Change Speed Teleprompter',
			options: [
				{
					type: 'number',
					default: 10,
					id: 'speedBy',
					label: 'Speed change',
					min: -50,
					max: 50,
				},
			],
			callback: (action) => {
				const { speedBy } = action.options
				connection.sendSocket('teleprompter', { speedBy })
			},
		},
		[ActionId.TeleprompterScroll]: {
			name: 'Scroll Teleprompter',
			options: [
				{
					type: 'number',
					default: 0.2,
					id: 'scroll',
					label: 'Lines',
					min: -10,
					max: 10,
					tooltip: 'Number of lines to scroll by',
				},
			],
			callback: (action) => {
				const { scroll } = action.options
				connection.sendSocket('teleprompter', { scroll })
			},
		},
		[ActionId.TeleprompterMode]: {
			name: 'Set Teleprompter Stop Mode',
			options: [
				{
					type: 'dropdown',
					choices: [
						{ id: 'event', label: 'Event' },
						{ id: 'script', label: 'Script' },
						{ id: 'toggle', label: 'Toggle' },
					],
					default: 'toggle',
					id: 'mode',
					label: 'Teleprompter Mode',
				},
			],
			callback: (action) => {
				const { mode } = action.options
				connection.sendSocket('teleprompter', { mode })
			},
		},
	}
}
