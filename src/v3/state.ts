import { Playback, TimerZone } from './ontime-types'
import { RuntimeStore, SimpleDirection, SimplePlayback } from './ontime-types'

const stateobj: RuntimeStore & { companionSpecific: { timerZone: TimerZone } } = {
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
		playback: Playback.Stop,
	},
	onAir: false,
	message: {
		timer: { text: '', visible: false, blink: false, blackout: false },
		external: { text: '', visible: false },
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
	auxtimer1: {
		duration: 0,
		current: 0,
		playback: SimplePlayback.Stop,
		direction: SimpleDirection.CountDown,
	},
	companionSpecific: {
		timerZone: TimerZone.None,
	},
}

export { stateobj }
