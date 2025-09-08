import type {
	CompanionActionDefinitions,
	CompanionFeedbackDefinitions,
	CompanionPresetDefinitions,
	CompanionVariableDefinition,
} from '@companion-module/base'
import { OnTimeInstance, type OntimeClient } from './index.js'

import { connect, disconnectSocket } from './v3/connection.js'
import { stateobj } from './v3/state.js'

import { actions } from './v3/actions/index.js'
import { feedbacks } from './v3/feedbacks/index.js'
import { variables } from './v3/variables.js'
import { presets } from './v3/presets.js'
import type { CustomFields, OntimeEvent } from '@getontime/types'

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

			return variables().concat(...customVariables)
		}
		return variables()
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
