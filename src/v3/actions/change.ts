import {
	CompanionActionDefinition,
	CompanionActionEvent,
	splitHex,
	CompanionActionContext,
} from '@companion-module/base'
import { socketSendJson } from '../connection'
import { ActionId } from '../../enums'
import { ActionCommand } from './commands'
import { changePicker } from './changePicker'
import { eventPicker } from './eventPicker'
import { OntimeV3 } from '../ontimev3'
import { strictTimerStringToSeconds } from '../../utilities'

export function createChangeActions(ontime: OntimeV3): { [id: string]: CompanionActionDefinition } {
	async function changeEvent(action: CompanionActionEvent, context: CompanionActionContext): Promise<void> {
		const { properties, method, eventList, eventId } = action.options
		let id: string | null = null
		switch (method) {
			case 'list': {
				id = eventList ? String(eventList) : null
				break
			}
			case 'loaded': {
				id = ontime.state.eventNow?.id ?? null
				break
			}
			case 'next': {
				id = ontime.state.eventNext?.id ?? null
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
		const patch = {}
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
			socketSendJson(ActionCommand.Change, { [id]: patch })
		}
	}

	return {
		[ActionId.Change]: {
			name: 'Change event property',
			options: [...eventPicker(ontime.events, ['list', 'loaded', 'next', 'id']), ...changePicker(ontime)],
			callback: changeEvent,
		},
	}
}
