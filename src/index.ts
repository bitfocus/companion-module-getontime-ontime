import {
	runEntrypoint,
	InstanceBase,
	InstanceStatus,
	SomeCompanionConfigField,
	InputValue,
} from '@companion-module/base'
import * as io from 'socket.io-client'
import { getActionDefinitions } from './actions'
import { setVariables } from './variables'
import { GetFeedbacks } from './feedback'
import { GetPresetList } from './presets'
import { toReadableTime } from './utilities'
import { OntimeConfig, GetConfigFields } from './config'

export class OnTimeInstance extends InstanceBase<OntimeConfig> {
	public config!: OntimeConfig
	public states!: any
	public socket!: io.Socket

	async init(config: OntimeConfig): Promise<void> {
		this.log('debug', 'Initializing module')
		this.updateStatus(InstanceStatus.Disconnected)

		this.config = config
		this.states = {}

		this.initConnection()
		this.init_actions()
		this.init_variables()
		this.init_feedbacks()
		this.init_presets()
		this.checkFeedbacks()
	}

	async destroy(): Promise<void> {
		if (this.socket) {
			this.socket.disconnect()
			this.socket.close()
		}
		this.updateStatus(InstanceStatus.Disconnected)
		this.log('debug', 'destroy ' + this.id)
	}

	getConfigFields(): SomeCompanionConfigField[] {
		return GetConfigFields()
	}

	async configUpdated(config: OntimeConfig): Promise<void> {
		this.config = config
		this.updateStatus(InstanceStatus.Disconnected)

		this.initConnection()
		this.init_actions()
		this.init_variables()
		this.init_feedbacks()
		this.init_presets()
		this.checkFeedbacks()
	}

	initConnection(): void {
		this.log('debug', 'Initializing connection')

		this.socket = io.connect(`http://${this.config.host}:${this.config.port}`, {
			reconnection: true,
			reconnectionDelay: 1000,
			reconnectionDelayMax: 5000,
			reconnectionAttempts: 99999,
			transports: ['websocket'],
		})

		this.socket.on('connect', () => {
			this.updateStatus(InstanceStatus.Ok)
			this.log('debug', 'Socket connected')
		})

		this.socket.on('disconnect', () => {
			this.updateStatus(InstanceStatus.Disconnected, 'Disconnected')
			this.log('debug', 'Socket disconnected')
		})

		this.socket.on('connect_error', () => {
			this.updateStatus(InstanceStatus.ConnectionFailure, 'Connection error')
			this.log('debug', 'Socket connect error')
		})

		this.socket.on('error', () => {
			this.updateStatus(InstanceStatus.UnknownError, 'Error')
			this.log('debug', 'Socket error')
		})

		this.socket.on('reconnect', () => {
			this.updateStatus(InstanceStatus.Ok, 'Reconnected')
			this.log('debug', 'Socket reconnected')
		})

		this.socket.on('reconnect_attempt', () => {
			this.updateStatus(InstanceStatus.Connecting, 'Reconnecting')
			this.log('debug', 'Socket reconnecting')
		})

		this.socket.on('reconnecting', () => {
			this.updateStatus(InstanceStatus.Connecting, 'Reconnecting')
			this.log('debug', 'Socket reconnecting')
		})

		this.socket.on('reconnect_error', () => {
			this.updateStatus(InstanceStatus.ConnectionFailure, 'Reconnect error')
			this.log('debug', 'Socket reconnect error')
		})

		this.socket.on('reconnect_failed', () => {
			this.updateStatus(InstanceStatus.ConnectionFailure, 'Reconnect failed')
			this.log('debug', 'Socket reconnect failed')
		})

		this.socket.on('timer', (data) => {
			this.states = data

			const timer = toReadableTime(this.states.running, 's')
			this.log('debug', 'running: ' + this.states.running)
			this.setVariableValues({
				time: timer.hours + ':' + timer.minutes + ':' + timer.seconds,
				time_hm: timer.hours + ':' + timer.minutes,
				time_h: timer.hours,
				time_m: timer.minutes,
				time_s: timer.seconds,
			})

			const clock = toReadableTime(this.states.clock)
			this.setVariableValues({
				clock: clock.hours + ':' + clock.minutes + ':' + clock.seconds,
			})

			const timer_start = toReadableTime(this.states.startedAt)
			this.setVariableValues({
				timer_start: timer_start.hours + ':' + timer_start.minutes + ':' + timer_start.seconds,
			})

			const timer_finish = toReadableTime(this.states.expectedFinish)
			this.setVariableValues({
				timer_finish: timer_finish.hours + ':' + timer_finish.minutes + ':' + timer_finish.seconds,
			})

			this.checkFeedbacks('timer_negative')
		})

		this.socket.on('playstate', (data) => {
			this.states.playstate = data
			this.setVariableValues({
				playstate: data,
			})
			this.checkFeedbacks('state_color_running', 'state_color_paused', 'state_color_stopped', 'state_color_roll')
		})

		this.socket.on('titles', (data) => {
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

		this.socket.on('onAir', (data) => {
			this.states.onAir = data
			this.setVariableValues({
				onAir: this.states.onAir,
			})
			this.checkFeedbacks('onAir')
		})
	}

	init_actions(): void {
		this.log('debug', 'Initializing actions')
		this.setActionDefinitions(getActionDefinitions(this))
	}

	init_variables(): void {
		this.log('debug', 'Initializing variables')
		this.setVariableDefinitions(setVariables())
	}

	init_feedbacks(): void {
		this.log('debug', 'Initializing feedbacks')
		this.setFeedbackDefinitions(GetFeedbacks(this))
	}

	init_presets(): void {
		this.log('debug', 'Initializing presets')
		this.setPresetDefinitions(GetPresetList(this))
	}

	sendcmd(cmd: string, opt?: InputValue): void {
		this.log('debug', 'Sending command: ' + cmd + ', ' + opt)
		this.socket.emit(cmd, opt)
	}
}

runEntrypoint(OnTimeInstance, [])
