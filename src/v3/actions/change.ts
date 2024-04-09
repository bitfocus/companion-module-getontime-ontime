import { CompanionActionDefinition, CompanionActionEvent, splitHex } from '@companion-module/base'
import { socketSendJson } from '../connection'
import { ActionId } from '../../enums'
import { ActionCommand } from './commands'
import { changePicker } from './changePicker'
import { eventPicker } from '../../common/eventPicker'
import { OntimeV3 } from '../ontimev3'

export function createChangeActions(ontime: OntimeV3): { [id: string]: CompanionActionDefinition } {
	function changeEvent(action: CompanionActionEvent): void {
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
			properties.forEach((prop) => {
				let propval = action.options[prop]
				//return early if propval is empty
				if (!propval) {
					return
				}
				// converts companion color value to hex
				if (prop === 'colour') {
					propval = splitHex(propval as string)
				}

				Object.assign(patch, { [prop]: propval })
			})
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
