module.exports = {
    getVariables() {
        const variables = [
          {
            label: 'State of timer (Running, Paused, Stopped)',
            name: 'state',
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
        ]

        return variables
    }
}