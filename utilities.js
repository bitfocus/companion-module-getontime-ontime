module.exports = {
	/**
	 *
	 * @param {number} time - time in format s or ms
	 * @param {boolean} isNegative - true when time is negative
	 * @param {string} format - format of time (s or ms)
	 * @returns - returns an object with hours, minutes and seconds
	 */

	toReadableTime(time, isNegative, format) {
		time = Number(time)
		if (time < 0) {
			time = time * -1
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

		if (isNegative) {
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
	},
}
