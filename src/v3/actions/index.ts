import type { CompanionActionDefinition, CompanionActionDefinitions } from '@companion-module/base'

import { createPlaybackActions } from './playback.js'
import { createMessageActions } from './message.js'
import { createChangeActions } from './change.js'
import { OntimeV3 } from '../../ontimev3.js'
import { createAuxTimerActions } from './auxTimer.js'

/**
 * Returns all implemented actions.
 * @param ontime reference to the Ontime version
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
