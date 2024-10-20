import { CompanionFeedbackDefinition, CompanionFeedbackDefinitions } from '@companion-module/base'
import { OntimeV3 } from '../ontimev3'
import { createPlaybackFeedbacks } from './playback'
import { createMessageFeedbacks } from './message'
import { createTimerPhaseFeedback } from './timerPhase'
import { createOffsetFeedbacks } from './offset'
import { createAuxTimerFeedbacks } from './auxTimer'
import { createProgressFeedbacks } from './progress'
import { createCustomFieldsFeedbacks } from './customFields'

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
