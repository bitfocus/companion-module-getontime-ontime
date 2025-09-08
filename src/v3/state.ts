import { Playback, TimerPhase, SimpleDirection, SimplePlayback, OffsetMode } from '@getontime/types'
import type { RuntimeStore } from '@getontime/types'

const stateobj: RuntimeStore = {
	clock: 0,
	timer: {
		current: null,
		elapsed: null,
		expectedFinish: null,
		addedTime: 0,
		startedAt: null,
		secondaryTimer: null,
		duration: null,
		phase: TimerPhase.None,
		playback: Playback.Stop,
	},
	message: {
		timer: { text: '', visible: false, blink: false, blackout: false, secondarySource: null },
		secondary: '',
	},
	offset: {
		absolute: 0,
		relative: 0,
		mode: OffsetMode.Absolute,
		expectedGroupEnd: null,
		expectedRundownEnd: null,
		expectedFlagStart: null,
	},
	rundown: {
		numEvents: 0,
		selectedEventIndex: 0,
		plannedStart: 0,
		actualStart: 0,
		plannedEnd: null,
	},
	eventNow: null,
	eventNext: null,
	groupNow: null,
	auxtimer1: {
		duration: 0,
		current: 0,
		playback: SimplePlayback.Stop,
		direction: SimpleDirection.CountDown,
	},
	auxtimer2: {
		duration: 0,
		current: 0,
		playback: SimplePlayback.Stop,
		direction: SimpleDirection.CountDown,
	},
	auxtimer3: {
		duration: 0,
		current: 0,
		playback: SimplePlayback.Stop,
		direction: SimpleDirection.CountDown,
	},
	eventFlag: null,
	ping: 0,
}

export { stateobj }
