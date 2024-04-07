import { DropdownChoice } from '@companion-module/base'

/**
 * @param {number} number - number to pad
 * @return {string} - padded number
 */
function padTo2Digits(number: number) {
	return number.toString().padStart(2, '0')
}

/**
 *
 * @typedef {Object} ReadableTime
 * @property {string} hours - hours in format hh
 * @property {string} minutes - minutes in format mm
 * @property {string} seconds - seconds in format ss
 */

/**
 * @param {number} time - time in format s or ms
 * @param {string} [format=ms] - format of time (s or ms)
 * @return {ReadableTime} - object with hours, minutes and seconds
 */

interface ReadableTime {
	hours: string
	minutes: string
	seconds: string
}

export function toReadableTime(time: number, format = 'ms'): ReadableTime {
	let negative = false
	time = Number(time)
	if (time < 0) {
		time = time * -1
		negative = true
	} else {
		negative = false
	}

	if (format === 's') {
		time = time * 1000
	}

	const s = Math.floor(time / 1000)
	const m = Math.floor(s / 60)
	const h = Math.floor(m / 60)

	const seconds = padTo2Digits(s % 60)
	const minutes = padTo2Digits(m % 60)
	let hours = padTo2Digits(h % 24)

	if (negative) {
		hours = '-' + hours
	}

	return {
		hours: String(hours),
		minutes: String(minutes),
		seconds: String(seconds),
	}
}

export function mstoTime(time: number): string {
	let negative = false
	if (time < 0) {
		time = time * -1
		negative = true
	} else {
		negative = false
	}
	const seconds = padTo2Digits(Math.floor((time / 1000) % 60))
	const minutes = padTo2Digits(Math.floor((time / (1000 * 60)) % 60))
	const hours = padTo2Digits(Math.floor((time / (1000 * 60 * 60)) % 24))

	return negative ? '-' + hours + ':' + minutes + ':' + seconds : hours + ':' + minutes + ':' + seconds
}

export function eventsToChoices(events: { id: string; cue: string; title: string }[]): DropdownChoice[] {
	return events.map(({ id, cue, title }) => {
		return { id, label: `${cue} | ${title}` }
	})
}
