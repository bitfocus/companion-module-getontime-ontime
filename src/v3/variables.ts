import { CompanionVariableDefinition } from '@companion-module/base'
import { variableId } from '../enums'
import { createTimeVariablesFromConfig } from './variables/time-variables'
import { OntimeConfig } from '../config'

export function variables(config: OntimeConfig): CompanionVariableDefinition[] {
	const variables: CompanionVariableDefinition[] = [
		...createTimeVariablesFromConfig(config),
		// {
		// 	name: 'User added time to current event (hh:mm:ss)',
		// 	variableId: variableId.TimerAdded,
		// },
		// {
		// 	name: 'User added time to current event (smallest unit)',
		// 	variableId: variableId.TimerAddedNice,
		// },
		//timer.current
		{
			name: 'Current timer progress (Normal/Warning/Danger/Overtime)',
			variableId: variableId.TimerZone,
		},
		{
			name: '(DEPRECATED) Current timer (milliseconds)',
			variableId: variableId.TimerTotalMs,
		},
		{
			name: '(DEPRECATED) Current timer (hh:mm:ss)',
			variableId: variableId.Time,
		},
		{
			name: '(DEPRECATED) Current time of event (hh:mm)',
			variableId: variableId.TimeHM,
		},
		{
			name: '(DEPRECATED) Current event state Hours',
			variableId: variableId.TimeH,
		},
		{
			name: '(DEPRECATED) Current event state Minutes',
			variableId: variableId.TimeM,
		},
		{
			name: '(DEPRECATED) Current event state Seconds',
			variableId: variableId.TimeS,
		},
		{
			name: '(DEPRECATED) Current event timer Sign',
			variableId: variableId.TimeN,
		},
		//timer.duration
		//timer.elapsed
		//timer.expectedFinish
		// {
		// 	name: 'Expected finish of event (hh:mm:ss)',
		// 	variableId: variableId.TimerFinish,
		// },
		//timer.finishedAt
		//timer.playback
		{
			name: 'Playback state (Running, Paused, Stopped, Roll)',
			variableId: variableId.PlayState,
		},
		//timer.secondaryTimer
		//timer.startedAt
		// {
		// 	name: 'Start time of current timer (hh:mm:ss)',
		// 	variableId: variableId.TimerStart,
		// },
		//message.timer.text
		{
			name: 'Timer Message',
			variableId: variableId.TimerMessage,
		},
		//message.timer.visible
		{
			name: 'Timer Message Visible',
			variableId: variableId.TimerMessageVisible,
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
		{
			name: 'Number of events',
			variableId: variableId.NumberOfEvents,
		},
		{
			name: 'Selected event index',
			variableId: variableId.SelectedEventIndex,
		},
		{
			name: 'Rundown offset (hh:mm:ss)',
			variableId: variableId.RundownOffset,
		},
		{
			name: 'Rundown planned start (hh:mm:ss)',
			variableId: variableId.PlannedStart,
		},
		{
			name: 'Rundown planned end (hh:mm:ss)',
			variableId: variableId.PlannedEnd,
		},
		{
			name: 'Rundown actual start (hh:mm:ss)',
			variableId: variableId.ActualStart,
		},
		{
			name: 'Rundown expected end (hh:mm:ss)',
			variableId: variableId.ExpectedEnd,
		},
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
		//aux timer
		{
			name: 'Aux timer 1 duration (milliseconds)',
			variableId: variableId.AuxTimerDurationMs + '-1',
		},
		{
			name: 'Aux timer 1 current (milliseconds)',
			variableId: variableId.AuxTimerDurationMs + '-1',
		},
		{
			name: 'Aux timer 1 duration (hh:mm:ss)',
			variableId: variableId.AuxTimerDurationMs + '-1',
		},
		{
			name: 'Aux timer 1 current (hh:mm:ss)',
			variableId: variableId.AuxTimerCurrent + '-1',
		},
		{
			name: 'Aux timer 1 playback',
			variableId: variableId.AuxTimerPalyback + '-1',
		},
		{
			name: 'Aux timer 1 direction (count-up/count-down)',
			variableId: variableId.AuxTimerDirection + '-1',
		},
	]

	return variables
}
