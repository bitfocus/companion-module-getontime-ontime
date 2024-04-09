import { CompanionVariableDefinition } from '@companion-module/base'
import { deprecatedVariableId, variableId } from '../enums'

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
			name: 'Current time of event in milliseconds',
			variableId: variableId.TimerTotalMs,
		},
		{
			name: 'Time added to current event',
			variableId: variableId.TimerAdded,
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
			name: 'ID of current event',
			variableId: variableId.IdNow,
		},
		{
			name: 'Title of current event',
			variableId: variableId.TitleNow,
		},
		{
			name: 'Subitle of current event',
			variableId: deprecatedVariableId.SubtitleNow,
		},
		{
			name: 'Name of current speaker',
			variableId: deprecatedVariableId.SpeakerNow,
		},
		{
			name: 'Note of current event',
			variableId: variableId.NoteNow,
		},
		{
			name: 'Cue of current event',
			variableId: variableId.CueNow,
		},
		{
			name: 'ID of next event',
			variableId: variableId.IdNext,
		},
		{
			name: 'Title of next event',
			variableId: variableId.TitleNext,
		},
		{
			name: 'Subitle of next event',
			variableId: deprecatedVariableId.SubtitleNext,
		},
		{
			name: 'Name of next speaker',
			variableId: deprecatedVariableId.SpeakerNext,
		},
		{
			name: 'Note of next event',
			variableId: variableId.NoteNext,
		},
		{
			name: 'Cue of next event',
			variableId: variableId.CueNext,
		},
		{
			name: 'On Air',
			variableId: variableId.OnAir,
		},
		{
			name: 'Timer Message',
			variableId: variableId.TimerMessage,
		},
		{
			name: 'Public Message',
			variableId: variableId.PublicMessage,
		},
		{
			name: 'Lower thirds Message',
			variableId: variableId.LowerMessage,
		},
		{
			name: 'Timer Message Visible',
			variableId: variableId.TimerMessageVisible,
		},
		{
			name: 'Public Message Visible',
			variableId: variableId.PublicMessageVisible,
		},
		{
			name: 'Lower thirds Message Visible',
			variableId: variableId.LowerMessageVisible,
		},
		{
			name: 'Timer Blackout',
			variableId: variableId.TimerBlackout,
		},
		{
			name: 'Timer Blinking',
			variableId: variableId.TimerBlink,
		},
	]

	return variables
}
