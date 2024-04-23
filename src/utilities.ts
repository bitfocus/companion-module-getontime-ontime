import { DropdownChoice } from '@companion-module/base'
import { OntimeEvent, TimerZone } from './v3/ontime-types.js'

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
	const hours = (negative ? '-' : '') + padTo2Digits(h)

	const hoursMinutes = `${hours}:${minutes}`
	const hoursMinutesSeconds = `${hoursMinutes}:${seconds}`

	let delayString = '00'

	if (h && !m && !s) {
		delayString = `${negative ? '-' : '+'}${h}h`
	} else if (!h && m && !s) {
		delayString = `${negative ? '-' : '+'}${m}m`
	} else if (!h && !m && s) {
		delayString = `${negative ? '-' : '+'}${s}s`
	}

	return {
		hours,
		minutes,
		seconds,
		hoursMinutes,
		hoursMinutesSeconds,
		delayString,
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
