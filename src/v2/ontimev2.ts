import {
	CompanionActionDefinitions,
	CompanionFeedbackDefinitions,
	CompanionPresetDefinitions,
	CompanionVariableDefinition,
} from '@companion-module/base'
import { OnTimeInstance, OntimeClient } from '..'

import { actions } from './actions/index'
import { feedbacks } from './feedbacks/index'
import { variables } from './variables'
import { connect, disconnectSocket } from './connection'
import { OntimeEvent } from './ontime-types'
import { stateobj } from './state'
import { presets } from '../common/presets'

export class OntimeV2 implements OntimeClient {
	instance: OnTimeInstance
	public events: OntimeEvent[] = []

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

	getFeedbacks(_self: OnTimeInstance): CompanionFeedbackDefinitions {
		return feedbacks(this)
	}

	getPresets(): CompanionPresetDefinitions {
		return presets()
	}
}
