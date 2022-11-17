var instance_skel = require('../../instance_skel')
const actions = require('./actions')
const presets = require('./presets')
const variables = require('./variables')
const feedback = require('./feedback')
const io = require('socket.io-client')
const utilities = require('./utilities')

let debug
let log

let socket = null

let status = {}

class instance extends instance_skel {
  constructor(system, id, config) {
    super(system, id, config)

    Object.assign(this, {
      ...actions,
      ...feedback,
      ...presets,
      ...variables,
    })
  }

  init() {
    debug = this.debug
    log = this.log

    this.status(this.STATUS_WARNING, 'Connecting')

    this.initModule()
    this.init_actions()
    this.init_feedbacks()
    this.init_variables()
    this.init_presets()
  }

  destroy() {
    if (socket) {
      socket.disconnect()
      socket.close()
    }
    socket = null
    this.STATUS_UNKNOWN
    debug('destroy', this.id)
  }

  config_fields() {
    return [
      {
        label: 'Information',
        id: 'info',
        type: 'text',
        value: 'This module will establish a connection to ontime server at a given IP',
        width: 12,
      },
      {
        label: 'Ontime server IP',
        id: 'host',
        type: 'textinput',
        default: '127.0.0.1',
        regex: this.REGEX_IP,
        width: 6,
      },
      {
        label: 'Ontime server port (always 4001)',
        id: 'port',
        type: 'number',
        min: 1,
        max: 65535,
        default: 4001,
        required: true,
        regex: this.REGEX_PORT,
      },
    ]
  }

  updateConfig(config) {
    this.config = config
    this.status(this.STATUS_WARNING, 'Connecting')

    this.initModule()
    this.init_actions()
    this.init_feedbacks()
    this.init_variables()
    this.init_presets()
  }

  initModule() {
    if (socket) {
      socket.disconnect()
      socket.close()
    }

    socket = io.connect(`http://${this.config.host}:${this.config.port}`, {
      reconnection: true,
      reconnectionDelay: 1000,
      reconnectionDelayMax: 5000,
      reconnectionAttempts: 99999,
      transports: ['websocket'],
    })

    socket.on('connect', () => {
      this.status(this.STATUS_OK)
      debug('Socket connected')
    })

    socket.on('disconnect', () => {
      this.status(this.STATUS_WARNING, 'Connecting')
      debug('Socket disconnected')
    })

    socket.on('connect_error', () => {
      this.status(this.STATUS_ERROR, 'Connect error')
      debug('Socket connect error')
    })

    socket.on('error', () => {
      this.status(this.STATUS_ERROR, 'Error')
      debug('Socket error')
    })

    socket.on('reconnect', () => {
      this.status(this.STATUS_OK)
      debug('Socket reconnected')
    })

    socket.on('reconnect_attempt', () => {
      this.status(this.STATUS_WARNING, 'Reconnecting')
      debug('Socket reconnecting')
    })

    socket.on('reconnecting', () => {
      this.status(this.STATUS_WARNING, 'Reconnecting')
      debug('Socket reconnecting')
    })

    socket.on('reconnect_error', () => {
      this.status(this.STATUS_ERROR, 'Reconnect error')
      debug('Socket reconnect error')
    })

    socket.on('reconnect_failed', () => {
      this.status(this.STATUS_ERROR, 'Reconnect failed')
      debug('Socket reconnect failed')
    })

    socket.on('timer', (data) => {
      //this.log('info', JSON.stringify(data))
      status = data

      let timer = utilities.toReadableTime(status.running, status.isNegative, 's')
      this.setVariables({
        time: timer.hours + ':' + timer.minutes + ':' + timer.seconds,
        time_hm: timer.hours + ':' + timer.minutes,
        time_h: timer.hours,
        time_m: timer.minutes,
        time_s: timer.seconds,
      })

      let clock = utilities.toReadableTime(status.clock, false, 'ms')
      this.setVariable('clock', clock.hours + ':' + clock.minutes + ':' + clock.seconds)

      let timer_start = utilities.toReadableTime(status.startedAt, false, 'ms')
      this.setVariable('timer_start', timer_start.hours + ':' + timer_start.minutes + ':' + timer_start.seconds)

      let timer_finish = utilities.toReadableTime(status.expectedFinish, false, 'ms')
      this.setVariable('timer_finish', timer_finish.hours + ':' + timer_finish.minutes + ':' + timer_finish.seconds)

      this.checkFeedbacks('timer_negative')

    })

    socket.on('playstate', (data) => {
      //this.log('info', data)
      status.state = data
      this.setVariable('state', data)
      this.checkFeedbacks('state_color')
    })

    socket.on('titles', (data) => {
      status.titles = data
      this.setVariables({
        titleNow: status.titles.titleNow,
        subtitleNow: status.titles.subtitleNow,
        speakerNow: status.titles.presenterNow,
        noteNow: status.titles.noteNow,
        titleNext: status.titles.titleNext,
        subtitleNext: status.titles.subtitleNext,
        speakerNext: status.titles.presenterNext,
        noteNext: status.titles.noteNext,
      })
      //log('info', JSON.stringify(status))

    })

    socket.on('onAir', (data) => {
      status.onAir = data
      this.setVariable('onAir', status.onAir)
      this.checkFeedbacks('onAir')
    })
  }

  init_actions(system) {
    this.setActions(this.getActions())
  }

  init_feedbacks(system) {
    this.setFeedbackDefinitions(this.getFeedbacks())
  }

  init_presets(system) {
    this.setPresetDefinitions(this.getPresets())
  }

  init_variables(system) {
    this.setVariableDefinitions(this.getVariables())
  }

  feedback(feedback) {
    if (feedback.type === 'state_color') {
      if (status.state == 'start') {
        return {
          color: feedback.options.run_fg,
          bgcolor: feedback.options.run_bg,
        }
      } else if (status.state == 'pause') {
        return {
          color: feedback.options.pause_fg,
          bgcolor: feedback.options.pause_bg,
        }
      } else if (status.state == 'stop') {
        return {
          color: feedback.options.stop_fg,
          bgcolor: feedback.options.stop_bg,
        }
      } else if (status.state == 'roll') {
        return {
          color: feedback.options.roll_fg,
          bgcolor: feedback.options.roll_bg,
        } 
      } else {
        return false
      }
    }
    if (feedback.type === 'timer_negative') {
      log('info', status.isNegative)
      if (status.isNegative) {
        return true
      } else {
        return false
      }
    }
    if (feedback.type === 'onAir') {
      if (status.onAir) {
        return true
      } else {
        return false
      }
    }
  }

  action(action) {
    let id = action.action
    let options = action.options
    let value = null

    if (socket) {
      switch (id) {
        case 'start':
          action = 'set-start'
          socket.emit(action)
          break
        case 'startId':
          action = 'set-startid'
          value = options.value
          socket.emit(action, value)
          break
        case 'startIndex':
          action = 'set-startindex'
          value = options.value - 1
          socket.emit(action, value)
          break
        case 'loadId':
          action = 'set-loadid'
          value = options.value
          socket.emit(action, value)
          break
        case 'loadIndex':
          action = 'set-loadindex'
          value = options.value - 1
          socket.emit(action, value)
          break
        case 'pause':
          action = 'set-pause'
          socket.emit(action)
          break
        case 'stop':
          action = 'set-stop'
          socket.emit(action)
          break
        case 'reload':
          action = 'set-reload'
          socket.emit(action)
          break
        case 'previous':
          action = 'set-previous'
          socket.emit(action)
          break
        case 'next':
          action = 'set-next'
          socket.emit(action)
          break
        case 'roll':
          action = 'set-roll'
          socket.emit(action)
          break
        case 'delay':
          action = 'set-delay'
          value = options.value
          socket.emit(action, value)
          break
        case 'setOnAir':
          action = 'set-onAir'
          value = options.value
          socket.emit(action, value)
          break
        case 'setTimerMessage':
          action = 'set-timer-message-text'
          value = options.value
          socket.emit(action, value)
          break
        case 'setTimerMessageVisibility':
          action = 'set-timer-message-visible'
          value = options.value
          socket.emit(action, value)
          break
        case 'setPublicMessage':
          action = 'set-public-message-text'
          value = options.value
          socket.emit(action, value)
          break
        case 'setPublicMessageVisibility':
          action = 'set-public-message-visible'
          value = options.value
          socket.emit(action, value)
          break
        case 'setLowerMessage':
          action = 'set-lower-message-text'
          value = options.value
          socket.emit(action, value)
          break
        case 'setLowerMessageVisibility':
          action = 'set-lower-message-visible'
          value = options.value
          socket.emit(action, value)
          break
        default:
          this.log('info', `Unhandled action: ${action}`)
          break
      }
    }
  }
}

exports = module.exports = instance
