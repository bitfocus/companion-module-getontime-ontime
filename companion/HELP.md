# Ontime Companion Module

This module gives control over Ontime's playback leveraging
its [Websocket API](https://cpvalente.gitbook.io/ontime/control-and-feedback/websocket-api)

## Configuration

- This module requires Ontime V 1 or Ontime V 2.8.0 or above
- You can download ontime at [www.getontime.no](https://www.getontime.no/)
- Ontime must be reachable through the network by the device running companion
- **Ontime server IP** should be set to the IP address of the machine running ontime, available interfaces are
  shown in the [Info Panel](https://cpvalente.gitbook.io/ontime/main-concepts/interface-1/info)
- **Ontime server port** is usually 4001, with the exceptions of custom and docker setups

## Available actions

See below available actions, some of these are extended in Presets

### Playback Control

Actions related to time control

| Preset | Action                                                               |
| :----: | -------------------------------------------------------------------- |
|   ✅   | Start selected event                                                 |
|   ✅   | Start next event                                                     |
|   ✅   | Start event with given ID                                            |
|   ✅   | Start event at given position                                        |
|   ✅   | Start event with cue                                                 |
|   ✅   | Load event with given ID                                             |
|   ✅   | Load event at given position                                         |
|   ✅   | Load event with cue                                                  |
|   ✅   | Pause running timer                                                  |
|   ✅   | Stop running timer                                                   |
|   ✅   | Reload selected event                                                |
|   ✅   | Select previous event                                                |
|   ✅   | Select next event                                                    |
|   ✅   | Start [Roll Mode](https://cpvalente.gitbook.io/ontime/features/roll) |
|   ✅   | Add / remove time to running timer                                   |
|   ✅   | Toggle/On/Off On Air                                                 |
|   ✅   | Toggle/On/Off Timer Blinking                                         |
|   ✅   | Toggle/On/Off Timer Blackout                                         |
|   🔄   | Change event property                                                |

### Messages Control

Actions related to realtime messages

| Preset | Action                                                           |
| :----: | :--------------------------------------------------------------- |
|   ✅   | Set message for Timer view                                       |
|   ✅   | Toggle/On/Off visibility of message for Timer view (above)       |
|   ✅   | Set message for Public view                                      |
|   ✅   | Toggle/On/Off visibility of message for Public view (above)      |
|   ✅   | Set message for Lower Third view                                 |
|   ✅   | Toggle/On/Off visibility of message for Lower Third view (above) |

### Ontime Feedback

Currently, feedbacks are configured to change colours of banks on the given conditions

| Preset | Action                          |
| :----: | :------------------------------ |
|   ✅   | Timer is running                |
|   ✅   | Timer is paused                 |
|   ✅   | Timer is stopped                |
|   ✅   | Timer is paused                 |
|   ✅   | Timer is in Roll Mode           |
|   ✅   | Timer is in overtime            |
|   ✅   | Time added or removed           |
|   ✅   | Ontime is On Air                |
|   ✅   | Public Message Visibility       |
|   ✅   | Lower Thirds Message Visibility |
|   ✅   | Timer Message Visibility        |
|   ✅   | This Timer Message Visibility   |
|   ✅   | Timer Blinking                  |
|   ✅   | Timer Blackout                  |

### Variables

The following variables are made available in the module

|     Variable Id      | Description                                     |
| :------------------: | :---------------------------------------------- |
|         time         | Value of current timer (hh:mm:ss)               |
|       time_hm        | Value of current timer (hh:mm)                  |
|        time_h        | Value of current timer (Hours)                  |
|        time_m        | Value of current timer (Minutes)                |
|        time_s        | Value of current timer (Seconds)                |
|        clock         | Clock (hh:mm:ss)                                |
|     timer_start      | Start of timer (hh:mm:ss)                       |
|     timer_finish     | Expected finish of timer (hh:mm:ss)             |
|     timer_added      | Current added of timer                          |
|      playstate       | State of timer (Running, Paused, Stopped, Roll) |
|        onair         | If onAir is toggled on or off                   |
|       titleNow       | Title of current event                          |
|     subtitleNow      | Subitle of current event                        |
|      speakerNow      | Speaker of current event                        |
|       noteNow        | Note of current event                           |
|        cueNow        | Cue of current event                            |
|      titleNext       | Title of next timer                             |
|     subtitleNext     | Subitle of next event                           |
|     speakerNext      | Speaker of next event                           |
|       noteNext       | Note of next event                              |
|       cueNext        | Cue of next event                               |
|     timerMessage     | Current Timer Message                           |
|    publicMessage     | Current public Message                          |
|     lowerMessage     | Current lower Thirds Message                    |
| timerMessageVisible  | Timer Message Visible                           |
| publicMessageVisible | Public Message Visible                          |
| lowerMessageVisible  | Lower thirds Message Visible                    |
|      timerBlink      | Timer Blackout                                  |
|    timerBlackout     | Timer Blinking                                  |
