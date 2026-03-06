import { createPlaybackFeedbacks, type PlaybackFeedbackSchema } from './feedbacks/playback.js'
import { createMessageFeedbacks, type MessageFeedbackSchema } from './feedbacks/message.js'
import { createTimerPhaseFeedback, type TimerPhaseFeedbackSchema } from './feedbacks/timerPhase.js'
import { createOffsetFeedbacks, type OffsetFeedbackSchema } from './feedbacks/offset.js'
import { type AuxTimerFeedbacksSchema, createAuxTimerFeedbacks } from './feedbacks/auxTimer.js'
import { createProgressFeedbacks, type ProgressFeedbackSchema } from './feedbacks/progress.js'
import { createCustomFieldsFeedbacks, type CustomFieldsFeedbacksSchema } from './feedbacks/customFields.js'
import type { OntimeModule } from './index.js'
import type { CompanionFeedbackDefinitions } from '@companion-module/base'

export type FeedbackSchema = PlaybackFeedbackSchema &
	MessageFeedbackSchema &
	TimerPhaseFeedbackSchema &
	ProgressFeedbackSchema &
	OffsetFeedbackSchema &
	AuxTimerFeedbacksSchema &
	CustomFieldsFeedbacksSchema

/**
 * Returns all implemented feedbacks.
 */
export function generateFeedbacks(module: OntimeModule): CompanionFeedbackDefinitions<FeedbackSchema> {
	return {
		...createPlaybackFeedbacks(module.connection.state),
		...createMessageFeedbacks(module.connection.state),
		...createTimerPhaseFeedback(module.connection.state),
		...createProgressFeedbacks(module.connection.state),
		...createOffsetFeedbacks(module.connection.state),
		...createAuxTimerFeedbacks(module.connection.state),
		...createCustomFieldsFeedbacks(module.connection.state),
	}
}
