import { DropdownChoice } from '@companion-module/base'
import { OntimeEvent, RuntimeStore, SimpleTimerState, TimerZone } from './v3/ontime-types.js'
import { OntimeV3 } from './v3/ontimev3.js'

export const joinTime = (...args: string[]) => args.join(':')

function padTo2Digits(number: number) {
	return number.toString().padStart(2, '0')
}

const defaultTimerObject = {
	hours: '--',
	minutes: '--',
	seconds: '--',
	hoursMinutes: '--:--',
	hoursMinutesSeconds: '--:--:--',
	delayString: '0',
	negative: '',
}

type SplitTime = typeof defaultTimerObject

export function msToSplitTime(time: number | null): SplitTime {
	if (time === null) {
		return defaultTimerObject
	}
	let negative = false
	if (time < 0) {
		time = time * -1
		negative = true
	} else {
		negative = false
	}
	const s = Math.floor((time / 1000) % 60)
	const m = Math.floor((time / (1000 * 60)) % 60)
	const h = Math.floor((time / (1000 * 60 * 60)) % 24)

	const seconds = padTo2Digits(s)
	const minutes = padTo2Digits(m)
	const hours = padTo2Digits(h)
	const negativeSign = negative ? '-' : ''

	const hoursMinutes = `${hours}:${minutes}`
	const hoursMinutesSeconds = `${negativeSign}${hoursMinutes}:${seconds}`

	let delayString = '00'

	if (h && !m && !s) {
		delayString = `${negativeSign}${h}h`
	} else if (!h && m && !s) {
		delayString = `${negativeSign}${m}m`
	} else if (!h && !m && s) {
		delayString = `${negativeSign}${s}s`
	}

	return {
		hours,
		minutes,
		seconds,
		hoursMinutes,
		hoursMinutesSeconds,
		delayString,
		negative: negativeSign,
	}
}

export function eventsToChoices(events: OntimeEvent[]): DropdownChoice[] {
	return events.map(({ id, cue, title }) => {
		return { id, label: `${cue} | ${title}` }
	})
}

export function extractTimerZone(
	timer: number | null,
	currentEvent: { timeWarning: number; timeDanger: number } = { timeWarning: 2, timeDanger: 1 }
): TimerZone {
	if (timer === null) {
		return TimerZone.None
	}
	if (timer > currentEvent.timeWarning) {
		return TimerZone.Normal
	}
	if (timer > currentEvent.timeDanger) {
		return TimerZone.Warning
	}
	if (timer > 0) {
		return TimerZone.Danger
	}
	return TimerZone.Overtime
}

export function getAuxTimerState(ontime: OntimeV3, index = 'auxtimer1') {
	return ontime.state[index as keyof RuntimeStore] as unknown as SimpleTimerState
}
