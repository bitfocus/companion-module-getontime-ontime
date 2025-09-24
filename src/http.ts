import { isOntimeEvent } from '@getontime/resolver'
import type { CustomFields, OntimeEvent, Rundown } from '@getontime/resolver'
import type { OntimeModule } from './index.js'
import { makeURL } from './utilities.js'

let customFieldsEtag: string = ''

export async function fetchCustomFields(self: OntimeModule): Promise<false | CustomFields> {
	const serverHttp = makeURL(self.config.host, 'data/custom-fields')
	if (!serverHttp) {
		self.log('error', 'Fetch Custom: Unable to generate server url')
		return false
	}
	try {
		const response = await fetch(serverHttp, {
			method: 'GET',
			headers: { 'if-none-match': customFieldsEtag, 'cache-control': '3600', pragma: '' },
		})
		if (response.status === 304) {
			self.log('debug', '304 -> nothing changed in custom fields')
			return false
		}
		if (!response.ok) {
			self.log('error', `Fetch Custom: Unable to fetch custom fields: ${response.statusText}`)
			return false
		}
		customFieldsEtag = response.headers.get('Etag') ?? ''
		const data = (await response.json()) as CustomFields
		return data
	} catch (e: any) {
		self.log('error', `Fetch Custom: unknown error: ${e}`)
		return false
	}
}

let rundownEtag: string = ''
export async function fetchAllEvents(self: OntimeModule): Promise<false | OntimeEvent[]> {
	const serverHttp = makeURL(self.config.host, 'data/rundowns/current')
	if (!serverHttp) {
		self.log('error', 'Fetch Events: Unable to generate server url')
		return false
	}
	try {
		const response = await fetch(serverHttp.href, {
			method: 'GET',
			headers: { 'if-none-match': rundownEtag, 'cache-control': '3600', pragma: '' },
		})
		if (response.status === 304) {
			self.log('debug', 'Fetch Events: 304 -> nothing change in rundown')
			return false
		}
		if (!response.ok) {
			self.log('error', `Fetch Events: Unable to fetch events: ${response.statusText}`)
			return false
		}
		rundownEtag = response.headers.get('Etag') ?? ''
		const rundown = (await response.json()) as Rundown
		const flatRundown = getFlatRundown(rundown)
		return flatRundown
	} catch (e: any) {
		self.log('error', `Fetch Events: unknown error: ${e}`)
		return false
	}
}

function getFlatRundown(rundown: Rundown): OntimeEvent[] {
	const { flatOrder, entries } = rundown
	let idx = 0
	const flatRundown = new Array<OntimeEvent>(flatOrder.length)
	for (const id of flatOrder) {
		const entry = entries[id]
		if (!isOntimeEvent(entry)) continue
		flatRundown[idx] = entry
		idx++
	}
	flatRundown.splice(idx)
	return flatRundown
}
