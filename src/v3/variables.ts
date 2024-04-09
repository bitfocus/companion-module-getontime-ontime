import { CompanionVariableDefinition } from '@companion-module/base'
import { variableId } from '../enums'

export function variables(): CompanionVariableDefinition[] {
	const variables: CompanionVariableDefinition[] = [
		//clock
		{
			name: 'Clock (hh:mm:ss)',
			variableId: variableId.Clock,
		},
		//timer.addedTime
		{
			name: 'Time added to current event (hh:mm:ss)',
			variableId: variableId.TimerAdded,
		},
		//timer.current
		{
			name: 'Current time of event in milliseconds',
			variableId: variableId.TimerTotalMs,
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
		//timer.duration
		//timer.elapsed
		//timer.expectedFinish
		{
			name: 'Expected finish of event (hh:mm:ss)',
			variableId: variableId.TimerFinish,
		},
		//timer.finishedAt
		//timer.playback
		{
			name: 'State of event (Running, Paused, Stopped, Roll)',
			variableId: variableId.PlayState,
		},
		//timer.secondaryTimer
		//timer.startedAt
		{
			name: 'Start of event (hh:mm:ss)',
			variableId: variableId.TimerStart,
		},
		//onAir
		{
			name: 'On Air',
			variableId: variableId.OnAir,
		},
		//message.timer.text
		{
			name: 'Timer Message',
			variableId: variableId.TimerMessage,
		},
		//message.public.text
		{
			name: 'Public Message',
			variableId: variableId.PublicMessage,
		},
		//message.lower.text
		{
			name: 'Lower thirds Message',
			variableId: variableId.LowerMessage,
		},
		//message.timer.visible
		{
			name: 'Timer Message Visible',
			variableId: variableId.TimerMessageVisible,
		},
		//message.public.visible
		{
			name: 'Public Message Visible',
			variableId: variableId.PublicMessageVisible,
		},
		//message.lower.visible
		{
			name: 'Lower thirds Message Visible',
			variableId: variableId.LowerMessageVisible,
		},
		//message.timer.blackout
		{
			name: 'Timer Blackout',
			variableId: variableId.TimerBlackout,
		},
		//message.timer.blink
		{
			name: 'Timer Blinking',
			variableId: variableId.TimerBlink,
		},
		//runtime.numEvents
		//runtime.selectedEventIndex
		//runtime.offset
		//runtime.plannedStart
		//runtime.actualStart
		//runtime.plannedEnd
		//runtime.expectedEnd
		//eventNow.id
		{
			name: 'ID of current event',
			variableId: variableId.IdNow,
		},
		//eventNow.title
		{
			name: 'Title of current event',
			variableId: variableId.TitleNow,
		},
		//eventNow.note
		{
			name: 'Note of current event',
			variableId: variableId.NoteNow,
		},
		//eventNow.cue
		{
			name: 'Cue of current event',
			variableId: variableId.CueNow,
		},
		//eventNext.di
		{
			name: 'ID of next event',
			variableId: variableId.IdNext,
		},
		//eventNext.title
		{
			name: 'Title of next event',
			variableId: variableId.TitleNext,
		},
		//eventNext.note
		{
			name: 'Note of next event',
			variableId: variableId.NoteNext,
		},
		//eventNext.cue
		{
			name: 'Cue of next event',
			variableId: variableId.CueNext,
		},
		//extra timer
		{
			name: 'Extra timer 1 duration in milliseconds',
			variableId: variableId.ExtraTimerDurationMs + '-1',
		},
		{
			name: 'Extra timer 1 current in milliseconds',
			variableId: variableId.ExtraTimerCurrentMs + '-1',
		},
		{
			name: 'Extra timer 1 duration (hh:mm:ss)',
			variableId: variableId.ExtraTimerDuration + '-1',
		},
		{
			name: 'Extra timer 1 current (hh:mm:ss)',
			variableId: variableId.ExtraTimerCurrent + '-1',
		},
		{
			name: 'Extra timer 1 playback',
			variableId: variableId.ExtraTimerPalyback + '-1',
		},
		{
			name: 'Extra timer 1 direction',
			variableId: variableId.ExtraTimerDirection + '-1',
		},
	]

	return variables
}
