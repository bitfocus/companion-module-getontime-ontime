import {
	CompanionActionDefinitions,
	CompanionFeedbackDefinitions,
	CompanionPresetDefinitions,
	CompanionVariableDefinition,
} from '@companion-module/base'
import { OnTimeInstance, OntimeClient } from '..'

import { actions } from './actions/index'
import { feedbacks } from './feedback'
import { presets } from './presets'
import { variables } from './variables'
import { connect, disconnectSocket } from './connection'
import { SimpleOntimeEvent, stateobj } from './state'

export class OntimeV3 implements OntimeClient {
	instance: OnTimeInstance
	public events: SimpleOntimeEvent[] = []
	public state = stateobj
	public log

	constructor(instance: OnTimeInstance) {
		this.instance = instance
		this.log = instance.log
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

	getActions(self: OnTimeInstance): CompanionActionDefinitions {
		return actions(self, this)
	}

	getFeedbacks(self: OnTimeInstance): CompanionFeedbackDefinitions {
		return feedbacks(self)
	}

	getPresets(): CompanionPresetDefinitions {
		return presets()
	}
}
