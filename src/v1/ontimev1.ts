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

export class OntimeV1 implements OntimeClient {
	instance: OnTimeInstance

	constructor(instance: OnTimeInstance) {
		this.instance = instance
	}

	getVariables(): CompanionVariableDefinition[] {
		return variables()
	}

	getActions(): CompanionActionDefinitions {
		return actions(this.instance)
	}

	getFeedbacks(): CompanionFeedbackDefinitions {
		return feedbacks(this.instance)
	}

	getPresets(): CompanionPresetDefinitions {
		return presets()
	}

	async connect(): Promise<void> {
		connect(this.instance)
	}

	disconnectSocket(): void {
		disconnectSocket()
	}
}
