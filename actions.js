module.exports = {
  getActions() {
    let actions = {
      start: {
        name: 'Start selected event',
        callback: (action) => {
          socket.emit('set-start')
        },
      },
      startId: {
        name: 'Start event with given ID',
        options: [
          {
            type: 'textinput',
            name: 'Event ID',
            id: 'value',
            required: true,
          },
        ],
        callback: (action) => {
          socket.emit('set-startid', action.options.value)
        },
      },
      startIndex: {
        name: 'Start event at position (1-256)',
        options: [
          {
            type: 'number',
            name: 'Position',
            id: 'value',
            default: 1,
            min: 1,
            max: 256,
            step: 1,
            range: true,
            required: true,
          },
        ],
        callback: (action) => {
          socket.emit('set-startindex', action.options.value - 1)
        },
      },
      loadId: {
        name: 'Load event with given ID',
        options: [
          {
            type: 'textinput',
            name: 'Event ID',
            id: 'value',
            required: true,
          },
        ],
        callback: (action) => {
          socket.emit('set-loadid', action.options.value)
        },
      },
      loadIndex: {
        name: 'Load event at position (1-256)',
        options: [
          {
            type: 'number',
            name: 'Position',
            id: 'value',
            default: 1,
            min: 1,
            max: 256,
            step: 1,
            range: true,
            required: true,
          },
        ],
        callback: (action) => {
          socket.emit('set-loadindex', action.options.value - 1)
        }
      },
      pause: {
        name: 'Pause running timer',
        callback: (action) => {
          socket.emit('set-pause')
        },
      },
      stop: {
        name: 'Stop running timer',
        callback: (action) => {
          socket.emit('set-stop')
        },
      },
      reload: {
        name: 'Reload selected event',
        callback: (action) => {
          socket.emit('set-reload')
        },
      },
      previous: {
        name: 'Select previous event',
        callback: (action) => {
          socket.emit('set-previous')
        }
      },
      next: {
        name: 'Select next event',
        callback: (action) => {
          socket.emit('set-next')
        }
      },
      roll: {
        name: 'Start roll mode',
        callback: (action) => {
          socket.emit('set-roll')
        }
      },
      delay: {
        name: 'Add / remove time (min) to running timer',
        options: [
          {
            type: 'number',
            id: 'value',
            name: 'Time',
            default: 0,
            min: -60,
            max: 60,
            step: 1,
            required: true,
            range: true,
          },
        ],
        callback: (action) => {
          socket.emit('set-delay', action.options.value)
        }
      },
      setOnAir: {
        name: 'Toggle On Air',
        options: [
          {
            type: 'checkbox',
            id: 'value',
            name: 'On Air',
          },
        ],
        callback: (action) => {
          socket.emit('set-onAir', action.options.value)
        }
      },
      setTimerMessageVisibility: {
        name: 'Toggle visibility of Stage Timer message',
        options: [
          {
            type: 'checkbox',
            id: 'value',
            name: 'Show Message',
          },
        ],
        callback: (action) => {
          socket.emit('set-timer-message-visible', action.options.value)
        }
      },
      setTimerMessage: {
        name: 'Set text for Stage Timer message',
        options: [
          {
            type: 'textinput',
            name: 'Stage Timer message',
            placeholder: 'Only the Presenter sees this',
            id: 'value',
            required: true,
          },
        ],
        callback: (action) => {
          socket.emit('set-timer-message-text', action.options.value)
        }
      },
      setPublicMessageVisibility: {
        name: 'Toggle visibility of Public screens message',
        options: [
          {
            type: 'checkbox',
            id: 'value',
            name: 'Show Message',
          },
        ],
        callback: (action) => {
          socket.emit('set-public-message-visible', action.options.value)
        }
      },
      setPublicMessage: {
        name: 'Set text for Public screens message',
        options: [
          {
            type: 'textinput',
            name: 'Stage Timer message',
            placeholder: 'Only the Presenter sees this',
            id: 'value',
            required: true,
          },
        ],
        callback: (action) => {
          socket.emit('set-public-message-text', action.options.value)
        }
      },
      setLowerMessageVisibility: {
        name: 'Toggle visibility of Lower Third message',
        options: [
          {
            type: 'checkbox',
            id: 'value',
            name: 'Show Message',
          },
        ],
        callback: (action) => {
          socket.emit('set-lower-message-visible', action.options.value)
        }
      },
      setLowerMessage: {
        name: 'Set text for Lower Third message',
        options: [
          {
            type: 'textinput',
            name: 'Stage Timer message',
            placeholder: 'Only the Presenter sees this',
            id: 'value',
            required: true,
          },
        ],
        callback: (action) => {
          socket.emit('set-lower-message-text', action.options.value)
        }
      },
    }
    return actions
  },
}
