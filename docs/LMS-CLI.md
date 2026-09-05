# Lyrion Music Server CLI reference

<!-- markdownlint-disable MD013 -->
<!-- markdownlint-configure-file {"MD013":{"tables":false,"code_blocks":false},"MD033":{"allowed_elements":["details","summary","img","br"]}} -->
<!-- markdownlint-enable MD013 -->

Status: 2026-09-03. Primary compatibility target: stable LMS 9.1 (source commit
`f9c3f51f7a6d264f7e2d2f733ea7ac8fda4c7ffd`). The current upstream default branch
is LMS 9.2 (source commit `ba7d20d4957245f4d35cd483c28494849a69ddc7`).

This is a single-file Markdown edition of the Lyrion Music Server command-line
interface reference. It replaces the old, pre-7.7 monolithic documentation and
has been checked against the command dispatch tables in the LMS 9.1 and 9.2
source trees. LMS was formerly called Logitech Media Server, Squeezebox Server,
SqueezeCenter, and SlimServer.

The reference covers the built-in TCP CLI and its JSON-RPC representation.
Commands supplied by optional third-party plugins are intentionally not treated
as part of the stable core API because they depend on the installed plugin set.

## Quick navigation

- [Using the CLI](#using-the-command-line-interface)
- [General commands](#general-commands)
- [Player commands](#player-commands-and-queries)
- [Database commands](#database-commands-and-queries)
- [Playlist commands](#playlist-commands-and-queries)
- [Compound queries](#compound-queries)
- [Notifications](#notifications)
- [Alarms](#alarm-commands-and-queries)
- [Favorites](#favorites-commands-and-queries)
- [Random play](#randomplay-commands-and-queries)
- [Source-code audit notes](#source-code-audit-notes)

## Compatibility at a glance

| Version | Important CLI additions or changes                                                                                                                           |
| ------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| 9.1     | `albums` sorting by `recentlyplayed` and `playcount`; grouping count tag `2`; artist portrait tag `4`; targeted `rescan album <id>` and `rescan track <id>`. |
| 9.0     | `tags` query for raw file metadata; Works, roles, and classical-music metadata; partial Cometd/JSON support restored.                                        |
| 8.5     | MySqueezebox.com-related behavior removed; `alarmData` support in `status`.                                                                                  |
| 8.4     | Release types and roles in album/title queries; lists of album IDs supported.                                                                                |
| 8.2     | `fulltextsearch` capability query.                                                                                                                           |
| 8.0     | External service IDs (`extid`) supported.                                                                                                                    |
| 7.9     | Virtual libraries and `library_id` filters; `libraries` query; random album sorting and role filters.                                                        |
| 7.7     | Partial/single-directory rescans; `info total duration ?`; playlist-duration tag `DD`.                                                                       |

## Introduction

The Lyrion Music Server provides a command-line interface to the players via
TCP/IP. After starting the server, commands and queries may be sent by
connecting to a specific TCP/IP port. The server will reply echoing the request
(for commands) or by returning the requested data (for queries). By default, the
server will listen for connections on TCP/IP port 9090. This format is designed
for ease of integration into AMX, Crestron and other automation systems.

See [Using the command-line interface](#using-the-command-line-interface) for
details.

### Supported Commands

The available commands and queries are listed below, grouped by their scope:

- [General](#general-commands): general management of the Command Line Interface
  and of the server.
- [Players](#player-commands-and-queries): management of players.
- [Database](#database-commands-and-queries): mangement of the music database.
- [Playlist](#playlist-commands-and-queries): management of the playlist of each
  player.
- [Compound Queries](#compound-queries): queries to get most of the information
  about the server or a player in one convenient query, that can be updated by
  the server automatically.
- [Notifications](#notifications): internal server commands echoed to the CLI by
  using the "listen" or "subscribe" commands.
- [Alarms](#alarm-commands-and-queries): management of alarms.

### Changelog

#### Migration of the CLI documentation (April 2024)

- The CLI documentation was previously included as part of the embedded help in
  the LMS server distribution, accessible as a single (big) HTML page on a url
  like `LMS-SERVER:LMS-PORT/html/docs/cli-api.html`.
- The documentation here is based on `cli-api.html` from LMS Server v8.5. It is
  essentially unchanged, beyond dividing it into separate pages, formatting,
  plus a few corrections.
- Original sections "Deprecated", and "Plugins" have not been migrated.
- Future LMS server distributions (from v9 onwards) will no longer have the CLI
  documentation in the embedded help.

#### Changes starting from Lyrion Music Server 9.1

- Added new [`albums`](#albums) sort orders `recentlyplayed`, `playcount`
- Added `2` tag to [`albums`](#albums) query to return the number of an album's
  groupings.
- Added `4` tag to [`albums`](#albums), [`artists`](#artists),
  [`songs`](#songinfo) und [`status`](#songinfo) query to get the artist
  portrait ID. This ID can be used in a `/contributor/<portraitId>/image` url to
  get the artist's portrait.
- Added option to `rescan album <album_id>` or `rescan track <track_id>`.

#### Changes starting from Lyrion Music Server 9.0

- Added `tags` query to return a file's raw tag information.
- Restore partial Cometd/JSON support for CLI clients

#### Changes starting from Logitech Media Server 8.5

- Removed all calls and code related to MySqueezebox.com related systems.
- Added "alarmData" parameter to the "status" query to report information about
  the upcoming alarm.

#### Changes starting from Logitech Media Server 8.4

- Added support for release types and roles to albums, and titles queries.
- Added support for a list of album IDs while fetching albums.

#### Changes starting from Logitech Media Server 8.2

- Added query to figure out whether fulltext search is enabled or not
  (fulltextsearch).

#### Changes starting from Logitech Media Server 8.0

- Added support for external IDs: when libraries from online music services are
  imported, artists, albums, and titles store the external, service specific ID
  in the 'extid' field. Artists can have multiple, comma separated values, as
  one artist can be found on multiple services.

#### Changes starting from Logitech Media Server 7.9

- Added support for virtual library views. artists, albums, genres, titles etc.
  queries now accept a library_id parameter to filter the results by virtual
  libraries. libraries returns a list of libraries with their name and IDs.
- Added support for new "random" sort order for the albums query.
- Added support for these queries to filter by the contributor's role (role_id).

#### Changes starting from Logitech Media Server 7.7

- Extended "rescan" with optional singledir parameter.
- Added "info total duration ?" query to return the total number of seconds for
  the library.
- Added DD parameter to the "status" query to report total playtime of the
  current queue.

#### Changes starting from Squeezebox Server 7.6

- Added tag 'M' for [`songinfo`](#songinfo) to return track musicmagic_mixable
  value.
- Added tag 'c' for [`songinfo`](#songinfo) to return the track's coverid value,
  used for artwork URLs. If you were using the track's ID directly in artwork
  URLs, you should switch to using the coverid value.
- Added "pragma" command for changing SQLite behavior.
- Added artist_id tagged parameter to artists.
- Added album_id tagged parameter to albums.
- Added sort order 'albumtrack' for titles to return the tracks in the order
  album-title, track-number.
- Added tag 'X' for albums to return the album's replay-gain value.
- Added tag 'S' for albums to return the album's artist_id.
- Added 'play_index' tagged parameter to playlistcontrol.
- In extended queries, return all possible items if the `<itemsPerResponse>`
  parameter is omitted.
- Add the 'u' tag to the "musicfolder" query
- Added track_id tagged parameter to titles.
- Added genre_id tagged parameter to genres.
- Added year and hasAlbums tagged parameters to years.
- Added return_top tagged parameter to musicfolder.
- Removed the charset tagged parameter from all commands that supported it.
- Added the 'Z' tag to albums, artists and genres queries. It generates a
  indexList array or arrays in the result.

#### Changes starting from Squeezebox Server 7.5.1

- Added "playlist preview" command.
- Extended "playlist resume" with optional noplay and wipePlaylist tagged
  params.
- Extended "playlist save" with optional silent tagged param, which will
  suppress any showBriefly popup on squeezeplay players.

#### Changes starting from Squeezebox Server 7.4

- The music_services command is now apps.
- Added "pause" & "stop" subtypes to "playlist" notifications.
- Added "setsncredentials" command.
- Added "logging" command.

#### Changes starting from Squeezebox Server 7.3

- Added 'icon' tag to radios and music_services response.
- Added "syncgroups" query to get a list of sync groups and their members.
- Added "favorites exists" query to check whether an item exists in favorites.

#### Changes starting from Squeezebox Server 7.2

The following syntax changes apply to the CLI in Squeezebox Server 7.2. These
changes may impact CLI clients.

- The "alarm" and "alarms" command and query have been modified to match the
  improved alarm functionality. Most important change is the switch back to
  Sun=0 to Sat=6 days, instead of 0-7, where 0 meant "everyday" and Sun=7.
- The following changes or new commands & queries are available starting with
  Squeezebox Server 7.2. These changes should not have any impact on existing
  clients:

- New notification mechanism for alarms:
  "`alarm <sound|end|snooze|snooze_end> <id>`".
- New query to get localized strings: "getstring
  <STRINGTOKEN1[,STRINGTOKEN2...]>".

#### Changes starting from Squeezebox Server 7.0

The following syntax changes apply to the CLI in Squeezebox Server 7.0. These
changes may impact CLI clients.

- Completely modified the Favorites plugin support. It is now based on
  XMLBrowser, like most of the internet radios, and documented in the Plugins
  section of this document.
- Completely modified live365 support. It is now based on XMLBrowser, like all
  internet radios.
- Deprecated the tag "year_id" in favour of "year" in the "playlistcontrol"
  command.
- Changed how the "status" query behaves if the player one is subscribed to
  disappears.
- Updated the "status" query to return the time stamp of the last change to the
  current player playlist.
- Updated the "playlist newsong" notification to return the song title and
  playlist index.
- Updated the "pref" and "playerpref" commands to support the namespaces for
  preferences.
- Changed tags in queries "status", "titles", "playlists tracks" and
  "[songinfo](#songinfo)" for artist(s)/contributor(s) (band, composer,
  conductor, trackartist, etc) and genre(s). Multiple items may now be returned.
- New notification mechanism for preference changes: "prefset".
- The following changes or new commands & queries are available starting with
  Squeezebox Server 7.0. These changes should not have any impact on existing
  clients:

- Added the "years" query, to enable Browse by Year functionality.
- Added the "musicfolder" query, to enable Browse Music Folder functionality.
- Added the "readdirectory" query, to browse file systems from the server's
  point of view (local & network shares)
- Added the "rescanprogress" query, to report details on scanning progress.
- Added the "abortscan" command, to stop a running scan.
- Added the "serverstatus" query, to return compound server status in a single
  query.
- Added the "playlists new" command to create a stored playlist.
- Added the "prefs" tag to the "players" query, to enable returning the given
  preference values along with each player.
- Added the "canpoweroff", "isplayer" and "uuid" tags to the "players", "player"
  and "serverstatus" queries. to enable returning the given preference values
  along with each player.
- Added the "pref validate" and "playerpref validate" queries to validate
  preferences without setting them.
- Added a tag to return the artist from the "albums" query.
- Added a tag to return if the item is audio from the "XML based" queries.
- Added a tag to allow sorting the results of the "radios" query.
- Added the "name" query/command to get/change the player name.
- Added the "irenable" query/command to enable/disable IR processing for a
  player.
- Added the "displaystatus" query which allows subscription to display update
  messages.
- Updated queries "status", "titles", "playlists tracks" and
  "[`songinfo`](#songinfo)" to support a new tag J to return the
  artwork_track_id (as returned by the "albums"). This enables clients to cache
  one image for all songs of the same album.
- Updated queries "status", "titles", "playlists tracks" and
  "[`songinfo`](#songinfo)" to support new tags for previously missing
  information like sample rate/size, rating, etc.
- Order of tracks passed to "playlistcontrol" command is maintained.
- Command "playlistcontrol" now accepts also a folder_id as returned by the new
  "musicfolder" query.
- Slightly reorganised this document to introduce a "Compound queries" section
  to document queries "serverstatus" and "status".

---

## Using the command-line interface

There are two ways to use the CLI commands: using a raw socket Telnet style
connection, or using the JSON/RPC interface over the HTTP protocol.

### Telnet

LMS provides a command-line interface to the players via TCP/IP. After starting
the server, commands and queries may be sent by connecting to a specific TCP/IP
port. The server will reply echoing the request (for commands) or by returning
the requested data (for queries). By default, the server will listen for
connections on TCP/IP port 9090. This format is designed for ease of integration
into AMX, Crestron and other automation systems.

The end of line separator is line feed (<LF\> ASCII decimal 10, hexadecimal
0x0A). The server accepts LF, CR or 0x00 (or any combination thereof) as end of
line, and replies with whatever was used for the command. For strings, LMS uses
the UTF-8 character-set encoding.

To use the command line interface interactively, use the telnet command from
your system's command prompt: `telnet localhost 9090` and when it connects, you
can start typing commands. Beware that the server expects parameters to be
encoded using percent-style escaping (the same method as is used in URLs); `"`
and `\\` are not supported as in shell-like environments.

A limited subset of the CometD functionality supported over HTTP is also
available to CLI clients. This allows for an alternate command/query and
response syntax using JSON structured data instead of the space delimited
positional parameters and percent-style escaping format.

For debugging purposes, CLI formatted commands can be sent using standard in and
out. This support is only available on Unix platforms (MacOS X included), and
must be enabled by launching the server with the `--stdio` command line option.

#### Practice with a few CLI commands

Log in using telnet on port 9090. Use CLI commands to get the version of LMS,
find a player id, and use that player id to mute the player. After each command
you should get a response.

```sh
telnet localhost 9090
version ?
player id 0 ?​
00:04:20:ab:cd:ef​ mute
```

### jsonrpc.js

You can alternatively use a JSON-RPC 1.0 API over HTTP to interact with the CLI.
This employs POST requests sent to `http://<server>:<port>/jsonrpc.js`, where
port is the normal 9000 http port instead of the 9090 CLI port. There's no need
to create a connection as with telnet.

The Content-Type header should be "application/json" and the body of the request
should include a JSON-encoded object which includes an array containing the
extended query format parameters (see section Command format) as follows:

```json
{"id": 1, "method": "slim.request", "params": [<playerid>, [<command>,
"<start>", "<itemsPerResponse>", "<p3>", "...", "<pN>"]]}
```

The response will be a JSON-encoded object which echoes the params/id/method
parameters from the request, with the requested data present in the "result"
object.

Example:

```sh
> **`curl -g -X POST -d '{"id":1,"method":"slim.request","params":["00:04:20:ab:cd:ef",["playlist","name","?"]]}' http://192.168.1.1:9000/jsonrpc.js`**
```

Response:

```json
{
    "params": ["00:04:20:ab:cd:ef", ["playlist", "name", "?"]],
    "result": { "_name": "Daily Mix" },
    "id": "1",
    "method": "slim.request"
}
```

For commands that are global to the server and do not require a `<playerid>`,
you can substitute 0. There is no error handling when malformed or invalid
requests are attempted — there will either be an empty response {} or you'll
observe an ECONNRESET error.

Note that percent-style encoding of parameters is not needed when using
jsonrpc.js.

#### `GET`ting a request (LMS 9.1+ only)

The same command and data structure as outline before can also be used when
`GET`ting `/jsonrpc.js`. This can be helpful in environments where you want to
have a simple URL to be called, or when `POST` is not an option. In this case
create the same request object, URI encode it, and add it as the parameter
`request`:

**`curl -s http://192.168.1.1:9000/jsonrpc.js?request=%7B%22id%22%3A0%2C%22params%22%3A%5B%2200%3A04%3A20%3A10%3A01%3Axx%22%2C%5B%22pause%22%5D%5D%2C%22method%22%3A%22slim.request%22%7D`**

As you can see the URI encoding does add quite a bit of overhead to the overall
data size. The above represents the same as:

`{"id":0,"params":["00:04:20:10:01:xx",["pause"]],"method":"slim.request"}`

### STDIO (direct input for developers)

If you are a developer and often run Lyrion Music Server from the command line
directly (`./slimserver.pl` or `perl slimserver.pl`) you can enable STDIO mode:
in this mode you can type CLI commands directly in the terminal where you run
the server. In order to do so define an environment variable `LMS_STDIO=1`
before you launch the server. After that you can directly type your commands
where the log output is shown:

```bash
% LMS_STDIO=1 ./slimserver.pl
[26-05-12 07:58:10.7029] main::init (282) Starting Lyrion Music Server (v9.2.0, git-49cc1af44, 2026-05-10 11:03:48 +0200) perl 5.034000 - darwin-thread-multi-2level
[26-05-12 07:58:11.4062] main::init (555) Server done init: http://192.168.0.123:9000
status 0 1
00%3A113A22%3A33%3A44%3A55 status 0 1 player_name%3ALyrion%20Minim player_connected%3A1 player_ip%3A127.0.0.1%3A54820 power%3A1 signalstrength%3A0 mode%3Astop remote%3A1 current_title%3APictures%20-%20Gnarls%20Barkley%20(0) title%3APictures ...
```

### Examples

#### Mute a player

The `mixer muting` command mutes or unmutes the player. Use `0` to unmute, `1`
to mute, `?` to query and no parameter (or `toggle`) to toggle the muting state
of the player.

Mute player `00:04:20:ab:cd:ef`

=== "curl"

```sh
curl -g -X POST -d '{"id":1,"method":"slim.request","params":["00:04:20:ab:cd:ef",["mixer","muting","1"]]}' http://192.168.1.1:9000/jsonrpc.js
```

=== "wget"

```sh
wget -q -O- --post-data='{"id":1,"method":"slim.request","params":["00:04:20:ab:cd:ef",["mixer","muting","1"]]}' http://192.168.1.1:9000/jsonrpc.js
```

=== "nc / ncat"

```sh
printf "00:04:20:ab:cd:ef mixer muting 1\n" | nc 192.168.1.1 9090
```

The response you will get in the case of curl or wget looks like:

```json
{
    "id": 1,
    "method": "slim.request",
    "result": { "_muting": "1" },
    "params": ["00:04:20:ab:cd:ef", ["mixer", "muting", "?"]]
}
```

For ncat the response is `00:04:20:ab:cd:ef mixer muting 1`.

#### Skip to the next track

The `playlist index` command sets or queries the song that is currently playing
by index. When setting, a zero-based value may be used to indicate which song to
play. An explicitly positive or negative number may be used to jump to a song
relative to the currently playing song.

Skip to the next track on player `00:04:20:ab:cd:ef`:

=== "curl"

```sh
curl -g -X POST -d '{"id":1,"method":"slim.request","params":["00:04:20:ab:cd:ef",["playlist","index","+1"]]}' http://192.168.1.1:9000/jsonrpc.js
```

=== "wget"

```sh
wget -q -O- --post-data='{"id":1,"method":"slim.request","params":["00:04:20:ab:cd:ef",["playlist","index","+1"]]}' http://192.168.1.1:9000/jsonrpc.js
```

=== "nc / ncat"

```sh
printf "00:04:20:ab:cd:ef playlist index +1\n" | nc 192.168.1.1 9090
```

---

### Command format

General command and query format The format of the commands, queries and server
replies is as follows:

`[<playerid>] <p0> <p1> ... <pN> <LF>`

where:

`<playerid>` is the unique identifier for the player, usually (but not
guaranteed to be) the MAC address of the player. Some commands are global to the
server and do not require a `<playerid>`. For commands requiring it, a random
player will be selected by the server if the `<playerid>` is omitted, and
returned in the server reply. `<playerid>` may be obtained by using the
`player id` or `players` queries.

`<p0>` through `<pN>` are positional parameters. Pass a `?` to obtain a value
for that parameter in the server response (i.e. send a query). Details of the
parameters vary for each command as described below.

Each parameter needs to be encoded using percent-style escaping, the same method
as is used in URLs; for example, `The Clash?` would be encoded as
`The%20Clash%3F`. This also applies to `<playerid>`. In the examples below, the
escaping is not shown for readability (except `%20` for space).

### Extended query format

A few extended queries are defined, to regroup multiple queries and allow
browsing the server database. These queries return multiple items. Overall
however, their format is compliant with the general command format above:

`[<playerid>] <command> <start> <itemsPerResponse> <p3> ... <pN> <LF>`

where:

`<playerid>` is the unique identifier for the player, as above.

`<command>` is the query name.

`<start>` and `<itemsPerResponse>` are positional parameters that control the
response chunking. `<start>` is a zero-based index of the first item to return,
and `<itemsPerResponse>` is the number of items to return, if possible.

`<p3>` through `<pN>` are tagged parameters. Tags consist of a name followed by
`:`. For example, `artist:Abba`. The tag and the `:` are URL escaped with the
field value. Tag names cannot contain `:` but the data can.

to which the server replies:

```text
[<playerid>] <command> <start> <itemsPerResponse> <p3> ... <pN>
<pN+1> ... <pM> <LF>
```

where:

The entire query is repeated.

`<pN+1>` through `<pM>` is the tagged returned data. A special tag value is
defined in each command to separate the multiple returned items. Data is only
returned when applicable, that is, all possible tags are not always returned.

If the `<itemsPerResponse>` positional parameter and all tagged parameters are
omitted then all possible items are returned.

Example:

The `players` command returns data on all players known by the server. It is a
shortcut call compared to the general CLI API `player count ?` followed by a
number of calls to get the players name, ID, etc. The command must be called
with the chunking parameters. For example, the following returns information on
the first 2 players known by the server (if so many exist), starting from the
first one:

```text
Request: "players 0 2<LF>"
Response: "players 0 2 count:2 playerindex:0 playerid:a5:41:d2:cd:cd:05 ip:127.0.0.1:60488 name:127.0.0.1 model:softsqueeze displaytype:graphic-280x16 connected:1 playerindex:1 playerid:00:04:20:02:00:c8 ip:192.168.1.22:3483 name:Movy model:slimp3 displaytype:noritake-katakana connected:1<LF>"
```

---

### Extended command format

Extended commands are commands that reuse the general principle of tagged
parameters as introduced by extended queries:

`[<playerid>] <command> <p1> ... <pN> <LF>`

where:

`<playerid>` is the unique identifier for the player, as above.

`<command>` is the command name.

`<p1>` through `<pN>` are tagged parameters as defined above.

The server performs the command and returns:

`[<playerid>] <command> <p1> ... <pN> <pN+1> ... <pM> <LF>`

where:

The entire query is repeated.

`<pN+1>` through `<pM>` is the tagged returned data. See the command description
for definitions. In general commands do return some information about the
command performed.

### CometD/JSON format

To use the limited CometD/JSON format over the CLI, first request a `clientId`
by sending a handshake to the `/meta/handshake` channel and then include that
`clientId` in all subsequent commands and queries for the duration of the CLI
session. Note that the requests and responses are encapsulated in a JSON encoded
array. The beginning `[` and ending `]`square brackets are required.

Example:

Send a handshake and receive a response that includes a new `clientId`:

```text
Request: [{"channel":"/meta/handshake"}]
Response: [{"clientId":"3a6772d3","supportedConnectionTypes":["long-polling","streaming"],"successful":true,"advice":{"timeout":60000,"reconnect":"retry","interval":0},"version":"1.0","channel":"/meta/handshake","id":""}]
```

Send a query to the server using the `/slim/request` channel. Note that the
`clientId` is used in two places:

```text
Request: [{"id":"1","clientId":"3a6772d3","channel":"/slim/request","data":{"response":"/slim/3a6772d3/request","request":["00:04:20:02:00:c8",["status","-","1","tags:aclKN"]]}}]
Response: [{"channel":"/slim/request","id":"1","successful":true,"clientId":"3a6772d3"},{"channel":"/slim/3a6772d3/request","id":"1","ext":{"priority":""},"data":{"mode":"stop","playlist repeat":0,"playlist_cur_index":"8","rate":1,"player_connected":1,"player_name":"sodco","player_ip":"10.0.0.33:47924","seq_no":0,"time":0,"duration":299.417,"playlist_timestamp":1723945752.73756,"playlist mode":"off","power":1,"digital_volume_control":1,"mixer volume":90,"playlist_loop":[{"playlist index":8,"id":29926,"title":"Dark Hours","artist":"Shadwick Wilde","coverid":"5466de2c","album":"Forever Home"}],"signalstrength":0,"can_seek":1,"playlist_tracks":10,"playlist shuffle":0}}]
```

---

### Notes

#### Security Settings

The Security settings of the server preferences apply to CLI connections when
they are established. A change in security settings does not affect established
connections. The connection is only accepted from allowed hosts. If password
protection is enabled, the `login` command must be the first command sent after
the connection. Any error in the user and/or password, or using any other
command as the first one, results in the server disconnecting.

#### LMS Preferences apply to CLI

All LMS preferences apply to the CLI data. For examples, the preference about
composers appearing in the artists list applies to the data returned by the
`artists` query.

#### Relative Paths for Songs or Playlists

Commands that use paths to songs or playlists (`<item>` parameters below) can
use relative paths from the root of the Music Library folder to specify songs.
For example, if the Music Library is specified as `D:\mymusic` and you'd like to
refer to a song in that folder named `foo.mp3` you can specify just `foo.mp3` in
the command parameter. Likewise, to refer to items in the Saved Playlist folder,
you can use a prefix of `__playlists/` before the path. For example, to refer to
the saved playlist `bar.m3u` in the Saved Playlists folder, you can specify a
path of `__playlists/bar.m3u`.

#### Cover Art

The HTTP server can return cover art for songs using the track ID as returned by
the CLI functions. If no cover art exists for the given song, the server returns
a special "no artwork" image. Please refer to the Artwork Setup documentation
for more details on artwork management in LMS.

Use the following URL: `http://<server>:<port>/music/<track_id>/cover.jpg`

where:

`<server>` is the ip address or name of the server.

`<port>` is the HTTP port of the server (not the same as the CLI port).

`<track_id>` is the track ID as returned by the CLI functions.

In addition, there is a shortcut URL to return the artwork of the currently
playing song for a player:

`http://<server>:<port>/music/current/cover.jpg?player=<playerid>`

where:

`<server>` is the ip address or name of the server.

`<port>` is the HTTP port of the server (not the same as the CLI port).

`<playerid>` is the unique identifier for the player, as above. If omitted, the
server will use a random player.

#### Positional Parameters

For commands using positional parameters, any extra parameters (after all
required ones) will be returned. For commands using tagged parameters,
parameters using unknown tags will be returned as well. This allows the client
to add to commands and queries some context information.

For example:

```text
Request: "04:20:00:12:23:45 mixer bass ? context<LF>"
Response: "04:20:00:12:23:45 mixer bass 98 context<LF>"

Request: "players 0 2 context:1<LF>"
Response: "players 0 2 context:1 count:2 id:00:04:20:02:00:c8 ...(same as above)"
```

#### Returned URLs, escaping

All paths returned as URLs, for example the ones returned by the query
[`songinfo`](#songinfo) are double URL escaped. To get a useable path (that you
can use with your file system), you will need to unescape the field twice. Also
note the URLs are not translated or re-encoded: they use the encoding of the
underlying filesystem API, typically (but not necessarily) the current locale.

#### Transporter Digital Inputs

Transporter Digital Inputs are handled as remote streams, with a URL starting
with source: followed by `aes-ebu`, `bnc-spdif`, `toslink` or `rca-spdif`.

To set Transporter to the TOSLINK input, use
`<playerid> playlist play source:toslink<LF>`.

When set to a digital input, Transporter reports the URL scheme above to the
various path, url or status queries.

---

## General commands

---

### login

`login <user> <password>`

The `login` command allows the caller to authenticate itself on the server, as
defined in the Security pane of the server preferences. Like any other command,
the user and password must be escaped. If successful, the server replaces the
password with 6 star characters. If unsuccessful, the server returns the same,
then disconnects. If security is off this command is always successful.

Examples:

```text
Request: "login user correctpassword<LF>"
Response: "login user ******<LF>"

Request: "login user wrongpassword<LF>"
Response: "login user ******<LF>" (Connection terminated)
```

---

### can

`can <request terms> ?`

The `can` query allows the caller to determine if the command or query indicated
by `<request terms>` is available.

Examples:

```text
Request: "can info total genres ?<LF>"
Response: "can info total genres 1<LF>"

Request: "can smurf ?<LF>"
Response: "can smurf 0<LF>"
```

---

### version

`version ?`

The `version` query returns version number of the server.

Examples:

```text
Request: "version ?<LF>"
Response: "version 6.5<LF>"
```

---

### listen

`listen <0\|1\|?>`

The `listen` command enables to receive asynchronously internal server commands
(notifications) on the CLI connection. Notifications concern all activity in the
server, not just the activity triggered by the command-line. Use `0` to clear,
`1` to set, `?` to query, and no parameter to toggle the listen state of the
command-line connection.

If only certain notifications are of interrest, consider using the `subscribe`
command below. The `listen` command shares some of its internal plumbing with
`subscribe` so using `subscribe xxx` changes the list of echoed notifications
from nothing or everything to only xxx.

Please consult section [Notifications](#notifications) for a list of possible
notifications.

Examples:

```text
Request: "listen 1<LF>"
Response: "listen 1<LF>"
"04:20:00:12:23:45 mixer volume 25<LF>"
"04:20:00:12:23:45 pause<LF>"
```

---

### subscribe

`subscribe <comma_separated_notification_list>`

The `subscribe` command is similar to `listen` but echoes only a subset of the
notifications, indicated by a comma separated list. If no list is provided, the
notifications are turned off. This command shares some of its internal plumbing
with `listen` so using `listen 0` or `listen 1` changes the list of echoed
notifications (to nothing and everything, respectively).

Please consult section [Notifications](#notifications) for a list of possible
notifications.

Examples:

```text
Request: "subscribe mixer,pause<LF>"
Response: "subscribe mixer,pause<LF>"
"04:20:00:12:23:45 mixer volume 25<LF>"
"04:20:00:12:23:45 pause<LF>"
```

---

### pref

`pref <prefname\|namespace:prefname> <prefvalue\|?>`

The `pref` command allows the caller to set and query the server's internal
preference values. The following affect the behaviour of CLI queries and
commands:

- `authorize`: Security enabled or not. If enabled, usage of the `login` command
  is required.
- `groupdiscs`: handling of multiple disc sets. Affects the `albums` query.
- `variousArtistAutoIdentification`: compilation artists are listed as
  `Various Artists`. Affects the `artists` query.
- `splitList`: delimiter for multiple items in tags. Affects all the queries
  returning genres, mainly `genres`.
- `composerInArtists`, `conductorInArtists`, `bandInArtists`: determines which
  contributors are considered artists. Affects the `info total artists ?` query.

If you want to query/set a preference from a namespace other than `server` (eg.
a plugin), you'll have to prepend the desired namespace to the prefname.

Examples:

```text
Request: "pref audiodir ?<LF>"
Response: "pref audiodir %2fUsers%2fdean%2fDesktop%2ftest%20music<LF>"

Request: "pref plugin.rescan:time ?<LF>"
Response: "pref plugin.rescan:time 32400<LF>"

Request: "pref playlistdir %2fUsers%2fdean%2fplaylists<LF>"
Response: "pref playlistdir %2fUsers%2fdean%2fplaylists<LF>"
```

---

### pref validate

`pref validate <prefname\|namespace:prefname> <prefvalue>`

The `pref validate` command allows the caller to validate a server's internal
preference value without setting it.

If you want to validate a preference from a namespace other than `server` (eg. a
plugin), you'll have to prepend the desired namespace to the prefname.

Examples:

```text
Request: "pref validate bufferSecs 10"
Response: "pref validate bufferSecs valid:1"

Request: "pref validate audiodir %2fsome%2fincorrect%2ffilepath"
Response: "pref validate audiodir valid:0"
```

---

### artworkspec

`artworkspec add <specification> <name>`

The `artworkspec` command allows the caller to set custom artwork resizing
specifications. These are used during a media scan to pre-cache artwork in the
given size and format. The name is optional, but allows to recognize, which
client would have registered a specification.

Example:

```text
artworkspec add 300x300_p My%20Favorite%20Controller%20App
```

---

### logging

`logging <group:logging group> [<persist:1>]`

The `logging` command allows setting some logging levels. Today you can only set
one of the following logging groups: server, radio, transcoding, scanner. The
optional persist parameter defines whether the change should be persistent or
not.

Examples:

```text
Request: "logging group:scanner<LF>"
Response: "logging group:scanner<LF>"
```

---

### getstring

`getstring <STRINGTOKEN1[,STRINGTOKEN2...]>`

The `getstring` command allows the caller to query one or several localized
strings. String tokens can be passed as a single, concatenated value.

Examples:

```text
Request: "getstring HOME <LF>"
Response: "getstring HOME:Startseite <LF>"

Request: "getstring SETTINGS,SCREENSAVERS,HOME <LF>"
Response: "getstring SETTINGS:Einstellungen SCREENSAVERS:Bildschirmschoner HOME:Startseite <LF>"
```

---

### debug

`debug <debug category> <OFF\|FATAL\|ERROR\|WARN\|INFO\|DEBUG\|?\|>`

The `debug` command allows the caller to query or set the server's internal
debugging categories.

- Use 'OFF' to silence,
- 'FATAL' for only seeing fatal errors,
- 'ERROR' for non-fatal errors, etc.
- Finally, using ? will query the current level for the category.

Valid categories can be found under Settings/Advanced/Logging.

Examples:

```text
Request: "debug d_files ?<LF>"
Response: "debug d_files 0<LF>"

Request: "debug d_itunes 0<LF>"
Response: "debug d_itunes 0<LF>"

Request: "debug d_stream 1<LF>"
Response: "debug d_stream 1<LF>"

Request: "debug d_stream<LF>"
Response: "debug d_stream 0<LF>"
```

---

### exit

`exit`

The `exit` command closes the TCP connection with the server and terminates the
Command Line Interface session.

Example:

```text
Request: "exit<LF>"
Response: "exit<LF>"
(Connection terminated)
```

### stopserver

`stopserver`

The `stopserver` command shuts down the server.

Example:

```text
Request: "stopserver<LF>"
Response: "stopserver<LF>"
(Connection terminated)
```

### restartserver

`restartserver`

The `restartserver` command restarts the server. Please note that restarting the
server using this command is not available on all platforms.

Example:

```text
Request: "restartserver<LF>"
Response: "restartserver<LF>"
(Connection terminates and server is being restarted)
```

---

## Player commands and queries

---

### `player`

Various subcommands which return information about players. Different commands
are used to set player attributes.

#### `player count`

`player count ?`

The `player count ?` query returns the number of players connected to the
server.

Example:

```text
Request: "player count ?<LF>"
Response: "player count 2<LF>"
```

#### `player id`

`player id <playerindex> ?`

The `player id ?` query returns the unique identifier of a player, (`<playerid>`
parameter of many CLI commands). For physical players this is generally the MAC
address. The IP address is used for remote streams.

Example:

```text
Request: "player id 0 ?<LF>" (or) "0 player id ?"
Response: "player id 0 04:20:00:12:23:45<LF>"
```

#### `player uuid`

`<playerindex> player uuid ?`

The `player uuid ?` query returns the player uuid.

Example:

```text
Request: "player uuid 0 ?<LF>" (or) "0 player uuid ?"
Response: "player uuid 0 012345678901234567890123456789012<LF>"
```

#### `player name`

`player name <playerindex\|playerid> ?`

The `player name ?` query returns the human-readable name for the specified
player. If the name has not been specified by the user in the Player Settings,
then a default name will be used, usually the IP address.

Example:

```text
Request: "player name 0 ?<LF>" or "0 player name ?"
Response: "player name 0 Living Room<LF>"
```

#### `player ip`

`player ip <playerindex\|playerid> ?`

The `player ip ?` query returns the IP address (along with port number) of the
specified player.

Example:

```text
Request: "player ip 0 ?<LF>" or "0 player ip ?"
Response: "player ip 0 192.168.1.22:3483<LF>"
```

#### `player model`

`player model <playerindex\|playerid> ?`

The `player model ?` query returns the model of the player, currently one of
`transporter`, `squeezebox2`, `squeezebox`, `slimp3`, `softsqueeze`, or `http`
(for remote streaming connections).

Example:

```text
Request: "player model 0 ?<LF>" or "0 player model ?"
Response: "player model squeezebox<LF>"
```

#### `player isplayer`

`player isplayer <playerindex\|playerid> ?`

Whether a player is a known player model. Currently know models are
`transporter`, `squeezebox2`, `squeezebox`, `slimp3`, `softsqueeze`, or `http`
(for remote streaming connections). Will return `0` for streaming connections.

Example:

```text
Request: "player isplayer 0 ?<LF>" or "0 player isplayer ?"
Response: "player isplayer 1<LF>"
```

#### `player displaytype`

`player displaytype <playerindex\|playerid> ?`

The `player displaytype ?` query returns the display model of the player.
Graphical display types start with `graphic-`, non-graphical display type with
`noritake-`.

Example:

```text
Request: "player displaytype 0 ?<LF>" or "0 player displaytype ?"
Response: "player displaytype 0 noritake-katakana<LF>"
```

#### `player canpowerpoff`

`player canpoweroff <playerindex\|playerid> ?`

Returns whether a player can be powered off or not. Current hardware players and
SoftSqueeze would return `1`, web clients `0`.

Examples:

```text
Request: "player canpoweroff 04:20:00:12:23:45 ?<LF>"
Response: "player canpoweroff 04:20:00:12:23:45 1<LF>"

Request: "player canpoweroff 192.168.0.39 ?<LF>"
Response: "player canpoweroff 192.168.0.39 0<LF>"
```

---

### `signalstrength`

`<playerid> signalstrength ?`

Returns the wireless signal strength for the player, range is `1` to `100`.
Returns `0` if not connected wirelessly.

Example:

```text
Request: "04:20:00:12:23:45 signalstrength ?<LF>"
Response: "04:20:00:12:23:45 signalstrength 76<LF>"
```

---

### `name`

`<playerid> name <newname\|?>`

Sets the name of the player. You may query the player name by passing in `?`
(equivalent to `player name ?`.)

Example:

```text
Request: "04:20:00:12:23:45 name ?<LF>"
Response: "04:20:00:12:23:45 name Lightyears<LF>"

Request: "04:20:00:12:23:45 name Buzz<LF>"
Response: "04:20:00:12:23:45 name Buzz<LF>"
```

---

### `connected`

`<playerid> connected ?`

Returns the connected state of the player, `1` or `0` depending on the state of
the TCP connection to the player. SLIMP3 players, since they use UDP, always
return `1`.

Examples:

```text
Request: "04:20:00:12:23:45 connected ?<LF>"
Response: "04:20:00:12:23:45 connected 1<LF>"
```

---

### `sleep`

`<playerid> sleep <number\|?>`

The `sleep` command specifies a number of seconds to continue playing before
powering off the player. You may query the amount of time until the player
sleeps by passing in `?`.

Examples:

```text
Request: "04:20:00:12:23:45 sleep ?<LF>"
Response: "04:20:00:12:23:45 sleep 105.3<LF>"

Request: "04:20:00:12:23:45 sleep 300<LF>"
Response: "04:20:00:12:23:45 sleep 300<LF>"
```

---

### `sync`

`<playerid> sync <playerindex\|playerid\|-\|?>`

The `sync` command specifies the player to synchronise with the given playerid.
The command accepts only one playerindex or playerid. To unsync the player, use
the `-` parameter.

Note that in both cases the first `<playerid>` is the player which is already a
member of a sync group. When adding a player to a sync group, the second
specified player will be added to the group which includes the first player, if
necessary first removing the second player from its existing sync-group.

You may query which players are already synced with this player by passing in a
`?` parameter. Multiple playerids are separated by a comma. If the player is not
synced, `-` is returned.

Examples:

```text
Request: "04:20:00:12:23:45 sync 1<LF>"
Response: "04:20:00:12:23:45 sync 1<LF>"

Request: "04:20:00:12:23:45 sync ?<LF>"
Response: "04:20:00:12:23:45 sync 04:20:00:12:23:21<LF>"

Request: "04:20:00:12:23:45 sync -<LF>"
Response: "04:20:00:12:23:45 sync -<LF>"
```

---

### `syncgroups`

`syncgroups ?`

The `syncgroups` query returns a comma separated list of sync groups members
(IDs and names).

Examples:

```text
Request: "syncgroups ?<LF>"
Response: "syncgroups sync_members:04:20:00:12:23:45,04:20:00:12:34:56 sync_member_names:Living%20Room,Kitchen<LF>"
```

---

### `power`

`<playerid> power <0\|1\|?\|>`

The `power` command turns the player on or off. Use `0` to turn off, `1` to turn
on, `?` to query and no parameter to toggle the power state of the player. For
remote streaming connections, the command does nothing and the query always
returns `1`.

Examples:

```text
Request: "04:20:00:12:23:45 power 1<LF>"
Response: "04:20:00:12:23:45 power 1<LF>"

Request: "04:20:00:12:23:45 power ?<LF>"
Response: "04:20:00:12:23:45 power 1<LF>"
```

---

### `mixer`

Various subcommands which return or set mixer settings.

#### `mixer volume`

`<playerid> mixer volume <0 .. 100\|-100 .. +100\|?>`

The `mixer volume` command returns or sets the current volume setting for the
player. The scale is `0` to `100`, in real numbers (i.e. `34.5` is valid). If
the player is muted, the volume is returned as a negative value.

Note that the old ip3k based players display a `0` to `40` scale, that is, the
`0..100` volume divided by `2.5` (two and a half). Likewise, using the `button`
command with `volume_up` or `volume_down` parameters increases or decreases the
volume by 2.5 (two and a half). If you want more granular control use the
`mixer volume` command with the increment of your liking.

Examples:

```text
Request: "04:20:00:12:23:45 mixer volume ?<LF>"
Response: "04:20:00:12:23:45 mixer volume 98<LF>"

Request: "04:20:00:12:23:45 mixer volume 25<LF>"
Response: "04:20:00:12:23:45 mixer volume 25<LF>"

Request: "04:20:00:12:23:45 mixer volume +10<LF>"
Response: "04:20:00:12:23:45 mixer volume +10<LF>"
```

#### `mixer muting`

`<playerid> mixer muting <0\|1\|toggle\|?\|>`

The `mixer muting` command mutes or unmutes the player. Use `0` to unmute, `1`
to mute, `?` to query and no parameter (or 'toggle') to toggle the muting state
of the player. Note also the `mixer volume` command returns a negative value if
the player is muted.

Example:

```text
Request: "04:20:00:12:23:45 mixer muting<LF>"
Response: "04:20:00:12:23:45 mixer muting<LF>"
```

#### `mixer bass`

`<playerid> mixer bass <0 .. 100\|-100 .. +100\|?>`

The `mixer bass` command returns or sets the current bass setting for the
player. This is only supported by SliMP3 and SqueezeBox (SB1) players. For more
information on the `0 to 100` scale, please
[refer to the `mixer volume` command](#mixer-volume).

Example:

```text
Request: "04:20:00:12:23:45 mixer bass ?<LF>"
Response: "04:20:00:12:23:45 mixer bass 98<LF>"

Request: "04:20:00:12:23:45 mixer bass 25<LF>"
Response: "04:20:00:12:23:45 mixer bass 25<LF>"

Request: "04:20:00:12:23:45 mixer bass +10<LF>"
Response: "04:20:00:12:23:45 mixer bass +10<LF>"
```

#### `mixer treble`

`<playerid> mixer treble <0 .. 100\|-100 .. +100\|?>`

The `mixer treble` command returns or sets the current treble setting for the
player. This is only supported by SliMP3 and SqueezeBox (SB1) players. For more
information on the `0 to 100` scale, please
[refer to the `mixer volume` command](#mixer-volume).

Example:

```text
Request: "04:20:00:12:23:45 mixer treble ?<LF>"
Response: "04:20:00:12:23:45 mixer treble 98<LF>"

Request: "04:20:00:12:23:45 mixer treble 25<LF>"
Response: "04:20:00:12:23:45 mixer treble 25<LF>"

Request: "04:20:00:12:23:45 mixer treble +10<LF>"
Response: "04:20:00:12:23:45 mixer treble +10<LF>"
```

#### `mixer pitch`

`<playerid> mixer pitch <80 .. 120\|-40 .. +40\|?>`

The `mixer pitch` command returns or sets the current pitch setting for the
player (only supported by SqueezeBox (SB1) players).

Example:

```text
Request: "04:20:00:12:23:45 mixer pitch ?<LF>"
Response: "04:20:00:12:23:45 mixer pitch 98<LF>"

Request: "04:20:00:12:23:45 mixer pitch 80<LF>"
Response: "04:20:00:12:23:45 mixer pitch 80<LF>"

Request: "04:20:00:12:23:45 mixer pitch +10<LF>"
Response: "04:20:00:12:23:45 mixer pitch +10<LF>"
```

---

### `show`

`<playerid> show <taggedParameters>`

The `show` command displays a message on the player display for a given
duration. Various options are provided to customize the appearance of the
message (font size, centering). If the mesage is too long to fit on the display,
it scrolls.

This command is designed to display the message, and by default temporarily
cancels any screensaver and increases the brightness to the maximum value.

This command is only echoed once the message display is done.

Please note the CLI expects parameters to be encoded using percent-style
escaping (see above): space is represented by `%20`. See the examples.

**Accepted tagged parameters:**

| Tag          | Description                                                                                                                                                                                                     |
| ------------ | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `line1`      | First line of the display.                                                                                                                                                                                      |
| `line2`      | Second line of the display. This is the line used for single line display mode (font = huge).                                                                                                                   |
| `duration`   | Time in seconds to display the message; this time does not take into account any scrolling time necessary, which will be performed to its completion. The default is `3` seconds.                               |
| `brightness` | Brightness to use to display the message, either 'powerOn', 'powerOff', 'idle' or a value from `0` to `4`. The default value is `4`. The display brightness is reset to its configured value after the message. |
| `font`       | Use value `huge` to have `line2` displayed in a large font using the entire display. The actual font used depends on the player model. Otherwise the command uses the standard, `2` lines display font.         |
| `centered`   | Use value `1` to center the lines on the display. There is no scrolling in centered mode.                                                                                                                       |
| `screen`     | Screen to display text on. Use to display on transporter second screen, i.e. screen:2                                                                                                                           |

Examples:

```text
Request: "04:20:00:12:23:45 show line1:Hello%20World line2:Second%20line duration:1 centered:1<LF>"
Response: "04:20:00:12:23:45 show line1:Hello%20World line2:Second%20line duration:1 centered:1<LF>"
```

---

### `display`

`<playerid> display <line1> <line2> <duration>`

The `display` command specifies some text to be displayed on the player screen
for a specified amount of time (in seconds). Please note the CLI expects
parameters to be encoded using percent-style escaping (see above): space is
represented by `%20`. See the examples.

Examples:

```text
Request: "04:20:00:12:23:45 display Hello World 5<LF>"
Response: "04:20:00:12:23:45 display Hello World 5<LF>"

Request: "04:20:00:12:23:45 display Hello%20World Second%20Line 5<LF>"
Response: "04:20:00:12:23:45 display Hello%20World Second%20Line 5<LF>"
```

---

### `linesperscreen`

`<playerid> linesperscreen ?`

The `linesperscreen` command returns how many lines of text can fit in the
display, depending on its current setting or font.

Examples:

```text
Request: "04:20:00:12:23:45 linesperscreen ?<LF>"
Response: "04:20:00:12:23:45 linesperscreen 1<LF>"
```

---

### `display` query

`<playerid> display ? ?`

The `display ? ?` command may be used to obtain the text that is currently
displayed on the screen.

Examples:

```text
Request: "04:20:00:12:23:45 display ? ?<LF>"
Response: "04:20:00:12:23:45 display Hello World<LF>"
```

---

### `displaynow`

`<playerid> displaynow ? ?`

The `displaynow` command provides access to the data currently on the display.
This differs from the `display ? ?` command in that it returns the latest data
sent to the display, including any animation, double-size fonts, etc...

Examples:

```text
Request: "04:20:00:12:23:45 displaynow ? ?<LF>"
Response: "04:20:00:12:23:45 display Hello World<LF>"
```

---

### `playerpref`

`<playerid> playerpref <prefname\|namespace:prefname> <prefvalue\|?>`

The `playerpref` command allows the caller to set and query the server's
internal player-specific preferences values.

If you want to query/set a preference from a namespace other than `server` (eg.
a plugin), you'll have to prepend the desired namespace to the prefname.

Examples:

```text
Request: "04:20:00:12:23:45 playerpref doublesize ?"
Response: "04:20:00:12:23:45 playerpref doublesize 1"

Request: "04:20:00:12:23:45 playerpref doublesize 0"
Response: "04:20:00:12:23:45 playerpref doublesize 0"
```

`<playerid> playerpref validate <prefname\|namespace:prefname> <prefvalue>`

The `playerpref validate` command allows the caller to validate a server's
internal player-specific preference value without setting it.

If you want to validate a preference from a namespace other than `server` (eg. a
plugin), you'll have to prepend the desired namespace to the prefname.

Examples:

```text
Request: "04:20:00:12:23:45 playerpref validate scrollPause 3"
Response: "04:20:00:12:23:45 playerpref validate scrollPause valid:1"

Request: "04:20:00:12:23:45 playerpref validate scrollRate fast"
Response: "04:20:00:12:23:45 playerpref validate scrollRate valid:0"
```

---

### `button`

`<playerid> button <buttoncode>`

The `button` command simulates a button press. Valid button codes correspond to
the functions defined in the Default.map file.

Example:

```text
Request: "04:20:00:12:23:45 button stop<LF>"
Response: "04:20:00:12:23:45 button stop<LF>"
```

---

### `ir`

`<playerid> ir <ircode> <time>`

The `ir` command simulates an IR code. Valid IR codes are defined in the
Default.map file.

Example:

```text
Request: "bd:a5:a9:9b:9d:df ir 768910ef 11073.575<LF>"
Response: "bd:a5:a9:9b:9d:df ir 768910ef 11073.575<LF>"
```

---

### `irenable`

`<playerid> irenable <0\|1\|?\|>`

The `irenable` command enables or disables IR processing for the player on or
off. Use `0` to disable, `1` to enable, `?` to query and no parameter to toggle
IR processing of the player. For remote streaming connections, the command does
nothing and the query always returns `1`.

Examples:

```text
Request: "04:20:00:12:23:45 irenable 1<LF>"
Response: "04:20:00:12:23:45 irenable 1<LF>"

Request: "04:20:00:12:23:45 irenable ?<LF>"
Response: "04:20:00:12:23:45 irenable 1<LF>"
```

---

### `connect`

`<playerid> connect <ip>`

The `connect` command tells a Squeezebox 2 or newer player to connect to a
different server address.

Supported values are:

ip - A dotted IP address to connect to.

If the player is currently a member of a sync-group, then all players in the
sync-group will be instructed to switch to the new server and re-establish the
sync-group.

Example:

```text
Request: "bd:a5:a9:9b:9d:df connect 192.168.1.10<LF>"
Response: "bd:a5:a9:9b:9d:df connect 192.168.1.10<LF>"
```

---

### `client forget`

`<playerid> client forget`

The `client forget` command deletes the client/player from the server database.

Example:

```text
Request: "bd:a5:a9:9b:9d:df client forget<LF>"
Response: "bd:a5:a9:9b:9d:df client forget<LF>"
```

---

### `disconnect`

`disconnect <playerid> <ip>`

The `disconnect` command tells a Squeezebox 2 or newer player on another server
instance to disconnect from its server and connect to us. This is the opposite
of `connect`, where we tell a player connected to us to connect to a different
server.

Supported values are:

ip - A dotted IP address to connect to.

Example:

```text
Request: "disconnect bd:a5:a9:9b:9d:df 192.168.1.10<LF>"
Response: "disconnect bd:a5:a9:9b:9d:df 192.168.1.10<LF>"
```

---

### `players`

`players <start> <itemsPerResponse>`

The `players` query returns information about all `players` (physical players as
well as streaming clients) known by the server.

- `players 0` will return info about all players.
- `players 3 2` will return information about two players starting with
  playerindex 3
- `players 2 1` will return info about the player with playerindex 2

**Accepted tagged parameters:**

| Tag         | Description                                                            |
| :---------- | :--------------------------------------------------------------------- |
| playerprefs | Comma separated list of preference values to return (for each player). |

**Returned tagged parameters:**

Results returned as two blocks.

- First a block containing just the count of players
- Secondly a standard set of data for each player
    - Info for each player can in addition include values as per the list of
      preferences included in the optional playerprefs parameter.

| Block                                | Tag         | Description                                                                                                                                                                    |
| ------------------------------------ | ----------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| **First block:**                     |             |                                                                                                                                                                                |
|                                      | count       | Number of players known by the server. Equivalent to `player count ?`.                                                                                                         |
| **For each player:**                 |             |                                                                                                                                                                                |
|                                      | playerindex | Player index. Values 0, 1, 2 etc                                                                                                                                               |
|                                      | playerid    | Player unique identifier. Equivalent to `player id <playerindex> ?`.                                                                                                           |
|                                      | uuid        | Player uuid. Equivalent to `player uuid <playerindex> ?`.                                                                                                                      |
|                                      | ip          | Player IP and port. Equivalent to `player ip <playerindex                                                                            \| playerid> ?`.                          |
|                                      | name        | Player name. Equivalent to `player name <playerindex                                                                                 \| playerid> ?`.                          |
|                                      | seq_no      | _Not clear what this is._                                                                                                                                                      |
|                                      | model       | Player model. Values like `squeezebox3`, `baby`, `squeezelite`. Equivalent to `player model <playerindex                             \| playerid> ?`.                          |
|                                      | modelname   | Model name, values like `Squeezebox Classic`, `Squeeezebox Radio`, `Squeezelite-X`.                                                                                            |
|                                      | power       | Indicatess if player is powered on. Returns 1 for True, 0 for False. Equivalent to `<playerid> power ?`.                                                                       |
|                                      | isplaying   | Indicates if player currently playing. Returns 1 for True, 0 for False.                                                                                                        |
|                                      | displaytype | Player display type. Not returned for streaming connections. Equivalent to `player displaytype <playerindex                          \| playerid> ?`.                          |
|                                      | isplayer    | Whether a player is a known player model. Will return 0 for streaming connections. Equivalent to `player isplayer <playerindex       \| playerid> ?`.                          |
|                                      | canpoweroff | Whether the player can be powered off. This value is false for streaming connections. Equivalent to `player canpoweroff <playerindex \| playerid> ?`                           |
|                                      | connected   | Connected state. Equivalent to `<playerid> connected ?`.                                                                                                                       |
|                                      | firmware    | Firmware version                                                                                                                                                               |
| **For each defined pref requested:** |             |                                                                                                                                                                                |
|                                      | prefName    | Preference value. Only if the value is defined. Equivalent to `<playerid> playerpref <prefname                                       \| namespace:prefname> <prefvalue \| ?>`. |

Examples:

```text
Request: "players"
Response: "players  count:3"

Request: "players 0 2 playerprefs:doublesize,idleBrightness<LF>"
Response: "players 0 2 count:2
playerindex:0 playerid:a5:41:d2:cd:cd:05 ip:127.0.0.1:60488 name:127.0.0.1 model:softsqueeze displaytype:graphic-280x16 connected:1 doublesize:0 idleBrightness:2
playerindex:1 playerid:00:04:20:02:00:c8 ip:192.168.1.22:3483 name:Movy model:slimp3 displaytype:noritake-katakana connected:1 doublesize:1 idleBrightness:1
<LF>"

Request: "players 0 4"
Response: "players 0 4 count:4
playerindex:0 playerid:a0:ce:c8:ce:a1:3b uuid: ip:192.168.5.20:50591 name:Squeezelite-X seq_no:0 model:squeezelite modelname:Squeezelite-X power:1 isplaying:1 displaytype:none isplayer:1 canpoweroff:1 connected:1 firmware:v1.9.9-1419
playerindex:1 playerid:00:04:20:28:c7:f1 uuid:ca1c8fbf2d48cbb1c859b5ea7ce4ecf9 ip:192.168.5.102:41372 name:Stalking Horse seq_no:41 model:baby modelname:Squeezebox Radio power:1 isplaying:1 displaytype:none isplayer:1 canpoweroff:1 connected:1 firmware:8.0.1-r16924
playerindex:2 playerid:00:04:20:2a:e0:74 uuid:7147ee259b66f5c9c39c0eb14cfefb5c ip:192.168.5.101:40890 name:Runcible Red seq_no:2 model:baby modelname:Squeezebox Radio power:1 isplaying:0 displaytype:none isplayer:1 canpoweroff:1 connected:1 firmware:8.0.1-r16924
playerindex:3 playerid:00:04:20:12:ae:f5 uuid: ip:192.168.5.103:28931 name:Dittography seq_no:0 model:squeezebox3 modelname:Squeezebox Classic power:1 isplaying:1 displaytype:graphic-320x32 isplayer:1 canpoweroff:1 connected:1 firmware:137<LF>"
```

---

## Database commands and queries

---

### rescan

`rescan <\|playlists\|onlinelibrary\|external\|full\|album\|track <item>\|?>`

The `rescan` command causes the server to rescan the entire music library,
reloading the music file information. You can define different types of scans,
and in some cases an item you want to scan (path, album/track ID):

- If `playlists` is indicated (`rescan playlists`), only the playlist directory
  is rescanned.
- If `onlinelibrary` is indicated (`rescan onlinelibrary`), only the import from
  online music services is run.
- If `external` is requested, the rescan will be performed using the external
  scanner process instead of the in-process scanner.
- If `full file://some/path` is defined, then only this path will be scanned.
- If `album <album_id>` or `track <track_id>` are requested, then only that
  album's or track's folder is scanned (LMS 9.1+). These are quick server
  internal updates and won't run all the plugin importers!
- Issued with a `?`, `rescan ?` returns whether the server is currently
  scanning.

Scanning occurs when the server starts and following `rescan` and `wipecache`
commands.

Examples:

```text
Request: "rescan<LF>"
Response: "rescan<LF>"

Request: "rescan ?<LF>"
Response: "rescan 1<LF>"
```

---

### rescanprogress

`rescanprogress`

The `rescanprogress` query returns details on the scanning progress. This query
does not take any parameters.

**Returned tagged parameters:**

| Tag              | Description                                                                                                                                                                                                                                                                                                                                                                                                               |
| ---------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `rescan`         | Returned with value 1 if the server is still scanning the database, otherwise returned with value 0 and the fields below are not returned.                                                                                                                                                                                                                                                                                |
| `totaltime`      | Total elapsed time since the start of the scan, format `hh:mm:ss`.                                                                                                                                                                                                                                                                                                                                                        |
| `importer`       | A completion percentage for each importer. Importers include:-<br> `directory` (Music folder), <br>`playlist`(Playlist folder), <br>`iTunes` (iTunes), <br>`musicip` (MusicIP), <br><br> as well as more technical ones such as <br> `mergeva` (Various Artists merging) and <br> `dboptimize` (Database optimization).<BR><BR> The type, quantity and order of importers is determined dynamically as rescan progresses. |
| `info`           | Additional information about the current scanning step, like eg. the currently scanned file name.                                                                                                                                                                                                                                                                                                                         |
| `steps`          | Scanning steps in the order they've been executed.                                                                                                                                                                                                                                                                                                                                                                        |
| `lastscanfailed` | Information about a possible failure in case a scan has not finished in an attended manner.                                                                                                                                                                                                                                                                                                                               |

Example:

```text
Request: "rescanprogress<LF>"
Response: "rescanprogress rescan:1 totaltime:00:00:07 directory:100 playlist:100 itunes:15 <LF>"

Request: "rescanprogress<LF>"
Response: "rescanprogress rescan:1 totaltime:00:01:04 directory:100 playlist:100 itunes:100 itunes_playlists:100 mergeva:100 cleanup1:100 cleanup2:100 dboptimize:47 <LF>"
```

---

### abortscan

`abortscan`

The `abortscan` command causes the server to cancel a running scan. Please note
that after stopping a scan this way you'll have to fully rescan your music
collection to get consistent data.

Examples:

```text
Request: "abortscan<LF>"
Response: "abortscan<LF>"
```

---

### wipecache

`wipecache`

The `wipecache` command allows the caller to have the server rescan its music
library, reloading the music file information. This differs from the `rescan`
command in that it first clears the tag database. During a rescan triggered by
`wipecache`, `rescan ?` returns true.

Examples:

```text
Request: "wipecache<LF>"
Response: "wipecache<LF>"
```

---

### libraries

`libraries`

The `libraries` query returns a list of known library views with their ID to the
caller.

Examples:

```text
Request: "libraries<LF>"
Response: "libraries id:8c7ee510 name:FLAC%20files%20only<LF>"
```

---

### libraries getid

`<playerid> libraries getid`

The `libraries getid` query returns the ID and the name of library set to be
used by the given player. Returns id:0 and no name if no library is active.

Examples:

```text
Request: "04:20:00:12:23:45 libraries getid<LF>"
Request: "04:20:00:12:23:45 libraries getid id:8c7ee510 name:FLAC%20files%20only<LF>"
```

---

### info total genres

`info total genres ?`

The `info total genres ?` query returns the number of unique genres in the
server music database.

Examples:

```text
Request: "info total genres ?<LF>"
Response: "info total genres 18<LF>"
```

---

### info total artists

`info total artists ?`

The `info total artists ?` query returns the number of unique artists in the
server music database. The `Composer, band and orchestra in artists` preference
(Server Settings, Behavior) determines which contributors are considered
artists.

Examples:

```text
Request: "info total artists ?<LF>"
Response: "info total artists 18<LF>"
```

---

### info total albums

`info total albums ?`

The `info total albums ?` query returns the number of unique albums in the
server music database.

Examples:

```text
Request: "info total albums ?<LF>"
Response: "info total albums 18<LF>"
```

---

### info total songs

`info total songs ?`

The `info total songs ?` query returns the number of unique songs in the server
music database.

Examples:

```text
Request: "info total songs ?<LF>"
Response: "info total songs 18<LF>"
```

---

### info total duration

`info total duration ?`

The `info total duration ?` query returns the number of seconds playtime in the
server music database.

Examples:

```text
Request: "info total duration ?<LF>"
Response: "info total duration 66109<LF>"
```

---

### genres

`genres <start> <itemsPerResponse> <taggedParameters>`

The `genres` query returns all genres known by the server.

Note that the server supports multiple genres per track, depending on the
`Multiple items in tags` preference (Server Settings, Behavior).

**Accepted tagged parameters:**

| Tag          | Description                                                                                                                                    |
| ------------ | ---------------------------------------------------------------------------------------------------------------------------------------------- |
| `search`     | Search string. The search is case insensitive and obeys the `Search Within Words` server parameter.                                            |
| `artist_id`  | Limit results to those genres proposed by the artist identified by `artist_id`.                                                                |
| `album_id`   | Limit results to those genres available on the album identified by `album_id`.                                                                 |
| `track_id`   | Limit results to the genres of the track identified by `track_id`. If present, other filters are ignored.                                      |
| `genre_id`   | Limit results to the genre identified by `genre_id`. The genre_id may be a list of comma separated IDs. If present, other filters are ignored. |
| `library_id` | Virtual library ID, to restrict the results to a virtual library view.                                                                         |
| `year`       | Limit results to the genres of the tracks of the given `year`.                                                                                 |
| `tags`       | Determines which tags are returned. Each returned tag is identified by a letter (see below). The default value is empty.                       |

**Returned tagged parameters:**

| Block               | Tag             | Description                                                                                                                                          |
| ------------------- | --------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------- |
| **First block:**    |                 |                                                                                                                                                      |
|                     | `rescan`        | Returned with value 1 if the server is still scanning the database. The results may therefore be incomplete. Not returned if no scan is in progress. |
|                     | `count`         | Number of results returned by the query. If no filter parameter is present, this is the same value as returned by `info total genres ?`.             |
|                     | `CC` `count`    | - Only return the number of results, but not the results themselves.                                                                                 |
|                     | `Z` `indexList` | An array of arrays indicating how many items start with each key letter.                                                                             |
| **For each genre:** |                 |                                                                                                                                                      |
|                     | `id`            | Genre ID. Item delimiter.                                                                                                                            |
|                     | `genre`         | Genre name.                                                                                                                                          |
|                     | `s`             | textkey                                                                                                                                              |

The genre's `textkey` is the first letter of the sorting key.

Example:

```text
Request: "genres 0 5<LF>"
Response: "genres 0 5 rescan:1 count:6 id:3 genre:Acid%20Jazz id:4 genre:Alternative%20&%20Punk id:5 genre:French id:6 genre:No%20Genre id:7 genre:Pop <LF>"

Request: "genres 0 5 search:unk<LF>"
Response: "genres 0 5 search:unk count:1 id:4 genre:Alternative%20&%20Punk<LF>"
```

---

### artists

`artists <start> <itemsPerResponse> <taggedParameters>`

The `artists` query returns all artists known by the server. The results of this
query depend in part on the `Compilations` preference (Server Settings,
Behavior). The `Various Artists` pseudo-artist appears if the server groups
compilations.

**Accepted tagged parameters:**

| Tag                           | Description                                                                                                                                                                                                                                                                                                                                                                        |
| ----------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `search`                      | Search substring. The search is case insensitive and obeys the `Search Within Words` server parameter.                                                                                                                                                                                                                                                                             |
| `genre_id`                    | Genre ID, to restrict the results to those artists with songs of that genre. The genre_id may be a list of comma separated IDs.                                                                                                                                                                                                                                                    |
| `album_id`                    | Album ID, to restrict the results to those artists with songs of that album.                                                                                                                                                                                                                                                                                                       |
| `track_id`                    | Track ID, to restrict the results to the artist of `track_id`. If specified, all other filters are ignored.                                                                                                                                                                                                                                                                        |
| `artist_id`                   | Artist ID, to restrict the results to a single artist. If specified, all other filters are ignored.                                                                                                                                                                                                                                                                                |
| `role_id`                     | Contributor role ID, to restrict the results to the artist of `role_id`. This parameter must be a comma separated list of role IDs, or a comma separated list of role tokens (eg. ALBUMARTIST, ARTIST)                                                                                                                                                                             |
| `library_id`                  | Virtual library ID, to restrict the results to a virtual library view.                                                                                                                                                                                                                                                                                                             |
| `include_online_only_artists` | Include external artists from music services, even if they don't have any track or album in the current collection. This allows callers to browse those artists on the external service. <br><br> Please note that this parmeter would be ignored if some kind of filtering argument was given which didn't apply to artists without related tracks (eg. genre_id, album_id etc.). |
| `tags`                        | Determines which tags are returned. Each returned tag is identified by a letter (see below). The default value is empty.                                                                                                                                                                                                                                                           |

**Returned tagged parameters:**

| Block                | Tag              | Description                                                                                                                                          |
| -------------------- | ---------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------- |
| **First block:**     |                  |                                                                                                                                                      |
|                      | `rescan`         | Returned with value 1 if the server is still scanning the database. The results may therefore be incomplete. Not returned if no scan is in progress. |
|                      | `count`          | Number of results returned by the query. If no search string is present, this is the same value as returned by `info total artists ?`                |
|                      | `CC` `count`     | Only return the number of results, but not the results themselves.                                                                                   |
|                      | `Z` `indexList`  | An array of arrays indicating how many items start with each key letter.                                                                             |
| **For each artist:** |                  |                                                                                                                                                      |
|                      | `id`             | Artist ID. Item delimiter.                                                                                                                           |
|                      | `artist`         | Artist name.                                                                                                                                         |
|                      | `s` `textkey`    | The artist's `textkey` is the first letter of the sorting key.                                                                                       |
|                      | `E` `extid`      | The contributor's external ID, if it is eg. from an online music service.                                                                            |
|                      | `4` `portraitid` | The contributor's portrait ID                                                                                                                        |

Example:

```text
Request: "artists 0 5<LF>"
Response: "artists 0 5 count:7 id:2 artist:Anastacia id:3 artist:Calogero id:4 artist:Evanescence id:5 artist:Leftfield%20%26%20Lydon id:18 artist:Llorca <LF>"

Request: "artists 0 5 genre_id:7<LF>"
Response: "artists 0 5 genre_id:7 count:2 id:2 artist:Anastacia id:19 artist:Sarah%20Connor <LF>"
```

---

### roles

`roles <start> <itemsPerResponse> <taggedParameters>`

The `roles` query returns all roles known by the server for a given track, or
releases.

**Accepted tagged parameters:**

| Tag          | Description                                                                                                                                                                                                                            |
| ------------ | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `track_id`   | Track ID, to restrict the results to the album of `track_id`. If specified, all other filters are ignored.                                                                                                                             |
| `artist_id`  | Artist ID, to restrict the results to those albums by `artist_id`.                                                                                                                                                                     |
| `album_id`   | Album ID, to restrict the results to a single album. Or a comma sparated list of album IDs, to restrict the results to a specific list of albums. If specified, all other filters are ignored.                                         |
| `year`       | Year, to restrict the results to those albums of that year.                                                                                                                                                                            |
| `work_id`    | Limit results to an individual `work`.                                                                                                                                                                                                 |
| `library_id` | Virtual library ID, to restrict the results to a virtual library view.                                                                                                                                                                 |
| `tags`       | Determines which tags are returned. Each returned tag is identified by a letter. The only valid values currently are `t` (textual representation of the contributor type), and `CC` (only return count of results, but no other data). |

**Returned tagged parameters:**

| Block              | Tag         | Description                                                                                                                                          |
| ------------------ | ----------- | ---------------------------------------------------------------------------------------------------------------------------------------------------- |
| **First block:**   |             |                                                                                                                                                      |
|                    | `rescan`    | Returned with value 1 if the server is still scanning the database. The results may therefore be incomplete. Not returned if no scan is in progress. |
| **For each role:** |             |                                                                                                                                                      |
|                    | `role_id`   | The role ID.                                                                                                                                         |
|                    | `role_name` | The contributor role name (only if requested with `tag:t`)                                                                                           |

Example:

```text
Request: "roles 0 1 tags:t<LF>"
Response: "roles 0 1 rescan:1 count:6 role_id:1 role_name:ARTIST <LF>"
```

---

### albums

`albums <start> <itemsPerResponse> <taggedParameters>`

The `albums` query returns all albums known by the server. The results of this
query depend in part on the `Group discs` preference (Server Settings,
Behavior).

**Accepted tagged parameters:**

| Tag           | Description                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                          |
| ------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| `search`      | Search substring. The search is case insensitive and obeys the `Search Within Words` server parameter.                                                                                                                                                                                                                                                                                                                                                                                                                               |
| `genre_id`    | Genre ID, to restrict the results to those albums with songs of that genre. The genre_id may be a list of comma separated IDs.                                                                                                                                                                                                                                                                                                                                                                                                       |
| `artist_id`   | Artist ID, to restrict the results to those albums by `artist_id`.                                                                                                                                                                                                                                                                                                                                                                                                                                                                   |
| `track_id`    | Track ID, to restrict the results to the album of `track_id`. If specified, all other filters are ignored.                                                                                                                                                                                                                                                                                                                                                                                                                           |
| `album_id`    | Album ID, to restrict the results to a single album. Or a comma sparated list of album IDs, to restrict the results to a specific list of albums. If specified, all other filters are ignored.                                                                                                                                                                                                                                                                                                                                       |
| `role_id`     | Contributor role ID, to restrict the results to those albums by artist of role `role_id`. This parameter must be a comma separated list of role IDs, or a comma separated list of role tokens (eg. ALBUMARTIST, ARTIST)                                                                                                                                                                                                                                                                                                              |
| `library_id`  | Virtual library ID, to restrict the results to a virtual library view.                                                                                                                                                                                                                                                                                                                                                                                                                                                               |
| `year`        | Year, to restrict the results to those albums of that year.                                                                                                                                                                                                                                                                                                                                                                                                                                                                          |
| `compilation` | Compilation, to restrict the results to those albums that are (1) or aren't (0) compilations.                                                                                                                                                                                                                                                                                                                                                                                                                                        |
| `sort`        | Sort order of the returned list of albums. One of: <br>`album`, (the default), <br>`new` (sort by the date the item was added to the library, in descending order), <br>`changed` (sort by change date in descending order), <br>`lastplayed` (last time the item was played, in descending order), <br>`playcount` (total count of the item's tracks playcount), <br>`artflow` which sorts by artist, year, album for use with artwork-centric interfaces, <br>`artistalbum`, <br>`yearalbum`, <br>`yearartistalbum`, <br>`random`. |
| `tags`        | Determines which tags are returned. Each returned tag is identified by a letter (see below). The default value is `l`.                                                                                                                                                                                                                                                                                                                                                                                                               |

**Returned tagged parameters:**

| Block               | Tag                                   | Description                                                                                                                                                                  |
| ------------------- | ------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **First block:**    |                                       |                                                                                                                                                                              |
|                     | `rescan`                              | Returned with value 1 if the server is still scanning the database. The results may therefore be incomplete. Not returned if no scan is in progress.                         |
|                     | `count`                               | Number of results returned by the query. If no filter is present, this is the same value as returned by `info total albums ?`                                                |
|                     | `CC` `count`                          | Only return the number of results, but not the results themselves.                                                                                                           |
|                     | `Z` `indexList`                       | An array of arrays indicating how many items start with each key letter (or year for a year-dominated sort order).                                                           |
| **For each album:** |                                       |                                                                                                                                                                              |
|                     | `id`                                  | Album ID. Item delimiter.                                                                                                                                                    |
|                     | `l` `album`                           | Album name, including the server's added `(N of M)` if the server is set to group multi disc albums together. See tag `title` for the unmodified value.                      |
|                     | `y` `year`                            | Album year. This is determined by the server based on the album tracks.                                                                                                      |
|                     | `j` `artwork_track_id`                | Identifier of one of the album tracks, used by the server to display the album's artwork.                                                                                    |
|                     | `t` `title`                           | `Raw` album title as found in the album tracks ID3 tags, as opposed to `album`. Note that `title` and `album` are identical if the server is set to group discs together.    |
|                     | `i` `disc`                            | Disc number of this album. Only if the server is not set to group multi-disc albums together.                                                                                |
|                     | `q` `disccount`                       | Number of discs for this album. Only if known.                                                                                                                               |
|                     | `w` `compilation`                     | 1 if this album is a compilation.                                                                                                                                            |
|                     | `W` `release_type`                    | The release type of an album, eg. `album`, `ep`, etc.                                                                                                                        |
|                     | `a` `artist`                          | The album artist (depends on server configuration).                                                                                                                          |
|                     | `aa` `artists`                        | A comma separated list of album artists (depends on server configuration).                                                                                                   |
|                     | `S` `artist_id`                       | The album artist id (depends on server configuration).                                                                                                                       |
|                     | `SS` `artist_ids`                     | A comma separated list of album artist ids (depends on server configuration).                                                                                                |
|                     | `s` `textkey`                         | The album's `textkey` is the first letter of the sorting key.                                                                                                                |
|                     | `E` `extid`                           | The album's external ID, if it is eg. from an online music service.                                                                                                          |
|                     | `R` `role_ids`                        | A comma separated list of role ids for the album.                                                                                                                            |
|                     | `X` `album_replay_gain`               | The album's replay-gain.                                                                                                                                                     |
|                     | `2` `group_count & contiguous_groups` | Returns a count of distinct works/groupings/performances on the album and a flag indicating whether the groups are contiguous, to assist UI formatting of the album results. |
|                     | `4` `portraitid`                      | The contributor's portrait ID                                                                                                                                                |

Examples:

```text
Request: "albums 0 4<LF>"
Response: "albums 0 4 count:14 id:1 album:Amadeus%20(Disc%201%20of%202) id:4 album:Anastacia id:5 album:Bounce%20[Single] id:6 album:Fallen<LF>"

Request: "albums 0 5 genre_id:7<LF>"
Response: "albums 0 5 genre_id:7 count:2 id:4 album:Anastacia id:5 album:Bounce%20[Single]<LF>"

Request: "albums 0 5 artist_id:19<LF>"
Response: "albums 0 5 artist_id:19 count:1 id:5 album:Bounce%20[Single]<LF>"
```

---

### works

`works <start> <itemsPerResponse> <taggedParameters>`

The `works` query returns all works known by the server.

A Work is a (usually classical) piece of music made up of one or more movements,
acts, scenes etc, each of which is usually a separate track.

A Work is defined by its name and its composer.

An Album can contain many Works, and an instance of a Work can exist on many
Albums. There is therefore a many-to-many relationship between Works and Albums.
This many-to-many relationship is resolved in the Tracks table which contains
the album id and the work id.

**Accepted tagged parameters:**

| Tag          | Description                                                                                                |
| ------------ | ---------------------------------------------------------------------------------------------------------- |
| `search`     | Search string. The search is case insensitive and obeys the `Search Within Words` server parameter.        |
| `artist_id`  | Limit results to those works on which the artist identified by `artist_id` performs.                       |
| `genre_id`   | Limit results to the genre(s) identified by `genre_id`. The genre_id may be a list of comma separated IDs. |
| `library_id` | Virtual library ID, to restrict the results to a virtual library view.                                     |
| `work_id`    | Limit results to an individual `work`.                                                                     |
| `role_id`    | Limit results to the role(s) identified by `role_id`. The role_id may be a list of comma separated IDs.    |

**Returned parameters:**

| Block              | Tag                 | Description                                                                                                           |
| ------------------ | ------------------- | --------------------------------------------------------------------------------------------------------------------- |
| **First block:**   |                     |                                                                                                                       |
| count              | `count`             | Number of results returned by the query.                                                                              |
| **For each work:** |                     |                                                                                                                       |
|                    | `single_composer`   | only returned if the results contain works from a single composer who is also the searched-for contributor            |
|                    | `composer`          | the name of the composer of the work                                                                                  |
|                    | `work`              | the name of the work                                                                                                  |
|                    | `composer_id`       | the id of the composer of the work                                                                                    |
|                    | `artwork_track_id`  | the id of the artwork for the first album found containing the work                                                   |
|                    | `artwork_track_ids` | a list of all artwork ids of albums containing the work                                                               |
|                    | `album_id`          | a list of the ids of all albums containing the work                                                                   |
|                    | `textkey`           | if `single_composer` (see above), the first letter of the work name, otherwise, the first letter of the composer name |
|                    | `favorites_url`     | the URL for favoriting the work                                                                                       |
|                    | `favorites_title`   | the text to be used for the favorite                                                                                  |

---

### years

`years <start> <itemsPerResponse> <taggedParameters>`

The `years` query returns all years known by the server.

**Accepted tagged parameters:**

| Tag           | Description                                   |
| ------------- | --------------------------------------------- |
| `year`        | Return only the specified year.               |
| `hasAlbums:1` | Return only years which are valid for albums. |

**Returned tagged parameters:**

| Block              | Tag      | Description                                                                                                                                          |
| ------------------ | -------- | ---------------------------------------------------------------------------------------------------------------------------------------------------- |
| **First block:**   |          |                                                                                                                                                      |
|                    | `rescan` | Returned with value 1 if the server is still scanning the database. The results may therefore be incomplete. Not returned if no scan is in progress. |
| **For each year:** |          |                                                                                                                                                      |
|                    | `year`   | Year. Item delimiter.                                                                                                                                |

Example:

```text
Request: "years 0 5<LF>"
Response: "years 0 5 rescan:1 count:6 year:1985 year:1987 year:1988 year:2002 year:2003 year:2004 <LF>"
```

---

### musicfolder

`musicfolder <start> <itemsPerResponse> <taggedParameters>`

The `musicfolder` query returns the content of a given music folder, starting
from the top level directory configured in the server.

`musicfolder` is retained as a backward-compatible alias; `mediafolder` is the
current implementation name.

**Accepted tagged parameters:**

| Tag          | Description                                                                                                                                                                                         |
| ------------ | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `folder_id`  | Browses the folder identified by `folder_id`.                                                                                                                                                       |
| `return_top` | If set to 1, and `folder_id` is provided, will return the data about the listed folder instead of the child folders.                                                                                |
| `url`        | Browses the folder identified by `url`. If the content of `url` did not happen to be in the server database, it is added to it.<br><br> `url` has precedence over `folder_id` if both are provided. |
| `type`       | One of `audio`, or `list`. Select the media type you want to browse in the given folder.                                                                                                            |
| `tags`       | Determines which tags are returned. Each returned tag is identified by a letter (see below). The default value is empty.                                                                            |
| `recursive`  | If set to 1, the query will return information about the requested folder and its sub-folders, and all files in there.                                                                              |

**Returned tagged parameters:**

| Block                            | Tag            | Description                                                                                                                                          |
| -------------------------------- | -------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------- |
| **First block:**                 |                |                                                                                                                                                      |
|                                  | `rescan`       | Returned with value 1 if the server is still scanning the database. The results may therefore be incomplete. Not returned if no scan is in progress. |
|                                  | `count`        | Number of results returned by the query.                                                                                                             |
| **For each item in the folder:** |                |                                                                                                                                                      |
|                                  | `id`           | Track, playlist or folder ID. Item delimiter.                                                                                                        |
|                                  | `type`         | One of `track`, `folder`, `playlist`, or `unknown`.                                                                                                  |
|                                  | `c` `coverid`  | coverid to use when constructing an artwork URL, such as /music/$coverid/cover.jpg                                                                   |
|                                  | `d` `duration` | Song duration in seconds.                                                                                                                            |
|                                  | `s` `textkey`  | The item's `textkey` is the first letter of the sorting key.                                                                                         |
|                                  | `u` `url`      | The item's full URL.                                                                                                                                 |

Example:

```text
Request: "musicfolder 0 10<LF>"
Response: "musicfolder 0 10 count:26 id:1 title:03%20Barbie%20Girl.mp3 type:audio id:2 title:12%20-%20If%20I%20Had%20You.mp3 type:audio id:313 title:A-Ha type:dir id:50 title:Test.m3u type:playlist<LF>"

Request: "musicfolder 0 10 folder_id:313<LF>"
Response: "musicfolder 0 10 folder_id:313 count:2 id:335 title:Lifelines type:dir id:336 title:Minor%20Earth%20Major%20Sky type:dir<LF>"
```

#### mediafolder

`mediafolder` uses the same parameters and response fields as
[`musicfolder`](#musicfolder). In current LMS source code, `musicfolder`
delegates to `mediafolder`.

---

### playlists

`playlists <start> <itemsPerResponse> <taggedParameters>`

The `playlists` query returns all playlists known by the server.

**Accepted tagged parameters:**

| Tag      | Description                                                                                                              |
| -------- | ------------------------------------------------------------------------------------------------------------------------ |
| `search` | Search substring. The search is case insensitive and obeys the `Search Within Words` server parameter.                   |
| `tags`   | Determines which tags are returned. Each returned tag is identified by a letter (see below). The default value is empty. |

**Returned tagged parameters:**

| Block                  | Tag           | Description                                                                                                                                          |
| ---------------------- | ------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------- |
| **First block:**       |               |                                                                                                                                                      |
|                        | `rescan`      | Returned with value 1 if the server is still scanning the database. The results may therefore be incomplete. Not returned if no scan is in progress. |
|                        | `count`       | Number of results returned by the query.                                                                                                             |
| **For each playlist:** |               |                                                                                                                                                      |
|                        | `id`          | Playlist ID. Item delimiter.                                                                                                                         |
|                        | `playlist`    | Playlist name                                                                                                                                        |
|                        | `s` `textkey` | The playlist's `textkey` is the first letter of the sorting key.                                                                                     |
|                        | `u` `url`     | The playlist's url.                                                                                                                                  |
|                        | `E` `extid`   | The playlist's external ID, if it is eg. from an online music service.                                                                               |
|                        | `x` `remote`  | If 1, this is a remote playlist.                                                                                                                     |

Example:

```text
Request: "playlists 0 2<LF>"
Response: "playlists 0 2 count:5 id:37 name:Funky%20Beats id:57 name:SUPER<LF>"

Request: "playlists 0 2 search:SUPER tags:u<LF>"
Response: "playlists 0 2 search:SUPER tags:u count:1 id:57 name:SUPER url:playlist:///Volume/path/file.m3u<LF>"
```

---

### playlists tracks

`playlists tracks <start> <itemsPerResponse> <taggedParameters>`

The `playlists tracks` query returns the tracks of a given playlist.

**Accepted tagged parameters:**

| Tag           | Description                                                                                                                                                                                                                          |
| ------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| `playlist_id` | Playlist ID as returned by the `playlists` query. This is a mandatory parameter.                                                                                                                                                     |
| `tags`        | Determines which tags are returned. Each returned tag is identified by a letter (see command [`songinfo`](#songinfo) for a list of possible fields and their identifying letter). The default tags value for this command is `gald`. |

**Returned tagged parameters:**

| Block               | Tag              | Description                                                                                                                                          |
| ------------------- | ---------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------- |
| **First block:**    |                  |                                                                                                                                                      |
|                     | `rescan`         | Returned with value 1 if the server is still scanning the database. The results may therefore be incomplete. Not returned if no scan is in progress. |
|                     | `count`          | Number of tracks in the playlist.                                                                                                                    |
| **For each track:** |                  |                                                                                                                                                      |
|                     | `playlist index` | Index (first item is 0) of the track in the playlist. The first returned instance of this field is equal to start. Item seperator.                   |
|                     | `Tags`           | Same tags as defined in command [`songinfo`](#songinfo).                                                                                             |

---

### playlists rename

`playlists rename <taggedParameters>`

This command renames a saved playlist.

**Accepted tagged parameters:**

| Tag           | Description                                                                                                                                                                                                                                    |
| ------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `playlist_id` | The id of the playlist to rename.                                                                                                                                                                                                              |
| `newname`     | The new name of the playlist (without .m3u).                                                                                                                                                                                                   |
| `dry_run`     | Used to check if the new name is already used by another playlist. The command performs the name check but does not overwrite the existing playlist. If a name conflict occurs, the command will return a `overwritten_playlist_id` parameter. |

**Returned tagged parameters:**

| Tag                       | Description                                                                                                                                                      |
| ------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `overwritten_playlist_id` | This returns the playlist id of the playlist overwritten (if `dry_run` is 0 or not present) by renaming the playlist. Only present if a playlist is overwritten. |

Examples:

```text
Request: "playlists rename playlist_id:22 newname:Hello<LF>"
Response: "playlists rename playlist_id:22 newname:Hello<LF>"
```

---

### playlists new

`playlists new <taggedParameters>`

This command creates an empty saved playlist, to be further manipulated by other
commands.

**Accepted tagged parameters:**

| Tag    | Description                              |
| ------ | ---------------------------------------- |
| `name` | The name of the playlist (without .m3u). |

**Returned tagged parameters:**

| Tag                       | Description                                                                                               |
| ------------------------- | --------------------------------------------------------------------------------------------------------- |
| `playlist_id`             | This returns the playlist id of the created playlist.                                                     |
| `overwritten_playlist_id` | This returns the playlist id of an existing playlist with the same name. The new playlist is not created. |

Examples:

```text
Request: "playlists new name:Hello<LF>"
Response: "playlists new name:Hello playlist_id:345<LF>"
```

---

### playlists delete

`playlists delete <taggedParameters>`

This command deletes a saved playlist.

**Accepted tagged parameters:**

| Tag           | Description                       |
| ------------- | --------------------------------- |
| `playlist_id` | The id of the playlist to delete. |

Examples:

```text
Request: "playlists delete playlist_id:22<LF>"
Response: "playlists delete playlist_id:22<LF>"
```

---

### playlists edit

`playlists edit <taggedParameters>`

This command manipulates the track content of a saved playlist.

**Accepted tagged parameters:**

| Tag           | Description                                                                                       |
| ------------- | ------------------------------------------------------------------------------------------------- |
| `playlist_id` | The id of the playlist to manipulate.                                                             |
| `cmd`         | One of `up`, `down`, `move`, `delete` or `add`, in order to move up, down, delete or add a track. |
| `index`       | For `cmd:up`, `cmd:down`, `cmd:move` and `cmd:delete` the index of the track to edit.             |
| `toindex`     | For `cmd:move` the new index of the track to be moved.                                            |
| `title`       | For `cmd:add`, the title of the track to add.                                                     |
| `url`         | For `cmd:add`, the url of the track to add.                                                       |

Examples:

```text
Request: "playlists edit cmd:up playlist_id:22 index:3<LF>"
Response: "playlists edit cmd:up playlist_id:22 index:3<LF>"

Request: "playlists edit cmd:add playlist_id:22 title:Song url:file://...<LF>"
Response: "playlists edit cmd:add playlist_id:22 title:Song url:file://...<LF>"
```

---

### songinfo

`songinfo <start> <itemsPerResponse> <taggedParameters>`

The `songinfo` command returns all the information on a song known by the
server. Please note that the `<start>` and `<itemsPerResponse>` parameters apply
to the individual data fields below and not, as they do in other extended CLI
queries, to the number of songs (or artists, genres, etc.) returned; the
`songinfo` only ever returns information about a single song.

**Accepted tagged parameters:**

| Tag        | Description                                                                                                                                                                                                                |
| ---------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `url`      | Song path as returned by other CLI commands. This is a mandatory parameter, except if `track_id` is provided.                                                                                                              |
| `track_id` | Track ID as returned by other CLI commands. This is a mandatory parameter, except if `url` is provided.                                                                                                                    |
| `tags`     | Determines which tags are returned. Each returned tag is identified by a letter (see below). The default value is all info except the url (`u`) and the multi-valued tags for genre(s) (`G` & `P`) and artists (`A` & `S`) |

**Returned tagged parameters:**

| Tag                      | Description                                                                                                                                                 |
| ------------------------ | ----------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `rescan`                 | Returned with value 1 if the server is still scanning the database. The results may therefore be incomplete. Not returned if no scan is in progress.        |
| `count`                  | Number of results returned by the query, that is, total number of elements to return for this song.                                                         |
| `id`                     | Track ID.                                                                                                                                                   |
| `title`                  | Song title                                                                                                                                                  |
| `a` `artist`             | Artist name.                                                                                                                                                |
| `A` `<role>`             | For every artist role (one of `artist`, `composer`, `conductor`, `band`, `albumartist` or `trackartist`), a comma and space (', ') separated list of names. |
| `AA` `<role>`            | This is like `A`, but without the space after the comma. This should simplify parsing/splitting when required.                                              |
| `B` `buttons`            | A hash with button definitions. Only available for certain plugins such as Pandora.                                                                         |
| `c` `coverid`            | coverid to use when constructing an artwork URL, such as /music/$coverid/cover.jpg                                                                          |
| `C` `compilation`        | 1 if the album this track belongs to is a compilation                                                                                                       |
| `K` `artwork_url`        | A full URL to remote artwork. Only available for certain online music services.                                                                             |
| `W` `release_type`       | The release type of the track's album, eg. `album`, `ep`, etc.                                                                                              |
| `d` `duration`           | Song duration in seconds.                                                                                                                                   |
| `e` `album_id`           | Album ID. Only if known.                                                                                                                                    |
| `f` `filesize`           | Song file length in bytes. Only if known.                                                                                                                   |
| `g` `genre`              | Genre name. Only if known.                                                                                                                                  |
| `G` `genres`             | Genre names, separated by commas (only useful if the server is set to handle multiple items in tags).                                                       |
| `i` `disc`               | Disc number. Only if known.                                                                                                                                 |
| `I` `samplesize`         | Song sample size (in bits)                                                                                                                                  |
| `j` `coverart`           | 1 if coverart is available for this song. Not listed otherwise.                                                                                             |
| `J` `artwork_track_id`   | Identifier of the album track used by the server to display the album's artwork. Not listed if artwork is not available for this album.                     |
| `k` `comment`            | Song comments, if any.                                                                                                                                      |
| `K` artwork_url          | A full URL to remote artwork. Only available for certain online music services.                                                                             |
| `l` `album`              | Album name. Only if known.                                                                                                                                  |
| `L` `info_link`          | A custom link to use for trackinfo. Only available for certain online music services.                                                                       |
| `m` `bpm`                | Beats per minute. Only if known.                                                                                                                            |
| `M` `musicmagic_mixable` | 1 if track is mixable, otherwise 0.                                                                                                                         |
| `n` `modificationTime`   | Date and time song file was last changed on disk.                                                                                                           |
| `N` `remote_title`       | Title of the internet radio station.                                                                                                                        |
| `o` `type`               | Content type. Only if known.                                                                                                                                |
| `Q` `lossless`           | 1 if track is lossless, otherwise 0.                                                                                                                        |
| `p` `genre_id`           | Genre ID. Only if known.                                                                                                                                    |
| `P` `genre_ids`          | Genre IDs, separated by commas (only useful if the server is set to handle multiple items in tags).                                                         |
| `D` `addedTime`          | Date and time song file was first added to the database.                                                                                                    |
| `U` `lastUpdated`        | Date and time song file was last updated in the database.                                                                                                   |
| `q` `disccount`          | Number of discs. Only if known.                                                                                                                             |
| `r` `bitrate`            | Song bitrate. Only if known.                                                                                                                                |
| `R` `rating`             | Song rating, if known and greater than 0.                                                                                                                   |
| `O` `playcount`          | Song play count.                                                                                                                                            |
| `s` `artist_id`          | Artist ID.                                                                                                                                                  |
| `S` `<role>_ids`         | For each role as defined above, the list of ids (comma separated).                                                                                          |
| `t` `tracknum`           | Track number. Only if known.                                                                                                                                |
| `T` `samplerate`         | Song sample rate (in KHz)                                                                                                                                   |
| `u` `url`                | Song file url.                                                                                                                                              |
| `v` `tagversion`         | Version of tag information in song file. Only if known.                                                                                                     |
| `w` `lyrics`             | Lyrics. Only if known.                                                                                                                                      |
| `x` `remote`             | If 1, this is a remote track.                                                                                                                               |
| `E` `extid`              | Some tracks have an external identifier (eg. from an online music service).                                                                                 |
| `X` `album_replay_gain`  | Replay gain of the album (in dB), if any                                                                                                                    |
| `y` `year`               | Song year. Only if known.                                                                                                                                   |
| `Y` `replay_gain`        | Replay gain (in dB), if any                                                                                                                                 |
| `V` `live_edge`          | The Live edge of a remote stream. -1 is not live, 0 is live at the edge, >0 is number of seconds from the live edge.                                        |
| `z` `subtitle`           | Subtitle associated with track title e.g. Acoustic, Demo, Live at... etc. Only if known.                                                                    |
| `4` `portraitid`         | The contributor's portrait ID                                                                                                                               |

Example:

```text
Request: "songinfo 0 100 track_id:2<LF>"
Response: "songinfo 0 100 track_id:2 count:26 id:2 title:If%20I%20Had%20You artist:Diana%20Krall duration:297.117 album_id:2 filesize:5952369 genre:Vocal comment:Pianist%2Fvocalist%20Diana%20Krall%20pays%20tribute%20to%20the%20Nat%20King%20Cole%20Trio.... album:All%20for%20You modificationTime:Thursday%2C%20March%201%2C%202007%2C%209:21:58%20PM type:mp3 genre_id:2 bitrate:160kbps%20VBR artist_id:3 tracknum:12 tagversion:ID3v2.3.0 year:1995 samplerate:44100 url:file:%2F%2F%2FUsers%2Ffred%2FPrograms%2FLyrion Music Server%2FMusic%2F12%2520-%2520If%2520I%2520Had%2520You.mp3 <LF>"
```

---

### titles|songs|tracks

`titles\|songs\|tracks <start> <itemsPerResponse> <taggedParameters>`

The `titles` command returns all titles known by the server.

`songs` and `tracks` are aliases for `titles`

**Accepted tagged parameters:**

| Tag            | Description                                                                                                                                                                                                                                                                                                                                                  |
| -------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| `genre_id`     | Genre ID, to restrict the results to the titles of that genre.                                                                                                                                                                                                                                                                                               |
| `artist_id`    | Artist ID, to restrict the results to the titles of that artist.                                                                                                                                                                                                                                                                                             |
| `album_id`     | Album ID, to restrict the results to the titles of that album.                                                                                                                                                                                                                                                                                               |
| `track_id`     | Track ID, to restrict the results to a single track.                                                                                                                                                                                                                                                                                                         |
| `role_id`      | Contributor role ID, to restrict the results to the artist of role `role_id`. This parameter must be a comma separated list of role IDs, or a comma separated list of role tokens (eg. ALBUMARTIST, ARTIST)                                                                                                                                                  |
| `release_type` | The release type of the track's album, eg. `album`, `ep`, etc.                                                                                                                                                                                                                                                                                               |
| `library_id`   | Virtual library ID, to restrict the results to a virtual library view.                                                                                                                                                                                                                                                                                       |
| `year`         | Year, to restrict the results to the titles of that year.                                                                                                                                                                                                                                                                                                    |
| `search`       | Search substring. The search is case insensitive and obeys the `Search Within Words` server parameter.                                                                                                                                                                                                                                                       |
| `tags`         | Determines which tags are returned. Each returned tag is identified by a letter (see command [`songinfo`](#songinfo) for a list of possible fields and their identifying letter). The default tags value for this command is `gald`.                                                                                                                         |
| `CC`           | Only return the number of results, but not the results themselves.                                                                                                                                                                                                                                                                                           |
| `sort`         | Sorting, one of:-<br>`title` (the default), <br>`tracknum` (in which case the track field (`t`) is added automatically to the response) or <br>`albumtrack` (in which case the track and album-title fields (`l` and `t`) are added automatically to the response). <br><br>Sorting by tracks is possible only if tracks are defined and for a single album. |

**Returned tagged parameters:**

| Block               | Tag      | Description                                                                                                                                                       |
| ------------------- | -------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **First block:**    |          |                                                                                                                                                                   |
|                     | `rescan` | Returned with value 1 if the server is still scanning the database. The results may therefore be incomplete. Not returned if no scan is in progress.              |
|                     | `count`  | Number of results returned by the query. If no search string or album/artist/genre filter is present, this is the same value as returned by `info total songs ?`. |
| **For each title:** |          |                                                                                                                                                                   |
|                     | `Tags`   | Same tags as defined in command [`songinfo`](#songinfo).                                                                                                          |

Example:

```text
Request: "titles 0 2<LF>"
Response: "titles 0 2 count:100 id:55 title:Ancestral%20Aid genre:Soundtrack artist:Various%20Artists album:The%20Hunt%20For%20Red%20October duration:136.93387755102 disc:1 track:5 year:1990 url:file://Disk | he%20Hunt%20For%20Red%20October/Ancestral%20Aid.mp3 id:1 title:Any%20How genre:Acid%20Jazz artist:Llorca album:New%20Comer duration:340.297142857143 track:5 year:2001 url:...<LF>"

Request: "titles 0 12 album:Anastacia tags:p<LF>"
Response: "titles 0 12 album:Anastacia tags:p count:12 id:4 title:Heavy%20On%20My%20Heart url:... id:1 title:I%20Do url:... id:2 title:Left%20Outside%20Alone url:...<LF>"
```

---

### tags

`tags <url\|track_id>`

Return the tracks found in the file referenced by the `url` or `track_id`.

Please note that returned data depends on the file format, tagging software
used, etc.

**Accepted tagged parameters:**

| Tag        | Description                                      |
| ---------- | ------------------------------------------------ |
| `url`      | The `file://` or `tmp://` URL to the audio file. |
| `track_id` | The track's ID                                   |

Example:

```text
Request: "tags track_id:454<LF>"
Response: tags track_id%3A454 ALBUM%3A0 ARTIST%3ALow%20Roar COMMENT%3A%40JW DATE%3A2014 GENRE%3AAlternative REPLAYGAIN_ALBUM_GAIN%3A-9.18%20dB REPLAYGAIN_ALBUM_PEAK%3A1.00000000 REPLAYGAIN_REFERENCE_LOUDNESS%3A89.0%20dB REPLAYGAIN_TRACK_GAIN%3A-3.16%20dB REPLAYGAIN_TRACK_PEAK%3A0.96447754 TITLE%3AIn%20the%20Morning TRACKNUMBER%3A8 VENDOR%3Areference%20libFLAC%201.2.1%2020070917
```

---

### search

`search <start> <itemsPerResponse> <taggedParameters>`

The `search` command returns artists, albums and tracks matching a search
string.

Please note that `start` and `itemsPerResponse` are calculated per category. If
you eg. have genres and tracks with the search term in them, you'll get
`itemsPerResponse` number of each of them. The total number of items returned
therefore can be a multiple of `itemsPerResponse`.

**Accepted tagged parameters:**

| Tag    | Description   |
| ------ | ------------- |
| `term` | Search string |

**Returned tagged parameters:**

| Block                | Tag             | Description                                                                                                                                          |
| -------------------- | --------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------- |
| **First block:**     |                 |                                                                                                                                                      |
|                      | `rescan`        | Returned with value 1 if the server is still scanning the database. The results may therefore be incomplete. Not returned if no scan is in progress. |
|                      | `count`         | Total number of results returned by the query. This is the sum of `artists_count`, `albums_count` and `tracks_count`.                                |
|                      | `artists_count` | Total number of artists found.                                                                                                                       |
|                      | `albums_count`  | Total number of albums found.                                                                                                                        |
|                      | `genres_count`  | Total number of genres found.                                                                                                                        |
|                      | `tracks_count`  | Total number of tracks found.                                                                                                                        |
| **For each artist:** |                 |                                                                                                                                                      |
|                      | `artist_id`     | Artist ID.                                                                                                                                           |
|                      | `artist`        | Artist name.                                                                                                                                         |
| **For each album:**  |                 |                                                                                                                                                      |
|                      | `album_id`      | Album ID.                                                                                                                                            |
|                      | `albu`          | Album title                                                                                                                                          |
| **For each genre:**  |                 |                                                                                                                                                      |
|                      | `genre_id`      | Genre ID.                                                                                                                                            |
|                      | `genre`         | Genre title.                                                                                                                                         |
| **For each track:**  |                 |                                                                                                                                                      |
|                      | `track_id`      | Track ID.                                                                                                                                            |
|                      | `track`         | Track title.                                                                                                                                         |

Example:

```text
Request: "search 0 20 term:al<LF>"
Response: "search 0 20 term:al count:9 artists_count:2 albums_count:1 tracks_count:6 artist_id:2 artist:Alanis%20Morissette artist_id:37 artist:Alphaville album_id:10 album:All%20Time%20Greatest%20Hits%20%5BBarry%20White%5D%20MMM track_id:11 track:All%20I%20Really%20Want track_id:68 track:The%20Sun%20Always%20Shines%20On%20TV track_id:185 track:All%20Around%20The%20World track_id:189 track:Give%20Me%20All%20Your%20Love%20%5BSingle%20Cut%5D track_id:245 track:Better%20All%20The%20Time
```

---

### pragma

`pragma <pragma string>`

The `pragma` command executes the given pragma string against the SQLite
database engine. If using MySQL, this command has no effect. For a list of
available pragmas, see sqlite.org. Warning: Do not use this function unless you
know what you are doing!

Example:

```text
pragma locking_mode = NORMAL
```

---

## Playlist commands and queries

---

### play

`<playerid> play <fadeInSecs>`

The `play` command allows to start playing the current playlist. The
`fadeInSecs` parameter may be passed to specify a fade-in period.

Example:

```text
Request: "04:20:00:12:23:45 play<LF>"
Response: "04:20:00:12:23:45 play<LF>"
```

---

### stop

`<playerid> stop`

The `stop` command allows to stop playing the current playlist.

Example:

```text
Request: "04:20:00:12:23:45 stop<LF>"
Response: "04:20:00:12:23:45 stop<LF>"
```

---

### pause

`<playerid> pause <0\|1\|> <fadeInSecs> <suppressShowBriefly>`

You may use `pause 1` to force the player to pause, `pause 0` to force the
player to unpause and `pause` to toggle the pause state. The `fadeInSecs`
parameter may be passed to specify a fade-in period when unpausing.

The `suppressShowBriefly` parameter may be passed to specify **not** to show a
pause icon on squeezeplay-based devices (as is the case with hitting 'power off'
on the SBController, which pauses play but should not display an icon, see bug
13521). The popup on squeezeplay-based devices which shows the pause icon is
referred to as the `showBriefly` popup.

Example

```text
Request: "04:20:00:12:23:45 pause<LF>"
Response: "04:20:00:12:23:45 pause<LF>"
```

---

### mode

`<playerid> mode ?`

The `mode` command allows to query the player state and returns one of `play`,
`stop` or `pause`.

If the player is off, `mode ?` returned value is undefined.

Example:

```text
Request: "04:20:00:12:23:45 mode ?<LF>"
Response: "04:20:00:12:23:45 mode stop<LF>"
```

---

### time

`<playerid> time <number\|-number\|+number\|?>`

The `time` command allows you to query the current number of seconds that the
current song has been playing by passing in a `?`. You may jump to a particular
position in a song by specifying a number of seconds to seek to. You may also
jump to a relative position within a song by putting an explicit `-` or `+`
character before a number of seconds you would like to seek.

Examples:

```text
Request: "04:20:00:12:23:45 time ?<LF>"
Response: "04:20:00:12:23:45 time 12.55<LF>"

Request: "04:20:00:12:23:45 time 5<LF>"
Response: "04:20:00:12:23:45 time 5<LF>"

Request: "04:20:00:12:23:45 time -5<LF>"
Response: "04:20:00:12:23:45 time -5<LF>"
```

---

### Querying the Song Playing

The `remote`, `current_title`, `genre`, `artist`, `album`, `title` `duration`,
and `path` commands allow for querying information about the song currently
playing.

See also a similar set of queries for a Song on a given playlist at
[Querying a Song on a Playlist](#querying-a-song-on-a-playlist) (tho that set of
queries does not have a `current_title` query).

#### current_title

`<playerid> current_title ?`

`current_title` returns the current title for remote streams or the song title
as formatted for the player.

```text
Request: "04:20:00:12:23:45 current_title ?<LF>"
Response: "04:20:00:12:23:45 current_title 1-Voulez%20vous%20(ABBA)<LF>"
```

#### remote

`<playerid> remote ?`

The `remote` command allows for querying information about the song currently
playing. Command `remote` returns `1` if the current song is a remote stream.

```text
Request: "04:20:00:12:23:45 remote ?<LF>"
Response: "04:20:00:12:23:45 remote 0<LF>"
```

#### genre

`<playerid> genre ?`

Example

```text
Request: "04:20:00:12:23:45 genre ?<LF>"
Response: "04:20:00:12:23:45 genre Rock<LF>"
```

#### artist

`<playerid> artist ?`

Example

```text
Request: "04:20:00:12:23:45 artist ?<LF>"
Response: "04:20:00:12:23:45 artist Abba<LF>"
```

#### album

`<playerid> album ?`

Example

```text
Request: "04:20:00:12:23:45 album ?<LF>"
Response: "04:20:00:12:23:45 album Greatest%20Hits<LF>"
```

#### title

`<playerid> title ?`

Example

```text
Request: "04:20:00:12:23:45 title ?<LF>"
Response: "04:20:00:12:23:45 title Voulez%20vous<LF>"

```

#### duration

`<playerid> duration ?`

Example

```text
Request: "04:20:00:12:23:45 duration ?<LF>"
Response: "04:20:00:12:23:45 duration 103.2<LF>"

```

#### path

`<playerid> path ?`

Example

```text
Request: "04:20:00:12:23:45 path ?<LF>"
Response: "04:20:00:12:23:45 path pathtofile<LF>"
```

---

### playlist play

`<playerid> playlist play <item> <title> <fadeInSecs>`

The `playlist play` command puts the specified song URL, playlist or directory
contents into the current playlist and plays starting at the first item. Any
songs previously in the playlist are discarded. An optional title value may be
passed to set a title. This can be useful for remote URLs. The `fadeInSecs`
parameter may be passed to specify a fade-in period.

Examples:

```text
Request: "04:20:00:12:23:45 playlist play /music/abba/01_Voulez_Vous.mp3<LF>"
Response: "04:20:00:12:23:45 playlist play /music/abba/01_Voulez_Vous.mp3<LF>"

Request: "04:20:00:12:23:45 playlist play http://someserver/02_Sledgehammer.flac Peter%20Gabriel%20-%20Sledgehammer<LF>"
Response: "04:20:00:12:23:45 playlist play http://someserver/02_Sledgehammer.flac Peter%20Gabriel%20-%20Sledgehammer<LF>"
```

---

### playlist add

`<playerid> playlist add <item> <title>`

The `playlist add` command adds the specified song URL, playlist or directory
contents to the end of the current playlist. Songs currently playing or already
on the playlist are not affected. An optional title value may be passed to set a
title. This can be useful for remote URLs.

Examples:

```text
Request: "04:20:00:12:23:45 playlist add /music/abba/01_Voulez_Vous.mp3<LF>"
Response: "04:20:00:12:23:45 playlist add /music/abba/01_Voulez_Vous.mp3<LF>"

Request: "04:20:00:12:23:45 playlist add /playlists/abba.m3u<LF>"
Response: "04:20:00:12:23:45 playlist add /playlists/abba.m3u<LF>"
```

---

### playlist insert

`<playerid> playlist insert <item> <title>`

The `playlist insert` command inserts the specified song URL, playlist or
directory contents to be played immediately after the current song in the
current playlist. Any songs currently playing or already on the playlist are not
affected. An optional title value may be passed to set a title. This can be
useful for remote URLs.

Examples:

```text
Request: "04:20:00:12:23:45 playlist insert /music/abba/01_Voulez_Vous.mp3<LF>"
Response: "04:20:00:12:23:45 playlist insert /music/abba/01_Voulez_Vous.mp3<LF>"

Request: "04:20:00:12:23:45 playlist insert /playlists/abba.m3u<LF>"
Response: "04:20:00:12:23:45 playlist insert /playlists/abba.m3u<LF>"
```

---

### playlist deleteitem

`<playerid> playlist deleteitem <item>`

The `playlist deleteitem` command removes the specified song URL, playlist or
directory contents from the current playlist.

Examples:

```text
Request: "04:20:00:12:23:45 playlist deleteitem /music/abba/01_Voulez_Vous.mp3<LF>"
Response: "04:20:00:12:23:45 playlist deleteitem /music/abba/01_Voulez_Vous.mp3<LF>"
```

---

### playlist move

`<playerid> playlist move <fromindex> <toindex>`

The `playlist move` command moves the song at the specified index to a new index
in the playlist. An offset of zero is the first song in the playlist.

Examples:

```text
Request: "04:20:00:12:23:45 playlist move 0 5<LF>"
Response: "04:20:00:12:23:45 playlist move 0 5<LF>"
```

---

### playlist delete

`<playerid> playlist delete <songindex>`

The `playlist delete` command deletes the song at the specified index from the
current playlist.

Examples:

```text
Request: "04:20:00:12:23:45 playlist delete 5<LF>"
Response: "04:20:00:12:23:45 playlist delete 5<LF>"
```

---

### playlist preview

`<playerid> playlist preview <taggedParameters>`

When called **without** a cmd param of `stop`, replace the current playlist with
the playlist specified by url, but save the current playlist to
tempplaylist_`<playerid>`.m3u for later retrieval.

When called **with** the cmd param of `stop`, stops the currently playing
playlist and loads (if possible) the previous playlist. Restored playlist jumps
to beginning of CURTRACK when present in m3u file, and does not autoplay
restored playlist.

Examples:

```text
Request: "04:20:00:12:23:45 playlist preview url:db:album.titlesearch=A%20FEAST%20OF%20WIRE title:A%20Feast%20Of%20Wire<LF>"
Response: "04:20:00:12:23:45 playlist preview url:db:album.titlesearch=A%20FEAST%20OF%20WIRE title:A%20Feast%20Of%20Wire<LF>"

Request: "04:20:00:12:23:45 playlist preview cmd:stop<LF>"
Response: "04:20:00:12:23:45 playlist preview cmd:stop<LF>"
```

---

### playlist resume

`<playerid> playlist resume <playlist> <taggedParameters>`

Replace the current playlist with the playlist specified by `<playlist>` (p2),
starting at the song that was playing when the file was saved. (Resuming works
only with M3U files saved with the `playlist save` command below.)

Shortcut: use a bare playlist name (without leading directories or trailing .m3u
suffix) to load a playlist in the saved playlists folder.

**Optional tagged parameters:** `noplay` which when non-zero will not auto-start
the track, and `wipePlaylist`, which will destroy the saved playlist from both
the filesystem and from the DB (these tagged params are typically used for
resuming a temporarily cached playlist, e.g. after exiting alarm sound preview
on squeezeplay devices).

Examples:

```text
Request: "04:20:00:12:23:45 playlist resume abba<LF>"
Response: "04:20:00:12:23:45 playlist resume abba<LF>"
```

---

### playlist save

`<playerid> playlist save <filename> <taggedParameters>`

Saves a playlist file in the saved playlists directory. Accepts a playlist
filename (without .m3u suffix) and saves in the top level of the playlists
directory.

**Optional tagged parameter:** `silent` When non-zero, suppresses any
`showBriefly` displayed.

Examples:

```text
Request: "04:20:00:12:23:45 playlist save abba<LF>"
Response: "04:20:00:12:23:45 playlist save abba<LF>"
```

---

### playlist loadalbum

`<playerid> playlist loadalbum <genre> <artist> <album>`

The `playlist loadalbum` command puts songs matching the specified genre artist
and album criteria on the playlist. Songs previously in the playlist are
discarded.

Examples:

```text
Request: "04:20:00:12:23:45 playlist loadalbum Rock Abba *<LF>"
Response: "04:20:00:12:23:45 playlist loadalbum Rock Abba *<LF>"
```

---

### playlist addalbum

`<playerid> playlist addalbum <genre> <artist> <album>`

The `playlist addalbum` command appends all songs matching the specified
criteria onto the end of the playlist. Songs currently playing or already on the
playlist are not affected.

Examples:

```text
Request: "04:20:00:12:23:45 playlist addalbum Rock Abba *<LF>"
Response: "04:20:00:12:23:45 playlist addalbum Rock Abba *<LF>"
```

---

### playlist loadtracks

`<playerid> playlist loadtracks <searchparam>`

The `playlist loadtracks` command puts tracks matching the specified query on
the playlist. Songs previously in the playlist are discarded. Note: you must
provide a particular form to the searchparam (see examples)

Examples:

```text
Request: "04:20:00:12:23:45 playlist loadtracks track.titlesearch=purple <LF>"
Response: "04:20:00:12:23:45 playlist loadtracks track.titleseach=purple <LF>"

Request: "04:20:00:12:23:45 playlist loadtracks album.titlesearch=3121 <LF>"
Response: "04:20:00:12:23:45 playlist loadtracks album.titlesearch=3121 <LF>"

Request: "04:20:00:12:23:45 playlist loadtracks contributor.namesearch=prince <LF>"
Response: "04:20:00:12:23:45 playlist loadtracks contributor.namesearch=prince <LF>"
```

---

### playlist addtracks

`<playerid> playlist addtracks <searchparam>`

The `playlist addtracks` command appends all songs matching the specified
criteria onto the end of the playlist. Songs currently playing or already on the
playlist are not affected.

Note: you must provide a particular form to the searchparam (see examples)

Examples:

```text
Request: "04:20:00:12:23:45 playlist addtracks track.titlesearch=purple <LF>"
Response: "04:20:00:12:23:45 playlist addtracks track.titleseach=purple <LF>"

Request: "04:20:00:12:23:45 playlist addtracks album.titlesearch=3121 <LF>"
Response: "04:20:00:12:23:45 playlist addtracks album.titlesearch=3121 <LF>"

Request: "04:20:00:12:23:45 playlist addtracks contributor.namesearch=prince <LF>"
Response: "04:20:00:12:23:45 playlist addtracks contributor.namesearch=prince <LF>"
```

---

### playlist insertalbum

`<playerid> playlist insertalbum <genre> <artist> <album>`

The `playlist insertalbum` command inserts all songs matching the specified
criteria at the top of the playlist. Songs already on the playlist are not
affected.

Examples:

```text
Request: "04:20:00:12:23:45 playlist addalbum Rock Abba *<LF>"
Response: "04:20:00:12:23:45 playlist addalbum Rock Abba *<LF>"
```

---

### playlist deletealbum

`<playerid> playlist deletealbum <genre> <artist> <album>`

The `playlist deletealbum` command removes songs matching the specified genre
artist and album criteria from the playlist.

Examples:

```text
Request: "04:20:00:12:23:45 playlist deletealbum Rock Abba *<LF>"
Response: "04:20:00:12:23:45 playlist deletealbum Rock Abba *<LF>"
```

---

### playlist clear

`<playerid> playlist clear`

The `playlist clear` command removes any song that is on the playlist. The
player is stopped.

Examples:

```text
Request: "04:20:00:12:23:45 playlist clear<LF>"
Response: "04:20:00:12:23:45 playlist clear<LF>"
```

---

### playlist zap

`<playerid> playlist zap <songindex>`

The `playlist zap` command adds the song at index songindex into the zapped song
playlist.

Examples:

```text
Request: "04:20:00:12:23:45 playlist zap 3<LF>"
Response: "04:20:00:12:23:45 playlist zap 3<LF>"
```

---

### playlist name

`<playerid> playlist name ?`

The `playlist name` command returns the name of the saved playlist last loaded
into the Now Playing playlist, if any.

Examples:

```text
Request: "04:20:00:12:23:45 playlist name ?<LF>"
Response: "04:20:00:12:23:45 playlist name Jazz%20Favorites <LF>"
```

---

### playlist url

`<playerid> playlist url ?`

The `playlist url` command returns the URL of the saved playlist last loaded
into the Now Playing playlist, if any.

Examples:

```text
Request: "04:20:00:12:23:45 playlist url ?<LF>"
Response: "04:20:00:12:23:45 playlist url file:///Users/dean/Music/testmusic/Zapped%20Songs.m3u<LF>"
```

---

### playlist modified

`<playerid> playlist modified ?`

The `playlist modified` returns the modification state of the saved playlist
last loaded into the Now Playing playlist, if any. If `1`, the playlist has been
modified since it was loaded.

Examples:

```text
Request: "04:20:00:12:23:45 playlist modified ?<LF>"
Response: "04:20:00:12:23:45 playlist modified 0<LF>"
```

---

### playlist playslistsinfo

`<playerid> playlist playlistsinfo <taggedParameters>`

The `playlist playlistsinfo` query returns information on the saved playlist
last loaded into the Now Playing playlist, if any.

**Accepted tagged parameters:**

| Tag        | Description                                                                    |
| ---------- | ------------------------------------------------------------------------------ |
| `id`       | Playlist id.                                                                   |
| `name`     | Playlist name. Equivalent to `playlist name ?`.                                |
| `modified` | Modification state of the saved playlist. Equivalent to `playlist modified ?`. |
| `url`      | Playlist url. Equivalent to `playlist url ?`.                                  |

**Returned tagged parameters:**

| Tag        | Description                                                                    |
| ---------- | ------------------------------------------------------------------------------ |
| `id`       | Playlist id.                                                                   |
| `name`     | Playlist name. Equivalent to `playlist name ?`.                                |
| `modified` | Modification state of the saved playlist. Equivalent to `playlist modified ?`. |
| `url`      | Playlist url. Equivalent to `playlist url ?`.                                  |

Example:

```text
Request: "a5:41:d2:cd:cd:05 playlist playlistsinfo <LF>"
Response: "a5:41:d2:cd:cd:05 playlist playlistsinfo id:267 name:A98 modified:0 url:file://Volumes/... <LF>"
```

---

### playlist index

`<playerid> playlist index <index\|+index\|-index\|?> <fadeInSecs>`

The `playlist index` command sets or queries the song that is currently playing
by index. When setting, a zero-based value may be used to indicate which song to
play.

An explicitly positive or negative number may be used to jump to a song relative
to the currently playing song. The index can only be set if the playlist is not
empty.

If an index parameter is set then `fadeInSecs` may be passed to specify a
fade-in period. The value of the current song index may be obtained by passing
in `?` as a parameter.

Examples:

```text
Request: "04:20:00:12:23:45 playlist index +1<LF>"
Response: "04:20:00:12:23:45 playlist index +1<LF>"

Request: "04:20:00:12:23:45 playlist index 5<LF>"
Response: "04:20:00:12:23:45 playlist index 5<LF>"

Request: "04:20:00:12:23:45 playlist index ?<LF>"
Response: "04:20:00:12:23:45 playlist index 5<LF>"
```

---

### Querying a Song on a Playlist

The `playlist genre`, `playlist artist`, `playlist album`, `playlist title`,
`playlist path`, `playlist remote` and `playlist duration` queries return the
requested information for a given song at an index position in the current
playlist.

See also the commands under
[Querying the Song Playing](#querying-the-song-playing) which provided similar
information for the song currently playing (plus an additional query,
`current_title`)

#### playlist remote

`<playerid>` playlist remote `<index>` ? `playlist remote` returns 1 if the
`song` is a remote stream.

Example

```text
Request: "04:20:00:12:23:45 playlist remote 3 ?<LF>"
Response: "04:20:00:12:23:45 playlist remote 3 0<LF>"
```

#### playlist genre

`<playerid> playlist genre <index> ?`

Example

```text
Request: "04:20:00:12:23:45 playlist genre 3 ?<LF>"
Response: "04:20:00:12:23:45 playlist genre 3 Rock<LF>"
```

#### playlist artist

`<playerid> playlist artist <index> ?`

Example

```text
Request: "04:20:00:12:23:45 playlist artist 3 ?<LF>"
Response: "04:20:00:12:23:45 playlist artist 3 Abba<LF>"
```

#### playlist album

`<playerid> playlist album <index> ?`

Example

```text
Request: "04:20:00:12:23:45 playlist album 3 ?<LF>"
Response: "04:20:00:12:23:45 playlist album 3 Greatest Hits<LF>"
```

#### playlist title

`<playerid> playlist title <index> ?`

Example

```text
Request: "04:20:00:12:23:45 playlist title 3 ?<LF>"
Response: "04:20:00:12:23:45 playlist title 3 Voulez Vous<LF>"
```

#### playlist path

`<playerid> playlist path <index> ?`

Example

```text
Request: "04:20:00:12:23:45 playlist path 3 ?<LF>"
Response: "04:20:00:12:23:45 playlist path 3 file:///Volumes/Music/ABBA/...<LF>"
```

#### playlist duration

`<playerid> playlist duration <index> ?`

Example

```text
Request: "04:20:00:12:23:45 playlist duration 3 ?<LF>"
Response: "04:20:00:12:23:45 playlist duration 3 103.2<LF>"
```

---

### playlist tracks

`<playerid> playlist tracks ?1`

The `playlist tracks` command returns the the total number of tracks in the
current playlist

Example:

```text
Request: "04:20:00:12:23:45 playlist tracks ?<LF>"
Response: "04:20:00:12:23:45 playlist tracks 7<LF>"
```

---

### playlist shuffle

`<playerid> playlist shuffle <0\|1\|2\|?\|>`

The `playlist shuffle` command is used to shuffle, unshuffle or query the
shuffle state for the current playlist.

Meaning of the `shuffle` parameters:-

- `0` indicates that the playlist is not shuffled,
- `1` indicates that the playlist is shuffled by song,
- `2` indicates that the playlist is shuffled by album.
- Used with no parameter, the command toggles the shuffling state.

Example:

```text
Request: "04:20:00:12:23:45 playlist shuffle ?<LF>"
Response: "04:20:00:12:23:45 playlist shuffle 1<LF>"

Request: "04:20:00:12:23:45 playlist shuffle 0<LF>"
Response: "04:20:00:12:23:45 playlist shuffle 0<LF>"
```

---

### playlist repeat

`<playerid> playlist repeat <0\|1\|2\|?\|>`

The `playlist repeat` command is used to indicate or query if the player will
stop playing at the end of the playlist, repeat the current song indefinitely,
or repeat the current playlist indefinitely.

Meaning of the `repeat` parameters

- `0` indicates that the player will stop at the end of the playlist,
- `1` indicates that the player will repeat the current song indefinitely
- `2` indicates that the player will repeat the entire playlist indefinitely.
- Used with no parameter, the command toggles the repeat state.

Example:

```text
Request: "04:20:00:12:23:45 playlist repeat ?<LF>"
Response: "04:20:00:12:23:45 playlist repeat 2<LF>"

Request: "04:20:00:12:23:45 playlist repeat 0<LF>"
Response: "04:20:00:12:23:45 playlist repeat 0<LF>"
```

---

### playlistcontrol

`<playerid> playlistcontrol <taggedParameters>`

The`playlistcontrol` command enables playlist operations using IDs as returned
by extended CLI queries (titles, artists, playlists, etc).

**Accepted tagged parameters:**

| Tag             | Description                                                                                                                                                                                                                                                                                                                                                  |
| --------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| `cmd`           | Command to perform on the playlist, one of `load`, `add`, `insert` or `delete`. This parameter is mandatory. If no additional parameter is provided, the entire DB is loaded/added/inserted/deleted.                                                                                                                                                         |
| `genre_id`      | Genre ID, to restrict the results to the titles of that genre.                                                                                                                                                                                                                                                                                               |
| `artist_id`     | Artist ID, to restrict the results to the titles of that artist.                                                                                                                                                                                                                                                                                             |
| `album_id`      | Album ID, to restrict the results to the titles of that album.                                                                                                                                                                                                                                                                                               |
| `track_id`      | Comma-separated list of track IDs, to restrict the results to these track_ids. If this parameter is provided, then any `genre_id`, `artist_id` and/or `album_id` parameter is ignored. The tracks are added to the playlist in the given order.                                                                                                              |
| `year`          | Year, to restrict the results to the given year. _The form `year_id` is accepted for backwards compatibility but is deprecated._                                                                                                                                                                                                                             |
| `playlist_id`   | Playlist ID, to restrict the results to this playlist_id. If this parameter is provided, then any `genre_id`, `artist_id`, `album_id` and/or `track_id` parameter is ignored.                                                                                                                                                                                |
| `folder_id`     | Folder ID, to restrict the results to files in this folder_id. If this parameter is provided, then all the others are ignored. _Note that `cmd:delete` is not supported for folders._                                                                                                                                                                        |
| `playlist_name` | Playlist name, to restrict the results to this playlist_name. If this parameter is provided, then any `genre_id`, `artist_id`, `album_id`, `track_id` and/or `playlist_id` parameter is ignored.                                                                                                                                                             |
| `play_index`    | If this parameter is provided along with `cmd:load` then playback will start with the indicated track.                                                                                                                                                                                                                                                       |
| `sort`          | Album sort order. One of<br>`album`, (the default), <br>`new` (sort by change date in descending order), <br>`artflow` which sorts by artist, year, album for use with artwork-centric interfaces, <br>`artistalbum`, <br>`yearalbum`, <br>`yearartistalbum`, <br>`random`<br>Only of relevance if `genre_id`, `artist_id`, `year` or `year_id` is supplied. |

**Returned tagged parameters:**

| Tag      | Description                                                                                                                                              |
| -------- | -------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `rescan` | Returned with value 1 if the server is still scanning the database. The command may therefore have missed items. Not returned if no scan is in progress. |
| `count`  | Number of elements loaded/added/inserted or max number of elements deleted. For folders, only 1 is returned.                                             |

Example:

```text
Request: "a5:41:d2:cd:cd:05 playlistcontrol cmd:add genre_id:9<LF>"
Response: "a5:41:d2:cd:cd:05 playlistcontrol cmd:add genre_id:9 count:33<LF>"

Request: "a5:41:d2:cd:cd:05 playlistcontrol cmd:load album_id:22<LF>"
Response: "a5:41:d2:cd:cd:05 playlistcontrol cmd:load album_id:22 count:12<LF>"
```

---

## Compound queries

These queries were set up in order to get most of the information about the
server or a player in one convenient query, that can be updated by the server
automatically.

---

### serverstatus

`serverstatus <start> <itemsPerResponse> <taggedParameters>`

The `serverstatus` query returns a complete status about the server, including
its players.

Clients can subscribe to `serverstatus` queries, so that the query results are
automatically returned asynchronously whenever a change occurs to the server.
Please note this mechanism is completely distinct from the `listen` and
`subscribe` commands described elsewhere in this document.

**Accepted tagged parameters:**

| Tag           | Description                                                                                                                      |
| ------------- | -------------------------------------------------------------------------------------------------------------------------------- |
| `prefs`       | Comma separated list of server preference values to return.                                                                      |
| `playerprefs` | Comma separated list of player preference values to return (for each player).                                                    |
| `subscribe`   | This optional parameter controls the subscription to the server status. Only one status subscription is possible per connection. |

Subscription is enabled by using this parameter with a positive integer. It is
disabled by using `-`. When the subscription is enabled, normal `serverstatus`
queries (i.e. not using the `subscribe` parameter) can be performed and will
have no effect on the subscription in place.

When enabled, the `serverstatus` query is automatically re-generated on server
change (and sent asynchronously to the CLI client). The number indicates the
time interval in seconds between automatic generations in case nothing happened
to the server info in the interval. Use `0` to disable this last feature and
only be notified on changes. Please see the example.

Some situations will lead to multiple status queries generated very close to
another. This is a limitation of the change detection "algorithm".

Please note this mechanism is completely distinct from the `listen` and
`subscribe` commands described above.

**Returned tagged parameters:**

| Block                                                                                           | Tag                    | Description                                                                                                                                            |
| ----------------------------------------------------------------------------------------------- | ---------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------ |
| **First block:**                                                                                |                        |                                                                                                                                                        |
|                                                                                                 | `rescan`               | Returned with value `1` if the server is still scanning the database. The results may therefore be incomplete. Not returned if no scan is in progress. |
|                                                                                                 | `lastscan`             | Returned with the timestamp when the last scan finished. Not returned if no scan has been run yet.                                                     |
|                                                                                                 | `progressname`         | Returned with the name for the current scan phase. Not returned if no scan is in progress.                                                             |
|                                                                                                 | `progressdone`         | Returned with the current value of items completed for current scan phase. Not returned if no scan is in progress.                                     |
|                                                                                                 | `progresstotal`        | Returned with the total value of items found for current scan phase. Not returned if no scan is in progress.                                           |
|                                                                                                 | `lastscanfailed`       | Information about a possible failure in case a scan has not finished in an attended manner.                                                            |
|                                                                                                 | `version`              | LMS version. Equivalent to `version ?`                                                                                                                 |
|                                                                                                 | `mac`                  | The MAC address of the computer on which the server software is running.                                                                               |
|                                                                                                 | `ip`                   | The IP address of the computer on which the server software is running.                                                                                |
|                                                                                                 | `httpport`             | The port on which the server software is listening.                                                                                                    |
|                                                                                                 | `uuid`                 | The server's unique identifier string.                                                                                                                 |
|                                                                                                 | `info total albums`    | Number of albums known to the server. Equivalent to `info total albums ?`                                                                              |
|                                                                                                 | `info total artists`   | Number of artists known to the server. Equivalent to `info total artists ?`                                                                            |
|                                                                                                 | `info total genres`    | Number of genres known to the server. Equivalent to `info total genres ?`                                                                              |
|                                                                                                 | `info total songs`     | Number of songs known to the server. Equivalent to `info total songs ?`                                                                                |
| **For each defined pref requested:**                                                            |                        |                                                                                                                                                        |
|                                                                                                 | `prefName`             | Preference value. Only if the value is defined. Equivalent to `pref prefName ?`.                                                                       |
|                                                                                                 | `player count`         | Number of players known by the server. Equivalent to `player count ?`.                                                                                 |
| **For each player: <br>Essentially, this list is equivalent to the one returned by `players`.** |                        |                                                                                                                                                        |
|                                                                                                 | `playerid`             | Player unique identifier. Item delimiter. Equivalent to `player id ?`.                                                                                 |
|                                                                                                 | `uuid`                 | Player unique identifier. Equivalent to `player uuid ?`.                                                                                               |
|                                                                                                 | `ip`                   | Player IP and port. Equivalent to `player ip ?`.                                                                                                       |
|                                                                                                 | `name`                 | Player name. Equivalent to `player name ?`.                                                                                                            |
|                                                                                                 | `model`                | Player model. Equivalent to `player model ?`.                                                                                                          |
|                                                                                                 | `power`                | Whether the player is powered on or off.                                                                                                               |
|                                                                                                 | `isplayer`             | Whether a player is a known player model. Will return 0 for streaming connections. Equivalent to `player isplayer ?`.                                  |
|                                                                                                 | `displaytype`          | Player display type. Not returned for streaming connections. Equivalent to `player displaytype <playerindex> ?`.                                       |
|                                                                                                 | `canpoweroff`          | Whether the player can be powered off. This value is false for streaming connections.                                                                  |
|                                                                                                 | `connected`            | Connected state. Equivalent to `<playerid> connected ?`.                                                                                               |
|                                                                                                 | `player_needs_upgrade` | Connected player needs a firmware upgrade.                                                                                                             |
|                                                                                                 | `player_is_upgrading`  | Connected player is in the process of performing a firmware update.                                                                                    |
|                                                                                                 | `other player count`   | Number of players connected to other discovered servers in the local network.                                                                          |
| **For each player connected to some other server in the local network:**                        |                        |                                                                                                                                                        |
|                                                                                                 | `playerid`             | Player unique identifier (MAC address).                                                                                                                |
|                                                                                                 | `name`                 | Player name.                                                                                                                                           |
|                                                                                                 | `server`               | The server to which the player is connected                                                                                                            |
|                                                                                                 | `model`                | Player model. Please note that only Squeezebox2 and later can be remotely disconnected.                                                                |
| **For each defined player pref requested:**                                                     |                        |                                                                                                                                                        |
|                                                                                                 | `prefName`             | Preference value. Only if the value is defined. Equivalent to `playerpref prefName ?`.                                                                 |

Examples: showing response to same command from Telnet and as output as JSON

```text
request: "serverstatus"

response: via TELNET (some line breaks added here to improve readability)
response: "serverstatus   lastscan%3A1711201749 version%3A8.5.0
uuid%3A9caf975e-f502-47db-ad3e-135ab16a86fa ip%3A192.168.5.75 httpport%3A9005
info%20total%20albums%3A539 info%20total%20artists%3A515
info%20total%20genres%3A116 info%20total%20songs%3A8880
info%20total%20duration%3A7091295.34500001 player%20count%3A4
other%20player%20count%3A0"

response: via JSON
{'lastscan': '1711201749',
 'version': '8.5.0',
 'uuid': '9caf975e-f502-47db-ad3e-135ab16a86fa',
 'ip': '192.168.5.75',
 'httpport': '9005',
 'info total albums': 539,
 'info total artists': 515,
 'info total genres': 116,
 'info total songs': 8880,
 'info total duration': 7091295.34500001,
 'player count': 4,
 'other player count': 0}
```

---

### status

`<playerid> status <start> <itemsPerResponse> <taggedParameters>`

The `status` query returns the complete status about a given player, including
the current playlist. Set the `<start>` parameter to `-` to get the playlist
data starting from the current song.

In this `current` mode and if repeat all is on (`playlist repeat` is `2`), the
server will attempt to return `<itemsPerResponse>` elements, by repeating the
playlist at most once, unless shuffling is on and the server is configured to
re-shuffle the playlist at each loop (in which case it is impossible to predict
the song following the last one in the playlist until this last song has
finished playing).

Similarly, in the `current` mode, if repeat is one, only the current song is
returned, regardless of the value of `<itemsPerResponse>`.

Clients can subscribe to `status` queries, so that the query results are
automatically returned asynchronously whenever a change occurs to a player.
Please note this mechanism is completely distinct from the `listen` and
`subscribe` commands described elsewhere in this document.

**Accepted tagged parameters:**

| Tag              | Description                                                                                                                                                                                                                                                                                                                                                                                                                 |
| ---------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `tags`           | Determines which tags are returned. Each returned tag is identified by a letter (see command [`songinfo`](#songinfo) for a list of possible fields and their identifying letter). The default tags value for this query is `gald`. In addition to the tags supported by [`songinfo`](#songinfo) there's the special `DD` tag, which would return no track information, but the total duration of the current playlist only. |
| `alarmData`      | If set to a truthy value will return information about the next upcoming alarm.                                                                                                                                                                                                                                                                                                                                             |
| `menu`           | If present, returns SlimBrowse menu data in `item_loop` instead of `playlist_loop`.                                                                                                                                                                                                                                                                                                                                         |
| `useContextMenu` | When used with `menu`, provides a context-menu action in the returned `base` data.                                                                                                                                                                                                                                                                                                                                          |
| `subscribe`      | This optional parameter controls the subscription to the player status. Only one status subscription is possible per player and connection.                                                                                                                                                                                                                                                                                 |

Subscription is enabled by using this parameter with a positive integer. It is
disabled by using `-`. When the subscription is enabled, normal `status` queries
(i.e. not using the `subscribe` parameter) can be performed and will have no
effect on the subscription in place.

When enabled, the `status` request is automatically re-generated on player
change (and sent asynchronously to the CLI client). The number indicates the
time interval in seconds between automatic generations in case nothing happened
to the player in the interval. Use `0` to disable this last feature and only be
notified on player or playlist changes. Please see the example.

Some situations will lead to multiple status queries generated very close to
another. This is a limitation of the change detection "algorithm".

If the player is manually (through the web page) or automatically deleted from
the server, the status query returns the `error` tag with value `invalid player`
and the subscription is terminated.

Please note this mechanism is completely distinct from the `listen` and
`subscribe` commands described above.

**Returned tagged parameters:**

| Tag      | Description                                                                                                                                          |
| -------- | ---------------------------------------------------------------------------------------------------------------------------------------------------- |
| `rescan` | Returned with value 1 if the server is still scanning the database. The results may therefore be incomplete. Not returned if no scan is in progress. |
| `error`  | Returned with value `invalid player` if the player this subscription query referred to no longer exists.                                             |

In non subscription mode, the query simply echoes itself (i.e. produces no
result) if `<playerid>` is wrong.

`alarmData` (or `menu`) also enables the alarm fields described below. `menu`
returns menu-specific fields described after the playlist fields.

| Tag                                                                      | Description                                                                                                                                                                                                                                                                                                                                   |
| ------------------------------------------------------------------------ | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `player_name`                                                            | Name of the player.                                                                                                                                                                                                                                                                                                                           |
| `player_connected`                                                       | Connected state of the player.                                                                                                                                                                                                                                                                                                                |
| `player_ip`                                                              | Player IP address and port. Only if connected.                                                                                                                                                                                                                                                                                                |
| `library_id`                                                             | ID of the virtual library assigned to the player. Only if one is assigned.                                                                                                                                                                                                                                                                    |
| `library_name`                                                           | Name of the virtual library assigned to the player. Only if one is assigned.                                                                                                                                                                                                                                                                  |
| `player_needs_upgrade`                                                   | Connected player needs a firmware upgrade.                                                                                                                                                                                                                                                                                                    |
| `player_is_upgrading`                                                    | Connected player is in the process of performing a firmware update.                                                                                                                                                                                                                                                                           |
| `showBriefly`                                                            | Current temporary display message. Only while the message has not expired.                                                                                                                                                                                                                                                                    |
| `power`                                                                  | Power state of the player. Only for player devices; not returned for remote streaming connections.                                                                                                                                                                                                                                            |
| `signalstrength`                                                         | Signal strength (only for Squeezeboxen and Transporters).                                                                                                                                                                                                                                                                                     |
| `mode`                                                                   | Player mode.                                                                                                                                                                                                                                                                                                                                  |
| `waitingToPlay`                                                          | A flag telling whether the player isn't actually playing, but still waiting for data or something.                                                                                                                                                                                                                                            |
| `alarm_state`                                                            | One of 'active' (means alarm currently going off), 'set' (alarm set to go off in next 24h on this player), 'none' (no alarm set to go off in next 24h on this player), 'snooze' (alarm is active but currently snoozing). Only with `alarmData` or `menu`.                                                                                    |
| `alarm_next`                                                             | Epochtime seconds when the next alarm within the next 24h is due, or `0` when no alarm is due or an alarm is snoozed or active. Only with `alarmData` or `menu`.                                                                                                                                                                              |
| `alarm_version`                                                          | Alarm response version, currently `2`. Only with `alarmData` or `menu`.                                                                                                                                                                                                                                                                       |
| `alarm_next2`                                                            | Epoch seconds when the next enabled alarm is due, including alarms beyond 24 hours. Only with `alarmData` or `menu`, and only when such an alarm exists.                                                                                                                                                                                      |
| `alarm_repeat`                                                           | Repeat setting for the next enabled alarm. Only with `alarmData` or `menu`, and only when such an alarm exists.                                                                                                                                                                                                                               |
| `alarm_days`                                                             | String of seven `0`/`1` characters for Sunday through Saturday, indicating the days enabled for the next alarm. Only with `alarmData` or `menu`, and only when such an alarm exists.                                                                                                                                                          |
| `alarm_snooze_seconds`                                                   | The snooze duration for the upcoming alarm. Only with `alarmData` or `menu`.                                                                                                                                                                                                                                                                  |
| `alarm_timeout_seconds`                                                  | The alarm timeout for the upcoming alarm. Only with `alarmData` or `menu`.                                                                                                                                                                                                                                                                    |
| Playback and player state:                                               |                                                                                                                                                                                                                                                                                                                                               |
| `remote`                                                                 | Returns 1 if a remote stream is currently playing.                                                                                                                                                                                                                                                                                            |
| `current_title`                                                          | Returns the current title for remote streams. Only if remote stream is playing.                                                                                                                                                                                                                                                               |
| `time`                                                                   | Elapsed time into the current song. Decimal seconds. Only if current song.                                                                                                                                                                                                                                                                    |
| `rate`                                                                   | Player rate. Always `1`, for backward compatibility with older SBC firmware. Only if there is a current song.                                                                                                                                                                                                                                 |
| `duration`                                                               | Duration of the current song. Decimal seconds. Only if current song and if the duration is known (it is not for remote streams).                                                                                                                                                                                                              |
| `can_seek`                                                               | `1` when the current song can be sought, omitted when it can't.                                                                                                                                                                                                                                                                               |
| `replay_gain`                                                            | Replay-gain value for the current song. Only if the song defines it.                                                                                                                                                                                                                                                                          |
| `sleep`                                                                  | If set to sleep, the amount (in seconds) it was set to.                                                                                                                                                                                                                                                                                       |
| `will_sleep_in`                                                          | Seconds left until sleeping. Only if set to sleep.                                                                                                                                                                                                                                                                                            |
| `sync_master`                                                            | ID of the master player in the sync group this player belongs to. Only if synced.                                                                                                                                                                                                                                                             |
| `sync_slaves`                                                            | Comma-separated list of player IDs, slaves to sync_master in the sync group this player belongs to. Only if synced.                                                                                                                                                                                                                           |
| `mixer volume`                                                           | Only returned for players with volume control.                                                                                                                                                                                                                                                                                                |
| `mixer treble`                                                           | Only returned when the player supports treble control (SliMP3 and Squeezebox1).                                                                                                                                                                                                                                                               |
| `mixer bass`                                                             | Only returned when the player supports bass control (SliMP3 and Squeezebox1).                                                                                                                                                                                                                                                                 |
| `mixer pitch`                                                            | Only returned when the player supports pitch control (Squeezebox1).                                                                                                                                                                                                                                                                           |
| `seq_no`                                                                 | Player sequence number. Only if defined.                                                                                                                                                                                                                                                                                                      |
| `digital_volume_control`                                                 | Player preference indicating whether digital volume control is enabled. Only if defined.                                                                                                                                                                                                                                                      |
| `use_volume_control`                                                     | Whether the player's volume control is active. Only if digital-volume and digital-output capabilities are known.                                                                                                                                                                                                                              |
| `randomplay`                                                             | Returns `1` when the Random Play plugin is active for the player, otherwise `0`. Only if the RandomPlay plugin is loaded.                                                                                                                                                                                                                     |
| `playlist mode`                                                          | Always `off`; retained for backwards compatibility.                                                                                                                                                                                                                                                                                           |
| `playlist duration`                                                      | Duration of the full playlist. Decimal seconds. Only if tag `DD` was requested and for the duration of tracks where it is known (it is not for eg. radio streams).                                                                                                                                                                            |
| `playlist repeat`                                                        | 0 no repeat, 1 repeat song, 2 repeat playlist.                                                                                                                                                                                                                                                                                                |
| `playlist shuffle`                                                       | 0 no shuffle, 1 shuffle songs, 2 shuffle albums.                                                                                                                                                                                                                                                                                              |
| `playlist_id`                                                            | Playlist id, if the current playlist is a stored playlist.                                                                                                                                                                                                                                                                                    |
| `playlist_name`                                                          | Playlist name, if the current playlist is a stored playlist. Equivalent to `playlist name ?`.                                                                                                                                                                                                                                                 |
| `playlist_modified`                                                      | Modification state of the saved playlist (if the current playlist is one). Equivalent to `playlist modified ?`.                                                                                                                                                                                                                               |
| `playlist_cur_index`                                                     | Index of the currently playing song in the playlist. Only if there are songs in the current playlist.                                                                                                                                                                                                                                         |
| `playlist_timestamp`                                                     | Timestamp of the current playlist, in seconds. Changes to the playlist (insertion/removal/shuffling) result in an increase of this value. This can be used to detect the entire playlist has to be reacquired. Only if there are songs in the current playlist.                                                                               |
| `playlist_tracks`                                                        | Number of tracks in the current playlist. `0` when the playlist is empty.                                                                                                                                                                                                                                                                     |
| `remoteMeta`                                                             | Metadata for the current remote track. Only when a remote track is playing and tag `DD` (means you want total playtime for the current playlist and nothing else) is not requested.                                                                                                                                                           |
| If playlist information exists/requested, for each song in the playlist: |                                                                                                                                                                                                                                                                                                                                               |
| `playlist index`                                                         | Index (first item is 0) of the playlist entry in the player playlist. Unless `<start>` is `-`, the first returned instance of this field is equal to start. If `<start>` is `-`, the first returned instance of this field contains the index of the currently playing song in the player playlist. Item separator.                           |
| `Tags`                                                                   | Same tags as defined in command [`songinfo`](#songinfo). Additionally, when returning the playlist_loop (ie current contents of the play queue) tag `2` will return a flag `contiguous_groups` indicating whether the play queue entries are contiguous with respect to work/grouping/performance, to assist UI formatting of the play queue. |
| In Menu mode:                                                            |                                                                                                                                                                                                                                                                                                                                               |
| `preset_loop`                                                            | Array of ten values 0/1 indicating whether each preset button is defined. Only with `menu`.                                                                                                                                                                                                                                                   |
| `preset_data`                                                            | Data for the ten preset buttons. Only with `menu`.                                                                                                                                                                                                                                                                                            |
| `base`                                                                   | Actions for each returned menu item. Only with `menu`.                                                                                                                                                                                                                                                                                        |
| `count`                                                                  | Number of returned menu items, including Save and Clear Playlist when the playlist is non-empty. Only with `menu`.                                                                                                                                                                                                                            |
| `offset`                                                                 | Index of the first returned menu item. Only with `menu` and a non-empty playlist.                                                                                                                                                                                                                                                             |
| `item_loop`                                                              | Menu items, including Save Playlist and Clear Playlist controls. Replaces `playlist_loop` when `menu` is requested.                                                                                                                                                                                                                           |

Examples:

Simple example

```text
Request: "a5:41:d2:cd:cd:05 status 0 2 tags:<LF>"
Response: "a5:41:d2:cd:cd:05 status 0 2 tags: player_name:127.0.0.1 player_connected:1 power:1 mode:play rate:1 time:13.7129358076728 duration:252.630204081633 mixer%20volume:50 mixer%20treble:50 mixer%20bass:50 mixer%20pitch:100 playlist%20repeat:2 playlist%20shuffle:0 playlist_cur_index:1 playlist_tracks:3 playlist%20index:0 title:Left%20Outside%20Alone playlist%20index:1 title:Bounce%20[Original%20Version]<LF>"
```

Current mode example

```text
Request: "a5:41:d2:cd:cd:05 status - 2 tags:<LF>"
Response: "a5:41:d2:cd:cd:05 status - 2 tags: player_name:127.0.0.1 player_connected:1 power:1 mode:play rate:1 time:18.721127818274 duration:252.630204081633 mixer%20volume:50 mixer%20treble:50 mixer%20bass:50 mixer%20pitch:100 playlist%20repeat:2 playlist%20shuffle:0 playlist_cur_index:1 playlist_tracks:3 playlist%20index:1 title:Bounce%20[Original%20Version] playlist%20index:2 title:Open%20Up%20[Radio%20Edit]<LF>"
```

Subscribe mode example

```text
Request: "a5:41:d2:cd:cd:05 status - 2 subscribe:30<LF>"
Response: "a5:41:d2:cd:cd:05 status - 2 subscribe:30 player_name:127.0.0.1 ... (same as above)

10 seconds later, player is turned off, CLI generates and sends:
"a5:41:d2:cd:cd:05 status - 2 subscribe:30 player_name:127.0.0.1 player_connected:1 power:0<LF>"

30 seconds (the subscribe value) elapse, no changes to the player, the CLI generates and sends:
"a5:41:d2:cd:cd:05 status - 2 subscribe:30 player_name:127.0.0.1 player_connected:1 power:0<LF>"
```

---

### displaystatus

`displaystatus <taggedParameters>`

The `displaystatus` query allows subscription to display update events for a
player. Details of the latest display change are automatically returned whenever
the relevant display update event occurs on that player.

Clients may subscribe to only receive status and warning (`showbriefly`)
messages, receive normal display updates (`update`), or receive all display
updates including menu transitions ('all').

Clients may also subscribe to receive the bitmap which comprises each display
update ('bits'). For SB2 and later players, this forwards the display bitmap to
the client encoded in base64. Clients may request a reduced width display by
setting the width parameter in the status subscription. Note this reduces the
width of the display shown on the live player screen as well as for the display
forwarded to the cli client.

**Accepted tagged parameters:**

| Tag         | Description                                                                      |
| ----------- | -------------------------------------------------------------------------------- |
| `subscribe` | 'showbriefly', 'update', 'all' or 'bits' to subscribe and nothing to unsubscribe |
| `width`     | Reduced width for the display, only used with a subscription for 'bits'          |

---

### readdirectory

`readdirectory <start> <itemsPerResponse> <taggedParameters>`

The `readdirectory` query allows to browse filesystems from the server's point
of view. This can be used to eg. select music folders. Local filesystems are
supported, as are UNC paths on Windows systems (eg. \\server\musicshare).

Please note that on Windows systems the back slashes must either be escaped or
replaced by normal slashes. The above path would better be written
`//server/musicshare.`

**Accepted tagged parameters:**

| Tag                   | Description                                                                                                              |
| --------------------- | ------------------------------------------------------------------------------------------------------------------------ |
| `folder`              | the path to the folder to be displayed, eg. c:/music, /Users/mh/Music, //server/share etc.                               |
| `filter`              | Filter the output according to one of the following keywords (regular expressions can be used):                          |
| `filter:foldersonly`  | list folders only                                                                                                        |
| `filter:filesonly`    | list files only                                                                                                          |
| `filter:musicfiles`   | list all files considered music files by the server; this is the same filter as is used when scanning the disk for music |
| `filter:filetype:xyz` | list file type .xyz only                                                                                                 |
| `filter:xyz`          | any expression filter path/filenames                                                                                     |

**Returned tagged parameters:**

| Tag        | Description                                |
| ---------- | ------------------------------------------ |
| `item`     | The folder's item: folder, files etc.      |
| `isfolder` | A flag whether an item is a folder or not. |

Example:

```text
Request: "readdirectory 0 10 folder://media/mp3"
Response: "readdirectory 0 10 folder%3A%2F%2Fmedia%2Fmp3 count%3A251 item%3A%5C%5Cmedia%5Cmp3%5CAerosmith isfolder%3A1 item%3A%5C%5Cmedia%5Cmp3%5CAir isfolder%3A1 item%3A%5C%5Cmedia%5Cmp3%5CAlanis%20Morissette isfolder%3A1 item%3A%5C%5Cmedia%5Cmp3%5CAldo%20Romano%2C%20Michel%20Benita%2C%20Glenn%20Ferris%2C%20Paolo%20Fresu isfolder%3A1 item%3A%5C%5Cmedia%5Cmp3%5CAli%20Farka%20Toure isfolder%3A1 item%3A%5C%5Cmedia%5Cmp3%5CAll%20Saints isfolder%3A1 item%3A%5C%5Cmedia%5Cmp3%5CManu%20Katche isfolder%3A1 item%3A%5C%5Cmedia%5Cmp3%5CSinead%20O'Connor isfolder%3A1 item%3A%5C%5Cmedia%5Cmp3%5CShakira isfolder%3A1 item%3A%5C%5Cmedia%5Cmp3%5CAnastacia isfolder%3A1"
```

---

## Notifications

All commands listed in this document are notifications as well as being commands
and can be received when using `listen 1` (if they do not originate from the
command-line connection that issued them; no command is echoed twice).

Note that queries (for example, `display ? ?`) are not notified.

Other available notifications are listed below with their meaning.

Please note that other notifications or commands may exist, but internal to the
server and therefore not documented in this CLI document. Likewise, commands
originating from the server may have more parameters than those described in
this document, or parameters consisting of internal Perl data structures with
strange text representations.

---

### client

`<playerid> client <new\|disconnect\|reconnect>`

A new client is notified using `client new`. `client disconnect` is sent when a
client disconnects. Unless it reconnects (as signaled by `client reconnect`)
before a number of minutes, the client will be automatically forgotten by the
server (as indicated by command/notification `client forget`.)

---

### rescan done

`rescan done`

This signals the end of a `rescan` or `wipecache`.

---

### library changed

`library changed <0\|1>`

This signals the presence or absence of a library has changed.

---

### unknownir

`<playerid> unknownir <ircode> <time>`

This signals an IR code unknown by the server. The syntax is the same than the
one used by `ir`- see [Info on `ir` command in Players](#ir).

Note: This is only available on SB Classic, SB Boom and Transporter. SB Touch
and SB Radio handle IR codes locally and do not report them to the server
anymore.

---

### playlist

Various Notifications related to Playlists

#### playlist newsong

`<playerid> playlist newsong [<current_title>] [<playlist index>]`

This signals the start of a new song, along with its `current_title` and
`playlist index`. For radio stations, only the `current_title` information is
provided.

#### playlist stop

`<playerid> playlist stop`

#### playlist pause

`<playerid> playlist pause <0\|1>`

These signal a change in playing status.

---

### prefset

`<playerid> prefset [<namespace>] [<prefname>] [<value>]`

This signals a preference change.

---

### favorites changed

`favorites changed`

Sent everytime the favorite database is changed, for any reason, by any process
(so the favorites command below will result in this notification being sent).

---

### Alarm notification

`<playerid> alarm <sound\|end\|snooze\|snooze_end> <id>`

- `alarm sound` is sent when an alarm sounds;
- `alarm end` when an alarm ends;
- `alarm snooze` when an alarm is snoozed;
- `alarm snooze_end` when a snooze ends (and the alarm resumes).
- `id` gives the id of the alarm.

---

### getexternalvolumeinfo

`<playerid> getexternalvolumeinfo <taggedParameters>`

This notification notifies a client that a plugin supports volume change
capability for a player. This capability will override (from a user's point of
view) the `digitalVolumeControl` flag that indicates whether a player's output
is fixed to a certain volume (typically 100%). This will be used by plugins
providing external volume control, e.g. for an amplifier (IRBlaster being an
example). In this scenario, the volume output of the player is typically fixed
but there is still a volume control capability and the plugin controls the amp's
volume instead. The purpose of this notification is to let a client know that
there is a volume control capability associated with a player.

Sending a `getexternalvolumeinfo` command triggers all plugins supporting the
feature to return a notification about their capabilities for each player for
which they provide these capabilities. The command may be sent to a specific
player but typically a plugin will ignore this and respond to any
getexternalvolumeinfo command for each player.

Please note that this notification is only supported by some 3rd party plugins.
It's not part of the core server functionality.

Returned tagged parameters:

| Tag        | Description                                                                                                                        |
| ---------- | ---------------------------------------------------------------------------------------------------------------------------------- |
| `relative` | A boolean value stating that a plugin is able to provide relative volume change capability for this player as in `mixer volume +5` |
| `precise`  | A boolean value stating that a plugin is able to provide precise volume change capability for this player as in `mixer volume 75`  |
| `plugin`   | is an optional string naming the plugin providing the capability                                                                   |

Example:

```text
Request: "getexternalvolumeinfo<LF>"
Response 1: "a5:41:d2:cd:cd:05 getexternalvolumeinfo relative:1 plugin:IRBlaster"
Response 2: "a5:41:d2:cd:cd:05 getexternalvolumeinfo precise:1 plugin:DenonSerial"
```

---

## Alarm commands and queries

Two main commands:- `alarm` and `alarms`

See also

- [`alarm` under Notifications](#alarm).
- [`playerpref` under Players](#playerpref)

---

### alarm

```text
<playerid> alarm
<add|update|delete|enableall|disableall|defaultvolume> <taggedParameters>
```

The `alarm` command allows to manipulate player alarms.

**Accepted tagged parameters:**

| Tag                      | Description                                                                                                                                                                                                                                                                                                                            |
| ------------------------ | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `id`                     | The id of an existing alarm. This value is mandatory unless you `add` a new alarm.                                                                                                                                                                                                                                                     |
| `dow`                    | Day Of Week. 0 is Sunday, 1 is Monday, etc. up to 6 being Saturday. You can define a group of days by concatenating them with `,` as separator. Default: 0-6.                                                                                                                                                                          |
| `dowAdd`                 | Add a single day of the week to the alarm list This takes precendence over anything sent in the dow tag.                                                                                                                                                                                                                               |
| `dowDel`                 | Removes a single day (0-6) of the week from the alarm list This takes precendence over anything sent in the dow tag.                                                                                                                                                                                                                   |
| `enabled`                | 1 if the alarm is enabled. Default: 0.                                                                                                                                                                                                                                                                                                 |
| `repeat`                 | 1 if the alarm repeats. Default: 1.                                                                                                                                                                                                                                                                                                    |
| `time`                   | Time of the alarm, in seconds from midnight. Mandatory when add command is issued.                                                                                                                                                                                                                                                     |
| `volume`                 | Mixer volume of the alarm.<br>Default: use the default volume for alarms. Mandatory when defaultvolume command is issued.                                                                                                                                                                                                              |
| `url` (or `playlisturl`) | URL of the alarm playlist.<br> Default: the current playlist.<br>`url` should be a valid LMS audio url.<br>The special value 0 means the current playlist.<br>You can also use these URLs which trigger various flavours of random play:-<br>`randomplay:track`<br>`randomplay:contributor`<br>`randomplay:album`<br>`randomplay:year` |

See also "favorites items".

**Returned tagged parameters:**

| Tag  | Description                                  |
| ---- | -------------------------------------------- |
| `id` | The id of the newly created or edited alarm. |

Examples:

Defining a new alarm

```text
Request: "bd:a5:a9:9b:9d:df alarm add dow:1 enabled:1 playlist:file://some/playlist.m3u time:9000<LF>"
Response: "bd:a5:a9:9b:9d:df alarm add dow:1 enabled:1 playlist:file://some/playlist.m3u time:9000 id:eaf39<LF>"
```

Deleting an alarm

```text
Request: "bd:a5:a9:9b:9d:df alarm delete id:eaf39<LF>"
Response: "bd:a5:a9:9b:9d:df alarm delete id:eaf39<LF>"
```

Enabling a previously defined alarm for Mo-Fr

```text
Request: "bd:a5:a9:9b:9d:df alarm update id:eaf39 dow:1,2,3,4,5 enabled:1<LF>"
Response: "bd:a5:a9:9b:9d:df alarm update id:eaf39 dow:1,2,3,4,5 enabled:1 count:1 <LF>"
```

---

### alarm playlists

`alarm playlists`

The `alarm playlists` returns all the playlists, sounds, favorites etc.
available to alarms.

**Returned tagged parameters:**

| Block                  | Tag         | Description                                                                        |
| ---------------------- | ----------- | ---------------------------------------------------------------------------------- |
| **First block:**       |             |                                                                                    |
|                        | Count       | The number of items available                                                      |
| **For each playlist:** |             |                                                                                    |
|                        | `title`     | The item's name or title                                                           |
|                        | `category`  | The category under which the item is grouped (eg. Favorites, Natural Sounds etc.)  |
|                        | `url`       | The item's URL, or the empty value as a placeholder for the current playlist.      |
|                        | `singleton` | 1 if the item is the only one in its category, or 0 if there's more than one item. |

Example:

```text
Request: "alarm playlists 0 3<LF>"
Response: "alarm playlists 0 100 category:The current playlist
title:Use Current Playlist url: singleton:1 category:Favorites
title:Random%20Artists url:randomplay://contributor singleton:0 category:Favorites
title:Random%20Tracks url:randomplay://track singleton:0 count:29 <LF>"
```

---

### alarms

`<playerid> alarms <start> <itemsPerResponse> <taggedParameters>`

The `alarms` query returns information about player alarms. `<start>` is the
indexid of the first player to be reported on (eg 0, 1, 2), while
`<itemsPerResponse>` is the numbers of players whose information will be
returned.

**Accepted tagged parameters:**

| Tag      | Description                                                                                                                                                                           |
| -------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `dow`    | If present, the query returns information about this Day Of Week only. Note this takes precedence over any `filter` parameter. 0 is Sunday, 1 is Monday, etc. up to 6 being Saturday. |
| `filter` | Two possible values:<br> `all` returns all alarms,<br>`enabled` returns just those alarms which are enabled.                                                                          |

**Returned tagged parameters:**

| Block               | Preference    | Description                                            |
| ------------------- | ------------- | ------------------------------------------------------ |
| **First block:**    |               |                                                        |
|                     | `fade`        | 1 if the alarms fade in.                               |
|                     | `count`       | Number of alarms returned, based on the filters above. |
| **For each alarm:** |               |                                                        |
|                     | `id`          | The alarm's ID.                                        |
|                     | `dow`         | Days Of Week of this alarm.                            |
|                     | `enabled`     | 1 if the alarm is enabled.                             |
|                     | `repeat`      | 1 if the alarm is repeated.                            |
|                     | `shufflemode` | 0 if off, 1 for songs, 2 for albums.                   |
|                     | `time`        | The time for this alarm.                               |
|                     | `volume`      | Mixer volume of the alarm.                             |
|                     | `url`         | URL of track or playlist to be played.                 |

Example:

```text
Request: "bd:a5:a9:9b:9d:df alarms 0 3<LF>"
Response: "bd:a5:a9:9b:9d:df alarms 0 3 count:2 fade:0
dow:1 enabled:1 time:3600 volume:50 url:randomplay://track
dow:5 enabled:1 time:81000 volume:77 playlist url:file:///Volumes/Smurf/playlists/Playlists/AAA.m3u <LF>"
```

### Alarm related Player Preferences

Additionally, the following player preferences control the operation of the
alarm and can be set/queried using the `playerpref` command.

This command is described more fully in the Players page.
[Jump to `playerpref` under Players](#playerpref)

| Preference                                | Description                                                                                                                                                                                                         |
| ----------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `alarmfadeseconds`<br> _(note the case!)_ | Whether alarms should fade in on this player. Despite the name, this preference is only a boolean and does not control the number of seconds over which alarms fade in. Set to 0 to disable fading; 1 to enable it. |
| `alarmTimeoutSeconds`                     | The number of seconds that an alarm will play for before being automatically stopped. Set to 0 to disable the automatic timeout.                                                                                    |
| `alarmSnoozeSeconds`                      | The number of seconds that a snooze will last for.                                                                                                                                                                  |
| `alarmsEnabled`                           | Whether any alarm can sound on this player. Set to 0 to prevent any alarm from sounding; 1 to allow them to sound.                                                                                                  |
| `alarmDefaultVolume`                      | The volume level (0-100) at which alarms will sound unless they have their own volume specifically set (see `alarm volume`).                                                                                        |

---

## Favorites commands and queries

---

### favorites items

`favorites items <start> <itemsPerResponse> <taggedParameters>`

The `favorites items` query returns all server favorites.

**Accepted tagged parameters:**

| Tag        | Description                                                                                                                                                           |
| ---------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `item_id`  | The id of a favorite to be returned. The id represents the hierarchical structure of the file using a dotted syntax similar to the one used in SNMP, like eg. 2.0.9.3 |
| `search`   | When a list of items is to be returned, it can be filtered by its name or title.                                                                                      |
| `want_url` | If set to 1, urls are returned by the query, otherwise they aren't.                                                                                                   |
| `feedMode` | If set to 1, the entire nested hierarchy of favorites is returned. In this case, the type will be opml and the nested sub-items will be in each level's items array.  |

**Returned tagged parameters:**

| Block                 | Tag        | Description                                                                                                                                                                                                                              |
| --------------------- | ---------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **First block:**      |            |                                                                                                                                                                                                                                          |
|                       | `count`    | The number of items available at the selected level.                                                                                                                                                                                     |
| **For each element:** |            |                                                                                                                                                                                                                                          |
|                       | `id`       | An item's hierarchical id. Item delimiter.                                                                                                                                                                                               |
|                       | `name`     | An item's (favorite or folder) name.                                                                                                                                                                                                     |
|                       | `hasitems` | Whether or not an item has sub-items. May indicate the number of sub-items.                                                                                                                                                              |
|                       | `url`      | URL of the station or track (only returned if parameter `want_url` is set to 1). Although, the station can be played using the [playlist play](#playlist-play) command, an equivalent command that operates on the id is provided below. |

---

### favorites exists

`favorites exists <id \| url>`

The `favorites exists` command is used to check whether a given track ID or URL
exists in favorites.

**Returned tagged parameters:**

| Tag      | Description                                                 |
| -------- | ----------------------------------------------------------- |
| `exists` | Returned with value 1 if the ID or URL exists in favorites. |
| `index`  | If exists is 1, the index of the ID or URL in favorites.    |

Example:

```text
Request: "favorites exists file:///... <LF>"
Response: "favorites exists file:///... exists:1 index:5<LF>"
```

---

### favorites add

`favorites add <taggedParameters>`

The `favorites add` command adds a favorite.

**Accepted tagged parameters:**

| Tag       | Description                                                                                                                                                                                                                                                                             |
| --------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `item_id` | The id of a favorite to be inserted. The id represents the hierarchical structure of the file using a dotted syntax similar to the one used in SNMP, like eg. 2.0.9.3.<br>Room is made to accommodate the new favorite. If no item_id is provided, the favorite is added at position 0. |
| `title`   | Favorite title (mandatory)                                                                                                                                                                                                                                                              |
| `url`     | Favorite url (mandatory)                                                                                                                                                                                                                                                                |
| `icon`    | Optional URL to an icon to be used with this favorite.                                                                                                                                                                                                                                  |

**Returned tagged parameters:**

| Tag     | Description                                                  |
| ------- | ------------------------------------------------------------ |
| `count` | Returned with value 1 if adding the favorite was successful. |

Example:

```text
Request: "favorites add url:file:///... title:BestSong<LF>"
Response: "favorites add url:file:///... title:BestSong
count:1<LF>"
```

---

### favorites addlevel

`favorites addlevel <taggedParameters>` The `favorites addlevel` command adds a
favorite level (a folder).

**Accepted tagged parameters:**

| Tag     | Description                                                                                                                                                                                                                                                                     |
| ------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| item_id | The id of a level to be inserted. The id represents the hierarchical structure of the level using a dotted syntax similar to the one used in SNMP, like eg. 2.0.9.3.<br>Room is made to accommodate the new level. If no item_id is provided, the level is added at position 0. |
| title   | Level title (mandatory)                                                                                                                                                                                                                                                         |

**Returned tagged parameters:**

| Tag   | Description                                               |
| ----- | --------------------------------------------------------- |
| count | Returned with value 1 if adding the level was successful. |

Example:

```text
 Request: "favorites addlevel title:Favourites<LF>"
 Response: "favorites addlevel title:Favourites count:1<LF>"
```

---

### favorites delete

`favorites delete <taggedParameters>`

The `favorites delete` command deletes a favorite or a level.

**Accepted tagged parameters:**

| Tag     | Description                                                                                                                                                                                                    |
| ------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| item_id | The id of a favorite or level to be deleted. The id represents the hierarchical structure of the file using a dotted syntax similar to the one used in SNMP, like eg. 2.0.9.3.<br>This parameter is mandatory. |

Example:

```text
Request: "favorites delete item_id:1.2.3.4.5<LF>"
Response: "favorites delete item_id:1.2.3.4.5<LF>"
```

---

### favorites rename

`favorites rename <taggedParameters>`

The `favorites rename` command renames a favorite or a level.

**Accepted tagged parameters:**

| Tag     | Description                                                                                                                                                                                                    |
| ------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| item_id | The id of a favorite or level to be renamed. The id represents the hierarchical structure of the file using a dotted syntax similar to the one used in SNMP, like eg. 2.0.9.3.<br>This parameter is mandatory. |
| title   | The new title to rename this item to. This parameter is mandatory.                                                                                                                                             |

Example:

```text
Request: "favorites rename item_id:1.2.3.4.5 title:NewTitle<LF>"
Response: "favorites rename item_id:1.2.3.4.5 title:NewTitle<LF>"
```

---

### favorites move

`favorites move <taggedParameters>`

The `favorites move` command moves a favorite or a level.

**Accepted tagged parameters:**

| Tag     | Description                                                                                                                                                                                                  |
| ------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| from_id | The id of a favorite or level to be moved. The id represents the hierarchical structure of the file using a dotted syntax similar to the one used in SNMP, like eg. 2.0.9.3.<br>This parameter is mandatory. |
| to_id   | The id to move the favorite or level to. The id represents the hierarchical structure of the file using a dotted syntax similar to the one used in SNMP, like eg. 2.0.9.3.<br>This parameter is mandatory.   |

Example:

```text
Request: "favorites move from_id:1.2.3.4.5 to_id:5.4.3.2.1<LF>"
Response: "favorites move from_id:1.2.3.4.5 to_id:5.4.3.2.1<LF>"
```

---

### favorites playlist

`<playerid> favorites playlist <play\|load\|insert\|add> <taggedParameters>`

This command adds or plays a favorite. If item_id defines an item that can't be
played, but contains playable subitems, then these will be played instead. This
allows to eg. play all tracks of a genre.

**Accepted tagged parameters:**

| Tag     | Description                                                                                                                                                      |
| ------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| item_id | The id of an item to be played. The id represents the hierarchical structure of the file using a dotted syntax similar to the one used in SNMP, like eg. 2.0.9.3 |

Example:

```text
Request: "6e:ef:54:e9:02:b0 favorites playlist play item_id:1.1<LF>"
Response: "6e:ef:54:e9:02:b0 favorites playlist play item_id:1.1<LF>"
```

---

## Randomplay commands and queries

---

### randomplay

`<playerid> randomplay <tracks\|albums\|contributors\|year\|disable>`

The `randomplay` command starts a random mix of the given type. The `disable`
type would disable continuation of the currently playing mix. It would cause the
current playlist to play to the end and no new tracks be added.

Example:

```text
Request: "04:20:00:12:23:45 randomplay albums<LF>"
Response: "04:20:00:12:23:45 randomplay albums<LF>"
```

### randomplaygenrelist

`<playerid> randomplaygenrelist`

This returns a formatted list of genres which is for use on the Jive platform.

Example:

```text
Request: "04:20:00:12:23:45 randomplaygenrelist<LF>"
Response: "04:20:00:12:23:45 randomplaygenrelist count%3A103
offset%3A0 actions%3AHASH(0xb804350) checkbox%3A1 text%3A80s
actions%3AHASH(0xb8042a8) checkbox%3A1 text%3AAcid%20Jazz
actions%3AHASH(0xb80438c) checkbox%3A1 text%3AAcoustic
actions%3AHASH(0xb804494) checkbox%3A0 text%3AAdvertisement
actions%3AHASH(0xb8cdcc0) checkbox%3A1 text%3AAfropop
actions%3AHASH(0xb8cdf9c) checkbox%3A1 <LF>"
```

### randomplaychoosegenre

`<playerid> randomplaychoosegenre <0\|1>`

Turn a particular genre on/off in random mix.

Example:

```text
Request: "04:20:00:12:23:45 randomplaychoosegenre Afropop 1<LF>"
Response: "04:20:00:12:23:45 randomplaychoosegenre Afropop 1<LF>"
```

### randomplaygenreselectall

`<playerid> randomplaygenreselectall <0\|1>`

Turn all genres on/off in random mix.

Example:

```text
Request: "04:20:00:12:23:45 randomplaygenreselectall 1<LF>"
Response: "04:20:00:12:23:45 randomplaychoosegenre 1<LF>"
```

### randomplayisactive

`<playerid> randomplayisactive`

Get to know whether RandomPlay is active for a given player, and what kind of
mix it's playing.

Example:

```text
Request: "04:20:00:12:23:45 randomplayisactive"
Response: "04:20:00:12:23:45 randomplayisactive album"
```

## Source-code audit notes

### Audit scope and method

The public reference above was compared with the built-in dispatch registry in
`Slim/Control/Request.pm` and with bundled-plugin `addDispatch` calls. The core
registration table is identical between the examined LMS 9.1 and 9.2 commits.
Therefore no 9.2-only core command is presented as stable here.

The dispatch metadata has three useful flags: whether a player is required,
whether the request is a query, and whether tagged parameters are accepted. The
prose sections remain the authoritative usage guide; the runtime itself is the
authority for whether a command exists. Use `can <request terms> ?` when
feature-detecting against an unknown LMS installation.

### Registered compatibility aliases and low-level commands

The following built-in registrations exist in LMS 9.1/9.2 but are either
aliases, low-level UI operations, or not expanded into their own section in the
public reference. They are listed here so a source-code inventory does not
mistake them for missing commands.

| Registered form                                                      | Classification / preferred documented form                                                                                                                       |
| -------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `musicfolder <start> <count> ...`                                    | Backward-compatible alias; use `mediafolder`.                                                                                                                    |
| `songs ...`, `tracks ...`                                            | Aliases of the `titles` database query.                                                                                                                          |
| `playlist append <item> [title]`                                     | Alias handled by the playlist item command; use `playlist add` in portable integrations.                                                                         |
| `playlist jump ...`                                                  | Alias of `playlist index ...`.                                                                                                                                   |
| `playlist load <item> ...`                                           | Tagged playlist-item loader; `playlist play` is the commonly documented single-item operation.                                                                   |
| `playlist insertlist <item>`                                         | Low-level playlist insertion variant.                                                                                                                            |
| `playlist playalbum ...`, `playlist playtracks ...`                  | Low-level counterparts of the documented load/add/insert album and track operations.                                                                             |
| `playlist deletetracks ...`, `playlist inserttracks ...`             | Low-level track-list operations.                                                                                                                                 |
| `contextmenu <start> <count> ...`                                    | Player UI/Jive context-menu query; response depends on UI providers and plugins.                                                                                 |
| `player address <id-or-index> ?`                                     | Low-level player address query; `player ip` is the portable public query.                                                                                        |
| `rating <track-id-or-path> ?` / `rating <track-id-or-path> <0..100>` | Gets or sets the rating of a local audio track. The item can be a numeric track ID or a local path/URL; remote tracks are rejected. The query returns `_rating`. |
| `artwork <artwork-id>`                                               | Internal artwork response command used by server/UI plumbing.                                                                                                    |

### Full-text search capability query

The bundled FullTextSearch plugin registers `fulltextsearch ?`. It returns `1`
when the current database supports full-text search and `0` otherwise. Because
the registration belongs to the plugin, callers should still feature-detect it:

```text
Request:  "can fulltextsearch ?<LF>"
Response: "can fulltextsearch ? 1<LF>"

Request:  "fulltextsearch ?<LF>"
Response: "fulltextsearch 1<LF>"
```

### Bundled and third-party plugin commands

Bundled plugins register additional commands at runtime (for example Favorites,
RandomPlay, alarms, Jive menus, and service-specific XML-browser commands).
Third-party plugins can add further verbs. Availability therefore depends on the
enabled plugins and cannot be represented by one universal static list.
Feature-detect plugin commands with `can`, and query the LMS menu APIs when
building a generic browser.

### Commands used by ioBroker.squeezeboxrpc

The adapter relies mainly on the stable player and compound-query surface:
`serverstatus`, `status`, `players`, `favorites items`, playback controls,
`mixer volume`, synchronization, and playlist operations. Announcement queue
restoration uses `playlist play`, `playlist add`, `playlist index`, and `time`;
absolute volume changes use `mixer volume` and are confirmed with
`mixer volume ?`.

## Sources

- [LMS 9.1 source tree](https://github.com/LMS-Community/slimserver/tree/f9c3f51f7a6d264f7e2d2f733ea7ac8fda4c7ffd)
- [LMS 9.2 source tree](https://github.com/LMS-Community/slimserver/tree/ba7d20d4957245f4d35cd483c28494849a69ddc7)
- [Lyrion CLI documentation sources](https://github.com/LMS-Community/lms-community.github.io/tree/1cc3d41ba002700e26771dedf247a3447f436e0e/docs/reference/cli)
- [Previous single-file LMS CLI documentation](https://github.com/oweitman/LMS-CLI-Documentation)
