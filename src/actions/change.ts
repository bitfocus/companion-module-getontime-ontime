import type {
	CompanionActionDefinition,
	CompanionActionEvent,
	CompanionActionContext,
	CompanionMigrationAction,
} from '@companion-module/base'
import { splitHex } from '@companion-module/base'
import { ActionId } from '../enums.js'
import { changePicker } from './changePicker.js'
import { eventPicker } from './eventPicker.js'
import { strictTimerStringToMs } from '../utilities.js'
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
				id = await context.parseVariablesInString(eventId as string)
				break
			}
		}
		//if no ID skip
		if (!id) {
			return
		}
		const patch: Partial<OntimeEvent> = {}
		if (properties && Array.isArray(properties)) {
			//remove unwanted placeholder value if present
			if (properties.includes('pickOne')) {
				properties.splice(properties.indexOf('pickOne'), 1)
			}

			for (const property of properties) {
				if (typeof property !== 'string') {
					continue
				}
				const value = action.options[property]
				if (typeof value === 'undefined') {
					continue
				}
				console.log({ property, value })
				// converts companion color value to hex
				if (property === 'colour') {
					const colour = splitHex(value as string)
					Object.assign(patch, { colour })
					continue
				}

				// converts companion time variable (hh:mm:ss) to ontime seconds
				if (property.endsWith('_hhmmss')) {
					const timeString = await context.parseVariablesInString(value as string)
					const maybeNumber = Number(timeString)
					const ms = isNaN(maybeNumber) ? strictTimerStringToMs(timeString) : maybeNumber
					if (ms === null) {
						module.log('error', `Invalid value in change action: ${property}`)
						continue
					}
					const propertyName = property.split('_hhmmss')[0]
					Object.assign(patch, { [propertyName]: ms })
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
				...eventPicker(module.connection.state.events, ['list', 'loaded', 'next', 'id', 'index']),
				...changePicker(module.connection.state.customFields),
			],
			callback: changeEvent,
		},
	}
}

export function tryRemoveIsPublic(action: CompanionMigrationAction): boolean {
	if (action.actionId !== `${ActionId.Change}`) {
		return false
	}
	if (typeof action.options.properties === 'string') {
		if (action.options.properties === 'isPublic') {
			action.options.properties = []
			return true
		}
		return false
	}

	if (!(action.options.properties as string[]).includes('isPublic')) {
		return false
	}
	action.options.properties = (action.options.properties as string[]).filter((p) => p !== 'isPublic')
	return true
}
