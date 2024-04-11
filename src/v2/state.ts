import { Playback, TimerZone } from '../common/ontime-types'
import { RuntimeStore } from './ontime-types'

const stateobj: RuntimeStore & { companionSpecific: { timerZone: TimerZone } } = {
	timer: {
		clock: 0,
		current: null,
		elapsed: null,
		expectedFinish: null,
		addedTime: 0,
		startedAt: null,
		finishedAt: null,
		secondaryTimer: null,
		selectedEventId: null,
		duration: null,
		timerType: null,
		endAction: null,
	},
	playback: Playback.Stop,
	timerMessage: { text: '', visible: false, timerBlink: false, timerBlackout: false },
	publicMessage: { text: '', visible: false },
	lowerMessage: { text: '', visible: false },
	externalMessage: { text: '', visible: false },
	onAir: false,
	loaded: {
		selectedEventIndex: null,
		selectedEventId: null,
		selectedPublicEventId: null,
		nextEventId: null,
		nextPublicEventId: null,
		numEvents: 0,
	},
	eventNow: null,
	publicEventNow: null,
	eventNext: null,
	publicEventNext: null,
	companionSpecific: {
		timerZone: TimerZone.None,
	},
}

export { stateobj }
