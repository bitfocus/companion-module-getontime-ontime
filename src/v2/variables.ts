import { CompanionVariableDefinition } from '@companion-module/base'
import { variableId } from '../enums'

export function variables(): CompanionVariableDefinition[] {
	const variables: CompanionVariableDefinition[] = [
		{
			name: 'State of event (Running, Paused, Stopped, Roll)',
			variableId: variableId.PlayState,
		},
		{
			name: 'Clock (hh:mm:ss)',
			variableId: variableId.Clock,
		},
		{
			name: 'Start of event (hh:mm:ss)',
			variableId: variableId.TimerStart,
		},
		{
			name: 'Expected finish of event (hh:mm:ss)',
			variableId: variableId.TimerFinish,
		},
		{
			name: 'Delay of current event',
			variableId: variableId.TimerDelay,
		},
		{
			name: 'Current time of event (hh:mm:ss)',
			variableId: variableId.Time,
		},
		{
			name: 'Current time of event (hh:mm)',
			variableId: variableId.TimeHM,
		},
		{
			name: 'Current event state Hours',
			variableId: variableId.TimeH,
		},
		{
			name: 'Current event state Minutes',
			variableId: variableId.TimeM,
		},
		{
			name: 'Current event state Seconds',
			variableId: variableId.TimeS,
		},
		{
			name: 'Title of current event',
			variableId: variableId.TitleNow,
		},
		{
			name: 'Subitle of current event',
			variableId: variableId.SubtitleNow,
		},
		{
			name: 'Name of current speaker',
			variableId: variableId.SpeakerNow,
		},
		{
			name: 'Note of current event',
			variableId: variableId.NoteNow,
		},
		{
			name: 'Title of next event',
			variableId: variableId.TitleNext,
		},
		{
			name: 'Subitle of next event',
			variableId: variableId.SubtitleNext,
		},
		{
			name: 'Name of next speaker',
			variableId: variableId.SpeakerNext,
		},
		{
			name: 'Note of next event',
			variableId: variableId.NoteNext,
		},
		{
			name: 'On Air',
			variableId: variableId.OnAir,
		},
		{
			name: 'Speaker Message',
			variableId: variableId.SpeakerMessage,
		},
		{
			name: 'Public Message',
			variableId: variableId.PublicMessage,
		},
		{
			name: 'Lower thirds Message',
			variableId: variableId.LowerMessage,
		},
	]

	return variables
}
