import { createPlaybackActions, type PlaybackActionsSchema } from './actions/playback.js'
import { createMessageActions, type MessageActionsSchema } from './actions/message.js'
import { type ChangeActionsSchema, createChangeActions } from './actions/change.js'
import { type AuxTimerActionsSchema, createAuxTimerActions } from './actions/auxTimer.js'
import type { OntimeModule } from './index.js'
import type { CompanionActionDefinitions } from '@companion-module/base'

export type ActionsSchema = MessageActionsSchema & AuxTimerActionsSchema & ChangeActionsSchema & PlaybackActionsSchema

/**
 * Returns all implemented actions.
 */
export function generateActions(module: OntimeModule): CompanionActionDefinitions<ActionsSchema> {
	return {
		...createMessageActions(module.connection),
		...createPlaybackActions(module),
		...createChangeActions(module),
		...createAuxTimerActions(module),
	}
}
