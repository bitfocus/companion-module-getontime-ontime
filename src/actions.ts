import { createPlaybackActions } from './actions/playback.js'
import { createMessageActions } from './actions/message.js'
import { createChangeActions } from './actions/change.js'
import { createAuxTimerActions } from './actions/auxTimer.js'
import type { OntimeModule } from './index.js'
import type { CompanionActionDefinitions } from '@companion-module/base'

/**
 * Returns all implemented actions.
 */
export function generateActions(module: OntimeModule): CompanionActionDefinitions {
	return {
		...createMessageActions(module.ontime),
		...createPlaybackActions(module),
		...createChangeActions(module),
		...createAuxTimerActions(module),
	}
}
