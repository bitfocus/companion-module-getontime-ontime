import { OffsetMode, runtimeStorePlaceholder } from '@getontime/resolver'
import type {
	CustomFields,
	MessageState,
	Offset,
	OntimeEvent,
	OntimeGroup,
	RundownState,
	RuntimeStore,
	SimpleTimerState,
	TimerState,
} from '@getontime/resolver'
import type { OntimeModule } from './index.js'
import { feedbackId, variableId } from './enums.js'
import type { CompanionVariableValues } from '@companion-module/base'
import { generateVariables, variableGen } from './variables.js'
import { generateActions } from './actions.js'

/**
 * state handles all changes to ontime state and any side effects arising form that
 * via setters and getters
 */
export default class OntimeState {
	private state = structuredClone(runtimeStorePlaceholder) as RuntimeStore
	private _customFields: CustomFields = {}
	private _events: OntimeEvent[] = []

	private pendingVariables: CompanionVariableValues = {}

	private hasPendingActionDefinition: boolean = false
	private hasPendingVariableDefinition: boolean = false

	public helper = {
		offset: 0,
	}

	constructor(private module: OntimeModule) {}

	public applyPendingVariableDefinition(force = false): void {
		if (this.hasPendingVariableDefinition || force) {
			this.module.setVariableDefinitions(generateVariables(this._customFields))
		}
	}

	public applyPendingActionDefinition(force = false): void {
		if (this.hasPendingActionDefinition || force) {
			this.module.setActionDefinitions(generateActions(this.module))
		}
	}

	private appendVariableUpdate(values: CompanionVariableValues): void {
		Object.assign(this.pendingVariables, values)
	}

	public applyPendingVariables(): void {
		if (Object.keys(this.pendingVariables).length > 0) {
			this.module.setVariableValues(this.pendingVariables)
			this.pendingVariables = {}
		}
	}

	private updateEvent(val: OntimeEvent | null, infix: 'now' | 'next' | 'flag') {
		const companionVariableValues: CompanionVariableValues = {}
		Object.keys(this.customFields).forEach((customKey) => {
			companionVariableValues[variableGen('event', infix, 'custom', customKey)] =
				!val || !val.custom ? undefined : val.custom[customKey]
		})
		this.appendVariableUpdate({
			...companionVariableValues,
			[variableGen('event', infix, 'title')]: val?.title,
			[variableGen('event', infix, 'note')]: val?.note,
			[variableGen('event', infix, 'cue')]: val?.cue,
			[variableGen('event', infix, 'id')]: val?.id,
		})

		this.module.checkFeedbacks(feedbackId.CustomFieldsValue)
	}

	private updateGroup(val: OntimeGroup | null, infix: 'now') {
		const companionVariableValues: CompanionVariableValues = {}
		Object.keys(this.customFields).forEach((customKey) => {
			companionVariableValues[variableGen('group', infix, 'custom', customKey)] =
				!val || !val.custom ? undefined : val.custom[customKey]
		})
		this.appendVariableUpdate({
			...companionVariableValues,
			[variableGen('group', infix, 'title')]: val?.title,
			[variableGen('group', infix, 'note')]: val?.note,
			[variableGen('group', infix, 'id')]: val?.id,
		})

		this.module.checkFeedbacks(feedbackId.CustomFieldsValue)
	}

	private updateAuxTimer(val: SimpleTimerState, infix: '1' | '2' | '3') {
		this.appendVariableUpdate({
			[variableGen('aux', infix, 'duration')]: val.duration,
			[variableGen('aux', infix, 'current')]: val.current,
			[variableGen('aux', infix, 'playback')]: val.playback,
			[variableGen('aux', infix, 'direction')]: val.direction,
		})
		this.module.checkFeedbacks(feedbackId.AuxTimerNegative, feedbackId.AuxTimerPlayback)
	}

	/** Wall Clock */
	get clock(): number {
		return this.state.clock
	}
	set clock(val: number | undefined) {
		if (val === undefined) return
		this.state.clock = val
		this.appendVariableUpdate({ [variableId.Clock]: val })
	}

	/** Event Timer */
	get timer(): TimerState {
		return this.state.timer
	}
	set timer(val: TimerState | undefined) {
		if (val === undefined) return
		this.state.timer = val
		this.appendVariableUpdate({
			[variableId.TimerCurrent]: val.current ?? undefined,
			[variableId.TimerDuration]: val.duration ?? undefined,
			[variableId.TimerAdded]: val.addedTime,
			[variableId.TimerPhase]: val.phase,
			[variableId.PlayState]: val.playback,
			[variableId.TimerExpectedFinish]: val.expectedFinish ?? undefined,
		})

		this.module.checkFeedbacks(
			feedbackId.ColorPlayback,
			feedbackId.ColorAddRemove,
			feedbackId.TimerPhase,
			feedbackId.TimerProgressBar,
			feedbackId.TimerProgressBarMulti,
		)
	}

	/** Message controller */
	get message(): MessageState {
		return this.state.message
	}
	set message(val: MessageState | undefined) {
		if (val === undefined) return
		this.state.message = val
		this.appendVariableUpdate({
			[variableId.MessageText]: val.timer.text,
			[variableId.MessageVisible]: val.timer.visible,
			[variableId.MessageBlink]: val.timer.blink,
			[variableId.MessageBlackout]: val.timer.blackout,
			[variableId.MessageSecondarySource]: val.timer.secondarySource as string,
			[variableId.MessageSecondary]: val.secondary,
		})

		this.module.checkFeedbacks(
			feedbackId.MessageVisible,
			feedbackId.TimerBlackout,
			feedbackId.TimerBlink,
			feedbackId.MessageSecondarySourceVisible,
		)
	}

	/** Rundown */
	get rundown(): RundownState {
		return this.state.rundown
	}
	set rundown(val: RundownState | undefined) {
		if (val === undefined) return
		this.state.rundown = val
		this.appendVariableUpdate({
			[variableId.TotalEvents]: val.numEvents,
			[variableId.SelectedIndex]: val.selectedEventIndex ?? undefined,
		})
	}

	/** Offset */
	get offset(): Offset {
		return this.state.offset
	}
	set offset(val: Offset | undefined) {
		if (val === undefined) return
		this.state.offset = val
		this.helper.offset = val.mode === OffsetMode.Absolute ? val.absolute : val.relative
		this.appendVariableUpdate({
			[variableId.Offset]: this.helper.offset,
		})
		this.module.checkFeedbacks(feedbackId.RundownOffset)
	}

	/** Event Now */
	get eventNow(): OntimeEvent | null {
		return this.state.eventNow
	}
	set eventNow(val: OntimeEvent | null | undefined) {
		if (val === undefined) return
		this.state.eventNow = val
		this.updateEvent(val, 'now')
	}

	/** Event Next */
	get eventNext(): OntimeEvent | null {
		return this.state.eventNow
	}
	set eventNext(val: OntimeEvent | null | undefined) {
		if (val === undefined) return
		this.state.eventNext = val
		this.updateEvent(val, 'next')
	}

	/** Event Flag */
	get eventFlag(): OntimeEvent | null {
		return this.state.eventFlag
	}
	set eventFlag(val: OntimeEvent | null | undefined) {
		if (val === undefined) return
		this.state.eventFlag = val
		this.updateEvent(val, 'flag')
	}

	/** Group Now */
	get groupNow(): OntimeGroup | null {
		return this.state.groupNow
	}
	set groupNow(val: OntimeGroup | null | undefined) {
		if (val === undefined) return
		this.state.groupNow = val
		this.updateGroup(val, 'now')
	}

	/** Auxtimer 1 */
	get auxtimer1(): SimpleTimerState {
		return this.state.auxtimer1
	}
	set auxtimer1(val: SimpleTimerState | undefined) {
		if (val === undefined) return
		this.state.auxtimer1 = val
		this.updateAuxTimer(val, '1')
	}

	/** Auxtimer 2 */
	get auxtimer2(): SimpleTimerState {
		return this.state.auxtimer2
	}
	set auxtimer2(val: SimpleTimerState | undefined) {
		if (val === undefined) return
		this.state.auxtimer2 = val
		this.updateAuxTimer(val, '2')
	}

	/** Auxtimer 3 */
	get auxtimer3(): SimpleTimerState {
		return this.state.auxtimer3
	}
	set auxtimer3(val: SimpleTimerState | undefined) {
		if (val === undefined) return
		this.state.auxtimer3 = val
		this.updateAuxTimer(val, '3')
	}

	/** Custom fields */
	get customFields(): CustomFields {
		return this._customFields
	}
	set customFields(val: CustomFields) {
		this._customFields = val
		this.hasPendingActionDefinition = true
		this.module.setActionDefinitions(generateActions(this.module))
	}

	/** Events */
	get events(): OntimeEvent[] {
		return this._events
	}
	set events(val: OntimeEvent[]) {
		this._events = val
		this.hasPendingActionDefinition = true
		this.module.setActionDefinitions(generateActions(this.module))
	}
}
