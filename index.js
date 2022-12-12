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

let states = {}
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
			states.timer = data

			let timer = utilities.toReadableTime(states.running, states.isNegative, 's')
			this.setVariableValues({
				time: timer.hours + ':' + timer.minutes + ':' + timer.seconds,
				time_hm: timer.hours + ':' + timer.minutes,
				time_h: timer.hours,
				time_m: timer.minutes,
				time_s: timer.seconds,
			})

			let clock = utilities.toReadableTime(states.clock, false, 'ms')
			this.setVariableValues({
				clock: clock.hours + ':' + clock.minutes + ':' + clock.seconds,
			})

			let timer_start = utilities.toReadableTime(states.startedAt, false, 'ms')
			this.setVariableValues({
				timer_start: timer_start.hours + ':' + timer_start.minutes + ':' + timer_start.seconds,
			})

			let timer_finish = utilities.toReadableTime(states.expectedFinish, false, 'ms')
			this.setVariableValues({
				timer_finish: timer_finish.hours + ':' + timer_finish.minutes + ':' + timer_finish.seconds,
			})

			this.checkFeedbacks('timer_negative')
		})

		socket.on('playstate', (data) => {
			//this.log('info', data)
			states.playsstate = data
			this.setVariableValues({
				state: data,
			})
			this.checkFeedbacks('state_color')
		})

		socket.on('titles', (data) => {
			states.titles = data
			this.setVariableValues({
				titleNow: states.titles.titleNow,
				subtitleNow: states.titles.subtitleNow,
				speakerNow: states.titles.presenterNow,
				noteNow: states.titles.noteNow,
				titleNext: states.titles.titleNext,
				subtitleNext: states.titles.subtitleNext,
				speakerNext: states.titles.presenterNext,
				noteNext: states.titles.noteNext,
			})
			//log('info', JSON.stringify(states))
		})

		socket.on('onAir', (data) => {
			states.onAir = data
			this.setVariableValues({
				onAir: states.onAir,
			})
			this.checkFeedbacks('onAir')
		})
	}

	init_actions(system) {
		this.setActionDefinitions(this.getActions())
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
}

exports = module.exports = instance
