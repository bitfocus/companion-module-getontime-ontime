import { OnTimeInstance } from '../../index'
import { CompanionActionDefinition, CompanionActionDefinitions } from '@companion-module/base'

import { createPlaybackActions } from './playback'
import { createMessageActions } from './message'
import { createChangeActions } from './change'

/**
 * Returns all implemented actions.
 * @param self reference to the BaseInstance
 * @constructor
 * @returns CompanionActions
 */
export function actions(self: OnTimeInstance): CompanionActionDefinitions {
	const actions: { [id: string]: CompanionActionDefinition } = {
		...createMessageActions(self),
		...createPlaybackActions(self),
		...createChangeActions(self),
	}
	return actions
}
