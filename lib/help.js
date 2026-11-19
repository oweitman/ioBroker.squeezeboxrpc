'use strict';

/*
 * The answer of the message "help": what the instance answers, written for AI agents (e.g. ioBroker.pi-agent or
 * the MCP server with send_to) and script authors. Keep it in sync with onMessage in squeezeboxrpc.js,
 * processMessages in lib/iosbserver.js and doStateChange in lib/iosbplayer.js.
 */

/** Every command the adapter answers; write = it can change something. */
const COMMANDS = [
    { command: 'help', write: false },
    { command: 'getPlayerNames', write: false },
    { command: 'cmdGeneral', write: true },
    { command: 'discoverlms', write: false },
];

const HELP = `ioBroker.squeezeboxrpc: connects ioBroker to a Lyrion (Logitech) Media Server (LMS) and its players
(Squeezebox, piCorePlayer, squeezelite, WiiM, Chromecast/AirPlay/UPnP through LMS plugins). An agent can tell what
plays where, query the music library and the favorites of LMS, and control a player (play, pause, stop, next,
volume, power, play a favorite or a URL, repeat, shuffle, announcements) by writing its states.
Players: squeezeboxrpc.0.Players.<player>; <player> = the name of the player in LMS with every run of characters
other than A-Z, a-z, 0-9 and _ replaced by one _ (e.g. "Living room" -> "Living_room"). getPlayerNames lists them.

Commands (sendTo squeezeboxrpc.0; the message must not be empty, send at least {}):
- getPlayerNames {}: the <player> names of all known players: ["Living_room", "Kitchen", ...].
- cmdGeneral {playerid, cmdArray}: sends one command of the LMS CLI and answers with the reply of LMS: {result:
  {...}, params, ok: true}; errors are texts: "error: cmdArray is not an array", "error: Problem with Server
  request". playerid: the MAC of a player (state Players.<player>.PlayerID) or "" for the server. cmdArray: the
  words of the command, e.g. ["playlists", "0", "999", "tags:us"] (all playlists), ["favorites", "items", "0",
  "999", "want_url:1", "item_id:"] (the favorites), ["mixer", "volume", "30"] with a playerid. Queries only read;
  other commands control the player or the server. All commands and their answers:
  https://github.com/oweitman/LMS-CLI-Documentation/blob/master/LMS-CLI.md
- discoverlms: the LMS servers found in the network, for the settings, not for agents.

States (squeezeboxrpc.0.*), write them with ack false:
- Players.<player>.* to control: state (0 pause, 1 play, 2 stop), Power (0 off, 1 on), Volume (0-100),
  PlaylistRepeat (0 off, 1 the song, 2 the playlist), PlaylistShuffle (0 off, 1 by song, 2 by album),
  PlaylistCurrentIndex (a text: the index in the playlist to jump to, or relative "+1" / "-2"), cmdGoTime (seconds
  to jump to, or relative "+30" / "-30"), cmdPlayFavorite (the id of a favorite, see Favorites), cmdPlayUrl (the URL
  of a stream or file, replaces the playlist), btnForward / btnRewind (true: next / previous track), btnPreset_1 to
  btnPreset_6 (true: the presets of the player), Announce (an HTTP(S) URL or an absolute path on the ioBroker host
  of an audio file, e.g. .mp3 or .wav: plays it at the announcement volume of the settings, then restores what
  played and the volume; a local file needs the web URL in the settings), cmdGeneral (an LMS command for this
  player as the JSON list items without brackets, e.g. "mixer","volume","30"; no answer, use the message instead).
- Players.<player>.* to read: Playername, PlayerID (MAC), Connected (0/1), IP, Mode (play, pause, stop), Title,
  Artist, Album, Albumartist, Trackartist, Band, Genre, RadioName, Remote (1 = a stream), Time (elapsed s),
  Duration (s), ArtworkUrl, Url, Type, Bitrate, Rate, SyncMaster and SyncSlaves (MACs), Playlist (JSON list of the
  tracks, if enabled in the settings), Alarms (JSON).
- Favorites.<fav>.*: Name, id (write it into cmdPlayFavorite), type, url, image, hasitems (> 0: a folder; its entries
  are Favorites.<fav>-<n>), isaudio. Only if "Request favorites" is enabled in the settings; Server.getFavorites
  (true) reloads them.
- Server.*: Name, Version, PlayerCount, SyncGroups (JSON), TotalSongs, TotalAlbums, TotalArtists, LastScan ...
- info.connection: true while LMS is reachable.

How to talk to the user:
- Which player: the one the user names (match the name of getPlayerNames or Players.<player>.Playername). If there
  are several and the user names none, ask; do not guess.
- Playing, pausing, Power, Volume, cmdPlayFavorite, cmdPlayUrl, Announce and cmdGeneral commands that are not
  queries change what the residents hear: only on the user's request. cmdPlayFavorite and cmdPlayUrl replace what
  plays now. Change the volume in small steps unless the user names a value.
- Name players by their names, favorites by Name and tracks by Title and Artist, not by IDs, MACs or URLs.`;

module.exports = { COMMANDS, HELP };
