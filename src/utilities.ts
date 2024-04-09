import { DropdownChoice } from '@companion-module/base'

export const joinTime = (...args: string[]) => args.join(':')

function padTo2Digits(number: number) {
	return number.toString().padStart(2, '0')
}

type SplitTime = {
	hours: string
	minutes: string
	seconds: string
	hoursMinutes: string
	hoursMinutesSeconds: string
}

export const defaultTimerObject: SplitTime = {
	hours: '--',
	minutes: '--',
	seconds: '--',
	hoursMinutes: '--:--',
	hoursMinutesSeconds: '--:--:--',
}

export function msToSplitTime(time: number): SplitTime {
	let negative = false
	if (time < 0) {
		time = time * -1
		negative = true
	} else {
		negative = false
	}
	const seconds = padTo2Digits(Math.floor((time / 1000) % 60))
	const minutes = padTo2Digits(Math.floor((time / (1000 * 60)) % 60))
	const hours = (negative ? '-' : '') + padTo2Digits(Math.floor((time / (1000 * 60 * 60)) % 24))

	const hoursMinutes = `${hours}:${minutes}`
	const hoursMinutesSeconds = `${hoursMinutes}:${seconds}`
	return {
		hours,
		minutes,
		seconds,
		hoursMinutes,
		hoursMinutesSeconds,
	}
}

export function eventsToChoices(events: { id: string; cue: string; title: string }[]): DropdownChoice[] {
	return events.map(({ id, cue, title }) => {
		return { id, label: `${cue} | ${title}` }
	})
}
