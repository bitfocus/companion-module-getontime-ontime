import type { DropdownChoice } from '@companion-module/base'
import type { OntimeEvent } from '@getontime/resolver'
import type OntimeState from './state.js'

export const joinTime = (...args: string[]): string => args.join(':')

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

function ensureTrailingSlash(url: URL): URL {
	if (!url.pathname.endsWith('/')) {
		url.pathname += '/'
	}
	return url
}

export function makeURL(host: string, path = '', ws = false): URL | undefined {
	let url: URL | undefined

	if (URL.canParse(host)) {
		url = new URL(host)
	} else if (URL.canParse(`http://${host}`)) {
		url = new URL(`http://${host}`)
	}

	if (url === undefined) return
	if (url.protocol !== 'http:' && url.protocol !== 'https:') return

	url = ensureTrailingSlash(url)
	url.pathname += path

	if (ws) {
		url.protocol = url.protocol === 'https:' ? 'wss:' : 'ws:'
	}

	return url
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

export function findPreviousPlayableEvent(state: OntimeState): OntimeEvent | null {
	if (state.eventNow === null) {
		return null
	}

	const nowId = state.eventNow.id
	let now = false

	for (let i = state.events.length - 1; i >= 0; i--) {
		if (!now && state.events[i].id === nowId) {
			now = true
			continue
		}
		if (now && !state.events[i].skip) {
			return state.events[i]
		}
	}

	return null
}

export function strictTimerStringToMs(str: string): number | null {
	const [hh, mm, ss] = str.split(':')

	if (hh === undefined || mm === undefined || ss === undefined) {
		return null
	}

	const isNegative = hh.startsWith('-') ? -1 : 1
	hh.replace('-', '')

	//TODO: check for NaN
	const seconds = Number(ss) * 1000
	const minutes = Number(mm) * 60 * 1000
	const hours = Number(hh) * 60 * 60 * 1000

	return isNegative * (seconds + minutes + hours)
}

export function formatTime(value: number) {
	const sign = value < 0 ? '-' : ''
	const absolute = Math.abs(value)
	const ss = (Math.round(absolute / 1000) % 60).toString().padStart(2, '0')
	const mm = (Math.floor(absolute / 60000) % 60).toString().padStart(2, '0')
	const HH = Math.floor(absolute / 3600000)
		.toString()
		.padStart(2, '0')

	const hms = `${sign}${HH}:${mm}:${ss}`

	return { sign, HH, mm, ss, hms }
}
