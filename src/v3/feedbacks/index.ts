import { CompanionFeedbackDefinition, CompanionFeedbackDefinitions } from '@companion-module/base'
import { OntimeV3 } from '../ontimev3'
import { createPlaybackFeedbacks } from './playback'
import { createMessageFeedbacks } from './message'
import { createTimerZoneFeedback } from './timerZone'

export function feedbacks(ontime: OntimeV3): CompanionFeedbackDefinitions {
	const feedbacks: { [id: string]: CompanionFeedbackDefinition | undefined } = {
		...createPlaybackFeedbacks(ontime),
		...createMessageFeedbacks(ontime),
		...createTimerZoneFeedback(ontime),
	}

	return feedbacks
}
