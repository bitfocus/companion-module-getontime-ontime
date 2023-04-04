import { SomeCompanionConfigField, Regex } from '@companion-module/base'

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
			label: 'Ontime server',
			id: 'host',
			type: 'textinput',
			default: '127.0.0.1',
			regex:
				'^(http://www.|https://www.|http://|https://)?[a-z0-9]+([-.]{1}[a-z0-9]+)*.[a-z]{2,5}(:[0-9]{1,5})?(/.*)?|^((http://www.|https://www.|http://|https://)?([0-9]|[1-9][0-9]|1[0-9]{2}|2[0-4][0-9]|25[0-5]).){3}([0-9]|[1-9][0-9]|1[0-9]{2}|2[0-4][0-9]|25[0-5])$',
			width: 6,
			required: true,
		},
		{
			label: 'Ontime server port ',
			id: 'port',
			type: 'textinput',
			default: '4001',
			required: true,
			width: 6,
			regex: Regex.PORT,
		},
	]
}
