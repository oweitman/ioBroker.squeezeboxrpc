<h1>
    <img src="admin/squeezeboxrpc.png" width="64"/>
    ioBroker.squeezeboxrpc
</h1>


## squeezeboxrpc adapter for ioBroker

SqueezeboxRPC

This is an alternate Adapter that uses the RPC-Protokoll to get data and send commands to the Logitech Media Server.

- Install the package
- Create an instance
- Configure the Instance with the IP of the logitech media server and the port (normaly 9000)

## Provided states

### Server 

| state             | Description                    | 
| ----------------- |--------------------------------| 
| LastScan          | timestamp of last scan         |
| PlayerCount       | Number of known players        |
| PlayerCountOther  | Number of known other Players  |
| PlayerCountSN     | Number of known SN Players     |
| TotalAlbums       | Number of all known Albums     |
| TotalArtists      | Number of all known Artists    |
| TotalDuration     | Sum of playtime all songs      |
| TotalGenres       | Number of all known Genres     |
| TotalSongs        | Number of all known songs      |
| Version           | Version of LMS                 |
| mac               | MAC-ID of the server           |
| uuid              | uuid of the LMS-instance       |

additional a defined button to refresh the favorites 
(at the moment the favorites only refreshs at startup of the adapter or every 12h)    

### Favorites

for each favorite
| state             | Description                    | 
| ----------------- |--------------------------------| 
| Name              | Name of the favorite           |
| hasitems          | indicates if this is a dir     |
| id                | id of the favorite             |
| isaudio           | isaudio                        |
| type              | Example types: link, text, audio, playlist     |
| url               | url of the track               |

at the moment only one level of favorites is available as a state

### Players

for each player
| state             | Description                                           | 
| ----------------- |-------------------------------------------------------| 
| Album             | Name of the current album                             |
| Artist            | Name of Artist                                        |
| ArtworkUrl        | url to the Artwork                                    |
| Bitrate           | Bitrate of the track                                  |
| Connected         | connectionstate of player (0/1)                       |
| Duration          | Duration of the track                                 |
| Genre             | genre of the track                                    |
| IP                | IP of the player                                      |
| Mode              | play / pause / stop                                   |
| Playername        | Name of the Player                                    |
| PlaylistRepeat    | Repeat song(1)/playlist(2)/dont repeat(0)             |
| PlaylistShuffle   | shuffle playlist(1)/shuffle album(2)/dont shuffle(0)  |
| Power             | get/set Powerstate of player off(0)/on(1)             |
| RadioName         | Name of Radiostation                                  |
| Rate              | Rating of the song                                    |
| Remote            | If remote stream (1)                                  |
| SyncMaster        | ID/MAC of Syncmaster                                  |
| SyncSlaves        | ID/Mac of Players in Syncgroup                        |
| Time              | elapsed song time                                     |
| Title             | song title                                            |
| Type              | type of media (eg MP3 Radio)                          |
| Url               | Url of track / stream                                 |
| Volume            | get/set Volume of the player (0-100)                  |
| state             | get/set play state: pause(0),play(1),stop(2)          |

additional a defined buttons 
| button            | Description                                   | 
| ----------------- |-----------------------------------------------| 
| btnForward        | Next song                                     |
| btnRewind         | Previous song                                 |
| btnPreset_*       | 1-6 buttons to define in player or server     |
 

For more information visit the CLI-documentation:
https://github.com/elParaguayo/LMS-CLI-Documentation/blob/master/LMS-CLI.md

## Todo

* more testing/fixing
* add artwork (station-logo/playlist-cover) for favorites
* implement more levels (subdirectories) of favorites

## Changelog

### 0.0.1
* (oweitman) initial release

## License
MIT License

Copyright (c) 2019 oweitman

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.