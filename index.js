var instance_skel = require('../../instance_skel')
var debug
var log

var io = require('socket.io-client')
var socket = null

function instance(system, id, config) {
  var self = this
  instance_skel.apply(this, arguments)
  self.actions()
  return self
}

instance.prototype.init = function () {
	var self = this

	debug = self.debug
	log = self.log

	self.status(self.STATUS_WARNING, 'connecting')

	self.initModule()
}

instance.prototype.updateConfig = function (config) {
	var self = this
	self.config = config

	self.status(self.STATUS_WARNING, 'connecting')

	self.initModule()
}

instance.prototype.initModule = function () {
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
      self.log('info','Disconnected from ' + serverURL)
    })

    socket.on('playstate', (data) => {
      self.log('info', data)
    })
  }
}

instance.prototype.destroy = function () {
  var self = this
  if (socket) {
    socket.disconnect()
    socket.close()
  }
  socket = null
  self.status(self.STATUS_UNKNOWN)
  debug('destroy',self.id)
}

instance.prototype.config_fields = function () {
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
      label: 'Target IP',
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

instance.prototype.actions = function (system) {
	var self = this

  self.OntimeActions = {
    'start': {
      label: 'Start selected event',
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
    'pause': {
      label: 'Pauses running timer'
    },

    'stop': {
      label: 'Stops running timer'
    },

    'reload': {
      label: 'Reloads selected event'
    },

    'previous': {
      label: 'Selects previous event'
    },

    'next': {
      label: 'Selects next event'
    },

    'roll': {
      label: 'Starts roll mode'
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
    }
  }
  self.setActions(self.OntimeActions)
}

instance.prototype.action = function (action) {
	var self = this
  var id = action.action
  var options = action.options

  if(socket) {
    switch (id) {
      case 'start':
        action = 'set-start'
        socket.emit(action)
        break
      case 'startId':
        action = 'set-startid'
        value = options.value
        socket.emit(action,value)
        break
      case 'startIndex':
        action = 'set-startindex'
        value = options.value - 1
        socket.emit(action,value)
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
        socket.emit(action,value)
        break
      case 'setOnAir':
        action = 'set-onAir'
        value = options.value
        socket.emit(action,value)
        break  
    }
  }
}

instance_skel.extendedBy(instance)
exports = module.exports = instance
