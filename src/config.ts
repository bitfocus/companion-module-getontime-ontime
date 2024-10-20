import { SomeCompanionConfigField, Regex } from '@companion-module/base'

export interface OntimeConfig {
	host: string
	port: string
	ssl: boolean
	_version_: string
	refetchEvents: boolean
	reconnect: boolean
	reconnectInterval: number
}

export function GetConfigFields(): SomeCompanionConfigField[] {
	return [
		{
			label: 'Information',
			id: 'info',
			type: 'static-text',
			value:
				'This module will establish a connection to Ontime v3. If you are upgrading from V2 to V3 we suggest backing up your configuration file.',
			width: 12,
		},
		{
			label: 'Ontime server address',
			id: 'host',
			type: 'textinput',
			default: '127.0.0.1',
			width: 6,
			required: true,
			tooltip: 'Ontime server address. Valid are IP or URL',
		},
		{
			label: 'Ontime server port ',
			id: 'port',
			type: 'textinput',
			default: '4001',
			required: true,
			width: 3,
			regex: Regex.PORT,
			tooltip: 'Ontime server port. Default is 4001',
		},
		{
			label: 'Use SSL',
			id: 'ssl',
			type: 'checkbox',
			default: false,
			width: 3,
			tooltip: 'Use SSL to connect to the Ontime server.',
		},
		//New line
		{
			label: 'Reconnect',
			id: 'reconnect',
			type: 'checkbox',
			default: true,
			width: 4,
			tooltip: 'Chose if you want Companion to try to reconnect to ontime when the connection is lost.',
		},
		{
			label: 'Reconnect interval (seconds)',
			id: 'reconnectInterval',
			type: 'number',
			min: 1,
			max: 60,
			default: 5,
			width: 4,
			isVisible: (config) => config.reconnect === true,
			tooltip: 'The interval in seconds between each reconnect attempt.',
		},
		{
			label: 'Refetch events',
			id: 'refetchEvents',
			type: 'checkbox',
			default: true,
			width: 4,
			tooltip: 'Whether Companion should keep the rundown updated with Ontime by refetching on change.',
		},
	]
}
