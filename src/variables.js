exports.getVariables = function () {
	const variables = [
		{
			name: 'State of timer (Running, Paused, Stopped, Roll)',
			variableId: 'state',
		},
		{
			name: 'Clock (hh:mm:ss)',
			variableId: 'clock',
		},
		{
			name: 'Start of timer (hh:mm:ss)',
			variableId: 'timer_start',
		},
		{
			name: 'Expected finish of timer (hh:mm:ss)',
			variableId: 'timer_finish',
		},
		{
			name: 'Current time of timer (hh:mm:ss)',
			variableId: 'time',
		},
		{
			name: 'Current time of timer (hh:mm)',
			variableId: 'time_hm',
		},
		{
			name: 'Current timer state Hours',
			variableId: 'time_h',
		},
		{
			name: 'Current timer state Minutes',
			variableId: 'time_m',
		},
		{
			name: 'Current timer state Seconds',
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
