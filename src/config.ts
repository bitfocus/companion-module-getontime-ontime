import { Regex, SomeCompanionConfigField } from '@companion-module/base'

export interface OntimeConfig {
	host: string
	port: string
}

export function GetConfigFields(): SomeCompanionConfigField[] {
	return [
		{
			label: 'Information',
			id: 'info',
			type: 'static-text',
			value: 'This module will establish a connection to ontime server at a given IP',
			width: 12,
		},
		{
			label: 'Ontime server IP',
			id: 'host',
			type: 'textinput',
			default: '127.0.0.1',
			regex: Regex.IP,
			width: 6,
			required: true,
		},
		{
			label: 'Ontime server port (always 4001)',
			id: 'port',
			type: 'textinput',
			default: '4001',
			required: true,
			width: 6,
			regex: Regex.PORT,
		},
	]
}
