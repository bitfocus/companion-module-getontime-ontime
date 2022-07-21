module.exports = {
  getActions() {
    const actions = {}
    // Todo: confirm action without option or type
    actions['start'] = {
      label: 'Start selected event',
      id: 'start'
    }

    actions['start-id'] = {
      label: 'Start event with given ID',
      type: 'textinput',
      required: true
    }

    actions['start-index'] = {
      label: 'Start event at position (1-256)',
      type: 'number',
      default: 1,
      min: 1,
      max: 256,
      step: 1,
      required: true
    }

    actions['pause'] = {
      label: 'Pauses running timer'
    }

    actions['reload'] = {
      label: 'Reloads selected event'
    }

    actions['previous'] = {
      label: 'Selects previous event'
    }

    actions['next'] = {
      label: 'Selects next event'
    }

    actions['roll'] = {
      label: 'Starts roll mode'
    }

    actions['delay'] = {
      label: 'Add / remove time (min) to running timer',
      type: 'number',
      default: 0,
      min: -60,
      max: 60,
      step: 1,
      required: true
    }

    actions['set-onAir'] = {
      label: 'Toggle On Air',
      type: 'checkbox'
    }

    return actions
  }
}
