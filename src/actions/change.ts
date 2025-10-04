import type { CompanionActionDefinition, CompanionActionEvent, CompanionActionContext } from '@companion-module/base'
import { splitHex } from '@companion-module/base'
import { ActionId } from '../enums.js'
import { changePicker } from './changePicker.js'
import { eventPicker } from './eventPicker.js'
import { strictTimerStringToSeconds } from '../utilities.js'
import type { OntimeModule } from '../index.js'
import type { OntimeEvent } from '@getontime/resolver'

export function createChangeActions(module: OntimeModule): { [id: string]: CompanionActionDefinition } {
	async function changeEvent(action: CompanionActionEvent, context: CompanionActionContext): Promise<void> {
		const { properties, method, eventList, eventId } = action.options
		let id: string | null = null
		switch (method) {
			case 'list': {
				id = eventList ? String(eventList) : null
				break
			}
			case 'loaded': {
				id = module.connection.state.eventNow?.id ?? null
				break
			}
			case 'next': {
				id = module.connection.state.eventNext?.id ?? null
				break
			}
			case 'id': {
				id = eventId ? String(eventId) : null
				break
			}
		}
		//if no ID skip
		if (id === null) {
			return
		}
		const patch: Partial<OntimeEvent> = {}
		if (properties && Array.isArray(properties)) {
			//remove unwanted placeholder value if present
			if (properties.includes('pickOne')) {
				properties.splice(properties.indexOf('pickOne'), 1)
			}

			for (const property of properties) {
				const value = action.options[property]
				//return early if propval is empty
				if (!value || typeof property !== 'string') {
					continue
				}
				// converts companion color value to hex
				if (property === 'colour') {
					const colour = splitHex(value as string)
					Object.assign(patch, { colour })
					continue
				}

				// converts companion time variable (hh:mm:ss) to ontime seconds
				if (property.endsWith('_hhmmss')) {
					const timeString = await context.parseVariablesInString(value as string)
					const seconds = strictTimerStringToSeconds(timeString)
					const propertyName = property.split('_hhmmss')[0]
					Object.assign(patch, { [propertyName]: seconds })
					continue
				}

				Object.assign(patch, { [property]: value })
			}
			module.connection.sendSocket('change', {
				[id]: patch,
			})
		}
	}

	return {
		[ActionId.Change]: {
			name: 'Change event property',
			options: [
				...eventPicker(module.connection.state.events, ['list', 'loaded', 'next', 'id']),
				...changePicker(module.connection.state.customFields),
			],
			callback: changeEvent,
		},
	}
}
