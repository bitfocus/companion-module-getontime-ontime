import {
	type CompanionStaticUpgradeProps,
	type CompanionStaticUpgradeResult,
	type CompanionUpgradeContext,
	type CompanionStaticUpgradeScript,
	type CompanionMigrationAction,
	type CompanionMigrationFeedback,
	type JsonValue,
	type CompanionMigrationOptionValues,
	EmptyUpgradeScript,
} from '@companion-module/base'
import type { OntimeConfig } from './config.js'
import { feedbackId } from './enums.js'
import { upgrade_offsetIsInvertedFeedback } from './feedbacks/offset.js'
import { upgrade_changeTimeWithExpression, upgrade_removeIsPublic } from './actions/change.js'
import { upgrade_auxTimerAddTimeString, upgrade_auxTimerDurationTakesExpressions } from './actions/auxTimer.js'
import { upgrade_collectMessageActions, upgrade_ensureMessageActionDefaultValues } from './actions/message.js'
import { upgrade_collectMessageFeedback, upgrade_ensureMessageFeedbackDefaultValues } from './feedbacks/message.js'
import {
	upgrade_ensureAddRemoveTimeDefaultValue,
	upgrade_ensurePlaybackActionDefaultValues,
} from './actions/playback.js'

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

function update5(
	_context: CompanionUpgradeContext<OntimeConfig | old_v4_config>,
	props: CompanionStaticUpgradeProps<OntimeConfig | old_v4_config, undefined>,
): CompanionStaticUpgradeResult<OntimeConfig, undefined> {
	const result: CompanionStaticUpgradeResult<OntimeConfig, undefined> = {
		updatedConfig: null,
		updatedActions: new Array<CompanionMigrationAction>(),
		updatedFeedbacks: new Array<CompanionMigrationFeedback>(),
	}

	for (const feedback of props.feedbacks) {
		const id = feedback.feedbackId as feedbackId
		if (id === feedbackId.ColorPlayback) {
			if (feedback.options.state && typeof feedback.options.state.value === 'string') {
				feedback.options.state.value = [feedback.options.state.value]
				result.updatedFeedbacks.push(feedback)
			}
		}
		if (id === feedbackId.TimerPhase) {
			if (feedback.options.phase && typeof feedback.options.phase.value === 'string') {
				feedback.options.phase.value = [feedback.options.phase.value]
				result.updatedFeedbacks.push(feedback)
			}
		}
		if (id === feedbackId.AuxTimerNegative) {
			if (!feedback.options.destination) {
				feedback.options.destination = { isExpression: false, value: 'auxtimer1' }
				result.updatedFeedbacks.push(feedback)
			}
		}

		if (id === feedbackId.AuxTimerPlayback) {
			if (!feedback.options.destination) {
				feedback.options.destination = { isExpression: false, value: 'auxtimer1' }
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
	return (
		_context: CompanionUpgradeContext<OntimeConfig>,
		props: CompanionStaticUpgradeProps<OntimeConfig, undefined>,
	) => {
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
	return (
		_context: CompanionUpgradeContext<OntimeConfig>,
		props: CompanionStaticUpgradeProps<OntimeConfig, undefined>,
	) => {
		return {
			updatedActions: [],
			updatedConfig: null,
			updatedFeedbacks: props.feedbacks.filter(tryUpdate),
		}
	}
}

/**
 * Ensures a single migration option key uses the Companion 4.3+ wrapped shape
 * `{ value, isExpression }`. If the key is missing or the wrapped `value` is
 * undefined, sets it to `defaultValue` with `isExpression: false`.
 *
 * @param options - Action or feedback `options` object from an upgrade script
 * @param key - Option id to fill in
 * @param defaultValue - JSON-serializable default when unset
 * @returns `true` if `options` was modified, otherwise `false`
 */
export function ensureDefault(options: CompanionMigrationOptionValues, key: string, defaultValue: JsonValue): boolean {
	if (options[key] === undefined) {
		options[key] = { value: defaultValue, isExpression: false }
		return true
	}
	if (options[key].value === undefined) {
		options[key] = { value: defaultValue, isExpression: false }
		return true
	}
	return false
}

type EnsureObject = Record<string, JsonValue>

/**
 * Runs {@link ensureDefault} for each entry in `ensureObject`. Useful when an
 * upgrade step must backfill several option defaults at once.
 *
 * @param options - Action or feedback `options` object from an upgrade script
 * @param ensureObject - Map of option id → default value
 * @returns `true` if any key was updated, otherwise `false`
 */
export function ensureDefaultMultiple(options: CompanionMigrationOptionValues, ensureObject: EnsureObject): boolean {
	let upgrade = false
	Object.entries(ensureObject).forEach(([key, defaultValue]) => {
		upgrade = ensureDefault(options, key, defaultValue) || upgrade
	})
	return upgrade
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

export const upgradeScripts: CompanionStaticUpgradeScript<OntimeConfig>[] = [
	EmptyUpgradeScript,
	EmptyUpgradeScript,
	EmptyUpgradeScript,
	EmptyUpgradeScript,
	update5,
	FeedbackUpdater(upgrade_offsetIsInvertedFeedback),
	ActionUpdater(upgrade_removeIsPublic),
	ActionUpdater(upgrade_changeTimeWithExpression),
	ActionUpdater(upgrade_auxTimerDurationTakesExpressions),
	ActionUpdater(upgrade_collectMessageActions),
	FeedbackUpdater(upgrade_collectMessageFeedback),
	ActionUpdater(upgrade_auxTimerAddTimeString),
	ActionUpdater(upgrade_ensureMessageActionDefaultValues),
	FeedbackUpdater(upgrade_ensureMessageFeedbackDefaultValues),
	ActionUpdater(upgrade_ensurePlaybackActionDefaultValues),
	ActionUpdater(upgrade_ensureAddRemoveTimeDefaultValue),
]
