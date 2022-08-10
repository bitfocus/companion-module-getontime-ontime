var instance_skel = require('../../instance_skel')
var debug
var log

var icons = require('./assets/icons')
var io = require('socket.io-client')
var socket = null

function instance(system, id, config) {
  var self = this
  instance_skel.apply(this, arguments)
  self.actions()
  return self
}

instance.prototype.init = function() {
  var self = this

  debug = self.debug
  log = self.log

  self.status(self.STATUS_WARNING, 'connecting')

  self.init_presets()
  self.initModule()
}

instance.prototype.updateConfig = function(config) {
  var self = this
  self.config = config

  self.status(self.STATUS_WARNING, 'connecting')

  self.init_presets()
  self.initModule()
}

instance.prototype.initModule = function() {
  var self = this

  if (self.config.host) {
    const serverUrl = self.config.host + ':' + self.config.port
    socket = io.connect('http://' + serverUrl, {
      reconnection: true,
      transports: ['websocket']
    })
    self.log('info', 'Connecting to Ontime at ' + serverUrl)

    socket.on('connect', function() {
      self.status(self.STATUS_OK)
      self.log('info', 'Connected. Retrieving data.')
    })

    socket.on('disconnected', () => {
      self.status(self.STATUS_WARNING)
      self.log('info', 'Disconnected from ' + serverURL)
    })

    socket.on('playstate', (data) => {
      self.log('info', data)
    })
  }
}

instance.prototype.destroy = function() {
  var self = this
  if (socket) {
    socket.disconnect()
    socket.close()
  }
  socket = null
  self.status(self.STATUS_UNKNOWN)
  debug('destroy', self.id)
}

instance.prototype.config_fields = function() {
  var self = this
  return [
    {
      label: 'Information',
      id: 'info',
      type: 'text',
      value: 'This module will establish a connection to ontime server at a given IP',
      width: 12
    },
    {
      label: 'Ontime server IP',
      id: 'host',
      type: 'textinput',
      default: '127.0.0.1',
      regex: self.REGEX_IP,
      width: 6
    },
    {
      label: 'Ontime server port (always 4001)',
      id: 'port',
      type: 'number',
      min: 1,
      max: 65535,
      default: 4001,
      required: true
    }
  ]
}

instance.prototype.actions = function(system) {
  var self = this

  self.OntimeActions = {
    'start': {
      label: 'Start selected event'
    },
    'startId': {
      label: 'Start event with given ID',
      options: [{
        type: 'textinput',
        label: 'Event ID',
        id: 'value',
        required: true
      }]
    },
    'startIndex': {
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
          required: true
        }
      ]
    },
    'loadId': {
      label: 'Load event with given ID',
      options: [{
        type: 'textinput',
        label: 'Event ID',
        id: 'value',
        required: true
      }]
    },
    'loadIndex': {
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
          required: true
        }
      ]
    },
    'pause': {
      label: 'Pause running timer'
    },
    'stop': {
      label: 'Stop running timer'
    },
    'reload': {
      label: 'Reload selected event'
    },
    'previous': {
      label: 'Select previous event'
    },
    'next': {
      label: 'Select next event'
    },
    'roll': {
      label: 'Start roll mode'
    },
    'delay': {
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
          range: true
        }
      ]
    },
    'setOnAir': {
      label: 'Toggle On Air',
      options: [
        {
          type: 'checkbox',
          id: 'value',
          label: 'On Air'
        }
      ]
    },
    'setTimerMessageVisibility': {
      label: 'Toggle visibility of Stage Timer message',
      options: [
        {
          type: 'checkbox',
          id: 'value',
          label: 'Show Message'
        }
      ]
    },
    'setTimerMessage': {
      label: 'Set text for Stage Timer message',
      options: [{
        type: 'textinput',
        label: 'Stage Timer message',
        placeholder: 'Only the Presenter sees this',
        id: 'value',
        required: true
      }]
    },
    'setPublicMessageVisibility': {
      label: 'Toggle visibility of Public screens message',
      options: [
        {
          type: 'checkbox',
          id: 'value',
          label: 'Show Message'
        }
      ]
    },
    'setPublicMessage': {
      label: 'Set text for Public screens message',
      options: [{
        type: 'textinput',
        label: 'Stage Timer message',
        placeholder: 'Only the Presenter sees this',
        id: 'value',
        required: true
      }]
    },
    'setLowerMessageVisibility': {
      label: 'Toggle visibility of Lower Third message',
      options: [
        {
          type: 'checkbox',
          id: 'value',
          label: 'Show Message'
        }
      ]
    },
    'setLowerMessage': {
      label: 'Set text for Lower Third message',
      options: [{
        type: 'textinput',
        label: 'Stage Timer message',
        placeholder: 'Only the Presenter sees this',
        id: 'value',
        required: true
      }]
    }
  }
  self.setActions(self.OntimeActions)
}

instance.prototype.action = function(action) {
  var self = this
  var id = action.action
  var options = action.options

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
        self.log('info', `Unhandled action: ${action}`)
        break
    }
  }
}

instance.prototype.init_presets = function() {
  var self = this
  var presets = [
    {
      category: 'Commands',
      label: 'Starts selected timer',
      bank: {
        style: 'png',
        png64: icons.PlaybackStart,
        pngalignment: 'center:top',
        text: 'START',
        alignment: 'center:bottom',
        size: '7',
        color: self.rgb(75, 255, 171),
        bgcolor: self.rgb(0, 0, 0)
      },
      actions: [{
        action: 'start'
      }]
    },
    {
      category: 'Commands',
      label: 'Pauses selected timer',
      bank: {
        style: 'png',
        png64: icons.PlaybackPause,
        pngalignment: 'center:top',
        text: 'PAUSE',
        alignment: 'center:bottom',
        size: '7',
        color: self.rgb(255, 255, 255),
        bgcolor: self.rgb(237, 137, 54)
      },
      actions: [{
        action: 'pause'
      }]
    },
    {
      category: 'Commands',
      label: 'Stops selected timer',
      bank: {
        style: 'png',
        png64: icons.PlaybackStop,
        pngalignment: 'center:top',
        text: 'STOP',
        alignment: 'center:bottom',
        size: '7',
        color: self.rgb(255, 255, 255),
        bgcolor: self.rgb(229, 62, 62)
      },
      actions: [{
        action: 'stop'
      }]
    },
    {
      category: 'Commands',
      label: 'Reload selected timer',
      bank: {
        style: 'png',
        png64: icons.PlaybackReload,
        pngalignment: 'center:top',
        text: 'RELOAD',
        alignment: 'center:bottom',
        size: '7',
        color: self.rgb(255, 255, 255),
        bgcolor: self.rgb(0, 0, 0)
      },
      actions: [{
        action: 'reload'
      }]
    },
    {
      category: 'Commands',
      label: 'Selects previous timer',
      bank: {
        style: 'png',
        png64: icons.PlaybackPrevious,
        pngalignment: 'center:top',
        text: 'PREVIOUS',
        alignment: 'center:bottom',
        size: '7',
        color: self.rgb(255, 255, 255),
        bgcolor: self.rgb(0, 0, 0)
      },
      actions: [{
        action: 'previous'
      }]
    },
    {
      category: 'Commands',
      label: 'Selects next timer',
      bank: {
        style: 'png',
        png64: icons.PlaybackNext,
        pngalignment: 'center:top',
        text: 'NEXT',
        alignment: 'center:bottom',
        size: '7',
        color: self.rgb(255, 255, 255),
        bgcolor: self.rgb(0, 0, 0)
      },
      actions: [{
        action: 'next'
      }]
    },
    {
      category: 'Commands',
      label: 'Starts Roll Mode',
      bank: {
        style: 'png',
        png64: icons.PlaybackRoll,
        pngalignment: 'center:top',
        text: 'ROLL MODE',
        alignment: 'center:bottom',
        size: '7',
        color: self.rgb(255, 255, 255),
        bgcolor: self.rgb(43, 108, 176)
      },
      actions: [{
        action: 'roll'
      }]
    },

    {
      category: 'Commands',
      label: 'Toggle On Air state',
      bank: {
        style: 'png',
        png64: icons.OnAir,
        pngalignment: 'center:top',
        text: 'ON AIR',
        alignment: 'center:bottom',
        size: '7',
        color: self.rgb(255, 255, 255),
        bgcolor: self.rgb(0, 0, 0),
        latch: true
      },
      actions: [{
        action: 'setOnAir',
        options: { value: true }
      }],
      release_actions: [{
        action: 'setOnAir',
        options: { value: false }
      }]
    },
    {
      category: 'Commands',
      label: 'Adds 1 min to running timer',
      bank: {
        style: 'text',
        text: '+1 MIN',
        size: '18',
        color: self.rgb(221, 107, 32),
        bgcolor: self.rgb(0, 0, 0)
      },
      actions: [{
        action: 'delay',
        options: { value: 1 }
      }]
    },
    {
      category: 'Commands',
      label: 'Adds 5 min to running timer',
      bank: {
        style: 'text',
        text: '+5 MIN',
        size: '18',
        color: self.rgb(221, 107, 32),
        bgcolor: self.rgb(0, 0, 0)
      },
      actions: [{
        action: 'delay',
        options: { value: 5 }
      }]
    },
    {
      category: 'Commands',
      label: 'Subtracts 1 min to running timer',
      bank: {
        style: 'text',
        text: '-1 MIN',
        size: '18',
        color: self.rgb(221, 107, 32),
        bgcolor: self.rgb(0, 0, 0)
      },
      actions: [{
        action: 'delay',
        options: { value: -1 }
      }]
    },
    {
      category: 'Commands',
      label: 'Subtracts 5 min to running timer',
      bank: {
        style: 'text',
        text: '-5 MIN',
        size: '18',
        color: self.rgb(221, 107, 32),
        bgcolor: self.rgb(0, 0, 0)
      },
      actions: [{
        action: 'delay',
        options: { value: -5 }
      }]
    },
    {
      category: 'Commands',
      label: 'Toggle visibility of Speaker message',
      bank: {
        style: 'png',
        png64: icons.MessageSpeaker,
        pngalignment: 'center:top',
        text: 'SPEAKER MSG',
        alignment: 'center:bottom',
        size: '7',
        color: self.rgb(255, 255, 255),
        bgcolor: self.rgb(0, 0, 0)
      },
      actions: [{
        action: 'setTimerMessageVisibility',
        options: { value: true }
      }],
      release_actions: [{
        action: 'setTimerMessageVisibility',
        options: { value: false }
      }]
    },
    {
      category: 'Commands',
      label: 'Toggle visibility of Public screens message',
      bank: {
        style: 'png',
        png64: icons.MessagePublic,
        pngalignment: 'center:top',
        text: 'PUBLIC MSG',
        alignment: 'center:bottom',
        size: '7',
        color: self.rgb(255, 255, 255),
        bgcolor: self.rgb(0, 0, 0)
      },
      actions: [{
        action: 'setPublicMessageVisibility',
        options: { value: true }
      }],
      release_actions: [{
        action: 'setPublicMessageVisibility',
        options: { value: false }
      }]
    },
    {
      category: 'Commands',
      label: 'Toggle visibility of Lower Third message',
      bank: {
        style: 'png',
        png64: icons.MessageLower,
        pngalignment: 'center:top',
        text: 'L3 MSG',
        alignment: 'center:bottom',
        size: '7',
        color: self.rgb(255, 255, 255),
        bgcolor: self.rgb(0, 0, 0)
      },
      actions: [{
        action: 'setLowerMessageVisibility',
        options: { value: true }
      }],
      release_actions: [{
        action: 'setLowerMessageVisibility',
        options: { value: false }
      }]
    }
  ]

  self.setPresetDefinitions(presets)
}

instance_skel.extendedBy(instance)
exports = module.exports = instance
