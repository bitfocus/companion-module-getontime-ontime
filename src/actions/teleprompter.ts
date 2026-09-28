import type { CompanionActionDefinitions } from '@companion-module/base'
import { ActionId } from '../enums.js'
import type { OntimeModule } from '../index.js'

export type TeleprompterActionsSchema = {
    [ActionId.TeleprompterTogglePlay]: {
        options: {
            value: 'toggle' | 'play' | 'pause'
        }
    }
    [ActionId.TeleprompterSpeed]: { options: { speed: number } }
    [ActionId.TeleprompterNudge]: { options: { nudge: number } }
}

export function createTeleprompterActions(module: OntimeModule): CompanionActionDefinitions<TeleprompterActionsSchema> {
    const connection = module.connection

    return {
        [ActionId.TeleprompterTogglePlay]: {
            name: 'Teleprompter: Play/Pause',
            options: [
                {
                    type: 'dropdown',
                    choices: [
                        { id: 'play', label: 'Start' },
                        { id: 'pause', label: 'Pause' },
                        { id: 'toggle', label: 'Toggle' },
                    ],
                    default: 'play',
                    id: 'value',
                    label: 'Action',
                },
            ],
            callback: (action) => {
                const { value } = action.options
                if (value === 'toggle') {
                    return
                }
                connection.sendSocket('teleprompter', value)
            },
        },
        [ActionId.TeleprompterSpeed]: {
            name: 'Teleprompter: Set Speed',
            options: [
                {
                    type: 'number',
                    default: 0,
                    id: 'speed',
                    label: 'Speed',
                    min: -10,
                    max: 10,
                    tooltip: 'Speed (Lines Per Minute)',
                },
            ],
            callback: (action) => {
                const { speed } = action.options
                connection.sendSocket('teleprompter', { speed })
            },
        },
        [ActionId.TeleprompterNudge]: {
            name: 'Teleprompter: Nudge',
            options: [
                {
                    type: 'number',
                    id: 'nudge',
                    label: 'Nudge ',
                    default: 0,
                    min: -10,
                    max: 10,
                    tooltip:
                        'Nudge amount in milliseconds. Positive moves forward, negative moves backward. Supports Companion variables.',
                },
            ],
            callback: (action) => {
                const { nudge } = action.options
                connection.sendSocket('teleprompter', { nudge })
            },
        },
    }
}
