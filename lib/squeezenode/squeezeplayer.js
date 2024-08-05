/*
 The MIT License (MIT)
 Copyright (c) 2013-2015 Piotr Raczynski, pio[dot]raczynski[at]gmail[dot]com
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

var _ = require('lodash');
var inherits = require('super');
var SqueezeRequest = require('./squeezerequest');

/**
 * Create a SqueezePlayer object
 *
 * @param playerId The ID of the player
 * @param name The name of the player
 * @param address The URL of the server
 * @param port The port that the server listens on
 * @param username The username for authentication
 * @param password The password for authentication
 */

function SqueezePlayer(playerId, name, address, port, username, password) {

    this.playerId = playerId;
    this.name = name;

    SqueezePlayer.super_.apply(this, [address, port, username, password]);

    /**
     * @method callMethod
     *
     * You can use this function to call any available method in the Logitech
     * Media Server API. The documentation for the API can be found here -
     * `http://<your-server-ip>:9000/html/docs/help.html`
     *
     * ...then click on "Technical Information"
     * ...then click on "The Logitech Media Server Command Line Interface"
     *
     * (God, they don't make it easy...)
     *
     * You can then use `callMethod` for anything, like so,
     * @example
     * squeezePlayer.callMethod({
     *     playerId: myPlayerId,
     *     method: 'mixer',
     *     params: ['volume', '?'],
     *     callback: myCallbackFunction
     * });
     *
     * While `callMethod` can be used to execute any of the LMS API methods, the additional
     * functions below (e.g `play`, `clearPlayList`, etc) may be more convenient and easier
     * to remember. Use whichever you prefer. `callMethod` is designed to provide flexibility
     * for calling methods that have not been explicitly defined on the SqueezePlayer
     * object. Plus, it supports promises! 🙀
     *
     * @param Object opts - The options object for the request.
     * @param string opts.method - The method name. Required.
     * @param array opts.params - The additional parameters for the request. Required.
     * @param function [opts.callback] - The callback function. Optional. If you don't
     *                                   provide a callback, a promise will be returned.
     * @throws Throws an error is opts.method is empty.
     * @returns Promise|Undefined
     *
     */

    this.callMethod = function (opts) {

        if (_.isUndefined(opts.method)) {
            throw Error('Method name missing.');
        }

        var params = _.flatten([
            _.get(opts, 'method'),
            _.get(opts, 'params'),
        ]);

        var cb = _.get(opts, 'callback');

        if (cb) {
            this.request(this.playerId, params, cb);
        } else {
            return new Promise(_.bind(function (resolve, reject) {
                this.request(
                    this.playerId,
                    params,
                    function (result) {
                        if (!result.ok) {
                            reject(result);
                        } else {
                            resolve(result);
                        }
                    }
                );
            }, this));
        }
    };

    /**
     * Clear the playlist for this player.
     *
     * @param callback The function to call with the result
     */

    this.clearPlayList = function (callback) {
        this.request(playerId, ["playlist", "clear"], callback);
    };

    /**
     * Get the current state of the player. i.e. playing, paused or stopped.
     *
     * @param callback The function to call with the result
     */

    this.getMode = function (callback) {
        this.request(playerId, ["mode", "?"], callback);
    };

    /**
     * Set the name of the player.
     *
     * @param name The new name for the player
     * @param callback The function to call with the result
     */

    this.setName = function (name, callback) {
        this.request(playerId, ["name", name], callback);
    };

    /**
     * Get the name of the player.
     *
     * @param callback The function to call with the result
     */

    this.getName = function (callback) {
        this.request(playerId, ["name", "?"], callback);
    };

    /**
     * Get the title of the current song playing.
     *
     * @param callback The function to call with the result
     */

    this.getCurrentTitle = function (callback) {
        this.request(playerId, ["current_title", "?"], function (reply) {
            if (reply.ok)
                reply.result = reply.result._current_title;
            callback(reply);
        });
    };

    /**
     * Get the artist of the current song playing.
     *
     * @param callback The function to call with the result
     */

    this.getArtist = function (callback) {
        this.request(playerId, ["artist", "?"], function (reply) {
            if (reply.ok)
                reply.result = reply.result._artist;
            callback(reply);
        });
    };

    /**
     * Get the album of the current song playing.
     *
     * @param callback The function to call with the result
     */

    this.getAlbum = function (callback) {
        this.request(playerId, ["album", "?"], function (reply) {
            if (reply.ok)
                reply.result = reply.result._album;
            callback(reply);
        });
    };

    /**
     * Get the remoteMeta part of the status of the player.
     *
     * @param callback The function to call with the result
     */

    this.getCurrentRemoteMeta = function (callback) {
        this.request(playerId, ["status"], function (reply) {
            if (reply.ok)
                reply.result = reply.result.remoteMeta;
            callback(reply);
        });
    };

    /**
     * Get the complete status of the player.
     *
     * @param callback The function to call with the result
     */

    this.getStatus = function (callback) {
        this.request(playerId, ["status"], callback);
    };

    /**
     * Get the status with part of the current playlist.
     *
     * @param from The place in the playlist to start getting information
     * @param to The place in the playlist to get information up to
     * @param callback The function to call with the result
     */

    this.getStatusWithPlaylist = function (from, to, callback) {
        this.request(playerId, ["status", from, to], function (reply) {
            if (reply.ok)
                reply.result = reply.result;
            callback(reply);
        });
    };

    /**
     * Get a portion of the playlist.
     *
     * @param from The place in the playlist to start getting information
     * @param to The place in the playlist to get information up to
     * @param callback The function to call with the result
     */

    this.getPlaylist = function (from, to, callback) {
        this.request(playerId, ["status", from, to], function (reply) {
            if (reply.ok)
                reply.result = reply.result.playlist_loop;
            callback(reply);
        });
    };

    /**
     * Start the player playing.
     *
     * @param callback The function to call with the result
     */

    this.play = function (callback) {
        this.request(playerId, ["play"], callback);
    };

    /**
     * Play a specific song in the playlist.
     *
     * @param index The index of the song to play.
     * @param callback The function to call with the result
     */

    this.playIndex = function (index, callback) {
        this.request(playerId, ["playlist", "index", index], callback);
    };

    /**
     * Pause or unpause the player.
     *
     * @param state 1 to pause, 0 to unpause
     * @param callback The function to call with the result
     */

    this.pause = function (state, callback) {
        this.request(playerId, ["pause", state ? "1" : "0"], callback);
    };

    /**
     * Toggle the pause state of the player.
     *
     * @param callback The function to call with the result
     */

    this.togglepause = function (callback) {
        this.request(playerId, ["pause"], callback);
    };

    /**
     * Move the player to the previous song in the playlist.
     *
     * @param callback The function to call with the result
     */

    this.previous = function (callback) {
        this.request(playerId, ["button", "jump_rew"], callback);
    };

    /**
     * Move the player to the next song in the playlist.
     *
     * @param callback The function to call with the result
     */

    this.next = function (callback) {
        this.request(playerId, ["button", "jump_fwd"], callback);
    };

    /**
     * Delete a song from the playlist.
     *
     * @param index The index of the song to delete
     * @param callback The function to call with the result
     */

    this.playlistDelete = function (index, callback) {
        this.request(playerId, ["playlist", "delete", index], callback);
    };

    /**
     * Move a song in the playlist.
     *
     * @param fromIndex The index to move the song from
     * @param toIndex The index to move the song to
     * @param callback The function to call with the result
     */

    this.playlistMove = function (fromIndex, toIndex, callback) {
        this.request(playerId, ["playlist", "move", fromIndex, toIndex], callback);
    };

    /**
     * Save the current playlist.
     *
     * @param playlistName The name to save the playlist as.
     * @param callback The function to call with the result
     */

    this.playlistSave = function (playlistName, callback) {
        this.request(playerId, ["playlist", "save", playlistName], callback);
    };

    /**
     * Sync the current player to another.
     *
     * @param syncTo The index or playerId to sync to
     * @param callback The function to call with the result
     */

    this.sync = function (syncTo, callback) {
        this.request(playerId, ["sync", syncTo], callback);
    };

    /**
     * Unsync the current player.
     *
     * @param callback The function to call with the result
     */

    this.unSync = function (callback) {
        this.request(playerId, ["sync", "-"], callback);
    };

    /**
     * Move the playback of the current song to a specific point.
     *
     * @param seconds The time in the song to move to
     * @param callback The function to call with the result
     */

    this.seek = function (seconds, callback) {
        this.request(playerId, ["time", seconds], callback);
    };

    /**
     * Set the volume of the player.
     *
     * @param volume The volume to set to between 0 and 100
     * @param callback The function to call with the result
     */

    this.setVolume = function (volume, callback) {
        this.request(playerId, ["mixer", "volume", volume], callback);
    };

    /**
     * Get the current volume of the player.
     *
     * @param callback The function to call with the result
     */

    this.getVolume = function (callback) {
        this.request(playerId, ["mixer", "volume", "?"], function (reply) {
            if (reply.ok)
                reply.result = reply.result._volume;
            callback(reply);
        });
    };

    /**
     * Create and play a random list.
     *
     * @param target The type of list to generate, e.g. tracks, albums, contributors, year
     * @param callback The function to call with the result
     */

    this.randomPlay = function (target, callback) {
        this.request(playerId, ["randomplay", target], callback);
    };

    /**
     * Turn on or off the player.
     *
     * @param state 0 to turn the player off, 0 to turn it on
     * @param callback The function to call with the result
     */

    this.power = function (state, callback) {
        this.request(playerId, ["power", state ? "1" : "0"], callback);
    };

    /**
     * Play a favourite
     *
     * @param favorite The ID of the item to play
     * @param callback The function to call with the result
     */

    this.playFavorite = function (favorite, callback) {
        this.request(playerId, ["favorites", "playlist", "play", "item_id:" + favorite], callback);
    };

    /**
     * Add an item to the playlist.
     *
     * @param item The item to add to the playlist
     * @param callback The function to call with the result
     */

    this.addToPlaylist = function (item, callback) {
        this.request(playerId, ["playlist", "add", item], callback);
    };

    /**
     * Insert an item into the playlist to be played immediately.
     *
     * @param item The item to insert
     * @param callback The function to call with the result
     */

    this.insertToPlaylist = function (item, callback) {
        this.request(playerId, ["playlist", "insert", item], callback);
    };

    /**
     * Set the shuffle state of the current playlist.
     *
     * @param state The state to set the list to, 0 no shuffle, 1 to shuffle
     * @param callback The function to call with the result
     */

    this.shuffle = function (state, callback) {
        this.request(playerId, ["playlist", "shuffle", state ? "1" : "0"], callback);
    };

    /**
     * Function to set Linein mode on Squeezebox Boom
     *
     * @param callback The function to call with the result
     */

    this.setLinein = function (callback) {
        this.request(playerId, ["setlinein", "linein"], callback);
    };
}

inherits(SqueezePlayer, SqueezeRequest);

module.exports = SqueezePlayer;