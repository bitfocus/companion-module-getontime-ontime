import type { OntimeEvent } from '@getontime/resolver'
import type OntimeState from './state.js'
import { HoursMs, MinutesMs, SecondsMs } from './enums.js'

function ensureTrailingSlash(url: URL): URL {
	if (!url.pathname.endsWith('/')) url.pathname += '/'
	return url
}

export function makeURL(host: string, path = '', ws = false): URL | undefined {
	const trimmed = host.trim()

	// only treat the input as a full URL when it has an explicit scheme like http:// or https://.
	// checking with URL.canParse(host) is not enough: a hostname with port like 'ontime.local:4001'
	// is valid URL syntax with the scheme 'ontime.local:' and was then rejected as not http(s).
	// IP addresses were not affected because a scheme has to start with a letter
	const withScheme = /^[a-z][a-z0-9+.-]*:\/\//i.test(trimmed) ? trimmed : `http://${trimmed}`

	if (!URL.canParse(withScheme)) return
	let url = new URL(withScheme)
	if (url.protocol !== 'http:' && url.protocol !== 'https:') return

	url = ensureTrailingSlash(url)
	url.pathname += path

	if (ws) url.protocol = url.protocol === 'https:' ? 'wss:' : 'ws:'

	return url
}

export function findPreviousPlayableEvent(state: OntimeState): OntimeEvent | null {
	if (state.eventNow === null) return null

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

/**
 * attempts to convert a sting to ms first by testing if it is a straight number and then by spiting on `:`
 * @returns {number | null} if successful returns a number otherwise null
 */
export function stringNumberOrFormatted(str: string): number | null {
	const maybeNumber = Number(str)
	return isNaN(maybeNumber) ? strictTimerStringToMs(str) : maybeNumber
}

/**
 * attempts to convert a sting to ms  by spiting on `:`
 * @returns {number | null} if successful returns a number otherwise null
 */
export function strictTimerStringToMs(str: string): number | null {
	const [hh, mm, ss] = str.split(':')

	if (hh === undefined || mm === undefined || ss === undefined) return null

	const isNegative = hh.startsWith('-') ? -1 : 1
	// strip the sign so it is only applied once below.
	// previously the result of replace() was discarded, so '-01:30:00' became -1h + 30min = +30min
	const unsignedHH = hh.replace(/^[-+]/, '')

	const maybeSS = Number(ss)
	const maybeMM = Number(mm)
	const maybeHH = Number(unsignedHH)
	if (isNaN(maybeSS) || isNaN(maybeMM) || isNaN(maybeHH)) return null

	return isNegative * hmsValuesToMs(maybeHH, maybeMM, maybeSS)
}

export function hmsValuesToMs(h: number, m: number, s: number): number {
	return s * SecondsMs + m * MinutesMs + h * HoursMs
}

export function formatTime(value: number): { sign: '-' | ''; HH: string; mm: string; ss: string; hms: string } {
	const sign = value < 0 ? '-' : ''
	// round to whole seconds first and derive all parts from that.
	// rounding only the seconds while flooring minutes/hours gave e.g. 00:04:00 for 4:59.6
	const totalSeconds = Math.round(Math.abs(value) / SecondsMs)
	const ss = (totalSeconds % 60).toString().padStart(2, '0')
	const mm = (Math.floor(totalSeconds / 60) % 60).toString().padStart(2, '0')
	const HH = Math.floor(totalSeconds / 3600)
		.toString()
		.padStart(2, '0')

	const hms = `${sign}${HH}:${mm}:${ss}`

	return { sign, HH, mm, ss, hms }
}

export type EmptyOptions = { options: Record<string, never> }
