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

export function toReadableTime(time, format = 'ms') {
	let negative = false
	time = Number(time)
	if (time < 0) {
		time = time * -1
		negative = true
	} else {
		negative = false
	}

	if (format === 'ms') {
		time = time / 1000
	}
	let hours = Math.floor(time / 60 / 60)
	let minutes = Math.floor((time - hours * 60 * 60) / 60)
	let seconds = Math.floor(time - hours * 60 * 60 - minutes * 60)

	// deal with hours
	if (hours < 10) {
		hours = '0' + hours
	}

	if (negative) {
		hours = '-' + hours
	}

	if (minutes < 10) {
		// deal with minutes
		minutes = '0' + minutes
	}

	// deal with seconds
	if (seconds < 10) {
		seconds = '0' + seconds
	}

	return {
		hours: String(hours),
		minutes: String(minutes),
		seconds: String(seconds),
	}
}
