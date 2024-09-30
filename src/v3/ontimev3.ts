import {
	CompanionActionDefinitions,
	CompanionFeedbackDefinitions,
	CompanionPresetDefinitions,
	CompanionVariableDefinition,
} from '@companion-module/base'
import { OnTimeInstance, OntimeClient } from '..'

import { connect, disconnectSocket } from './connection'
import { CustomFields, OntimeEvent } from './ontime-types'
import { stateobj } from './state'

import { actions } from './actions/index'
import { feedbacks } from './feedbacks/index'
import { variables } from './variables'
import { presets } from './presets'

export class OntimeV3 implements OntimeClient {
	instance: OnTimeInstance
	public events: OntimeEvent[] = []
	public customFields: CustomFields = {}
	public state = stateobj

	constructor(instance: OnTimeInstance) {
		this.instance = instance
	}

	connect(): void {
		connect(this.instance, this)
	}

	disconnectSocket(): void {
		disconnectSocket()
	}

	getVariables(includeCustom: boolean = false): CompanionVariableDefinition[] {
		if (includeCustom) {
			const customVariables = Object.entries(this.customFields).map((value) => {
				const name = value[1].label
				const variableId = value[0]
				return [
					{ name: `Custom "${name}" value of previous event`, variableId: `${variableId}_CustomPrevious` },
					{ name: `Custom "${name}" value of current event`, variableId: `${variableId}_CustomNow` },
					{ name: `Custom "${name}" value of next event`, variableId: `${variableId}_CustomNext` },
				]
			})
			
			return variables.concat(...customVariables)
		}
		return variables
	}

	getActions(): CompanionActionDefinitions {
		return actions(this)
	}

	getFeedbacks(): CompanionFeedbackDefinitions {
		return feedbacks(this)
	}

	getPresets(): CompanionPresetDefinitions {
		return presets()
	}
}
