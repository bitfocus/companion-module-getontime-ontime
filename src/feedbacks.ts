import type { CompanionFeedbackDefinitions } from '@companion-module/base'
import { createPlaybackFeedbacks } from './feedbacks/playback.js'
import { createMessageFeedbacks } from './feedbacks/message.js'
import { createTimerPhaseFeedback } from './feedbacks/timerPhase.js'
import { createOffsetFeedbacks } from './feedbacks/offset.js'
import { createAuxTimerFeedbacks } from './feedbacks/auxTimer.js'
import { createProgressFeedbacks } from './feedbacks/progress.js'
import { createCustomFieldsFeedbacks } from './feedbacks/customFields.js'
import type { OntimeModule } from './index.js'

/**
 * Returns all implemented feedbacks.
 */
export function generateFeedbacks(module: OntimeModule): CompanionFeedbackDefinitions {
	return {
		...createPlaybackFeedbacks(module.ontime.state),
		...createMessageFeedbacks(module.ontime.state),
		...createTimerPhaseFeedback(module.ontime.state),
		...createProgressFeedbacks(module.ontime.state),
		...createOffsetFeedbacks(module.ontime.state),
		...createAuxTimerFeedbacks(module.ontime.state),
		...createCustomFieldsFeedbacks(module.ontime.state),
	}
}
