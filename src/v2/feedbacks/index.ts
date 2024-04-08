import { CompanionFeedbackDefinition, CompanionFeedbackDefinitions } from '@companion-module/base'
import { OntimeV2 } from '../ontimev2'
import { createPlaybackFeedbacks } from './playback'
import { createMessageFeedbacks } from './message'

export function feedbacks(ontime: OntimeV2): CompanionFeedbackDefinitions {
	const feedbacks: { [id: string]: CompanionFeedbackDefinition | undefined } = {
		...createPlaybackFeedbacks(ontime),
		...createMessageFeedbacks(ontime),
	}

	return feedbacks
}
