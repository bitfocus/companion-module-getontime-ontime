/* eslint-disable @typescript-eslint/no-unsafe-enum-comparison */
import {
	type CompanionStaticUpgradeProps,
	type CompanionStaticUpgradeResult,
	type CompanionUpgradeContext,
	type CompanionStaticUpgradeScript,
	type CompanionMigrationAction,
	type CompanionMigrationFeedback,
	EmptyUpgradeScript,
} from '@companion-module/base'
import type { OntimeConfig } from './config.js'
import { feedbackId, deprecatedFeedbackId } from './enums.js'
import { TimerPhase } from '@getontime/resolver'
import { tryOffsetIsInvertedFeedback } from './feedbacks/offset.js'
import { tryChangeTimeWithExpression, tryRemoveIsPublic } from './actions/change.js'
import { tryAuxTimerDurationTakesExpressions } from './actions/auxTimer.js'
import { tryCollectMessageActions } from './actions/message.js'

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

type old_v4_config = {
	host: string
	port: string | null
	ssl: boolean
	version: string
	refetchEvents: boolean
	customToVariable: boolean
	reconnect: boolean
	reconnectInterval: number
}

function update46x(
	_context: CompanionUpgradeContext<OntimeConfig>,
	props: CompanionStaticUpgradeProps<old_v4_config | OntimeConfig>,
): CompanionStaticUpgradeResult<OntimeConfig> {
	const result: CompanionStaticUpgradeResult<OntimeConfig> = {
		updatedConfig: null,
		updatedActions: new Array<CompanionMigrationAction>(),
		updatedFeedbacks: new Array<CompanionMigrationFeedback>(),
	}

	if (props.config === null) {
		return result
	}

	if ('port' in props.config) {
		const { host, port } = props.config

		const newAddress = `${host}:${port}`
		result.updatedConfig = { ...props.config, host: newAddress }
		return result
	}
	return result
}

function update5(
	_context: CompanionUpgradeContext<OntimeConfig | old_v4_config>,
	props: CompanionStaticUpgradeProps<OntimeConfig | old_v4_config>,
): CompanionStaticUpgradeResult<OntimeConfig> {
	const result: CompanionStaticUpgradeResult<OntimeConfig> = {
		updatedConfig: null,
		updatedActions: new Array<CompanionMigrationAction>(),
		updatedFeedbacks: new Array<CompanionMigrationFeedback>(),
	}

	for (const feedback of props.feedbacks) {
		if (feedback.feedbackId === feedbackId.ColorPlayback) {
			if (typeof feedback.options.state === 'string') {
				feedback.options.state = [feedback.options.state]
				result.updatedFeedbacks.push(feedback)
			}
		}
		if (feedback.feedbackId === feedbackId.TimerPhase) {
			if (typeof feedback.options.phase === 'string') {
				feedback.options.phase = [feedback.options.phase]
				result.updatedFeedbacks.push(feedback)
			}
		}
		if (feedback.feedbackId === feedbackId.AuxTimerNegative) {
			if (!feedback.options.destination) {
				feedback.options.destination = 'auxtimer1'
				result.updatedFeedbacks.push(feedback)
			}
		}

		if (feedback.feedbackId === feedbackId.AuxTimerPlayback) {
			if (!feedback.options.destination) {
				feedback.options.destination = 'auxtimer1'
				result.updatedFeedbacks.push(feedback)
			}
		}
	}

	if ('ssl' in _context.currentConfig) {
		const host = new URL(_context.currentConfig.host)
		host.protocol = _context.currentConfig.ssl ? 'https' : 'http'
		result.updatedConfig = { host: _context.currentConfig.host }
	}

	return result
}

function ActionUpdater(
	tryUpdate: (action: CompanionMigrationAction) => boolean,
): CompanionStaticUpgradeScript<OntimeConfig> {
	return (_context: CompanionUpgradeContext<OntimeConfig>, props: CompanionStaticUpgradeProps<OntimeConfig>) => {
		return {
			updatedActions: props.actions.filter(tryUpdate),
			updatedConfig: null,
			updatedFeedbacks: [],
		}
	}
}

function FeedbackUpdater(
	tryUpdate: (feedback: CompanionMigrationFeedback) => boolean,
): CompanionStaticUpgradeScript<OntimeConfig> {
	return (_context: CompanionUpgradeContext<OntimeConfig>, props: CompanionStaticUpgradeProps<OntimeConfig>) => {
		return {
			updatedActions: [],
			updatedConfig: null,
			updatedFeedbacks: props.feedbacks.filter(tryUpdate),
		}
	}
}

// function ConfigUpdater(
// 	tryUpdate: (config: OntimeConfig | null) => boolean,
// ): CompanionStaticUpgradeScript<OntimeConfig> {
// 	return (_context: CompanionUpgradeContext<OntimeConfig>, props: CompanionStaticUpgradeProps<OntimeConfig>) => {
// 		return {
// 			updatedActions: [],
// 			updatedConfig: tryUpdate(props.config) ? props.config : null,
// 			updatedFeedbacks: [],
// 		}
// 	}
// }

export const UpgradeScripts: CompanionStaticUpgradeScript<OntimeConfig>[] = [
	EmptyUpgradeScript,
	EmptyUpgradeScript,
	update4xx,
	update46x,
	update5,
	FeedbackUpdater(tryOffsetIsInvertedFeedback),
	ActionUpdater(tryRemoveIsPublic),
	ActionUpdater(tryChangeTimeWithExpression),
	ActionUpdater(tryAuxTimerDurationTakesExpressions),
	ActionUpdater(tryCollectMessageActions),
]
