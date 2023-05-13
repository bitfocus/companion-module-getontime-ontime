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
import { OntimeV1 } from './v1/ontimev1'
import { OntimeV2 } from './v2/ontimev2'
export interface OntimeClient {
	instance: OnTimeInstance

	connect(): void
	disconnectSocket(): void

	getVariables(): CompanionVariableDefinition[]
	getActions(): CompanionActionDefinitions
	getFeedbacks(): CompanionFeedbackDefinitions
	getPresets(): CompanionPresetDefinitions
}
export class OnTimeInstance extends InstanceBase<OntimeConfig> {
	public config!: OntimeConfig
	public ontime!: OntimeClient
	public states!: any
	public events: Array<any> = [{ id: 'noEvents', label: 'No events found' }]

	async init(config: OntimeConfig): Promise<void> {
		this.log('debug', 'Initializing module')
		this.updateStatus(InstanceStatus.Disconnected)

		this.config = config
		this.states = {}

		if (config.version === 'v1') {
			this.ontime = new OntimeV1(this)
		} else if (config.version === 'v2') {
			this.ontime = new OntimeV2(this)
		}

		await this.initConnection()
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
		this.ontime.disconnectSocket()
		this.updateStatus(InstanceStatus.Disconnected)
		this.config = config

		if (config.version === 'v1') {
			this.ontime = new OntimeV1(this)
		} else if (config.version === 'v2') {
			this.ontime = new OntimeV2(this)
		}

		await this.initConnection()
		this.init_variables()
		this.init_actions()
		this.init_feedbacks()
		this.init_presets()
		this.checkFeedbacks()
	}

	async initConnection(): Promise<void> {
		this.log('debug', 'Initializing connection')
		// eslint-disable-next-line @typescript-eslint/await-thenable
		await this.ontime.connect()
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
		this.setFeedbackDefinitions(this.ontime.getFeedbacks())
	}

	init_presets(): void {
		this.log('debug', 'Initializing presets')
		this.setPresetDefinitions(this.ontime.getPresets())
	}
}

runEntrypoint(OnTimeInstance, [])
