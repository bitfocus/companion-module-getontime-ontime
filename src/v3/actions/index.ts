import { OnTimeInstance } from '../../index'
import { CompanionActionDefinition, CompanionActionDefinitions } from '@companion-module/base'

import { createPlaybackActions } from './playback'
import { createMessageActions } from './message'
import { createChangeActions } from './change'
import { OntimeV3 } from '../ontimev3'

/**
 * Returns all implemented actions.
 * @param self reference to the BaseInstance
 * @param ontime reference to the Ontime versiond
 * @constructor
 * @returns CompanionActions
 */
export function actions(self: OnTimeInstance, ontime: OntimeV3): CompanionActionDefinitions {
	const actions: { [id: string]: CompanionActionDefinition } = {
		...createMessageActions(self),
		...createPlaybackActions(self, ontime),
		...createChangeActions(ontime),
	}
	return actions
}
