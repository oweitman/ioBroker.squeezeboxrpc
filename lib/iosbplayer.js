'use strict';
const { ioUtil } = require('./ioUtil');

/**
 * Represents a Squeezebox player within a server environment.
 *
 * @param server - The server instance that manages the player.
 * @param playerdata - Initial data related to the player.
 *
 * Properties include:
 * - server: The server instance.
 * - adapter: Adapter for server communication.
 * - ioUtil: Utility for IO operations.
 * - fullStatus: String representing full status tags.
 * - smallStatus: String representing small status tags.
 * - statePath: Path to the player's state within the server.
 * - btnStatePath: Path to the player's button states.
 * - currentStates: Object holding the current states of the player.
 * - observers: List of observer functions for state changes.
 * - playername: Name of the player.
 * - playerid: Unique identifier for the player.
 * - playerindex: Index of the player.
 * - remote: Indicator for remote control capability.
 * - statuscounter: Counter for status updates.
 * - connected: Connection status of the player.
 * - log: Object for logging information.
 * - islogsilly: Flag for verbose logging.
 * - islogdebug: Flag for debug logging.
 * - TPE2Handling: Handling mode for TPE2 frames.
 * - FORBIDDEN_CHARS: Regular expression for forbidden characters in player names.
 * - sbPlayerStatusMain: Main status attributes of the player.
 * - sbPlayerStatusLoop: Loop status attributes of the player.
 * - sbPlayerButtons: Button commands available for the player.
 * - sbPlayerStatusPlaylist: Playlist status attributes of the player.
 *
 * Methods include:
 * - init: Initializes player settings and starts observation.
 * - sanitizePlayername: Sanitizes the player name.
 * - doObserverPlayer: Manages player status observation.
 * - getPlayerUpdateStatus: Updates player status.
 * - doAlarmsUpdateStatus: Updates alarm status.
 * - doPlayerUpdateStatus: Updates player data based on server responses.
 * - doPlayerStatus: Sets player status from initial data.
 * - checkPlayerdataStates: Ensures all player data states are initialized.
 * - doStateChange: Handles state changes based on updates.
 * - createArtworkUrl: Generates a URL for player artwork.
 * - disconnect: Handles player disconnection.
 * - connect: Handles player connection.
 * - createState: Creates a state object for the player.
 * - createObject: Creates a device or state object.
 * - request: Sends a request to the server.
 * - setTPE2Handling: Sets the TPE2 handling mode.
 * - setState: Updates the state of the player.
 * - createFolder: Creates a folder object.
 * - createDevice: Creates a device object.
 * - existsObjectAsync: Checks if an object exists asynchronously.
 * - convertState: Converts state values based on type.
 * - logsilly: Logs messages at a verbose level.
 * - logdebug: Logs debug messages.
 * - logerror: Logs error messages.
 * - loginfo: Logs informational messages.
 */
function ioSBPlayer(server, playerdata) {
    this.server = server;
    this.adapter = server.adapter;
    this.ioUtil = new ioUtil(
        server.adapter,
        this.adapter.config.outputplayerdebug,
        this.adapter.config.outputplayersilly,
    );
    this.fullStatus = 'tags:cgABbehldiqtyrSuoKLNJ';
    this.smallStatus = 'tags:uB';
    this.statePath = this.server.PlayersStatePath;
    this.btnStatePath = 'Buttons';
    this.currentStates = {};
    this.observers = [];
    this.playername = '';
    this.playerid = '';
    this.playerindex = 0;
    this.remote = 0;
    this.statuscounter = 0;
    this.connected = 0;

    this.log = {};

    this.islogsilly = this.adapter.config.outputplayersilly;
    this.islogdebug = this.adapter.config.outputplayerdebug;
    this.TPE2Handling = 1;

    this.FORBIDDEN_CHARS = /[^\d\w_]+/gm;
    //test the regex: https://regex101.com/r/Ed0WhH/1

    this.sbPlayerStatusMain = {
        player_name: {
            name: 'Playername',
            read: true,
            write: false,
            type: 'string',
            role: 'info.name',
            exist: false,
        },
        playerid: {
            name: 'PlayerID',
            read: true,
            write: false,
            type: 'string',
            role: 'info.name',
            exist: false,
        },
        player_connected: {
            name: 'Connected',
            read: true,
            write: false,
            type: 'number',
            role: 'value',
            exist: false,
        },
        player_ip: {
            name: 'IP',
            read: true,
            write: false,
            type: 'string',
            role: 'info.ip',
            exist: false,
        },
        power: {
            name: 'Power',
            read: true,
            write: true,
            type: 'number',
            role: 'switch',
            exist: false,
            min: 0,
            max: 1,
        },
        mode: {
            name: 'Mode',
            read: true,
            write: false,
            type: 'string',
            role: 'media.state',
            exist: false,
        },
        time: {
            name: 'Time',
            read: true,
            write: false,
            type: 'number',
            role: 'media.elapsed',
            exist: false,
        },
        rate: {
            name: 'Rate',
            read: true,
            write: false,
            type: 'number',
            role: 'value',
            exist: false,
        },
        sync_slaves: {
            name: 'SyncSlaves',
            read: true,
            write: false,
            type: 'string',
            role: 'value',
            exist: false,
        },
        sync_master: {
            name: 'SyncMaster',
            read: true,
            write: false,
            type: 'string',
            role: 'value',
            exist: false,
        },
        'mixer volume': {
            name: 'Volume',
            read: true,
            write: true,
            type: 'number',
            role: 'level.volume',
            exist: false,
            min: 0,
            max: 100,
        },
        'playlist repeat': {
            name: 'PlaylistRepeat',
            read: true,
            write: true,
            type: 'number',
            role: 'media.mode.repeat',
            exist: false,
        },
        'playlist shuffle': {
            name: 'PlaylistShuffle',
            read: true,
            write: true,
            type: 'number',
            role: 'media.mode.shuffle',
            exist: false,
        },
        remote: {
            name: 'Remote',
            read: true,
            write: false,
            type: 'number',
            role: 'value',
            exist: false,
        },
        playlist: {
            name: 'Playlist',
            read: true,
            write: false,
            type: 'string',
            role: 'value',
            exist: false,
        },
        playlist_cur_index: {
            name: 'PlaylistCurrentIndex',
            read: true,
            write: true,
            type: 'string',
            role: 'value',
            exist: false,
        },
        alarms: {
            name: 'Alarms',
            read: true,
            write: false,
            type: 'string',
            role: 'value',
            exist: false,
        },
        state: {
            name: 'state',
            read: true,
            write: true,
            type: 'number',
            role: 'media.state',
            exist: false,
            min: 0,
            max: 2,
        },
    };

    this.sbPlayerStatusLoop = {
        duration: {
            name: 'Duration',
            read: true,
            write: false,
            type: 'number',
            role: 'media.duration',
            exist: false,
        },
        artwork_url: {
            name: 'ArtworkUrl',
            read: true,
            write: false,
            type: 'string',
            role: 'media.cover',
            exist: false,
        },
        bitrate: {
            name: 'Bitrate',
            read: true,
            write: false,
            type: 'string',
            role: 'media.bitrate',
            exist: false,
        },
        album: {
            name: 'Album',
            read: true,
            write: false,
            type: 'string',
            role: 'media.album',
            exist: false,
        },
        coverid: {
            name: 'ArtworkUrl',
            read: true,
            write: false,
            type: 'string',
            role: 'value',
            exist: true,
        },
        genre: {
            name: 'Genre',
            read: true,
            write: false,
            type: 'string',
            role: 'media.genre',
            exist: false,
        },
        type: {
            name: 'Type',
            read: true,
            write: false,
            type: 'string',
            role: 'value',
            exist: false,
        },
        title: {
            name: 'Title',
            read: true,
            write: false,
            type: 'string',
            role: 'media.title',
            exist: false,
        },
        artist: {
            name: 'Artist',
            read: true,
            write: false,
            type: 'string',
            role: 'media.artist',
            exist: false,
        },
        albumartist: {
            name: 'Albumartist',
            read: true,
            write: false,
            type: 'string',
            role: 'media.artist',
            exist: false,
        },
        trackartist: {
            name: 'Trackartist',
            read: true,
            write: false,
            type: 'string',
            role: 'media.artist',
            exist: false,
        },
        band: {
            name: 'Band',
            read: true,
            write: false,
            type: 'string',
            role: 'media.artist',
            exist: false,
        },
        url: {
            name: 'Url',
            read: true,
            write: false,
            type: 'string',
            role: 'media.url',
            exist: false,
        },
        remote_title: {
            name: 'RadioName',
            read: true,
            write: false,
            type: 'string',
            role: 'value',
            exist: false,
        },
    };
    this.sbPlayerButtons = {
        cmdPlayFavorite: {
            name: 'cmdPlayFavorite',
            read: true,
            write: true,
            type: 'string',
            role: 'state',
            exist: false,
            def: ' ',
        },
        cmdPlayUrl: {
            name: 'cmdPlayUrl',
            read: true,
            write: true,
            type: 'string',
            role: 'state',
            exist: false,
            def: ' ',
        },
        cmdGeneral: {
            name: 'cmdGeneral',
            read: true,
            write: true,
            type: 'string',
            role: 'state',
            exist: false,
            def: ' ',
        },
        cmdGoTime: {
            name: 'cmdGoTime',
            read: true,
            write: true,
            type: 'string',
            role: 'state',
            exist: false,
            def: ' ',
        },
        forward: {
            name: 'btnForward',
            read: true,
            write: true,
            type: 'boolean',
            role: 'button.forward',
            exist: false,
            def: false,
        },
        preset_1: {
            name: 'btnPreset_1',
            read: true,
            write: true,
            type: 'boolean',
            role: 'button',
            exist: false,
            def: false,
        },
        preset_2: {
            name: 'btnPreset_2',
            read: true,
            write: true,
            type: 'boolean',
            role: 'button',
            exist: false,
            def: false,
        },
        preset_3: {
            name: 'btnPreset_3',
            read: true,
            write: true,
            type: 'boolean',
            role: 'button',
            exist: false,
            def: false,
        },
        preset_4: {
            name: 'btnPreset_4',
            read: true,
            write: true,
            type: 'boolean',
            role: 'button',
            exist: false,
            def: false,
        },
        preset_5: {
            name: 'btnPreset_5',
            read: true,
            write: true,
            type: 'boolean',
            role: 'button',
            exist: false,
            def: false,
        },
        preset_6: {
            name: 'btnPreset_6',
            read: true,
            write: true,
            type: 'boolean',
            role: 'button',
            exist: false,
            def: false,
        },
        rewind: {
            name: 'btnRewind',
            read: true,
            write: true,
            type: 'boolean',
            role: 'button.reverse',
            exist: false,
            def: false,
        },
    };
    this.sbPlayerStatusPlaylist = {
        'playlist index': {
            name: 'index',
            read: true,
            write: false,
            type: 'number',
            role: 'value',
            exist: false,
        },
        id: {
            name: 'id',
            read: true,
            write: false,
            type: 'number',
            role: 'value',
            exist: false,
        },
        url: {
            name: 'url',
            read: true,
            write: false,
            type: 'string',
            role: 'value',
            exist: false,
        },
        title: {
            name: 'title',
            read: true,
            write: false,
            type: 'string',
            role: 'value',
            exist: false,
        },
        artwork_url: {
            name: 'ArtworkUrl',
            read: true,
            write: false,
            type: 'string',
            role: 'media.cover',
            exist: false,
        },
        coverid: {
            name: 'ArtworkUrl',
            read: true,
            write: false,
            type: 'string',
            role: 'value',
            exist: true,
        },
        type: {
            name: 'Type',
            read: true,
            write: false,
            type: 'string',
            role: 'value',
            exist: false,
        },
        bitrate: {
            name: 'Bitrate',
            read: true,
            write: false,
            type: 'string',
            role: 'media.bitrate',
            exist: false,
        },
        duration: {
            name: 'Duration',
            read: true,
            write: false,
            type: 'number',
            role: 'media.duration',
            exist: false,
        },
        artist: {
            name: 'Artist',
            read: true,
            write: false,
            type: 'string',
            role: 'media.artist',
            exist: false,
        },
        album: {
            name: 'Album',
            read: true,
            write: false,
            type: 'string',
            role: 'media.album',
            exist: false,
        },
        remote_title: {
            name: 'RadioName',
            read: true,
            write: false,
            type: 'string',
            role: 'value',
            exist: false,
        },
    };
    /**
     * Initializes the player with the provided player data.
     *
     * @param playerdata - Initial data related to the player.
     * @async
     * @returns - A promise that resolves after initializing the player settings and starting observation.
     *
     * This function performs the following tasks:
     * - Sets the initial player status using the provided player data.
     * - Logs the discovery of a new player using its name and ID.
     * - Creates a folder and device object for the player in the server's state path.
     * - Starts observing player status updates with a delay based on the player's index.
     */
    this.init = async function (playerdata) {
        this.doPlayerStatus(playerdata);
        this.ioUtil.logdebug(`New Player found: ${this.playername} with id ${this.playerid}`);
        await this.createFolder(this.statePath);
        await this.createDevice(this.playername, this.statePath);
        const delay = this.playerindex || 0;
        setTimeout(this.doObserverPlayer.bind(this), delay * 190);
    };
    this.sanitizePlayername = playername => playername.replace(this.FORBIDDEN_CHARS, '_');
    /**
     * Starts observing player status updates.
     *
     * Logs the start of observing player updates, calls the function to request the player status,
     * and schedules the next call to itself with a delay based on the configured player refresh interval.
     */
    this.doObserverPlayer = function () {
        this.ioUtil.logsilly('doObserverPlayer');
        this.getPlayerUpdateStatus();
        this.observers['player'] = setTimeout(this.doObserverPlayer.bind(this), this.adapter.config.playerrefresh);
    };
    /**
     * Requests the player status, choosing between full and small status updates
     * in an alternating pattern.
     *
     * @description
     * Requests the player status using the "status" command, with a counter
     * cycling between 0 and 9. When the counter is 0, the full player status
     * is requested using the fullStatus parameter. Otherwise, the last player
     * status is requested using the smallStatus parameter. The
     * doPlayerUpdateStatus function is called with the result.
     * Additionally, the alarms are requested using the "alarms" command with
     * the filter "all". The doAlarmsUpdateStatus function is called with the
     * result.
     */
    this.getPlayerUpdateStatus = () => {
        this.ioUtil.logsilly('getPlayerUpdate');
        if (this.statuscounter == 0) {
            this.request(this.playerid, ['status', '0', '999', this.fullStatus], this.doPlayerUpdateStatus.bind(this));
            this.request(this.playerid, ['alarms', '0', '999', 'filter:all'], this.doAlarmsUpdateStatus.bind(this));
        } else {
            this.request(this.playerid, ['status', '-', '1', this.smallStatus], this.doPlayerUpdateStatus.bind(this));
        }
        this.statuscounter += 1;
        if (this.statuscounter > 9) {
            this.statuscounter = 0;
        }
    };
    /**
     * Updates the alarm status for the player.
     *
     * @description
     * This function is responsible for updating the alarm status of the player
     * by logging the operation, serializing the result of the alarms request
     * into a JSON string, and setting the state of the alarms in the player's
     * status using the converted state value. It utilizes the player's main
     * status attributes and the corresponding state path.
     * @param result - The result object from the alarms request,
     * containing the alarm data to be processed and updated.
     */
    this.doAlarmsUpdateStatus = function (result) {
        this.ioUtil.logsilly('doAlarmsUpdateStatus');
        const alarmdata = JSON.stringify(result.result);
        this.setState(
            this.sbPlayerStatusMain['alarms'].name,
            this.convertState(this.sbPlayerStatusMain['alarms'], alarmdata),
            this.statePath,
            this.playername,
        );
    };

    this.doPlayerUpdateStatus = result => {
        this.ioUtil.logsilly('doPlayerUpdateStatus');
        const fullStatus = result.params[1][3] == this.fullStatus;
        let playerdata = result.result;

        for (const key in this.sbPlayerStatusMain) {
            let value = '';
            if (key == 'state') {
                continue;
            }
            if (key == 'playlist') {
                continue;
            }
            if (key == 'playerid') {
                continue;
            }
            if (key == 'alarms') {
                continue;
            }
            if (Object.prototype.hasOwnProperty.call(playerdata, key)) {
                value = playerdata[key];
                if (key == 'name') {
                    this.playername = this.sanitizePlayername(value);
                }
                if (key == 'playerindex') {
                    this.playerindex = parseInt(value);
                }
                if (key == 'remote') {
                    this.remote = parseInt(value);
                }
                if (key == 'mode') {
                    if (value == 'play') {
                        this.setState('state', 1, this.statePath, this.playername);
                    }
                    if (value == 'pause') {
                        this.setState('state', 0, this.statePath, this.playername);
                    }
                    if (value == 'stop') {
                        this.setState('state', 2, this.statePath, this.playername);
                    }
                }
            } else {
                //if (key == "remote") value = 0;
                if (key == 'remote') {
                    this.remote = 0;
                }
            }
            this.setState(
                this.sbPlayerStatusMain[key].name,
                this.convertState(this.sbPlayerStatusMain[key], value),
                this.statePath,
                this.playername,
            );
        }
        this.setState(
            this.sbPlayerStatusMain['playerid'].name,
            this.convertState(this.sbPlayerStatusMain['playerid'], this.playerid),
            this.statePath,
            this.playername,
        );
        if (!result.result.playlist_loop) {
            return;
        }
        //todo
        playerdata = result.result.playlist_loop.find(
            function (result, el) {
                return el['playlist index'] == result.playlist_cur_index;
            }.bind(this, result.result),
        );
        if (playerdata) {
            for (const key in this.sbPlayerStatusLoop) {
                let value = '';
                if (Object.prototype.hasOwnProperty.call(playerdata, key)) {
                    value = playerdata[key];
                    if (key == 'coverid') {
                        if (value[0] != '-') {
                            value = this.createArtworkUrl(value);
                        } else {
                            continue;
                        }
                    }
                    if (key == 'artwork_url' && playerdata['coverid'] && playerdata['coverid'][0] != '-') {
                        continue;
                    }
                    if (key == 'artwork_url') {
                        const regex = /imageproxy\/(.*)\/[^/]/gm;
                        const m = regex.exec(value);
                        if (m && m.index > 0) {
                            value = decodeURIComponent(m[1]);
                        } else if (value === 'html/images/radio.png') {
                            value = `http://${this.adapter.config.server}:${
                                this.adapter.config.port
                            }/html/images/radio.png`;
                        } else if (value === 'html/images/cover.png') {
                            value = `http://${this.adapter.config.server}:${
                                this.adapter.config.port
                            }/html/images/cover.png`;
                        } else if (value === 'html/images/favorites.png') {
                            value = `http://${this.adapter.config.server}:${
                                this.adapter.config.port
                            }/html/images/favorites.png`;
                        }
                    }
                    this.setState(
                        this.sbPlayerStatusLoop[key].name,
                        this.convertState(this.sbPlayerStatusLoop[key], value),
                        this.statePath,
                        this.playername,
                    );
                } else {
                    if (key == 'remote_title' && this.remote == 0) {
                        value = '';
                    }
                    if (fullStatus) {
                        this.setState(
                            this.sbPlayerStatusLoop[key].name,
                            this.convertState(this.sbPlayerStatusLoop[key], value),
                            this.statePath,
                            this.playername,
                        );
                    }
                }
            }
            if (
                playerdata['trackartist'] !== undefined &&
                playerdata['trackartist'] !== null &&
                playerdata['trackartist'] !== '' &&
                (playerdata['artist'] === undefined || playerdata['artist'] === null || playerdata['artist'] === '')
            ) {
                this.setState(
                    this.sbPlayerStatusLoop['artist'].name,
                    this.convertState(this.sbPlayerStatusLoop['artist'], playerdata['trackartist']),
                    this.statePath,
                    this.playername,
                );
            }
        }
        if (fullStatus) {
            const playlist = result.result.playlist_loop;
            const pla = [];
            for (const playlistkey in playlist) {
                const playlistitem = playlist[playlistkey];
                const pli = {};
                for (const key in this.sbPlayerStatusPlaylist) {
                    if (Object.prototype.hasOwnProperty.call(playlistitem, key)) {
                        let value = playlistitem[key];
                        if (key == 'coverid') {
                            if (value[0] != '-') {
                                value = this.createArtworkUrl(value);
                            } else {
                                continue;
                            }
                        }
                        if (key == 'artwork_url' && playlistitem['coverid'] && playlistitem['coverid'][0] != '-') {
                            continue;
                        }
                        if (key == 'artwork_url') {
                            const regex = /imageproxy\/(.*)\/[^/]/gm;
                            const m = regex.exec(value);
                            if (m && m.index > 0) {
                                value = decodeURIComponent(m[1]);
                            }
                        }
                        pli[this.sbPlayerStatusPlaylist[key].name] = value;
                    }
                }
                pla.push(pli);
            }
            if (this.adapter.config.useplaylist) {
                this.setState(
                    this.sbPlayerStatusMain['playlist'].name,
                    this.convertState(this.sbPlayerStatusMain['playlist'], JSON.stringify(pla)),
                    this.statePath,
                    this.playername,
                );
            } else {
                this.setState(
                    this.sbPlayerStatusMain['playlist'].name,
                    this.convertState(this.sbPlayerStatusMain['playlist'], ''),
                    this.statePath,
                    this.playername,
                );
            }
        }
        return;
    };
    this.doPlayerStatus = playerdata => {
        this.ioUtil.logsilly('doPlayerStatus');
        if (playerdata.playerid) {
            this.playerid = playerdata.playerid;
        }
        if (playerdata.name) {
            this.playername = this.sanitizePlayername(playerdata.name);
        }
        if (playerdata.playerindex) {
            this.playerindex = playerdata.playerindex;
        }
        if (playerdata.connected) {
            this.connected = playerdata.connected;
        }
        this.checkPlayerdataStates(playerdata);
    };
    this.checkPlayerdataStates = playerdata => {
        this.ioUtil.logsilly('checkPlayerdataStates');
        if (!playerdata) {
            return;
        }
        if (playerdata.name) {
            this.playername = this.sanitizePlayername(playerdata.name);
        }
        for (const key in this.sbPlayerStatusMain) {
            const stateTemplate = this.sbPlayerStatusMain[key];
            if (key == 'playlist' && !this.adapter.config.useplaylist) {
                continue;
            }
            if (!stateTemplate.exist) {
                this.sbPlayerStatusMain[key] = this.createObject(stateTemplate, this.statePath, this.playername);
            }
        }
        for (const key in this.sbPlayerStatusLoop) {
            //if (key == "albumartist") key = "artist";
            const stateTemplate = this.sbPlayerStatusLoop[key];
            if (!stateTemplate.exist) {
                this.sbPlayerStatusLoop[key] = this.createObject(stateTemplate, this.statePath, this.playername);
            }
        }
        for (const key in this.sbPlayerButtons) {
            const stateTemplate = this.sbPlayerButtons[key];
            if (!stateTemplate.exist) {
                stateTemplate.create = true;
                this.sbPlayerButtons[key] = this.createObject(stateTemplate, this.statePath, this.playername);
            }
        }
    };
    /*************  ✨ Codeium Command ⭐  *************/
    /**
     * Handles state changes for player.
     *
     * @param idParts - The state identifier split into parts.
     * @param state - The new state object; can be null if the state was deleted.
     *
     * The function logs the state change, shifts the idParts array and invokes the
     * appropriate state change handler based on the first part of the id.
     * It returns early if id, state, or state.ack is falsy.
     *
     * Supported state changes:
     * - Volume: Sets the volume of the player.
     * - Power: Sets the power state of the player.
     * - state: Sets the state of the player (0 = off, 1 = play, 2 = stop)
     * - PlaylistRepeat: Sets the repeat state of the playlist (0 = off, 1 = repeat all, 2 = repeat one)
     * - PlaylistShuffle: Sets the shuffle state of the playlist (0 = off, 1 = shuffle, 2 = shuffle all)
     * - cmdGoTime: Sets the current time of the player in seconds.
     * - PlaylistCurrentIndex: Sets the current index of the playlist.
     * - cmdPlayFavorite: Plays a favorite with the given item_id.
     * - cmdPlayUrl: Plays a URL.
     * - cmdGeneral: Executes a general command (e.g. a button press).
     * - btnForward: Jump forward.
     * - btnRewind: Jump backward.
     * - btnPreset_X: Executes the preset X (e.g. preset_1.single).
     */
    /******  4364f116-3e7c-49b0-821a-4798e59f5e85  *******/
    this.doStateChange = function (idParts, state) {
        this.ioUtil.logsilly('doPlayerStateChange');
        idParts.shift();
        if (idParts[0] == 'Volume') {
            if (state.val != null) {
                this.request(this.playerid, ['mixer', 'volume', Math.round(state.val)]);
                this.setState(idParts[0], Math.round(state.val), this.statePath, this.playername, false);
            }
        }
        if (idParts[0] == 'Power') {
            if (state.val == 0) {
                this.request(this.playerid, ['power', 0]);
            }
            if (state.val == 1) {
                this.request(this.playerid, ['power', 1]);
            }
        }
        if (idParts[0] == 'state') {
            if (state.val == 0) {
                this.request(this.playerid, ['pause', '1']);
            }
            if (state.val == 1) {
                this.request(this.playerid, ['play', '2']);
            }
            if (state.val == 2) {
                this.request(this.playerid, ['stop']);
            }
        }
        if (idParts[0] == 'PlaylistRepeat') {
            if (state.val == 0) {
                this.request(this.playerid, ['playlist', 'repeat', '0']);
            }
            if (state.val == 1) {
                this.request(this.playerid, ['playlist', 'repeat', '1']);
            }
            if (state.val == 2) {
                this.request(this.playerid, ['playlist', 'repeat', '2']);
            }
        }
        if (idParts[0] == 'PlaylistShuffle') {
            if (state.val == 0) {
                this.request(this.playerid, ['playlist', 'shuffle', '0']);
            }
            if (state.val == 1) {
                this.request(this.playerid, ['playlist', 'shuffle', '1']);
            }
            if (state.val == 2) {
                this.request(this.playerid, ['playlist', 'shuffle', '2']);
            }
        }
        if (idParts[0] == 'cmdGoTime') {
            // state.val needs to be a string, although the time is set in seconds
            // when settings cmdGoTime via ioBroker.simple-api its not possible to submit a number as string
            // if we receive a number, we need to cast this to a string
            if (typeof state.val === 'number') {
                state.val = state.val.toString();
            }
            if (state.val.trim() !== '' && !isNaN(state.val.trim())) {
                this.request(this.playerid, ['time', state.val.trim()]);
                this.setState(idParts[0], ' ', this.statePath, this.playername, false);
            }
        }
        if (idParts[0] == 'PlaylistCurrentIndex') {
            if (state.val.trim() !== '' && !isNaN(state.val.trim())) {
                this.request(this.playerid, ['playlist', 'index', state.val.trim()]);
            }
        }
        if (idParts[0] == 'cmdPlayFavorite') {
            if (state.val !== ' ') {
                this.request(this.playerid, ['favorites', 'playlist', 'play', `item_id:${state.val}`]);
                this.setState(idParts[0], ' ', this.statePath, this.playername, false);
            }
        }
        if (idParts[0] == 'cmdPlayUrl') {
            if (state.val !== ' ') {
                this.request(this.playerid, ['playlist', 'play', state.val]);
                this.setState(idParts[0], ' ', this.statePath, this.playername, false);
            }
        }
        if (idParts[0] == 'cmdGeneral') {
            if (state.val !== ' ') {
                try {
                    const cmd = JSON.parse(`[${state.val}]`);
                    this.request(this.playerid, cmd);
                } catch {
                    this.ioUtil.logerror(`cmdGeneral, Parameter error: ${state.val}`);
                }
                this.setState(idParts[0], ' ', this.statePath, this.playername, false);
            }
        }
        if (idParts[0] == 'btnForward') {
            if (state.val) {
                this.request(this.playerid, ['button', 'jump_fwd']);
                this.setState(idParts[0], false, this.statePath, this.playername, false);
            }
        }
        if (idParts[0] == 'btnRewind') {
            if (state.val) {
                this.request(this.playerid, ['button', 'jump_rew']);
                this.setState(idParts[0], false, this.statePath, this.playername, false);
            }
        }
        if (idParts[0].startsWith('btnPreset_')) {
            const name = `preset_${idParts[0].split('_')[1]}.single`;
            if (state.val) {
                this.request(this.playerid, ['button', name]);
                this.setState(idParts[0], false, this.statePath, this.playername, false);
            }
        }
    };
    /**
     * Returns a URL for a given artworkid.
     *
     * @param artworkid The artworkid
     * @returns The URL for the artwork
     */
    this.createArtworkUrl = function (artworkid) {
        return `http://${this.adapter.config.server}:${this.adapter.config.port}/music/${artworkid}/cover.jpg`;
    };
    this.disconnect = () => {
        /**
         * Disconnects the player from the server.
         *
         * Logs the disconnection event, removes the player observer and clears the
         * power state, and sets the connected flag to 0.
         */
        this.ioUtil.logdebug(`Player ${this.playername} disconnected with id ${this.playerid}`);
        clearInterval(this.observers['player']);
        this.setState('Power', 0, this.statePath, this.playername, false);
        delete this.observers['player'];
        this.connected = 0;
    };
    /**
     * Connects the player to the server.
     *
     * Logs the connection event, starts the player observer and sets the
     * connected flag to 1.
     */
    this.connect = () => {
        this.ioUtil.logdebug(`Player ${this.playername} connected with id ${this.playerid}`);
        this.doObserverPlayer();
        this.connected = 1;
    };
    /**
     * Creates a state object for the player if it does not already exist.
     *
     * @param stateTemplate - The template containing the common properties of the state.
     * @param [level1path] - The first level path to prepend to the state name, can be false or empty.
     * @param [level2path] - The second level path to prepend to the state name, can be false or empty.
     * @returns The state template with an 'exist' property set to true.
     */
    this.createState = function (stateTemplate, level1path = false, level2path = false) {
        const name = (level1path ? `${level1path}.` : '') + (level2path ? `${level2path}.` : '') + stateTemplate.name;
        this.ioUtil.logsilly(`Create state ${name}`);
        if (!this.currentStates[name]) {
            this.adapter.createState(level1path, level2path, stateTemplate.name, stateTemplate);
        }
        stateTemplate.exist = true;
        return stateTemplate;
    };
    /**
     * Creates a state object in the ioBroker system if it does not already exist.
     *
     * @param stateTemplate - The template containing the common properties of the state.
     * @param level1path - The first level path to prepend to the state name, can be null or empty.
     * @param level2path - The second level path to prepend to the state name, can be null or empty.
     * @param [callback] - Optional callback function, called when the object is created.
     * @returns The state template with an 'exist' property set to true.
     */
    this.createObject = function (stateTemplate, level1path, level2path, callback) {
        this.ioUtil.logdebug(`createObject ${stateTemplate.name}`);
        const name = (level1path ? `${level1path}.` : '') + (level2path ? `${level2path}.` : '') + stateTemplate.name;
        this.adapter.getObject(name, (err, obj) => {
            const newobj = {
                type: 'state',
                common: stateTemplate,
                native: {},
            };
            if (!obj) {
                callback ? this.adapter.setObject(name, newobj, callback) : this.adapter.setObject(name, newobj);
            } else {
                if (callback) {
                    callback();
                }
            }
        });
        stateTemplate.exist = true;
        return stateTemplate;
    };
    /**
     * Makes a request to the Logitech Media Server.
     *
     * @param playerid - The player ID to request from, or an empty string for the server.
     * @param params - The parameters to pass to the request.
     * @param [callback] - The function to call with the result of the request.
     *
     * If the request is successful, calls the callback function with the result.
     * If the request fails, logs an error and does not call the callback function.
     */
    this.request = function (playerid, params, callback) {
        if (this.connected) {
            this.server.request(playerid, params, callback);
        }
    };
    /**
     * Sets the TPE2 handling value for the player.
     *
     * @param value - The value to set for TPE2 handling.
     *
     * This function updates the TPE2Handling property of the player to
     * the provided value, which determines how the TPE2 tag is used
     * in handling album artist metadata.
     */
    this.setTPE2Handling = function (value) {
        this.TPE2Handling = value;
    };
    this.setState = function (name, value, level1path, level2path, check = true) {
        name = (level1path ? `${level1path}.` : '') + (level2path ? `${level2path}.` : '') + name;
        if (this.currentStates[name] !== value && check) {
            this.currentStates[name] = value;
            if (!name.includes('Time')) {
                this.ioUtil.logsilly(`setState name: ${name} value: ${value}`);
            }
            this.adapter.setState(name, value, true);
        }
        if (!check) {
            this.currentStates[name] = value;
            this.ioUtil.logsilly(`setState name: ${name} value: ${value}`);
            this.adapter.setState(name, value, true);
        }
    };
    this.createFolder = async function (foldername, level1path, level2path) {
        const id = (level1path ? `${level1path}.` : '') + (level2path ? `${level2path}.` : '') + foldername;
        this.ioUtil.logsilly(`createFolder ${id}`);
        if (await this.existsObjectAsync(id)) {
            this.ioUtil.logsilly(`Folder exists: ${id}`);
        } else {
            const obj = {
                type: 'folder',
                common: {
                    name: foldername,
                },
                native: {},
            };
            this.adapter.setObject(id, obj);
        }
    };
    this.createDevice = async function (devicename, level1path, level2path) {
        const id = (level1path ? `${level1path}.` : '') + (level2path ? `${level2path}.` : '') + devicename;
        this.ioUtil.logsilly(`createDevice ${id}`);
        if (await this.existsObjectAsync(id)) {
            this.ioUtil.logsilly(`Device exists: ${id}`);
        } else {
            const obj = {
                type: 'device',
                common: {
                    name: devicename,
                },
                native: {},
            };
            this.adapter.setObject(id, obj);
        }
    };
    this.existsObjectAsync = function (id) {
        return new Promise((resolve, reject) => {
            id = `${this.adapter.namespace}.${id}`;

            this.adapter.getForeignObject(id, (err, obj) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(!!obj);
                }
            });
        });
    };
    this.convertState = function (stateTemplate, value) {
        if (stateTemplate.type == 'string') {
            return String(value);
        }
        if (stateTemplate.type == 'number') {
            return Number(value);
        }
        this.ioUtil.logdebug(`Missing conversion function for type ${stateTemplate.type} Please report.`);
        return value;
    };
    this.logsilly = s => {
        if (this.islogsilly) {
            this.adapter.log.silly(s);
        }
    };
    this.logdebug = s => {
        if (this.islogdebug) {
            this.adapter.log.debug(s);
        }
    };
    this.logerror = function (s) {
        this.adapter.log.error(s);
    };
    this.loginfo = s => {
        this.adapter.log.info(s);
    };

    this.init(playerdata);
}
module.exports = ioSBPlayer;
