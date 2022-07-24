const instance_skel = require('../../../instance_skel')

const actions = require('./actions')

const { io } = require('socket.io-client')

class instance extends instance_skel {
  constructor(system, id, config) {
    super(system, id, config)

    Object.assign(this,  {
      ...actions,
    })

    this.config = config
    this.socket = null
    this.status(this.STATUS_UNKNOWN)
  }

  /**
   * @description Provide a simple return of the necessary fields for the instance configuration screen.
   * @link https://github.com/bitfocus/companion/wiki/Module-Configuration
   * @returns {object[]}
   */
  config_fields() {
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
        value: '127.0.0.1',
        regex: this.REGEX_IP,
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

  /**
   * @description Clean up the instance before it is destroyed
   */
  destroy() {
    if (this.socket) {
      this.socket.disconnect()
    }
    this.socket = null
    this.status(this.STATUS_UNKNOWN)
  }

  /**
   * @description Main initialization function called once the module is OK to start doing things.
   */
  init() {
    if (this.config.host && this.config.port) {
      const serverURL = `http://${this.config.host}:${this.config.port}`
      this.log('info','Connecting to ' + serverURL);
      this.socket = io(serverURL, {
        reconnection: true,
        transports: ['websocket']
      })

      this.socket.on('connect', () => {
        this.status(this.STATUS_OK)
        this.log('info','Connected to ' + serverURL);
      })

      this.socket.on('disconnected', () => {
        this.status(this.STATUS_WARNING)
        this.log('info','Disconnected from ' + serverURL);
      })
    }
    this.initActions()
  }

  /**
   * @description When the instance configuration is saved by the user, this update will fire with the new configuration passed
   * @param {object} config - New config file
   */
  updateConfig(config) {
    this.config = config
    this.init()
  }

  /**
   * @description This function will be called for each action and release action a user executes when the action doesn't have a callback defined.
   * @param {object} calledAction
   */
  action(calledAction) {
    const { action, options } = calledAction
    if (this.socket) {
      this.socket.emit(action, options)
    }
  }

  /**
   * @description This function will be called for each action and release action a user executes when the action doesn't have a callback defined.
   * @param {object} feedback
   * @param {object} bank
   */
  feedback(feedback, bank) {

  }
}

exports = module.exports = instance
