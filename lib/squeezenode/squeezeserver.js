/*
 The MIT License (MIT)

 Copyright (c) 2013 Piotr Raczynski, pio[dot]raczynski[at]gmail[dot]com

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
 */

const inherits = require('super');
const fs = require('fs');
const SqueezeRequest = require(`${__dirname}/squeezerequest`);
const SqueezePlayer = require(`${__dirname}/squeezeplayer`);

/**
 * Create a SqueezeServer object
 *
 * @param address The URL of the server
 * @param port The port that the server listens on
 * @param username The username for authentication
 * @param password The password for authentication
 * @param sa A flag to skip apps
 * @param sp A flag to skip players
 */
function SqueezeServer(address, port, username, password, sa, sp) {
    SqueezeServer.super_.apply(this, arguments);
    const defaultPlayer = '00:00:00:00:00:00';
    this.players = [];
    this.apps = [];
    const subs = {};

    /**
     * Subscribe to an event on a channel
     *
     * @param channel The channel that received the event
     * @param sub The callback for the event
     */

    this.on = function (channel, sub) {
        subs[channel] = subs[channel] || [];
        subs[channel].push(sub);
    };

    /**
     * Send an event.
     *
     * @param channel The even channel
     */

    this.emit = function (channel) {
        const args = [].slice.call(arguments, 1);
        for (const sub in subs[channel]) {
            subs[channel][sub].apply(void 0, args);
        }
    };

    /**
     * Method to the the number of players.
     *
     * @param callback The function to call with the result.
     */

    this.getPlayerCount = function (callback) {
        this.request(defaultPlayer, ['player', 'count', '?'], callback);
    };

    /**
     * Method to get the ID of a player given it's index
     *
     * @param index The index of the player to get the ID for
     * @param callback The function to call with the result.
     */

    this.getPlayerId = function (index, callback) {
        this.request(defaultPlayer, ['player', 'id', index, '?'], callback);
    };

    /**
     * Method to get the IP address of a player
     *
     * @param playerId The ID or index of the player
     * @param callback The function to call with the result.
     */

    this.getPlayerIp = function (playerId, callback) {
        this.request(defaultPlayer, ['player', 'ip', playerId, '?'], callback);
    };

    /**
     * Method to get the name of a player.
     *
     * @param playerId The ID or index of the player
     * @param callback The function to call with the result.
     */

    this.getPlayerName = function (playerId, callback) {
        this.request(defaultPlayer, ['player', 'name', playerId, '?'], callback);
    };

    /**
     * Get a list of the synchronization group members
     *
     * @param callback The function to call with the result.
     */

    this.getSyncGroups = function (callback) {
        this.request(defaultPlayer, ['syncgroups', '?'], callback);
    };

    /**
     * Get a list of the apps installed in the server
     *
     * @param callback The function to call with the result.
     */

    this.getApps = function (callback) {
        this.request(defaultPlayer, ['apps', 0, 100], callback);
    };

    //

    /**
     * Get the content of a music folder.
     *
     * @param folderId The ID of the folder to get. Pass 0 or empty string "" to display root of music folder
     * @param callback The function to call with the result.
     */

    this.musicfolder = function (folderId, callback) {
        this.request(defaultPlayer, ['musicfolder', 0, 100, `folder_id:${folderId}`], callback);
    };

    /**
     * Get a information about the players.
     *
     * @param callback The function to call with the result.
     */

    this.getPlayers = callback => {
        this.request(defaultPlayer, ['players', 0, 100], function (reply) {
            if (reply.ok) {
                reply.result = reply.result.players_loop;
            }
            callback(reply);
        });
    };

    /**
     * Get a list of the artists from the server
     *
     * @param callback The callback to call with the result
     * @param limit The maximum number of results
     */

    this.getArtists = (callback, limit) => {
        this.request(defaultPlayer, ['artists', 0, limit], function (reply) {
            if (reply.ok) {
                reply.result = reply.result.artists_loop;
            }
            callback(reply);
        });
    };

    /**
     * Get a list of the albums from the server
     *
     * @param callback The callback to call with the result
     * @param limit The maximum number of results
     */

    this.getAlbums = (callback, limit) => {
        this.request(defaultPlayer, ['albums', 0, limit], function (reply) {
            if (reply.ok) {
                reply.result = reply.result.albums_loop;
            }
            callback(reply);
        });
    };

    /**
     * Get a list of the genre's from the server
     *
     * @param callback The callback to call with the result
     * @param limit The maximum number of results
     */

    this.getGenres = (callback, limit) => {
        this.request(defaultPlayer, ['genres', 0, limit], function (reply) {
            if (reply.ok) {
                reply.result = reply.result.genres_loop;
            }
            callback(reply);
        });
    };

    /**
     * Get a 'info' list from the server
     *
     * @param callback The callback to call with the result
     * @param limit The maximum number of results
     * @param slot The query to make to the server [genres, albums, artists, playlists ]
     */

    this.getInfo = (callback, limit, slot) => {
        this.request(defaultPlayer, [slot, 0, limit], function (reply) {
            if (reply.ok) {
                reply.result = reply.result[`${slot}_loop`];
            }
            callback(reply);
        });
    };

    this.registerPlayers = players => {
        for (const pl in players) {
            if (!this.players[players[pl].playerid]) {
                // player not on the list
                this.players[players[pl].playerid] = new SqueezePlayer(
                    players[pl].playerid,
                    players[pl].name,
                    this.address,
                    this.port,
                    this.username,
                    this.password,
                );
            }
        }
    };

    /**
     * Get Player oject for name, needs the players registred and normisles names with a lc search removeving puntuation
     *
     * @param name string
     * @param only reten the one player if only one
     */
    this.findPlayerObjectByName = function (name, only) {
        name = this.normalizePlayer(name);

        // Look for the player in the players list that matches the given name. Then return the corresponding player object
        // from the squeezeserver stored by the player's id

        for (const id in this.players) {
            if (
                this.normalizePlayer(this.players[id].name) === name || // name matches the requested player
                (name === '' && only && this.players.length === 1) // name is undefined and there's only one player,
                // so assume that's the one we want.
            ) {
                return this.players[id];
            }
        }
        return undefined;
    };

    /**
     *  Do any necessary clean up of player names
     *
     * @param playerName The name of the player to clean up
     * @param filter optional fn(str) returns str
     * @returns The normalized player name
     */

    this.normalizePlayer = function (playerName) {
        playerName || (playerName = ''); // protect against `playerName` being undefined
        playerName = playerName.replace('-', ' ');
        playerName = playerName.replace('   ', '  ');
        playerName = playerName.replace('  ', '  ');
        playerName = playerName.toLowerCase(playerName);

        return playerName;
    };

    /**
     * Find out if we can contact the server and get some basic information
     *
     * @param skipApps A flag to skip getting information about the apps
     */

    this.register = function (skipApps, skipPlayers) {
        if (!skipPlayers) {
            // Get the list of players from the server
            this.getPlayers(reply => {
                // Process the player information and create Player objects for each one
                if (reply.ok) {
                    this.registerPlayers(reply.result);
                }

                // Send a signal that we are done
                if (skipApps) {
                    this.emit('register', reply, undefined);
                } else {
                    this.emit('registerPlayers', reply);
                }
            });
        }

        if (!skipApps) {
            // Once the players have been obtained, request a list of the apps
            this.on('registerPlayers', reply => {
                this.getApps(areply => {
                    if (areply.ok) {
                        const apps = areply.result.appss_loop;
                        const dir = `${__dirname}/`;
                        fs.readdir(dir, (err, files) => {
                            files.forEach(file => {
                                const fil = file.substr(0, file.lastIndexOf('.'));
                                for (const pl in apps) {
                                    if (fil === apps[pl].cmd) {
                                        const app = require(dir + file);
                                        this.apps[apps[pl].cmd] = new app(
                                            defaultPlayer,
                                            apps[pl].name,
                                            apps[pl].cmd,
                                            this.address,
                                            this.port,
                                            this.username,
                                            this.password,
                                        );
                                        /* workaround, app needs existing player id so first is used here */
                                    }
                                }
                            });

                            this.emit('register', reply, areply);
                        });
                    } else {
                        this.emit('register', reply, areply);
                    }
                });
            });
        }
    };

    this.register(sa, sp);
}

inherits(SqueezeServer, SqueezeRequest);

module.exports = SqueezeServer;
