/**
 *
 * @typedef {Object} ReadableTime
 * @property {string} hours - hours in format hh
 * @property {string} minutes - minutes in format mm
 * @property {string} seconds - seconds in format ss
 */

/**
 *
 * @param {number} time - time in format s or ms
 * @param {string} [format=ms] - format of time (s or ms)
 * @return {ReadableTime} - object with hours, minutes and seconds
 */

function padTo2Digits(number) {
	return number.toString().padStart(2, '0')
}

export function toReadableTime(time, format = 'ms') {
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

	let seconds = Math.floor(time / 1000)
	let minutes = Math.floor(seconds / 60)
	let hours = Math.floor(minutes / 60)

	seconds = padTo2Digits(seconds % 60)
	minutes = padTo2Digits(minutes % 60)
	hours = padTo2Digits(hours % 24)

	if (negative) {
		hours = '-' + hours
	}

	return {
		hours: String(hours),
		minutes: String(minutes),
		seconds: String(seconds),
	}
}
