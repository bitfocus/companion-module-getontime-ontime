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

	getVariables(): CompanionVariableDefinition[] {
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
