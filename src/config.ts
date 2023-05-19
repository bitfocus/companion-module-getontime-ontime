import { SomeCompanionConfigField, Regex } from '@companion-module/base'

export interface OntimeConfig {
	host: string
	port: string
	version: string
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
			value: 'This module will establish a connection to the ontime server Version 1 and Version 2.',
			width: 12,
		},
		{
			label: 'Ontime server address',
			id: 'host',
			type: 'textinput',
			default: '127.0.0.1',
			regex: Regex.IP && Regex.HOSTNAME,
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
			width: 6,
			regex: Regex.PORT,
			tooltip: 'Ontime server port. Default is 4001',
		},
		{
			label: 'Ontime Version',
			id: 'version',
			type: 'dropdown',
			default: 'v1',
			choices: [
				{ id: 'v1', label: 'Ontime V1' },
				{ id: 'v2', label: 'Ontime V2' },
			],
			width: 12,
			tooltip: 'Choose wich version of Ontime you are connecting to.',
		},
		{
			label: 'Retfetch events',
			id: 'refetchEvents',
			type: 'checkbox',
			default: true,
			width: 4,
			isVisible: (config) => config.version === 'v2',
			tooltip: 'Chose if you want Companion to refetch the events from Ontime when the rundown gets updated.',
		},
		{
			label: 'Reconnect',
			id: 'reconnect',
			type: 'checkbox',
			default: true,
			width: 4,
			tooltip: 'Chose if you want Companion to try to reconnect to ontime whe the connection is lost.',
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
	]
}
