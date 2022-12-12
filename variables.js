module.exports = {
	getVariables() {
		const variables = [
			{
				label: 'State of timer (Running, Paused, Stopped, Roll)',
				name: 'state',
			},
			{
				label: 'Clock (hh:mm:ss)',
				name: 'clock',
			},
			{
				label: 'Start of timer (hh:mm:ss)',
				name: 'timer_start',
			},
			{
				label: 'Expected finish of timer (hh:mm:ss)',
				name: 'timer_finish',
			},
			{
				label: 'Current time of timer (hh:mm:ss)',
				name: 'time',
			},
			{
				label: 'Current time of timer (hh:mm)',
				name: 'time_hm',
			},
			{
				label: 'Current timer state Hours',
				name: 'time_h',
			},
			{
				label: 'Current timer state Minutes',
				name: 'time_m',
			},
			{
				label: 'Current timer state Seconds',
				name: 'time_s',
			},
			{
				label: 'Title of current event',
				name: 'titleNow',
			},
			{
				label: 'Subitle of current event',
				name: 'subtitleNow',
			},
			{
				label: 'Name of current speaker',
				name: 'speakerNow',
			},
			{
				label: 'Note of current event',
				name: 'noteNow',
			},
			{
				label: 'Title of next event',
				name: 'titleNext',
			},
			{
				label: 'Subitle of next event',
				name: 'subtitleNext',
			},
			{
				label: 'Name of next speaker',
				name: 'speakerNext',
			},
			{
				label: 'Note of next event',
				name: 'noteNext',
			},
			{
				label: 'On Air',
				name: 'onAir',
			},
		]

		return variables
	},
}
