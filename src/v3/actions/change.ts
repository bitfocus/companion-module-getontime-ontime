import { OnTimeInstance } from '../../index'
import { CompanionActionDefinition, CompanionActionEvent, splitHex } from '@companion-module/base'
import { socketSendChange } from '../connection'
import { ActionId } from '../../enums'
import { ActionCommand } from './commands'
import { changePicker } from '../common/change'
import { eventPicker } from '../common/events'

export function createChangeActions(ontime: OnTimeInstance): { [id: string]: CompanionActionDefinition } {
	function changeEvent(action: CompanionActionEvent): void {
		const { properties, method, eventList, eventId } = action.options
		let id: string | null = null
		switch (method) {
			case 'list': {
				id = eventList ? String(eventList) : null
				break
			}
			case 'loaded': {
				id = ontime.states.loaded.selectedEventId
				break
			}
			case 'next': {
				id = ontime.states.loaded.nextEventId
				break
			}
			case 'id': {
				id = eventId ? String(eventId) : null
				break
			}
		}

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
				if (id === null) {
					return
				}
				socketSendChange(ActionCommand.Change, id, prop, propval)
			})
		}
	}

	return {
		[ActionId.Change]: {
			name: 'Change event property',
			options: [...eventPicker(ontime, ['list', 'loaded', 'next', 'id']), ...changePicker()],
			callback: changeEvent,
		},
	}
}
