import type { SomeCompanionConfigField } from '@companion-module/base'

export interface OntimeConfig {
	host: string
}

export function GetConfigFields(): SomeCompanionConfigField[] {
	return [
		{
			label: 'Information',
			id: 'info',
			type: 'static-text',
			value:
				'This module will establish a connection to Ontime v4. If you are upgrading from an older version, we suggest backing up your configuration file.',
			width: 12,
		},
		{
			label: 'Help',
			id: 'help',
			type: 'static-text',
			value: 'Find more help on using the module, as well as useful links, by clicking the ? icon.',
			width: 12,
		},
		{
			label: 'Ontime server address',
			id: 'host',
			type: 'textinput',
			default: '127.0.0.1:4001',
			width: 9,
			required: true,
			tooltip: 'Ontime server address. eg. http://127.0.0.1:4001 or from cloud https://cloud.getontime.no/<stage-hash>',
		},
	]
}
