# Older changes
## 2.0.0-alpha (2026-08-28)

- **BREAKING CHANGE**
- Due to the extensive revision of the vis-1 widgets—including adjustments to
  their configuration attributes—they are no longer directly compatible with
  those from version 1. Recreating the vis-1 widgets is recommended.
- Importing or transferring them from vis-1 to vis-2 is not a viable option.
- Several fundamental concepts regarding the vis-1 widgets have been improved.
- add a complete VIS 2 widget set for player selection and control, favorites,
  playlists, browsing, synchronization, volume and player information
- add PlaylistDetail widgets for VIS 1 and VIS 2 with artwork, track metadata,
  duration, current-track highlighting, scrolling, playback and removal actions
- make player selection available across views and show the related
  SqueezeboxRPC instance in player-widget selectors
- improve the Players and Favorites configuration with reliable show/hide,
  ordering, default-player, custom-label and custom-image options
- improve the Playtime bar with accurate progress updates, an empty state for
  streams without a duration and click-to-seek support
- correct Play, Repeat, Shuffle, Forward and Rewind behavior and provide
  state-aware icons with support for custom button images
- improve widget styling for light and dark designs, including inherited
  colors, reliable borders, spacing, alignment, hover effects and thin scrollbars
- align VIS 1 and VIS 2 DateTime formatting and provide configurable,
  predictable date and time output
- prevent unchanged player and server values from being rewritten and keep
  artwork, artist and other player information stable during status updates
- add comprehensive English user documentation for every VIS 1 and VIS 2
  widget, including previews, configuration tables and usage notes
- add translated datapoint descriptions
- cmdGeneral for server

## 1.6.4 (2026-03-25)

- test remove node 18,extend to node 24
- update packages

## 1.6.2 (2025-05-05)

- fix node version in github workflow

## 1.6.1 (2025-05-05)

- Fix eslint

## 1.6.0 (2025-05-05)

- upgrade dependency js-controller
- new widget, but only alpha version for testing and improvement
- fix issues of adapter checker

## 1.5.2 (2024-12-16)

- fix spelling of iobroker upload squeezeboxrpc in readme
- fix playtime bar

## 1.5.1 (2024-11-29)

- improve documentation
- remove margin from plcontainer
- improve textoverflow with ellipsis
- adjust initial widgetsize of playlist widget
- repair attributes for playlist widget
- add light mode css for playlist widget

## 1.5.0 (2024-11-28)

- Switch to iobroker/eslint
- New widget playlist

## 1.4.0 (2024-11-27)

- fix some missing objects errors
- sanitize more playernames in syncgroups
- add sendTo Command "cmdGeneral"
- sanitize more the playername
- improve translation
- if trackartist is avail then write to artist if empty
- improve handling for artwork_url
- move widget documentation from html to markdown
- adjust responsive tab style
- improve attribute widgets
- change TPE2 handling once more
- jsonConfig add sizing options for differenz screen sizes
- test implementation of TPE2 handling. switch in settings
- add datapoints album_artist, track_artist, artistOriginal

## 1.3.17 (2024-10-23)

- add edit button to the vie index field of favorites widget

## 1.3.16 (2024-10-23)

- fixed icons of the favorites widget

## 1.3.15 (2024-08-09)

- due to a adapter checker issue i have to remove the release 1.3.13 from npm.
  but changes from 1.3.13 are included in 1.3.14

## 1.3.14 (2024-08-05)

- fix formatting

## 1.3.13 (2024-08-05)

- revert the fix for artist handling due to negative effect of spotify

## 1.3.12 (2024-08-05)

- improve cmdGoto handling by kairauer, close PR #74
- fix issues from adapter checker
- integrate squeezenode lib

## 1.3.11 (2024-08-05)

- update adapter structure and switch to jsonconfig

## 1.3.10

- getalbumartist as artist if setting of TPE2/TPE3 in `LMS` are changed"

## 1.3.9

- fix error with deleting favorites
- fix wrong type for datapoint

## 1.3.8

- fix forward button widget

## 1.3.7

- fix object creation of states in player modul

## 1.3.6

- fix object creation of states

## 1.3.5

- fix object creation for favorites

## 1.3.4

- fix object creation for favorites / \* center widgets in sidebar

## 1.3.3

- repair imageproxy for image datapoints of favorites

## 1.3.2

- fix for Alarm contains only enabled Alarms

## 1.3.1

- fix problem with git dependency url

## 1.3.0

- fix problem wit setting own icon in player widget / \* add infos about\
  alarms to a player datapoint

## 1.2.1

- fix small issue in last version

## 1.2.0

- improve handling of imageproxy artwork

## 1.1.0

- make request of favorites configurable

## 1.0.1

- change setstate/createobject logic
- fix role and type for Mode-state
- update tests
- update dependency versions
- improve io-package.json

## 1.0.0

- prepare for stable repository

## 0.8.32

- the adapter function iobroker.deleteChannel didnt works as expected.\
  It didnt delete the whole subtree of states. now i implement my own delete function

## 0.8.31

- change behaviour of deleting favorites

## 0.8.30

- change from the issue of the adapter checker

## 0.8.29

- optimize handling of player state power and connected

## 0.8.28

- add advanced signaling function with telnet and fix some more authorization\
  issues with `LMS`

## 0.8.27

- initialization for the new calctype property if empty in volumebar

## 0.8.26

- more improvement and fixing at volumebar / remove playlist widget from\
  master. not ready yet

## 0.8.25

- fixing css-settings on volumebar

## 0.8.24

- volumebar didnt get events between the segments, change clickevent and calculation

## 0.8.23

- adjust dependencies to remove vulnerabilities in dependend packages.\
  also remove travis due of unresolvable build-failures for win+node10/12

## 0.8.22

- due to iobroker.controller 2.0 a command in the api changed (socket to vis.conn.\_socket)

## 0.8.21

- add command für playing urls

## 0.8.20

- remove node v6 test setting

## 0.8.19

- shorten news history

## 0.8.18 (2019-06-27)

- last minute changes.

## 0.8.17 (2019-06-26)

- add more widges: playtime bar, string, number, datetime, image.\
  add button margin to player and favorite widget, improve editing of viewindex.\
  do some refactoring.

## 0.8.16 (2019-06-24)

- resolve a cross browser issue for firefox. the style.\
  font attribute is empty and you have to construct the font string by yourself

## 0.8.15 (2019-06-19)

- minor issue with not ready states

## 0.8.14 (2019-06-19)

- add syncgroups as new server-datapoint,add syncgroup widget,/
  change some jquery event logic

## 0.8.13 (2019-06-16)

- rename widgetset from squeezeboxrpcwidgets to squeezeboxrpc

## 0.8.12 (2019-06-16)

- sync version with npm

## 0.8.11 (2019-06-15)

- try to integrate the widgets into the main adapter

## 0.8.10 (2019-05-15)

- another try to fix the EADDRINUSE error of the server discovery

## 0.8.9 (2019-05-15)

- try to fix the EADDRINUSE error of the server discovery

## 0.8.8 (2019-05-14)

- make discover configurable

## 0.8.7 (2019-05-11)

- more control features (select playlist pos to play,ffwd,frew,jump to/
  a time position in song,repeat song,random song)

## 0.8.6 (2019-05-10)

- move some configuration options into seperate tabs

## 0.8.5 (2019-05-08)

- change serverdiscovery interval method, remove some double cmd lines,/
  additional minor changes advised from eslint

## 0.8.4

- move some files to lib directory

## 0.8.3

- close port for discovery on unload

## 0.8.2

- sync version with npm

## 0.8.1

- set compact mode flag

## 0.8.0

- implementation of compact mode, change version to represent a realistic/
  feature completness

## 0.0.9

- debug options are now configurable

## 0.0.8

- More playlist attributes + remove trailing and leading spaces from source

## 0.0.7

- Add the playlist to each player as json

## 0.0.6

- More config options

## 0.0.5

- All levels/subdirectories of favorites are now available in iobroker

## 0.0.4

- added the cmdPlayFavorite for each player

## 0.0.3

- repair the no-data symbols for buttons in vis

## 0.0.2

- added autodiscovery

## 0.0.1

- initial release
