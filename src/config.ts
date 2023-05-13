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
			value:
				'This module will establish a connection to the ontime server Version 1 and Version 2. Beware that Ontime Version 2 is still in the Beta phase.',
			width: 12,
		},
		{
			label: 'Ontime server address.',
			id: 'info_host',
			type: 'static-text',
			value: 'Ontime server address. Valid are IP or URL',
			width: 8,
		},
		{
			label: 'Ontime server address',
			id: 'host',
			type: 'textinput',
			default: '127.0.0.1',
			regex:
				'^(http://www.|https://www.|http://|https://)?[a-z0-9]+([-.]{1}[a-z0-9]+)*.[a-z]{2,5}(:[0-9]{1,5})?(/.*)?|^((http://www.|https://www.|http://|https://)?([0-9]|[1-9][0-9]|1[0-9]{2}|2[0-4][0-9]|25[0-5]).){3}([0-9]|[1-9][0-9]|1[0-9]{2}|2[0-4][0-9]|25[0-5])$',
			width: 4,
			required: true,
		},
		{
			label: 'Ontime server port',
			id: 'info_port',
			type: 'static-text',
			value: 'Ontime server port. Default is 4001',
			width: 8,
		},
		{
			label: 'Ontime server port ',
			id: 'port',
			type: 'textinput',
			default: '4001',
			required: true,
			width: 4,
			regex: Regex.PORT,
		},
		{
			label: 'Ontime Version',
			id: 'info_version',
			type: 'static-text',
			value: 'Choose wich version of Ontime you are connecting to.',
			width: 8,
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
			width: 4,
		},
		{
			label: 'Refetch events',
			id: 'info_refetch',
			type: 'static-text',
			value: 'Chose if you want Companion to refetch the events from Ontime when the rundown gets updated.',
			width: 8,
			isVisible: (config) => config.version === 'v2',
		},
		{
			label: 'Retfetch events',
			id: 'refetchEvents',
			type: 'checkbox',
			default: true,
			width: 4,
			isVisible: (config) => config.version === 'v2',
		},
		{
			label: 'Reconnect',
			id: 'info_reconnect',
			type: 'static-text',
			value: 'Chose if you want Companion to try to reconnect to ontime whe the connection is lost.',
			width: 8,
		},
		{
			label: 'Reconnect',
			id: 'reconnect',
			type: 'checkbox',
			default: true,
			width: 4,
		},
		{
			label: '',
			id: 'info_reconnectInterval',
			type: 'static-text',
			value: '',
			width: 8,
			isVisible: (config) => config.reconnect === true,
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
		},
	]
}
