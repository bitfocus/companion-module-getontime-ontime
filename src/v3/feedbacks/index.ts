import type { CompanionFeedbackDefinition, CompanionFeedbackDefinitions } from '@companion-module/base'
import { OntimeV3 } from '../ontimev3.js'
import { createPlaybackFeedbacks } from './playback.js'
import { createMessageFeedbacks } from './message.js'
import { createTimerPhaseFeedback } from './timerPhase.js'
import { createOffsetFeedbacks } from './offset.js'
import { createAuxTimerFeedbacks } from './auxTimer.js'
import { createProgressFeedbacks } from './progress.js'
import { createCustomFieldsFeedbacks } from './customFields.js'

export function feedbacks(ontime: OntimeV3): CompanionFeedbackDefinitions {
	const feedbacks: { [id: string]: CompanionFeedbackDefinition | undefined } = {
		...createPlaybackFeedbacks(ontime),
		...createMessageFeedbacks(ontime),
		...createTimerPhaseFeedback(ontime),
		...createProgressFeedbacks(ontime),
		...createOffsetFeedbacks(ontime),
		...createAuxTimerFeedbacks(ontime),
		...createCustomFieldsFeedbacks(ontime),
	}

	return feedbacks
}
