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
import { OntimeV3 } from './v3/ontimev3'
import { UpgradeScripts } from './upgrades'
export interface OntimeClient {
	instance: OnTimeInstance

	connect(): void
	disconnectSocket(): void

	getVariables(): CompanionVariableDefinition[]
	getActions(): CompanionActionDefinitions
	getFeedbacks(self: OnTimeInstance): CompanionFeedbackDefinitions
	getPresets(): CompanionPresetDefinitions
}

export class OnTimeInstance extends InstanceBase<OntimeConfig> {
	public config!: OntimeConfig
	private ontime!: OntimeClient

	/**
	 * Main initialization function called once the module
	 * is OK to start doing things.
	 */
	async init(config: OntimeConfig): Promise<void> {
		this.config = config

		this.log('debug', 'Initializing module')
		this.updateStatus(InstanceStatus.Disconnected)

		this.ontime = new OntimeV3(this)
		this.updateStatus(InstanceStatus.Connecting, 'starting V3')

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
		this.setActionDefinitions(this.ontime.getActions())
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
