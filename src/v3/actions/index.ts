import { CompanionActionDefinition, CompanionActionDefinitions } from '@companion-module/base'

import { createPlaybackActions } from './playback'
import { createMessageActions } from './message'
import { createChangeActions } from './change'
import { OntimeV3 } from '../ontimev3'
import { createAuxTimerActions } from './extraTimer'

/**
 * Returns all implemented actions.
 * @param ontime reference to the Ontime versiond
 * @constructor
 * @returns CompanionActions
 */
export function actions(ontime: OntimeV3): CompanionActionDefinitions {
	const actions: { [id: string]: CompanionActionDefinition } = {
		...createMessageActions(ontime),
		...createPlaybackActions(ontime),
		...createChangeActions(ontime),
		...createAuxTimerActions(ontime),
	}
	return actions
}
