# Ontime Companion Module

This module gives control over Ontime's playback leveraging
its [Websocket API](https://cpvalente.gitbook.io/ontime/control-and-feedback/websocket-api)

## Configuration

- You can download ontime at [www.getontime.no](https://www.getontime.no/)
- Ontime must be reachable through the network by the device running companion
- __Ontime server IP__ should be set to the IP address of the machine running ontime, available interfaces are
  shown in the [Info Panel](https://cpvalente.gitbook.io/ontime/main-concepts/interface-1/info)
- __Ontime server port__ is usually 4001, with the exceptions of custom and docker setups

## Available actions
See below available actions, some of these are extended in Presets

### Playback Control
Actions related to time control

| Preset | Action                                                                  |
| :---:  | :--------------------                                                   |
| ✅     | Start selected event                                                    |
| -    | Start event with given ID                                               | 
| -    | Start event at given position                                           |
| ✅     | Pause running timer                                                     | 
| ✅     | Stop running timer                                                      | 
| ✅     | Reload selected event                                                   | 
| ✅     | Select previous event                                                   | 
| ✅     | Select next event                                                       | 
| ✅     | Start [Roll Mode](https://cpvalente.gitbook.io/ontime/features/roll)    | 
| ✅     | Add / remove time (min) to running timer                                | 
| ✅     | Toggle On Air                                                           | 

### Messages Control
Actions related to realtime messages

| Preset | Action                                                                  |
| :---:  | :--------------------                                                   |
| -    | Set message for Stage Timer view                                        |
| ✅     | Toggle visibility of message for Speaker view (above)               | 
| -    | Set message for Public view                                             |
| ✅     | Toggle visibility of message for Public view (above)                    | 
| -    | Set message for Lower Third view                                        | 
| ✅     | Toggle visibility of message for Lower Third view (above)               |
