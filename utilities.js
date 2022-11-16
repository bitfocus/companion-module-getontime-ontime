module.exports = {
  toReadableTime(secondsfrommidnight, isNegative) {
    const SECONDS_IN_DAY = 86400

    secondsfrommidnight = Number(secondsfrommidnight) % SECONDS_IN_DAY
    if (secondsfrommidnight < 0) {
      secondsfrommidnight = secondsfrommidnight * -1
    }

    let hours = Math.floor(secondsfrommidnight / 60 / 60)
    let minutes = Math.floor((secondsfrommidnight - hours * 60 * 60) / 60)
    let seconds = Math.floor(secondsfrommidnight - hours * 60 * 60 - minutes * 60)

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
