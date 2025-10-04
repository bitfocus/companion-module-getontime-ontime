import type { SomeCompanionConfigField } from '@companion-module/base'
import { runEntrypoint, InstanceBase, InstanceStatus } from '@companion-module/base'

import type { OntimeConfig } from './config.js'
import { GetConfigFields } from './config.js'
import { UpgradeScripts } from './upgrades.js'
import { OntimeConnection } from './connection.js'

export class OntimeModule extends InstanceBase<OntimeConfig> {
	public config!: OntimeConfig
	public connection = new OntimeConnection(this)

	async init(config: OntimeConfig): Promise<void> {
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

runEntrypoint(OntimeModule, UpgradeScripts)
