import { CompanionFeedbackDefinition, CompanionFeedbackDefinitions } from '@companion-module/base'
import { OntimeV2 } from '../ontimev2'
import { createPlaybackFeedbackss } from './playback'

export function feedbacks(ontime: OntimeV2): CompanionFeedbackDefinitions {
	const feedbacks: { [id: string]: CompanionFeedbackDefinition | undefined } = {
		...createPlaybackFeedbackss(ontime),
	}

	return feedbacks
}
