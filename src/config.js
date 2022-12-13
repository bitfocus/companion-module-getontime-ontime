import { Regex } from '@companion-module/base'

export const ConfigFields = [
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
	},
	{
		label: 'Ontime server port (always 4001)',
		id: 'port',
		type: 'number',
		min: 1,
		max: 65535,
		default: 4001,
		required: true,
		regex: Regex.PORT,
	},
]
