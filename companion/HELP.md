# Ontime Companion Module

This module gives control over Ontime leveraging its [WebSockets API](https://docs.getontime.no/api/protocols/websockets/)

## Requirements

- Ontime v4.0.0 or greater

## Connecting to Ontime

To connect companion to Ontime you will need to provide the module with an address to Ontime's server. \
This can be a IP address in your local network, localhost (if you are running everything in the same machine) or a URL for Ontime Cloud.

Ontime provides an interface to generate these links:

1. Navigate to `Editor` -> `Settings` -> `Sharing and reporting` -> `Share link`
2. Select `Companion` as `Ontime view`
3. If your stage is behind a password, activate the `Authenticate` toggle
4. Click the `Create share link` button which adds the address to your clipboard

5. Back to Companion, you can now insert the copied address in the `Ontime server address` field

> in the case of "Bad configuration" error the module will stop retying the connection, manually restart it to try again

## Links

Download ontime or try our cloud service from the website [www.getontime.no](https://www.getontime.no/) \
View full release notes for the module on [GitHub](https://github.com/bitfocus/companion-module-getontime-ontime/releases) \
Read the docs at [http://docs.getontime.no](https://docs.getontime.no/) \
Follow Ontime's development on [GitHub](https://github.com/cpvalente/ontime) \
Join the [discord community](https://discord.com/invite/eje3CSUEXm)

### New for module version 5.4.2-beta.2

> Beta release: please report any issues on GitHub before this is promoted to a stable release.

- Connection no longer silently dies after hours: dead connections are detected within a few seconds and reconnected
- Changing the server address in the config now reconnects without restarting the module
- Hostnames with port (e.g. `ontime.local:4001`) are accepted as server address
- Fixed "Next Event" targeting the current event in the change action and custom field feedback
- Fixed negative times with an hour part (e.g. `-01:30:00`) being parsed with the wrong sign
- Fixed `timer_current_hms` showing a wrong value for one second at every minute change
- Added missing `group_now_custom_*` variables
- Fixed playback toggle into roll mode pausing the timer instead
- Fixed message feedback never matching when no secondary source is selected
- Fixed migration of configs from module version 4 and of message actions from before 5.2
- Custom field feedback picks up changes to custom fields without reconnecting

### New for module version 5.4.1

- Colour and duration variables from event and group
- Target duration variable for groups
- Aux timer name variable

### New for module version 5.4.0

- Upgraded to Module API **2.0** (Node 22 runtime)

### New for module version 5.3.1

- Targets **Companion 4.3+** and Module API **2.0** (Node 22 runtime)
- Stored actions and feedbacks are **migrated automatically** when you upgrade; recheck buttons
- Fixed some action/feedback issues

### New for module version 5.3.0

- Variables as input to add time action
- Variables as input to aux timer values

### New for module version 5.2.0

- Better message feedback
- Variables for flag, group and rundown offsets
- Variables as input to change action on custom fields and title
- A playback toggle action
