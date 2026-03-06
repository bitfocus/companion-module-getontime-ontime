import type { CompanionVariableValues, JsonObject, SomeCompanionConfigField } from '@companion-module/base'
import { InstanceBase, InstanceStatus } from '@companion-module/base'

import type { OntimeConfig } from './config.js'
import { GetConfigFields } from './config.js'
import { upgradeScripts } from './upgrades.js'
import { OntimeConnection } from './connection.js'
import type { ActionsSchema } from './actions.js'
import type { FeedbackSchema } from './feedbacks.js'

export interface OntimeTypes {
	config: OntimeConfig
	secrets: JsonObject | undefined
	actions: ActionsSchema
	feedbacks: FeedbackSchema
	variables: CompanionVariableValues
}

export class OntimeModule extends InstanceBase<OntimeTypes> {
	public config!: OntimeConfig
	public connection = new OntimeConnection(this)

	async init(config: OntimeConfig, _isFirstInit: boolean, _secrets: JsonObject | undefined): Promise<void> {
		this.log('debug', 'init')
		this.config = config
		this.updateStatus(InstanceStatus.Connecting)
		this.connection.initConnection()
	}

	async destroy(): Promise<void> {
		this.log('debug', 'destroy')
		await this.connection.destroy()
	}

	async configUpdated(config: OntimeConfig): Promise<void> {
		this.config = config
		this.log('debug', 'config update')
	}

	getConfigFields(): SomeCompanionConfigField[] {
		return GetConfigFields()
	}
}

export const UpgradeScripts = upgradeScripts
export default OntimeModule
