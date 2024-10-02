import { Playback, TimerPhase } from './ontime-types'
import { RuntimeStore, SimpleDirection, SimplePlayback } from './ontime-types'

const stateobj: RuntimeStore = {
	clock: 0,
	timer: {
		current: null,
		elapsed: null,
		expectedFinish: null,
		addedTime: 0,
		startedAt: null,
		finishedAt: null,
		secondaryTimer: null,
		duration: null,
		phase: TimerPhase.None,
		playback: Playback.Stop,
	},
	onAir: false,
	message: {
		timer: { text: '', visible: false, blink: false, blackout: false, secondarySource: null },
		external: '',
	},
	runtime: {
		numEvents: 0,
		selectedEventIndex: 0,
		offset: 0,
		plannedStart: 0,
		actualStart: 0,
		plannedEnd: 0,
		expectedEnd: 0,
	},
	eventNow: null,
	eventNext: null,
	currentBlock: { block: null, startedAt: null },
	auxtimer1: {
		duration: 0,
		current: 0,
		playback: SimplePlayback.Stop,
		direction: SimpleDirection.CountDown,
	},
}

export { stateobj }
