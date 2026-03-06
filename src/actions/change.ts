import type { CompanionActionDefinitions, CompanionActionEvent, CompanionMigrationAction } from '@companion-module/base'
import { splitHex } from '@companion-module/base'
import { ActionId, PICK_ONE } from '../enums.js'
import { changePicker, type ChangePickerOptions } from './changePicker.js'
import { eventPicker, type EventPickerOptions } from './eventPicker.js'
import { strictTimerStringToMs } from '../utilities.js'
import type { OntimeModule } from '../index.js'
import { TimeStrategy, type OntimeEvent } from '@getontime/resolver'

type ChangeOptions = EventPickerOptions & ChangePickerOptions
export type ChangeActionsSchema = { [ActionId.Change]: { options: ChangeOptions } }

export function createChangeActions(module: OntimeModule): CompanionActionDefinitions<ChangeActionsSchema> {
	return {
		[ActionId.Change]: {
			name: 'Change event property',
			options: [
				...eventPicker(module.connection.state.events, ['list', 'loaded', 'next', 'id', 'index']),
				...changePicker(module.connection.state.customFields),
			],
			callback: (action: CompanionActionEvent<ChangeOptions>) => {
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
						id = eventId
						break
					}
				}
				//if no ID skip
				if (!id) return
				if (!properties.length) return

				const patch: Partial<OntimeEvent> = {}
				//remove unwanted placeholder value if present
				const filteredProperties = properties.filter((val) => val !== PICK_ONE)

				for (const property of filteredProperties) {
					if (typeof property !== 'string') {
						continue
					}
					const value = action.options[property]
					if (typeof value === 'undefined') {
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
						const timeString = value as string
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
				if (properties.includes('timeStart_hhmmss')) {
					const linkStart = action.options.linkStart ?? false
					Object.assign(patch, { linkStart })
				}
				if (properties.includes('timeEnd_hhmmss')) {
					Object.assign(patch, { timeStrategy: TimeStrategy.LockEnd })
				}
				if (properties.includes('duration_hhmmss')) {
					Object.assign(patch, { timeStrategy: TimeStrategy.LockDuration })
				}
				module.connection.sendSocket('change', {
					[id]: patch,
				})
			},
		},
	}
}

/**
 * v5.0.0 remove public field
 */
export function upgrade_removeIsPublic(action: CompanionMigrationAction): boolean {
	if (action.actionId !== `${ActionId.Change}`) {
		return false
	}
	let madeUpgrade = false
	if (!action.options.properties) return false
	const properties = action.options.properties.value as string[]
	if (properties.includes('isPublic')) {
		action.options.properties = { isExpression: false, value: properties.filter((p) => p !== 'isPublic') }
		madeUpgrade = true
	}

	if ('isPublic' in action.options) {
		delete action.options.isPublic
		madeUpgrade = true
	}
	return madeUpgrade
}

/**
 * v5.0.0 allow user expression in change action
 */
export function upgrade_changeTimeWithExpression(action: CompanionMigrationAction): boolean {
	if (action.actionId !== `${ActionId.Change}`) {
		return false
	}
	let madeUpgrade = false

	const affectedProperties = ['duration', 'timeStart', 'timeEnd', 'timeWarning', 'timeDanger']
	if (!action.options.properties) return false
	const properties = action.options.properties.value as string[]
	const upgradedProperties = [...properties]
	affectedProperties.forEach((oldProperty) => {
		if (upgradedProperties.includes(oldProperty)) {
			const newProperty = `${oldProperty}_hhmmss`
			const i = upgradedProperties.indexOf(oldProperty)
			upgradedProperties.splice(i, 1, newProperty)
			action.options[newProperty] = action.options[oldProperty] ?? { isExpression: false, value: '0' }
			delete action.options[oldProperty]
			madeUpgrade = true
		}
	})
	if (madeUpgrade) {
		action.options.properties = { isExpression: false, value: upgradedProperties }
	}

	return madeUpgrade
}
