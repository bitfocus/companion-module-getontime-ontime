import { CompanionActionDefinition, CompanionActionDefinitions } from '@companion-module/base'

import { deprecatedActionId } from '../../enums'
import { socketSendJson } from '../connection'

import { OntimeV2 } from '../ontimev2'

import { createChangeActions } from './change'
import { ActionCommand } from './commands'
import { createMessageActions } from './message'
import { createPlaybackActions } from './playback'

/**
 * Returns all implemented actions.
 * @param self reference to the BaseInstance
 * @param ontime reference to the Ontime versiond
 * @constructor
 * @returns CompanionActions
 */
export function actions(ontime: OntimeV2): CompanionActionDefinitions {
	const actions: { [id: string]: CompanionActionDefinition } = {
		...createChangeActions(ontime),
		...createPlaybackActions(ontime),
		...createMessageActions(ontime),
		[deprecatedActionId.SetOnAir]: {
			name: 'Toggle/On/Off On Air',
			options: [
				{
					type: 'dropdown',
					choices: [
						{ id: 2, label: 'Toggle' },
						{ id: 1, label: 'On' },
						{ id: 0, label: 'Off' },
					],
					default: 2,
					id: 'value',
					label: 'On Air',
				},
			],
			callback: (action) => {
				const val = action.options.value === 2 ? !ontime.state.onAir : action.options.value
				socketSendJson(ActionCommand.SetOnAir, val)
			},
		},
	}
	return actions
}
