exports.getFeedbacks = function () {
  let feedbacks = {}

  feedbacks['state_color'] = {
    label: 'Change color from state',
    description: 'Change the colors of a bank according to the timer state',
    options: [
      {
        type: 'colorpicker',
        label: 'Running: Foreground color',
        id: 'run_fg',
        default: this.rgb(255, 255, 255),
      },
      {
        type: 'colorpicker',
        label: 'Running: Background color',
        id: 'run_bg',
        default: this.rgb(0, 204, 0),
      },
      {
        type: 'colorpicker',
        label: 'Paused: Foreground color',
        id: 'pause_fg',
        default: this.rgb(255, 255, 255),
      },
      {
        type: 'colorpicker',
        label: 'Paused: Background color',
        id: 'pause_bg',
        default: this.rgb(237, 137, 54),
      },
      {
        type: 'colorpicker',
        label: 'Stopped: Foreground color',
        id: 'stop_fg',
        default: this.rgb(255, 255, 255),
      },
      {
        type: 'colorpicker',
        label: 'Stopped: Background color',
        id: 'stop_bg',
        default: this.rgb(0, 0, 0),
      },
      {
        type: 'colorpicker',
        label: 'Roll: Foreground color',
        id: 'roll_fg',
        default: this.rgb(255, 255, 255),
      },
      {
        type: 'colorpicker',
        label: 'Roll: Background color',
        id: 'roll_bg',
        default: this.rgb(43, 108, 176),
      },
    ],
  }
  feedbacks['onAir'] = {
    label: 'Change color from onAir',
    description: 'Change the colors of a bank if onAir is turned on',
    options: [
      {
        type: 'colorpicker',
        label: 'OnAir: Foreground color',
        id: 'onAir_fg',
        default: this.rgb(255, 255, 255),
      },
      {
        type: 'colorpicker',
        label: 'OnAir: Background color',
        id: 'onAir_bg',
        default: this.rgb(255, 0, 0),
      },
    ],
  }
  return feedbacks
}
