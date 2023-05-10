import {
	runEntrypoint,
	InstanceBase,
	InstanceStatus,
	SomeCompanionConfigField,
	CompanionActionDefinitions,
	CompanionPresetDefinitions,
	CompanionVariableDefinition,
	CompanionFeedbackDefinitions,
} from '@companion-module/base'
import { OntimeConfig, GetConfigFields } from './config'
import { OntimeV2 } from './v2/connection'
import * as connection_v1 from './v1/connection'
import * as connection_v2 from './v2/connection'
import * as actions_v1 from './v1/actions'
import * as actions_v2 from './v2/actions'
import * as feedbacks_v1 from './v1/feedback'
import * as feedbacks_v2 from './v2/feedback'
import * as presets_v1 from './v1/presets'
import * as presets_v2 from './v2/presets'
import * as variables_v1 from './v1/variables'
import * as variables_v2 from './v2/variables'

export interface OntimeClient {
	// init: () => void // a way to change the code after initialising
	// shutdown: () => void // a way to close it
	// instance: OnTimeInstance
	// actions: CompanionActionDefinitions
	// presets: CompanionPresetDefinitions
	// variables: CompanionVariableDefinition[]
	// feedbacks: CompanionFeedbackDefinitions
}

export class OntimeBaseClient {}

export class OnTimeInstance extends InstanceBase<OntimeConfig> {
	public config!: OntimeConfig
	public ontime!: OntimeClient
	public states!: any
	public events: Array<any> = [{ id: 'noEvents', label: 'No events found' }]

	async init(config: OntimeConfig): Promise<void> {
		this.ontime = new OntimeV2(this)

		this.log('debug', 'Initializing module')
		this.updateStatus(InstanceStatus.Disconnected)

		this.config = config
		this.states = {}

		await this.initConnection()
		this.init_actions()
		this.init_variables()
		this.init_feedbacks()
		this.init_presets()
		this.checkFeedbacks()
	}

	async destroy(): Promise<void> {
		if (this.config.version === 'v1') {
			connection_v1.disconnectSocket()
		} else if (this.config.version === 'v2') {
			connection_v2.disconnectSocket()
		}
		this.updateStatus(InstanceStatus.Disconnected)
		this.log('debug', 'destroy ' + this.id)
	}

	getConfigFields(): SomeCompanionConfigField[] {
		return GetConfigFields()
	}

	async configUpdated(config: OntimeConfig): Promise<void> {
		if (this.config.version === 'v1') {
			connection_v1.disconnectSocket()
		} else if (this.config.version === 'v2') {
			connection_v2.disconnectSocket()
		}
		this.updateStatus(InstanceStatus.Disconnected)
		this.config = config

		await this.initConnection()
		this.init_actions()
		this.init_variables()
		this.init_feedbacks()
		this.init_presets()
		this.checkFeedbacks()
	}

	async initConnection(): Promise<void> {
		this.log('debug', 'Initializing connection')
		if (this.config.version === 'v1') {
			connection_v1.connect(this)
		} else if (this.config.version === 'v2') {
			connection_v2.connect(this)
			await connection_v2.initEvents(this)
		}
	}

	init_actions(): void {
		this.log('debug', 'Initializing actions')
		if (this.config.version === 'v1') {
			this.setActionDefinitions(actions_v1.getActions(this))
		} else if (this.config.version === 'v2') {
			this.setActionDefinitions(actions_v2.getActions(this))
		}
	}

	init_variables(): void {
		this.log('debug', 'Initializing variables')
		if (this.config.version === 'v1') {
			this.setVariableDefinitions(variables_v1.setVariables())
		} else if (this.config.version === 'v2') {
			this.setVariableDefinitions(variables_v2.setVariables())
		}
	}

	init_feedbacks(): void {
		this.log('debug', 'Initializing feedbacks')
		if (this.config.version === 'v1') {
			this.setFeedbackDefinitions(feedbacks_v1.GetFeedbacks(this))
		} else if (this.config.version === 'v2') {
			this.setFeedbackDefinitions(feedbacks_v2.GetFeedbacks(this))
		}
	}

	init_presets(): void {
		this.log('debug', 'Initializing presets')
		if (this.config.version === 'v1') {
			this.setPresetDefinitions(presets_v1.GetPresetList())
		} else if (this.config.version === 'v2') {
			this.setPresetDefinitions(presets_v2.GetPresetList())
		}
	}
}

runEntrypoint(OnTimeInstance, [])
