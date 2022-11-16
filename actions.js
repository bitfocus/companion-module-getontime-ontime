module.exports = {
  getActions() {
    const actions = {
      start: {
        label: 'Start selected event',
      },
      startId: {
        label: 'Start event with given ID',
        options: [
          {
            type: 'textinput',
            label: 'Event ID',
            id: 'value',
            required: true,
          },
        ],
      },
      startIndex: {
        label: 'Start event at position (1-256)',
        options: [
          {
            type: 'number',
            label: 'Position',
            id: 'value',
            default: 1,
            min: 1,
            max: 256,
            step: 1,
            range: true,
            required: true,
          },
        ],
      },
      loadId: {
        label: 'Load event with given ID',
        options: [
          {
            type: 'textinput',
            label: 'Event ID',
            id: 'value',
            required: true,
          },
        ],
      },
      loadIndex: {
        label: 'Load event at position (1-256)',
        options: [
          {
            type: 'number',
            label: 'Position',
            id: 'value',
            default: 1,
            min: 1,
            max: 256,
            step: 1,
            range: true,
            required: true,
          },
        ],
      },
      pause: {
        label: 'Pause running timer',
      },
      stop: {
        label: 'Stop running timer',
      },
      reload: {
        label: 'Reload selected event',
      },
      previous: {
        label: 'Select previous event',
      },
      next: {
        label: 'Select next event',
      },
      roll: {
        label: 'Start roll mode',
      },
      delay: {
        label: 'Add / remove time (min) to running timer',
        options: [
          {
            type: 'number',
            id: 'value',
            label: 'Time',
            default: 0,
            min: -60,
            max: 60,
            step: 1,
            required: true,
            range: true,
          },
        ],
      },
      setOnAir: {
        label: 'Toggle On Air',
        options: [
          {
            type: 'checkbox',
            id: 'value',
            label: 'On Air',
          },
        ],
      },
      setTimerMessageVisibility: {
        label: 'Toggle visibility of Stage Timer message',
        options: [
          {
            type: 'checkbox',
            id: 'value',
            label: 'Show Message',
          },
        ],
      },
      setTimerMessage: {
        label: 'Set text for Stage Timer message',
        options: [
          {
            type: 'textinput',
            label: 'Stage Timer message',
            placeholder: 'Only the Presenter sees this',
            id: 'value',
            required: true,
          },
        ],
      },
      setPublicMessageVisibility: {
        label: 'Toggle visibility of Public screens message',
        options: [
          {
            type: 'checkbox',
            id: 'value',
            label: 'Show Message',
          },
        ],
      },
      setPublicMessage: {
        label: 'Set text for Public screens message',
        options: [
          {
            type: 'textinput',
            label: 'Stage Timer message',
            placeholder: 'Only the Presenter sees this',
            id: 'value',
            required: true,
          },
        ],
      },
      setLowerMessageVisibility: {
        label: 'Toggle visibility of Lower Third message',
        options: [
          {
            type: 'checkbox',
            id: 'value',
            label: 'Show Message',
          },
        ],
      },
      setLowerMessage: {
        label: 'Set text for Lower Third message',
        options: [
          {
            type: 'textinput',
            label: 'Stage Timer message',
            placeholder: 'Only the Presenter sees this',
            id: 'value',
            required: true,
          },
        ],
      },
    }
    return actions
  },
}
