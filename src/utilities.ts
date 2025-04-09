import type { CompanionVariableValues, DropdownChoice } from '@companion-module/base'
import type { EventCustomFields, OntimeEvent, RuntimeStore, SimpleTimerState } from './v3/ontime-types.js'
import { OntimeV3 } from './v3/ontimev3.js'

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

export function makeURL(host: string, path = '', ssl = false, ws = false): URL | undefined {
	let url: URL | undefined

	if (URL.canParse(host)) {
		url = new URL(host)
	} else if (URL.canParse(`http://${host}`)) {
		url = new URL(`http://${host}`)
	}

	if (url === undefined) return

	url = ensureTrailingSlash(url)
	url.pathname += path

	if (ssl) {
		url.protocol = ws ? 'wss' : 'https'
	} else {
		url.protocol = ws ? 'ws' : 'http'
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

export function getAuxTimerState(ontime: OntimeV3, index = 'auxtimer1'): SimpleTimerState {
	return ontime.state[index as keyof RuntimeStore] as unknown as SimpleTimerState
}

export function findPreviousPlayableEvent(ontime: OntimeV3): OntimeEvent | null {
	if (ontime.state.eventNow === null) {
		return null
	}

	const nowId = ontime.state.eventNow.id
	let now = false

	for (let i = ontime.events.length - 1; i >= 0; i--) {
		if (!now && ontime.events[i].id === nowId) {
			now = true
			continue
		}
		if (now && !ontime.events[i].skip) {
			return ontime.events[i]
		}
	}

	return null
}

export function variablesFromCustomFields(
	ontime: OntimeV3,
	postFix: string,
	val: EventCustomFields | undefined,
): CompanionVariableValues {
	const companionVariableValues: CompanionVariableValues = {}
	if (typeof val === 'undefined') {
		Object.keys(ontime.customFields).forEach((key) => {
			companionVariableValues[`${key}_Custom${postFix}`] = undefined
		})
		return companionVariableValues
	}

	Object.keys(ontime.customFields).forEach((key) => {
		companionVariableValues[`${key}_Custom${postFix}`] = val[key]
	})
	return companionVariableValues
}

export function strictTimerStringToSeconds(str: string): string | number {
	const [hh, mm, ss] = str.split(':')

	if (hh === undefined || mm === undefined || ss === undefined) {
		return 'undefined'
	}

	const isNegative = hh.startsWith('-') ? -1 : 1
	hh.replace('-', '')

	return isNegative * (Number(ss) + Number(mm) * 60 + Number(hh) * 60 * 60)
}
