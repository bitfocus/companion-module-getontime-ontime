import { InputValue, InstanceStatus } from '@companion-module/base'
import * as io from 'socket.io-client'
import { toReadableTime } from '../utilities'
import { OnTimeInstance } from '..'

let socket: io.Socket | null = null

export function connect(self: OnTimeInstance): void {
	if (socket) {
		socket.disconnect()
		socket.close()
	}

	let host = self.config.host
	const port = self.config.port

	const pattern = /^((http|https):\/\/)/

	if (!pattern.test(host)) {
		host = 'http://' + host
	}

	socket = io.connect(`${host}:${port}`, {
		reconnection: true,
		reconnectionDelay: 1000,
		reconnectionDelayMax: 5000,
		reconnectionAttempts: 99999,
		transports: ['websocket'],
	})

	socket.on('connect', () => {
		self.updateStatus(InstanceStatus.Ok)
		self.log('debug', 'Socket connected')
	})

	socket.on('disconnect', () => {
		self.updateStatus(InstanceStatus.Disconnected, 'Disconnected')
		self.log('debug', 'Socket disconnected')
	})

	socket.on('connect_error', () => {
		self.updateStatus(InstanceStatus.ConnectionFailure, 'Connection error')
		self.log('debug', 'Socket connect error')
	})

	socket.on('error', () => {
		self.updateStatus(InstanceStatus.UnknownError, 'Error')
		self.log('debug', 'Socket error')
	})

	socket.on('reconnect', () => {
		self.updateStatus(InstanceStatus.Ok, 'Reconnected')
		self.log('debug', 'Socket reconnected')
	})

	socket.on('reconnect_attempt', () => {
		self.updateStatus(InstanceStatus.Connecting, 'Reconnecting')
		self.log('debug', 'Socket reconnecting')
	})

	socket.on('reconnecting', () => {
		self.updateStatus(InstanceStatus.Connecting, 'Reconnecting')
		self.log('debug', 'Socket reconnecting')
	})

	socket.on('reconnect_error', () => {
		self.updateStatus(InstanceStatus.ConnectionFailure, 'Reconnect error')
		self.log('debug', 'Socket reconnect error')
	})

	socket.on('reconnect_failed', () => {
		self.updateStatus(InstanceStatus.ConnectionFailure, 'Reconnect failed')
		self.log('debug', 'Socket reconnect failed')
	})

	socket.on('timer', (data) => {
		self.states = data

		const timer = toReadableTime(self.states.running, 's')
		// self.log('debug', 'running: ' + self.states.running)
		self.setVariableValues({
			time: timer.hours + ':' + timer.minutes + ':' + timer.seconds,
			time_hm: timer.hours + ':' + timer.minutes,
			time_h: timer.hours,
			time_m: timer.minutes,
			time_s: timer.seconds,
		})

		const clock = toReadableTime(self.states.clock)
		self.setVariableValues({
			clock: clock.hours + ':' + clock.minutes + ':' + clock.seconds,
		})

		const timer_start = toReadableTime(self.states.startedAt)
		self.setVariableValues({
			timer_start: timer_start.hours + ':' + timer_start.minutes + ':' + timer_start.seconds,
		})

		const timer_finish = toReadableTime(self.states.expectedFinish)
		self.setVariableValues({
			timer_finish: timer_finish.hours + ':' + timer_finish.minutes + ':' + timer_finish.seconds,
		})

		self.checkFeedbacks('timer_negative')
	})

	socket.on('playstate', (data) => {
		self.states.playstate = data
		self.setVariableValues({
			playstate: data,
		})
		self.checkFeedbacks('state_color_running', 'state_color_paused', 'state_color_stopped', 'state_color_roll')
	})

	socket.on('titles', (data) => {
		self.states.titles = data
		self.setVariableValues({
			titleNow: self.states.titles.titleNow,
			subtitleNow: self.states.titles.subtitleNow,
			speakerNow: self.states.titles.presenterNow,
			noteNow: self.states.titles.noteNow,
			titleNext: self.states.titles.titleNext,
			subtitleNext: self.states.titles.subtitleNext,
			speakerNext: self.states.titles.presenterNext,
			noteNext: self.states.titles.noteNext,
		})
	})

	socket.on('onAir', (data) => {
		self.states.onAir = data
		self.setVariableValues({
			onAir: self.states.onAir,
		})
		self.checkFeedbacks('onAir')
	})
}

export function disconnectSocket(): void {
	if (socket) {
		socket.disconnect()
		socket.close()
	}
}

export function sendCommand(command: string, option?: InputValue): void {
	if (socket) {
		console.log('sending command: ' + command + ' with option: ' + option)
		socket.emit(command, option)
	}
}
