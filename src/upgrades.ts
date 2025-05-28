/* eslint-disable @typescript-eslint/no-unsafe-enum-comparison */
import type {
	// CreateConvertToBooleanFeedbackUpgradeScript,
	CompanionStaticUpgradeProps,
	CompanionStaticUpgradeResult,
	CompanionUpgradeContext,
	// type InputValue,
	CompanionStaticUpgradeScript,
	CompanionMigrationAction,
	CompanionMigrationFeedback,
} from '@companion-module/base'
import type { OntimeConfig } from './config.js'
import { feedbackId, ActionId, deprecatedActionId, deprecatedFeedbackId } from './enums.js'
import { TimerPhase } from './v3/ontime-types.js'

function update2x4x0(
	_context: CompanionUpgradeContext<OntimeConfig>,
	props: CompanionStaticUpgradeProps<OntimeConfig>,
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
				feedback.feedbackId = deprecatedFeedbackId.TimerMessageVisible
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
				feedback.feedbackId = deprecatedFeedbackId.TimerMessageVisible
				result.updatedFeedbacks.push(feedback)
			}
		}
	}

	return result
}

function update3x4x0(
	_context: CompanionUpgradeContext<OntimeConfig>,
	props: CompanionStaticUpgradeProps<OntimeConfig>,
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
		for (const feedback of props.feedbacks) {
			if (feedback.feedbackId === deprecatedFeedbackId.ColorRunning) {
				feedback.feedbackId = feedbackId.ColorPlayback
				feedback.options.state = 'play'
				result.updatedFeedbacks.push(feedback)
			} else if (feedback.feedbackId === deprecatedFeedbackId.ColorPaused) {
				feedback.feedbackId = feedbackId.ColorPlayback
				feedback.options.state = 'pause'
				result.updatedFeedbacks.push(feedback)
			} else if (feedback.feedbackId === deprecatedFeedbackId.ColorStopped) {
				feedback.feedbackId = feedbackId.ColorPlayback
				feedback.options.state = 'stop'
				result.updatedFeedbacks.push(feedback)
			} else if (feedback.feedbackId === deprecatedFeedbackId.ColorRoll) {
				feedback.feedbackId = feedbackId.ColorPlayback
				feedback.options.state = 'roll'
				result.updatedFeedbacks.push(feedback)
			} else if (feedback.feedbackId === feedbackId.ColorAddRemove) {
				if (!('direction' in feedback.options)) {
					feedback.options.direction = 'both'
					result.updatedFeedbacks.push(feedback)
				}
			} else if (feedback.feedbackId === deprecatedFeedbackId.LowerMessageVisible) {
				feedback.feedbackId = feedbackId.MessageVisible
				feedback.options.source = 'lower'
				feedback.options.reqText = false
				result.updatedFeedbacks.push(feedback)
			} else if (feedback.feedbackId === deprecatedFeedbackId.PublicMessageVisible) {
				feedback.feedbackId = feedbackId.MessageVisible
				feedback.options.source = 'public'
				feedback.options.reqText = false
				result.updatedFeedbacks.push(feedback)
			} else if (feedback.feedbackId === deprecatedFeedbackId.ThisTimerMessageVisible) {
				feedback.feedbackId = feedbackId.MessageVisible
				feedback.options.source = 'timer'
				feedback.options.reqText = true
				feedback.options.text = feedback.options.msg
				delete feedback.options.msg
				result.updatedFeedbacks.push(feedback)
			} else if (feedback.feedbackId === deprecatedFeedbackId.TimerMessageVisible) {
				feedback.feedbackId = feedbackId.MessageVisible
				feedback.options.source = 'timer'
				feedback.options.reqText = false
				result.updatedFeedbacks.push(feedback)
			} else if (feedback.feedbackId === deprecatedFeedbackId.ColorNegative) {
				feedback.feedbackId = feedbackId.TimerPhase
				feedback.options.state = [TimerPhase.Overtime]
				result.updatedFeedbacks.push(feedback)
			}
		}
	}

	return result
}

function update4xx(
	_context: CompanionUpgradeContext<OntimeConfig>,
	props: CompanionStaticUpgradeProps<OntimeConfig>,
): CompanionStaticUpgradeResult<OntimeConfig> {
	const result = {
		updatedConfig: null,
		updatedActions: new Array<CompanionMigrationAction>(),
		updatedFeedbacks: new Array<CompanionMigrationFeedback>(),
	}

	for (const feedback of props.feedbacks) {
		if (feedback.feedbackId === deprecatedFeedbackId.TimerZone) {
			feedback.feedbackId = feedbackId.TimerPhase

			switch (feedback.options.zone) {
				case '': {
					feedback.options.phase = [TimerPhase.None]
					break
				}
				case 'normal': {
					feedback.options.phase = [TimerPhase.Default]
					break
				}
				case 'warning': {
					feedback.options.phase = [TimerPhase.Warning]
					break
				}
				case 'danger': {
					feedback.options.phase = [TimerPhase.Danger]
					break
				}
				case 'overtime': {
					feedback.options.phase = [TimerPhase.Overtime]
					break
				}
			}
			delete feedback.options.zone
			result.updatedFeedbacks.push(feedback)
		}
	}
	return result
}

function update46x(
	_context: CompanionUpgradeContext<OntimeConfig>,
	props: CompanionStaticUpgradeProps<OntimeConfig>,
): CompanionStaticUpgradeResult<OntimeConfig> {
	const result: CompanionStaticUpgradeResult<OntimeConfig> = {
		updatedConfig: null,
		updatedActions: new Array<CompanionMigrationAction>(),
		updatedFeedbacks: new Array<CompanionMigrationFeedback>(),
	}
	if (props.config) {
		const { host, port } = props.config
		if (port) {
			const newAddress = `${host}:${port}`
			result.updatedConfig = { ...props.config, host: newAddress, port: null }
		}
	}
	return result
}

function update462(
	_context: CompanionUpgradeContext<OntimeConfig>,
	props: CompanionStaticUpgradeProps<OntimeConfig>,
): CompanionStaticUpgradeResult<OntimeConfig> {
	const result: CompanionStaticUpgradeResult<OntimeConfig> = {
		updatedConfig: null,
		updatedActions: new Array<CompanionMigrationAction>(),
		updatedFeedbacks: new Array<CompanionMigrationFeedback>(),
	}

	for (const action of props.actions) {
		if (action.actionId === deprecatedActionId.Reload) {
			action.actionId = ActionId.Load
			action.options.method = 'loaded'
			result.updatedActions.push(action)
		}
	}

	return result
}

export const UpgradeScripts: CompanionStaticUpgradeScript<OntimeConfig>[] = [
	update2x4x0,
	update3x4x0,
	update4xx,
	update46x,
	update462,
]
