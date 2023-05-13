import { CompanionVariableDefinition } from '@companion-module/base'

export function variables(): CompanionVariableDefinition[] {
	const variables: CompanionVariableDefinition[] = [
		{
			name: 'State of event (Running, Paused, Stopped, Roll)',
			variableId: 'playstate',
		},
		{
			name: 'Clock (hh:mm:ss)',
			variableId: 'clock',
		},
		{
			name: 'Start of event (hh:mm:ss)',
			variableId: 'timer_start',
		},
		{
			name: 'Expected finish of event (hh:mm:ss)',
			variableId: 'timer_finish',
		},
		{
			name: 'Current time of event (hh:mm:ss)',
			variableId: 'time',
		},
		{
			name: 'Current time of event (hh:mm)',
			variableId: 'time_hm',
		},
		{
			name: 'Current event state Hours',
			variableId: 'time_h',
		},
		{
			name: 'Current event state Minutes',
			variableId: 'time_m',
		},
		{
			name: 'Current event state Seconds',
			variableId: 'time_s',
		},
		{
			name: 'Title of current event',
			variableId: 'titleNow',
		},
		{
			name: 'Subitle of current event',
			variableId: 'subtitleNow',
		},
		{
			name: 'variableId of current speaker',
			variableId: 'speakerNow',
		},
		{
			name: 'Note of current event',
			variableId: 'noteNow',
		},
		{
			name: 'Title of next event',
			variableId: 'titleNext',
		},
		{
			name: 'Subitle of next event',
			variableId: 'subtitleNext',
		},
		{
			name: 'variableId of next speaker',
			variableId: 'speakerNext',
		},
		{
			name: 'Note of next event',
			variableId: 'noteNext',
		},
		{
			name: 'On Air',
			variableId: 'onAir',
		},
	]

	return variables
}
