import {
	// CreateConvertToBooleanFeedbackUpgradeScript,
	type CompanionStaticUpgradeProps,
	type CompanionStaticUpgradeResult,
	type CompanionUpgradeContext,
	// type InputValue,
	type CompanionStaticUpgradeScript,
	type CompanionMigrationAction,
	type CompanionMigrationFeedback,
} from '@companion-module/base'
import type { OntimeConfig } from './config'
import { feedbackId, ActionId, deprecatedActionId } from './enums'

function update2x4x0(
	_context: CompanionUpgradeContext<OntimeConfig>,
	props: CompanionStaticUpgradeProps<OntimeConfig>
): CompanionStaticUpgradeResult<OntimeConfig> {
	const result = {
		updatedConfig: null,
		updatedActions: new Array<CompanionMigrationAction>(),
		updatedFeedbacks: new Array<CompanionMigrationFeedback>(),
	}
	if (_context.currentConfig.version === 'v1') {
		for (const action of props.actions) {
			if (action.actionId === 'setSpeakerMessageVisibility') {
				action.actionId = deprecatedActionId.SetTimerMessageVisibility
				result.updatedActions.push(action)
			} else if (action.actionId === 'setSpeakerMessage') {
				action.actionId = deprecatedActionId.SetTimerMessage
				result.updatedActions.push(action)
			} else if (action.actionId === 'delay') {
				action.actionId = ActionId.Add
				result.updatedActions.push(action)
			}
		}
		for (const feedback of props.feedbacks) {
			if (feedback.feedbackId === 'speakerMessageVisible') {
				feedback.feedbackId = feedbackId.TimerMessageVisible
				result.updatedFeedbacks.push(feedback)
			}
		}
	} else if (_context.currentConfig.version === 'v2') {
		for (const action of props.actions) {
			if (action.actionId === 'setSpeakerMessageVisibility') {
				action.actionId = deprecatedActionId.SetTimerMessageVisibility
				result.updatedActions.push(action)
			} else if (action.actionId === 'setSpeakerMessage') {
				action.actionId = deprecatedActionId.SetTimerMessage
				result.updatedActions.push(action)
			} else if (action.actionId === 'delay') {
				action.actionId = ActionId.Add
				action.options.addremove = (action.options.value as number) >= 0 ? 'add' : 'remove'
				action.options.minutes = Math.abs(action.options.value as number)
				action.options.hours = 0
				action.options.seconds = 0
				result.updatedActions.push(action)
			}
		}
		for (const feedback of props.feedbacks) {
			if (feedback.feedbackId === 'speakerMessageVisible') {
				feedback.feedbackId = feedbackId.TimerMessageVisible
				result.updatedFeedbacks.push(feedback)
			}
		}
	}

	return result
}

function update3x4x0(
	_context: CompanionUpgradeContext<OntimeConfig>,
	props: CompanionStaticUpgradeProps<OntimeConfig>
): CompanionStaticUpgradeResult<OntimeConfig> {
	const result = {
		updatedConfig: null,
		updatedActions: new Array<CompanionMigrationAction>(),
		updatedFeedbacks: new Array<CompanionMigrationFeedback>(),
	}
	if (_context.currentConfig.version === 'v2') {
		for (const action of props.actions) {
			if (action.actionId === ActionId.Change) {
				if ('val' in action.options) {
					action.options.properties = [String(action.options.property)]
					action.options[String(action.options.property)] = action.options.val
					if (action.options.eventId === 'selected') {
						action.options.method = 'loaded'
					} else if (action.options.eventId === 'next') {
						action.options.method = 'next'
					} else {
						action.options.method = 'list'
						action.options.eventList = action.options.eventId
					}
					delete action.options.eventId
					delete action.options.property
					delete action.options.val
					result.updatedActions.push(action)
				}
			} else if (action.actionId === deprecatedActionId.LoadIndex) {
				action.actionId = ActionId.Load
				action.options.method = 'index'
				action.options.eventIndex = action.options.value
				delete action.options.value
				result.updatedActions.push(action)
			} else if (action.actionId === deprecatedActionId.Previous) {
				action.actionId = ActionId.Load
				action.options.method = 'previous'
				result.updatedActions.push(action)
			} else if (action.actionId === deprecatedActionId.Next) {
				action.actionId = ActionId.Load
				action.options.method = 'next'
				result.updatedActions.push(action)
			} else if (action.actionId === deprecatedActionId.LoadSelect) {
				action.actionId = ActionId.Load
				action.options.method = 'list'
				action.options.eventList = action.options.value
				delete action.options.value
				result.updatedActions.push(action)
			} else if (action.actionId === deprecatedActionId.LoadCue) {
				action.actionId = ActionId.Load
				action.options.method = 'cue'
				action.options.eventCue = action.options.value
				delete action.options.value
				result.updatedActions.push(action)
			} else if (action.actionId === deprecatedActionId.LoadId) {
				action.actionId = ActionId.Load
				action.options.method = 'id'
				action.options.eventId = action.options.value
				delete action.options.value
				result.updatedActions.push(action)
			} else if (action.actionId === deprecatedActionId.StartIndex) {
				action.actionId = ActionId.Start
				action.options.method = 'index'
				action.options.eventIndex = action.options.value
				delete action.options.value
				result.updatedActions.push(action)
			} else if (action.actionId === deprecatedActionId.StartSelect) {
				action.actionId = ActionId.Start
				action.options.method = 'list'
				action.options.eventList = action.options.value
				delete action.options.value
				result.updatedActions.push(action)
			} else if (action.actionId === deprecatedActionId.StartCue) {
				action.actionId = ActionId.Start
				action.options.method = 'cue'
				action.options.eventCue = action.options.value
				delete action.options.value
				result.updatedActions.push(action)
			} else if (action.actionId === deprecatedActionId.StartId) {
				action.actionId = ActionId.Start
				action.options.method = 'id'
				action.options.eventId = action.options.value
				delete action.options.value
				result.updatedActions.push(action)
			} else if (action.actionId === deprecatedActionId.StartNext) {
				action.actionId = ActionId.Start
				action.options.method = 'next'
				result.updatedActions.push(action)
			} else if (action.actionId === ActionId.Start) {
				if (!('method' in action.options)) {
					action.options.method = 'loaded'
					result.updatedActions.push(action)
				}
			} else if (action.actionId === deprecatedActionId.SetTimerMessageVisibility) {
				action.actionId = ActionId.MessageVisibility
				action.options.destination = 'timer'
				result.updatedActions.push(action)
			} else if (action.actionId === deprecatedActionId.SetPublicMessageVisibility) {
				action.actionId = ActionId.MessageVisibility
				action.options.destination = 'public'
				result.updatedActions.push(action)
			} else if (action.actionId === deprecatedActionId.SetLowerMessageVisibility) {
				action.actionId = ActionId.MessageVisibility
				action.options.destination = 'lower'
				result.updatedActions.push(action)
			} else if (action.actionId === deprecatedActionId.SetTimerMessage) {
				action.actionId = ActionId.MessageText
				action.options.destination = 'timer'
				result.updatedActions.push(action)
			} else if (action.actionId === deprecatedActionId.SetPublicMessage) {
				action.actionId = ActionId.MessageText
				action.options.destination = 'public'
				result.updatedActions.push(action)
			} else if (action.actionId === deprecatedActionId.SetLowerMessage) {
				action.actionId = ActionId.MessageText
				action.options.destination = 'lower'
				result.updatedActions.push(action)
			} else if (action.actionId === deprecatedActionId.SetTimerBlackout) {
				action.actionId = ActionId.TimerBlackout
				result.updatedActions.push(action)
			} else if (action.actionId === deprecatedActionId.SetTimerBlink) {
				action.actionId = ActionId.TimerBlink
				result.updatedActions.push(action)
			}
		}
	}

	return result
}

export const UpgradeScripts: CompanionStaticUpgradeScript<OntimeConfig>[] = [update2x4x0, update3x4x0]
