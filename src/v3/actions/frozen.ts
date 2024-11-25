import { CompanionActionDefinition } from '@companion-module/base'
import { socketSendJson } from '../connection'
import { ActionId } from '../../enums'
import { OntimeV3 } from '../ontimev3'
import { ToggleOnOff } from '../../utilities'
import { ActionCommand } from './commands'

export function createFreezeActions(ontime: OntimeV3): { [id: string]: CompanionActionDefinition } {
	return {
		[ActionId.Freeze]: {
			name: 'Toggle/On/Off freeze rundown',
			options: [
				{
					type: 'dropdown',
					choices: [
						{ id: ToggleOnOff.Toggle, label: 'Toggle' },
						{ id: ToggleOnOff.On, label: 'On' },
						{ id: ToggleOnOff.Off, label: 'Off' },
					],
					default: 2,
					id: 'value',
					label: 'Action',
				},
			],
			callback: (action) => {
				const value = action.options.value as ToggleOnOff
				const freeze = value === ToggleOnOff.Toggle ? !ontime.state.frozen : value
				socketSendJson(ActionCommand.Freeze, freeze)
			},
		},
	}
}
