import { runEntrypoint, InstanceBase, Regex } from '@companion-module/base'
import * as io from 'socket.io-client'
import { getActionDefinitions } from './actions.js'
import { setVariables } from './variables.js'
import { getFeedbackDefinitions } from './feedback.js'
import { getPresetsDefentions } from './presets.js'
import { toReadableTime } from './utilities.js'
import { ConfigFields } from './config.js'
let socket = null
class OnTimeInstance extends InstanceBase {
	async init(config) {
		this.config = config

		this.states = {}

		this.log('debug', 'Initializing module')

		this.updateStatus('connecting')

		this.initConnection()
		this.init_actions()
		this.init_variables()
		this.init_feedbacks()
		this.init_presets()
		this.checkFeedbacks()
	}

	async destroy() {
		if (socket) {
			socket.disconnect()
			socket.close()
		}
		socket = null
		this.updateStatus('disconnected')
		this.log('debug', 'destroy ' + this.id)
	}

	async configUpdated(config) {
		this.config = config
		this.updateStatus('connecting')

		this.initConnection()
		this.init_actions()
		this.init_variables()
		this.init_feedbacks()
		this.init_presets()
		this.checkFeedbacks()
	}

	getConfigFields() {
		return ConfigFields
	}

	initConnection() {
		this.log('debug', 'Initializing connection')

		socket = io.connect(`http://${this.config.host}:${this.config.port}`, {
			reconnection: true,
			reconnectionDelay: 1000,
			reconnectionDelayMax: 5000,
			reconnectionAttempts: 99999,
			transports: ['websocket'],
		})

		socket.on('connect', () => {
			this.updateStatus('ok')
			this.log('debug', 'Socket connected')
		})

		socket.on('disconnect', () => {
			this.updateStatus('disconnected')
			this.log('debug', 'Socket disconnected')
		})

		socket.on('connect_error', () => {
			this.updateStatus('connection_failure', 'Connect error')
			this.log('debug', 'Socket connect error')
		})

		socket.on('error', () => {
			this.updateStatus('unknown_error', 'Error')
			this.log('debug', 'Socket error')
		})

		socket.on('reconnect', () => {
			this.updateStatus('ok')
			this.log('debug', 'Socket reconnected')
		})

		socket.on('reconnect_attempt', () => {
			this.updateStatus('disconnected', 'Reconnecting')
			this.log('debug', 'Socket reconnecting')
		})

		socket.on('reconnecting', () => {
			this.updateStatus('disconnected', 'Reconnecting')
			this.log('debug', 'Socket reconnecting')
		})

		socket.on('reconnect_error', () => {
			this.updateStatus('connection_failure', 'Reconnect error')
			this.log('debug', 'Socket reconnect error')
		})

		socket.on('reconnect_failed', () => {
			this.updateStatus('connection_failure', 'Reconnect failed')
			this.log('debug', 'Socket reconnect failed')
		})

		socket.on('timer', (data) => {
			this.states = data

			let timer = toReadableTime(this.states.running, this.states.isNegative, 's')
			this.setVariableValues({
				time: timer.hours + ':' + timer.minutes + ':' + timer.seconds,
				time_hm: timer.hours + ':' + timer.minutes,
				time_h: timer.hours,
				time_m: timer.minutes,
				time_s: timer.seconds,
			})

			let clock = toReadableTime(this.states.clock, false, 'ms')
			this.setVariableValues({
				clock: clock.hours + ':' + clock.minutes + ':' + clock.seconds,
			})

			let timer_start = toReadableTime(this.states.startedAt, false, 'ms')
			this.setVariableValues({
				timer_start: timer_start.hours + ':' + timer_start.minutes + ':' + timer_start.seconds,
			})

			let timer_finish = toReadableTime(this.states.expectedFinish, false, 'ms')
			this.setVariableValues({
				timer_finish: timer_finish.hours + ':' + timer_finish.minutes + ':' + timer_finish.seconds,
			})

			this.checkFeedbacks('timer_negative')
		})

		socket.on('playstate', (data) => {
			this.states.playstate = data
			this.setVariableValues({
				playstate: data,
			})
			this.checkFeedbacks('state_color_running', 'state_color_paused', 'state_color_stopped', 'state_color_roll')
		})

		socket.on('titles', (data) => {
			this.states.titles = data
			this.setVariableValues({
				titleNow: this.states.titles.titleNow,
				subtitleNow: this.states.titles.subtitleNow,
				speakerNow: this.states.titles.presenterNow,
				noteNow: this.states.titles.noteNow,
				titleNext: this.states.titles.titleNext,
				subtitleNext: this.states.titles.subtitleNext,
				speakerNext: this.states.titles.presenterNext,
				noteNext: this.states.titles.noteNext,
			})
		})

		socket.on('onAir', (data) => {
			this.states.onAir = data
			this.setVariableValues({
				onAir: this.states.onAir,
			})
			this.checkFeedbacks('onAir')
		})
	}

	init_actions() {
		this.log('debug', 'Initializing actions')
		this.setActionDefinitions(getActionDefinitions(this))
	}

	init_variables() {
		this.log('debug', 'Initializing variables')
		this.setVariableDefinitions(setVariables())
	}

	init_feedbacks() {
		this.log('debug', 'Initializing feedbacks')
		this.setFeedbackDefinitions(getFeedbackDefinitions(this))
	}

	init_presets() {
		this.log('debug', 'Initializing presets')
		this.setPresetDefinitions(getPresetsDefentions(this))
	}

	sendcmd(cmd, opt) {
		this.log('debug', 'Sending command: ' + cmd + ', ' + opt)
		socket.emit(cmd, opt)
	}
}

runEntrypoint(OnTimeInstance, [])
