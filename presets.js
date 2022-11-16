exports.getPresets = function () {
  const icons = require('./assets/icons')

  let presets = []

  presets.push({
    category: 'Commands',
    label: 'Starts selected timer',
    bank: {
      style: 'png',
      png64: icons.PlaybackStart,
      pngalignment: 'center:top',
      text: 'START',
      alignment: 'center:bottom',
      size: '7',
      color: this.rgb(75, 255, 171),
      bgcolor: this.rgb(0, 0, 0),
    },
    actions: [
      {
        action: 'start',
      },
    ],
  })
  presets.push({
    category: 'Commands',
    label: 'Pauses selected timer',
    bank: {
      style: 'png',
      png64: icons.PlaybackPause,
      pngalignment: 'center:top',
      text: 'PAUSE',
      alignment: 'center:bottom',
      size: '7',
      color: this.rgb(255, 255, 255),
      bgcolor: this.rgb(237, 137, 54),
    },
    actions: [
      {
        action: 'pause',
      },
    ],
  })
  presets.push({
    category: 'Commands',
    label: 'Stops selected timer',
    bank: {
      style: 'png',
      png64: icons.PlaybackStop,
      pngalignment: 'center:top',
      text: 'STOP',
      alignment: 'center:bottom',
      size: '7',
      color: this.rgb(255, 255, 255),
      bgcolor: this.rgb(229, 62, 62),
    },
    actions: [
      {
        action: 'stop',
      },
    ],
  })
  presets.push({
    category: 'Commands',
    label: 'Reload selected timer',
    bank: {
      style: 'png',
      png64: icons.PlaybackReload,
      pngalignment: 'center:top',
      text: 'RELOAD',
      alignment: 'center:bottom',
      size: '7',
      color: this.rgb(255, 255, 255),
      bgcolor: this.rgb(0, 0, 0),
    },
    actions: [
      {
        action: 'reload',
      },
    ],
  })
  presets.push({
    category: 'Commands',
    label: 'Selects previous timer',
    bank: {
      style: 'png',
      png64: icons.PlaybackPrevious,
      pngalignment: 'center:top',
      text: 'PREVIOUS',
      alignment: 'center:bottom',
      size: '7',
      color: this.rgb(255, 255, 255),
      bgcolor: this.rgb(0, 0, 0),
    },
    actions: [
      {
        action: 'previous',
      },
    ],
  })
  presets.push({
    category: 'Commands',
    label: 'Selects next timer',
    bank: {
      style: 'png',
      png64: icons.PlaybackNext,
      pngalignment: 'center:top',
      text: 'NEXT',
      alignment: 'center:bottom',
      size: '7',
      color: this.rgb(255, 255, 255),
      bgcolor: this.rgb(0, 0, 0),
    },
    actions: [
      {
        action: 'next',
      },
    ],
  })
  presets.push({
    category: 'Commands',
    label: 'Starts Roll Mode',
    bank: {
      style: 'png',
      png64: icons.PlaybackRoll,
      pngalignment: 'center:top',
      text: 'ROLL MODE',
      alignment: 'center:bottom',
      size: '7',
      color: this.rgb(255, 255, 255),
      bgcolor: this.rgb(43, 108, 176),
    },
    actions: [
      {
        action: 'roll',
      },
    ],
  })
  presets.push({
    category: 'Commands',
    label: 'Toggle On Air state',
    bank: {
      style: 'png',
      png64: icons.OnAir,
      pngalignment: 'center:top',
      text: 'ON AIR',
      alignment: 'center:bottom',
      size: '7',
      color: this.rgb(255, 255, 255),
      bgcolor: this.rgb(0, 0, 0),
      latch: true,
    },
    actions: [
      {
        action: 'setOnAir',
        options: { value: true },
      },
    ],
    release_actions: [
      {
        action: 'setOnAir',
        options: { value: false },
      },
    ],
  })
  presets.push({
    category: 'Commands',
    label: 'Adds 1 min to running timer',
    bank: {
      style: 'text',
      text: '+1 MIN',
      size: '18',
      color: this.rgb(221, 107, 32),
      bgcolor: this.rgb(0, 0, 0),
    },
    actions: [
      {
        action: 'delay',
        options: { value: 1 },
      },
    ],
  })
  presets.push({
    category: 'Commands',
    label: 'Adds 5 min to running timer',
    bank: {
      style: 'text',
      text: '+5 MIN',
      size: '18',
      color: this.rgb(221, 107, 32),
      bgcolor: this.rgb(0, 0, 0),
    },
    actions: [
      {
        action: 'delay',
        options: { value: 5 },
      },
    ],
  })
  presets.push({
    category: 'Commands',
    label: 'Subtracts 1 min to running timer',
    bank: {
      style: 'text',
      text: '-1 MIN',
      size: '18',
      color: this.rgb(221, 107, 32),
      bgcolor: this.rgb(0, 0, 0),
    },
    actions: [
      {
        action: 'delay',
        options: { value: -1 },
      },
    ],
  })
  presets.push({
    category: 'Commands',
    label: 'Subtracts 5 min to running timer',
    bank: {
      style: 'text',
      text: '-5 MIN',
      size: '18',
      color: this.rgb(221, 107, 32),
      bgcolor: this.rgb(0, 0, 0),
    },
    actions: [
      {
        action: 'delay',
        options: { value: -5 },
      },
    ],
  })
  presets.push({
    category: 'Commands',
    label: 'Toggle visibility of Speaker message',
    bank: {
      style: 'png',
      png64: icons.MessageSpeaker,
      pngalignment: 'center:top',
      text: 'SPEAKER MSG',
      alignment: 'center:bottom',
      size: '7',
      color: this.rgb(255, 255, 255),
      bgcolor: this.rgb(0, 0, 0),
    },
    actions: [
      {
        action: 'setTimerMessageVisibility',
        options: { value: true },
      },
    ],
    release_actions: [
      {
        action: 'setTimerMessageVisibility',
        options: { value: false },
      },
    ],
  })
  presets.push({
    category: 'Commands',
    label: 'Toggle visibility of Public screens message',
    bank: {
      style: 'png',
      png64: icons.MessagePublic,
      pngalignment: 'center:top',
      text: 'PUBLIC MSG',
      alignment: 'center:bottom',
      size: '7',
      color: this.rgb(255, 255, 255),
      bgcolor: this.rgb(0, 0, 0),
    },
    actions: [
      {
        action: 'setPublicMessageVisibility',
        options: { value: true },
      },
    ],
    release_actions: [
      {
        action: 'setPublicMessageVisibility',
        options: { value: false },
      },
    ],
  })
  presets.push({
    category: 'Commands',
    label: 'Toggle visibility of Lower Third message',
    bank: {
      style: 'png',
      png64: icons.MessageLower,
      pngalignment: 'center:top',
      text: 'L3 MSG',
      alignment: 'center:bottom',
      size: '7',
      color: this.rgb(255, 255, 255),
      bgcolor: this.rgb(0, 0, 0),
    },
    actions: [
      {
        action: 'setLowerMessageVisibility',
        options: { value: true },
      },
    ],
    release_actions: [
      {
        action: 'setLowerMessageVisibility',
        options: { value: false },
      },
    ],
  })
  presets.push({
    category: 'Display',
    label: 'Time',
    bank: {
      style: 'text',
      text: '$(timer:time)',
      size: '18',
      color: this.rgb(255, 255, 255),
      bgcolor: this.rgb(0, 0, 0),
    },
    feedbacks: [
      {
        type: 'state_color',
        options: {
          run_fg: this.rgb(255, 255, 255),
          run_bg: this.rgb(0, 204, 0),
          pause_fg: this.rgb(255, 255, 255),
          pause_bg: this.rgb(237, 137, 54),
          stop_fg: this.rgb(255, 255, 255),
          stop_bg: this.rgb(0, 0, 0),
          roll_fg: this.rgb(255, 255, 255),
          roll_bg: this.rgb(43, 108, 176),
          negative_fg: this.rgb(255, 255, 255),
          negative_bg: this.rgb(255, 0, 0),
        },
      },
    ],
  })
  presets.push({
    category: 'Display',
    label: 'Hours:Minutes',
    bank: {
      style: 'text',
      text: '$(timer:time_hm)',
      size: '24',
      color: this.rgb(255, 255, 255),
      bgcolor: this.rgb(0, 0, 0),
    },
    feedbacks: [
      {
        type: 'state_color',
        options: {
          run_fg: this.rgb(255, 255, 255),
          run_bg: this.rgb(0, 204, 0),
          pause_fg: this.rgb(255, 255, 255),
          pause_bg: this.rgb(237, 137, 54),
          stop_fg: this.rgb(255, 255, 255),
          stop_bg: this.rgb(0, 0, 0),
          roll_fg: this.rgb(255, 255, 255),
          roll_bg: this.rgb(43, 108, 176),
          negative_fg: this.rgb(255, 255, 255),
          negative_bg: this.rgb(255, 0, 0),
        },
      },
    ],
  })
  presets.push({
    category: 'Display',
    label: 'Hours',
    bank: {
      style: 'text',
      text: '$(timer:time_h)',
      color: this.rgb(255, 255, 255),
      bgcolor: this.rgb(0, 0, 0),
    },
    feedbacks: [
      {
        type: 'state_color',
        options: {
          run_fg: this.rgb(255, 255, 255),
          run_bg: this.rgb(0, 204, 0),
          pause_fg: this.rgb(255, 255, 255),
          pause_bg: this.rgb(237, 137, 54),
          stop_fg: this.rgb(255, 255, 255),
          stop_bg: this.rgb(0, 0, 0),
          roll_fg: this.rgb(255, 255, 255),
          roll_bg: this.rgb(43, 108, 176),
          negative_fg: this.rgb(255, 255, 255),
          negative_bg: this.rgb(255, 0, 0),
        },
      },
    ],
  })
  presets.push({
    category: 'Display',
    label: 'Minutes',
    bank: {
      style: 'text',
      text: '$(timer:time_m)',
      color: this.rgb(255, 255, 255),
      bgcolor: this.rgb(0, 0, 0),
    },
    feedbacks: [
      {
        type: 'state_color',
        options: {
          run_fg: this.rgb(255, 255, 255),
          run_bg: this.rgb(0, 204, 0),
          pause_fg: this.rgb(255, 255, 255),
          pause_bg: this.rgb(237, 137, 54),
          stop_fg: this.rgb(255, 255, 255),
          stop_bg: this.rgb(0, 0, 0),
          roll_fg: this.rgb(255, 255, 255),
          roll_bg: this.rgb(43, 108, 176),
          negative_fg: this.rgb(255, 255, 255),
          negative_bg: this.rgb(255, 0, 0),
        },
      },
    ],
  })
  presets.push({
    category: 'Display',
    label: 'Seconds',
    bank: {
      style: 'text',
      text: '$(timer:time_s)',
      color: this.rgb(255, 255, 255),
      bgcolor: this.rgb(0, 0, 0),
    },
    feedbacks: [
      {
        type: 'state_color',
        options: {
          run_fg: this.rgb(255, 255, 255),
          run_bg: this.rgb(0, 204, 0),
          pause_fg: this.rgb(255, 255, 255),
          pause_bg: this.rgb(237, 137, 54),
          stop_fg: this.rgb(255, 255, 255),
          stop_bg: this.rgb(0, 0, 0),
          roll_fg: this.rgb(255, 255, 255),
          roll_bg: this.rgb(43, 108, 176),
          negative_fg: this.rgb(255, 255, 255),
          negative_bg: this.rgb(255, 0, 0),
        },
      },
    ],
  })
  return presets
}
