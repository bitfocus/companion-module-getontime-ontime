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
import { OntimeV2 } from './v2/ontimev2'
import { UpgradeScripts } from './upgrades'
export interface OntimeClient {
	instance: OnTimeInstance

	connect(): void
	disconnectSocket(): void

	getVariables(): CompanionVariableDefinition[]
	getActions(self: OnTimeInstance): CompanionActionDefinitions
	getFeedbacks(self: OnTimeInstance): CompanionFeedbackDefinitions
	getPresets(): CompanionPresetDefinitions
}
export class OnTimeInstance extends InstanceBase<OntimeConfig> {
	public config!: OntimeConfig
	public ontime!: OntimeClient
	public states!: any

	async init(config: OntimeConfig): Promise<void> {
		this.config = config

		this.log('debug', 'Initializing module')
		this.updateStatus(InstanceStatus.Disconnected)

		this.states = {}

		if (this.config.version !== 'v1' && this.config.version !== 'v2') {
			this.config.version = 'v2'
			this.config.refetchEvents = true
			this.config.reconnect = true
			this.config.reconnectInterval = 5
			this.saveConfig(this.config)
		}

		if (this.config.version === 'v1') {
			this.updateStatus(InstanceStatus.BadConfig, 'V1 is no longer suported')
			return
		} else if (this.config.version === 'v2') {
			this.ontime = new OntimeV2(this)
		} else {
			this.updateStatus(InstanceStatus.BadConfig, 'unknown version')
		}

		this.initConnection()
		this.init_variables()
		this.init_actions()
		this.init_feedbacks()
		this.init_presets()
		this.checkFeedbacks()
	}

	async destroy(): Promise<void> {
		this.ontime.disconnectSocket()
		this.updateStatus(InstanceStatus.Disconnected)
		this.log('debug', 'destroy ' + this.id)
	}

	getConfigFields(): SomeCompanionConfigField[] {
		return GetConfigFields()
	}

	async configUpdated(config: OntimeConfig): Promise<void> {
		this.config = config
		this.ontime.disconnectSocket()
		this.updateStatus(InstanceStatus.Disconnected)

		if (this.config.version === 'v1') {
			this.updateStatus(InstanceStatus.BadConfig, 'V1 is no longer suported')
			return
		} else if (this.config.version === 'v2') {
			this.ontime = new OntimeV2(this)
		} else {
			this.updateStatus(InstanceStatus.BadConfig, 'unknown version')
		}

		this.initConnection()
		this.init_variables()
		this.init_actions()
		this.init_feedbacks()
		this.init_presets()
		this.checkFeedbacks()
	}

	initConnection(): void {
		this.log('debug', 'Initializing connection')
		this.ontime.connect()
	}

	init_variables(): void {
		this.log('debug', 'Initializing variables')
		this.setVariableDefinitions(this.ontime.getVariables())
	}

	init_actions(): void {
		this.log('debug', 'Initializing actions')
		this.setActionDefinitions(this.ontime.getActions(this))
	}

	init_feedbacks(): void {
		this.log('debug', 'Initializing feedbacks')
		this.setFeedbackDefinitions(this.ontime.getFeedbacks(this))
	}

	init_presets(): void {
		this.log('debug', 'Initializing presets')
		this.setPresetDefinitions(this.ontime.getPresets())
	}
}

runEntrypoint(OnTimeInstance, UpgradeScripts)
