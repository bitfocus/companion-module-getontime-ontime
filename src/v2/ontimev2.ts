import {
	CompanionActionDefinitions,
	CompanionFeedbackDefinitions,
	CompanionPresetDefinitions,
	CompanionVariableDefinition,
} from '@companion-module/base'
import { OnTimeInstance, OntimeClient } from '..'

import { actions } from './actions'
import { feedbacks } from './feedback'
import { presets } from './presets'
import { variables } from './variables'
import { connect, disconnectSocket } from './connection'
import { stateobj } from './state'

export class OntimeV2 implements OntimeClient {
	instance: OnTimeInstance

	constructor(instance: OnTimeInstance) {
		this.instance = instance
		this.instance.states = stateobj
	}

	connect(): void {
		connect(this.instance)
	}

	disconnectSocket(): void {
		disconnectSocket()
	}

	getVariables(): CompanionVariableDefinition[] {
		return variables()
	}

	getActions(self: OnTimeInstance): CompanionActionDefinitions {
		return actions(self)
	}

	getFeedbacks(self: OnTimeInstance): CompanionFeedbackDefinitions {
		return feedbacks(self)
	}

	getPresets(): CompanionPresetDefinitions {
		return presets()
	}
}
