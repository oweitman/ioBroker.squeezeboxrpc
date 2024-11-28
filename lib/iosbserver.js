'use strict';

const dgram = require('dgram');
const { ioUtil } = require('./ioUtil');
const SqueezeServerNew = require(`${__dirname}/squeezenode/squeezeserver`);
const ioSBPlayer = require(`${__dirname}/iosbplayer`);

/**
 * IoSbServer is a constructor function that initializes and manages a server
 * for interacting with SqueezeBox devices. It sets up various server states,
 * handles server and player discovery, manages favorites, and communicates
 * with the SqueezeBox server via telnet and HTTP requests.
 *
 * @param adapter - An instance of the adapter to manage states and configurations.
 */
function IoSbServer(adapter) {
    this.ioUtil = new ioUtil(adapter, adapter.config.outputserverdebug, adapter.config.outputserversilly);

    this.sbServerStatus = {
        lastscan: {
            name: 'LastScan',
            read: true,
            write: false,
            type: 'string',
            role: 'value',
            exist: false,
        },
        version: {
            name: 'Version',
            read: true,
            write: false,
            type: 'string',
            role: 'value',
            exist: false,
        },
        uuid: {
            name: 'uuid',
            read: true,
            write: false,
            type: 'string',
            role: 'value',
            exist: false,
        },
        name: {
            name: 'Name',
            read: true,
            write: false,
            type: 'string',
            role: 'value',
            exist: false,
        },
        mac: {
            name: 'mac',
            read: true,
            write: false,
            type: 'string',
            role: 'info.mac',
            exist: false,
        },
        'info total albums': {
            name: 'TotalAlbums',
            read: true,
            write: false,
            type: 'number',
            role: 'value',
            exist: false,
        },
        'info total artists': {
            name: 'TotalArtists',
            read: true,
            write: false,
            type: 'number',
            role: 'value',
            exist: false,
        },
        'info total genres': {
            name: 'TotalGenres',
            read: true,
            write: false,
            type: 'number',
            role: 'value',
            exist: false,
        },
        'info total songs': {
            name: 'TotalSongs',
            read: true,
            write: false,
            type: 'number',
            role: 'value',
            exist: false,
        },
        'info total duration': {
            name: 'TotalDuration',
            read: true,
            write: false,
            type: 'number',
            role: 'media.duration',
            exist: false,
        },
        'player count': {
            name: 'PlayerCount',
            read: true,
            write: false,
            type: 'number',
            role: 'value',
            exist: false,
        },
        'sn player count': {
            name: 'PlayerCountSN',
            read: true,
            write: false,
            type: 'number',
            role: 'value',
            exist: false,
        },
        'other player count': {
            name: 'PlayerCountOther',
            read: true,
            write: false,
            type: 'number',
            role: 'value',
            exist: false,
        },
        syncgroups: {
            name: 'SyncGroups',
            read: true,
            write: false,
            type: 'string',
            role: 'value',
            exist: false,
        },
        otherServers: {
            name: 'otherServers',
            read: true,
            write: true,
            type: 'string',
            role: 'value',
            exist: false,
        },
        getFavorites: {
            name: 'getFavorites',
            read: true,
            write: true,
            type: 'boolean',
            role: 'button',
            def: false,
            exist: false,
        },
    };
    this.sbFavoritesState = {
        name: {
            name: 'Name',
            read: true,
            write: false,
            type: 'string',
            role: 'value',
            exist: false,
        },
        type: {
            name: 'type',
            read: true,
            write: false,
            type: 'string',
            role: 'value',
            exist: false,
        },
        id: {
            name: 'id',
            read: true,
            write: false,
            type: 'string',
            role: 'value',
            exist: false,
        },
        hasitems: {
            name: 'hasitems',
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
            role: 'media.url',
            exist: false,
        },
        image: {
            name: 'image',
            read: true,
            write: false,
            type: 'string',
            role: 'url.icon',
            exist: false,
        },
        isaudio: {
            name: 'isaudio',
            read: true,
            write: false,
            type: 'number',
            role: 'value',
            exist: false,
        },
    };

    this.ServerStatePath = 'Server';
    this.FavoritesStatePath = 'Favorites';
    this.PlayersStatePath = 'Players';

    this.FORBIDDEN_CHARS = /[^\d\w_]+/gm;
    //test the regex: https://regex101.com/r/Ed0WhH/1

    this.currentStates = {};
    this.players = [];
    this.observers = [];

    this.adapter = adapter;

    this.adapter.setState('info.connection', false, true);
    this.adapter.subscribeStates('*');

    this.sbServer =
        adapter.config.username != ''
            ? new SqueezeServerNew(
                  `http://${this.adapter.config.server}`,
                  Number.parseInt(this.adapter.config.port),
                  adapter.config.username,
                  adapter.config.password,
              )
            : new SqueezeServerNew(`http://${this.adapter.config.server}`, Number.parseInt(this.adapter.config.port));

    this.log = {};

    this.errmax = 5;
    this.errcnt = -1;
    this.connected = 0;
    this.firstStart = true;
    this.server = null;
    this.telnet = null;
    this.otherserver = [];

    /**
     * Initialization function of the Server object.
     *
     * @async
     * @description
     * This function is called when the adapter object is created and
     * initializes the IoSbServer object. It sets up the connection state
     * and starts the server state and favorites observers.
     */
    this.init = async function () {
        this.ioUtil.logdebug('server init');
        this.setState('connection', true, 'info');
        this.doObserverServer();
        this.doObserverFavorites();
        this.doTelnet();
    };
    /**
     * Observes the server status at regular intervals.
     *
     * @description
     * Logs the execution of the observer, retrieves the current server status,
     * and schedules the next execution of the observer based on the configured
     * server refresh interval in seconds.
     */
    this.doObserverServer = function () {
        this.ioUtil.logdebug('doObserverServer');
        this.getServerstatus();
        this.setTimeout('serverstatus', this.doObserverServer.bind(this), this.adapter.config.serverrefresh * 1000);
    };
    /**
     * Processes incoming messages and executes corresponding commands.
     *
     * @param msg - The message object containing command and optional data.
     * @description Logs the received message and executes specific functions based on the command.
     * For 'discoverlms', it initiates server discovery. For 'cmdGeneral', it sends a general command
     * to the LMS server.
     */
    this.processMessages = function (msg) {
        this.ioUtil.logdebug(`processMessages ${JSON.stringify(msg)}`);
        if (msg.command === 'discoverlms') {
            this.ioUtil.logdebug('send discoverlms');
            this.discoverLMS(msg.command, msg.message, msg.from, msg.callback);
        }
        if (msg.command === 'cmdGeneral') {
            this.ioUtil.logdebug('send cmdGeneral');
            this.sendCmdGeneral(msg.command, msg.message, msg.from, msg.callback);
        }
    };

    /**
     * Processes a general command message to the Logitech Media Server.
     *
     * @param command - The command identifier, should be 'cmdGeneral'.
     * @param message - The message object containing a playerid and a cmdArray.
     * @param from - The sender of the message.
     * @param callback - The callback function to be called with the result.
     * @description
     * Logs the received message and executes a request to the LMS server
     * with the provided playerid and cmdArray. If the request is successful,
     * it sends the result to the callback function. If an error occurs, it
     * sends an error message to the callback function.
     */
    this.sendCmdGeneral = async (command, message, from, callback) => {
        this.ioUtil.logdebug(`sendCmdGeneral ${JSON.stringify(message)}`);
        let error = '';
        if (typeof message === 'object') {
            let data;
            const playerid = message.playerid || '';
            const cmd = message.cmdArray;
            if (!Array.isArray(cmd)) {
                error += 'cmdArray is not an array';
            }
            if (error == '') {
                try {
                    data = await this.requestAsync(playerid, cmd);
                } catch {
                    error = 'Problem with Server request';
                }
            }
            if (callback && error == '') {
                this.adapter.sendTo(from, command, data, callback);
            } else {
                this.adapter.sendTo(from, command, `error: ${error}`, callback);
            }
        }
    };

    this.sanitizePlayername = playername => playername.replace(this.FORBIDDEN_CHARS, '_');

    /**
     * Returns a list of other Logitech Media Servers discovered by the current
     * instance of the adapter. This function is called from the Admin interface
     *
     * @param command - The command identifier, should be 'discoverlms'.
     * @param message - The message object containing no data.
     * @param from - The adapter instance ID that sent the message.
     * @param callback - The callback function to send the response to.
     * @description
     * Logs the received message, processes the discovered servers and sends a
     * response back to the adapter instance that sent the message.
     */
    this.discoverLMS = function (command, message, from, callback) {
        this.ioUtil.logdebug(`discoverLMS ${JSON.stringify(message)}`);
        const data = [];
        for (const [, srv] of Object.entries(this.otherserver)) {
            data.push({ label: `${srv.NAME}/${srv.ADDRESS}`, value: srv.ADDRESS });
        }
        this.adapter.sendTo(from, command, [{ value: '', label: '---' }, ...data], callback);
    };
    /**
     * Sets a timeout for a specified callback function and stores it in the observers object.
     *
     * @param id - Unique identifier for the timeout, used to manage and clear the timeout.
     * @param callback - The function to execute after the specified time delay.
     * @param time - The delay in milliseconds before executing the callback.
     */
    this.setTimeout = function (id, callback, time) {
        this.clearTimeout(id);
        this.observers[id] = setTimeout(callback.bind(this), time);
    };

    /**
     * Sets an interval for a specified callback function and stores it in the observers object.
     *
     * @param id - Unique identifier for the interval, used to manage and clear the interval.
     * @param callback - The function to execute after the specified time delay.
     * @param time - The delay in milliseconds before executing the callback.
     */
    this.setInterval = function (id, callback, time) {
        this.clearInterval(id);
        this.observers[id] = setInterval(callback.bind(this), time);
    };
    /**
     * Clears an interval that was previously set using setInterval.
     *
     * @param id - Unique identifier for the interval to clear.
     */
    this.clearInterval = function (id) {
        if (this.observers[id]) {
            clearInterval(this.observers[id]);
        }
        delete this.observers[id];
    };
    this.clearTimeout = function (id) {
        if (this.observers[id]) {
            clearTimeout(this.observers[id]);
        }
        delete this.observers[id];
    };
    /**
     * Observes the favorites of the player and updates the favorites datapoints.
     *
     * If the user has set the "Use Favorites" option in the adapter settings, the
     * favorites are queried from the Logitech Media Server and the datapoints are
     * updated using the setFavorites method.
     *
     * If the user has not set the "Use Favorites" option, the favorites are deleted
     * and the function is called again after a certain time using the setTimeout
     * method.
     */
    this.doObserverFavorites = function () {
        this.ioUtil.logdebug('doObserverFavorites');
        this.delFavorites();
        if (this.adapter.config.usefavorites) {
            this.setFavorites();
            return;
        }
        this.setTimeout(
            'favorites',
            this.doObserverFavorites.bind(this),
            this.adapter.config.favoriterefresh * 60 * 1000,
        );
    };
    /**
     * Gets a list of other Logitech Media Servers discovered by the current
     * instance.
     *
     * If the user has set the "Use Discovery" option in the adapter settings,
     * a UDP socket is created and bound to a port. The socket listens for
     * incoming messages and processes them to detect other Logitech Media
     * Servers. For each detected server, a datapoint is created with the
     * server's IP address as the name and the server's configuration as the
     * value.
     *
     * If the user has not set the "Use Discovery" option, the datapoints for
     * other servers are deleted and the function is exited.
     *
     */
    this.getDiscoverServers = () => {
        this.ioUtil.logdebug('getDiscoverServers');
        if (!this.adapter.config.usediscovery) {
            this.delState(this.ServerStatePath, this.sbServerStatus['otherServers'].name, () => {
                this.delObject(this.ServerStatePath, this.sbServerStatus['otherServers'].name);
            });
            return;
        }
        this.server = dgram.createSocket({ type: 'udp4', reuseAddr: true });
        const broadcastPort = 3483;
        this.server.bind(broadcastPort, '0.0.0.0', () => {
            this.server && this.server.setBroadcast(true);
        });
        this.server.on('message', async (data, rinfo) => {
            this.ioUtil.logsilly(`getDiscoverServers: Message resceived ${escape(data.toString())}`);
            if (data.toString().charAt(0) == 'E') {
                let msg = data.toString();
                msg = msg.substr(1);
                const srv = {};
                let len = msg.length;
                let tag, len2, val;
                while (len > 0) {
                    tag = msg.substr(0, 4);
                    len2 = msg.charCodeAt(4);
                    val = msg.substr(5, len2);
                    msg = msg.substr(len2 + 5);
                    len = len - len2 - 5;
                    srv[tag] = val;
                }
                srv['ADDRESS'] = rinfo.address;
                srv['TIMESTAMP'] = Date.now();
                this.otherserver[srv['ADDRESS']] = srv;
                const state = {};
                Object.assign(state, this.sbServerStatus['otherServers']);
                state.name = srv['ADDRESS'].replace(/\./g, '-');
                state.def = JSON.stringify(srv);
                await this.createFolder(this.sbServerStatus['otherServers'].name, this.ServerStatePath);
                this.createObject(state, this.ServerStatePath, this.sbServerStatus['otherServers'].name, () => {
                    this.setState(
                        srv['ADDRESS'].replace(/\./g, '-'),
                        JSON.stringify(srv),
                        this.ServerStatePath,
                        this.sbServerStatus['otherServers'].name,
                        false,
                    );
                });
                this.ioUtil.logdebug(
                    `Autodiscover: Server found ${srv['NAME']} IP: ${srv['ADDRESS']} Port ${srv['JSON']} UUID ${
                        srv['UUID']
                    }`,
                );
            }
        });
        this.server.on('error', err => {
            this.ioUtil.logerror(`Error with Server discovery ${err.message}`);
            if (err.message.includes('EADDRINUSE')) {
                this.ioUtil.loginfo("use 'lsof -i -P' to check for ports used.");
            }
            try {
                this.server &&
                    this.server.close(() => {
                        this.ioUtil.loginfo('Server discovery deactivated.');
                        this.server = null;
                    });
            } catch (err) {
                this.ioUtil.logerror(`server.close() ${err.message}`);
            }
        });
        setTimeout(this.doDiscoverServerSearch, 1000);
    };
    /**
     * Called periodically to send a broadcast message to find other servers,
     * and remove old entries from the list.
     *
     */
    this.doDiscoverServerSearch = () => {
        this.ioUtil.logdebug('doDiscoverServerSearch');
        const msg = Buffer.from('eIPAD\0NAME\0JSON\0UUID\0VERS');
        const broadcastAddress = '255.255.255.255';
        const broadcastPort = 3483;
        this.getStates('*', this.ServerStatePath, this.sbServerStatus['otherServers'].name, (err, states) => {
            for (const id in states) {
                const srv = JSON.parse(states[id]?.val || '{}');
                if ((Date.now() - srv.TIMESTAMP) / 1000 > 60) {
                    this.delObject(id);
                    this.ioUtil.logdebug(
                        `Autodiscover: Server removed ${srv['NAME']} IP: ${srv['ADDRESS']} Port ${
                            srv['JSON']
                        } UUID ${srv['UUID']}`,
                    );
                }
            }
        });
        if (!this.server) {
            return;
        }
        this.server.send(msg, 0, msg.length, broadcastPort, broadcastAddress, err => {
            if (err) {
                this.ioUtil.logerror(err);
            }
        });
        this.setTimeout(
            'discover',
            this.doDiscoverServerSearch.bind(this),
            this.adapter.config.discoveryrefresh * 1000,
        );
    };
    /**
     * Close the UDP server for discovery mode.
     *
     */
    this.doDiscoverServerClose = function () {
        this.ioUtil.logdebug('doDiscoverServerClose');
        this.server && this.server.close();
    };
    /**
     * Connect to the LMS server via Telnet, login and listen for player events.
     *
     */
    this.doTelnet = () => {
        this.ioUtil.logdebug('doTelnet');
        if (!this.adapter.config.usetelnet) {
            return;
        }
        const net = require('net');
        this.telnet = net.createConnection(
            { host: this.adapter.config.server, port: this.adapter.config.telnetport },
            () => {
                this.ioUtil.logdebug('doTelnet connected to server!');
                this.telnet.write(`login ${this.adapter.config.username} ${this.adapter.config.password}\r\n`);
                this.telnet.write('listen 1\r\n');
            },
        );
        this.telnet.on('data', data => {
            this.ioUtil.logdebug(`doTelnet received Data: ${data.toString()}`);
            //console.log(decodeURIComponent(data.toString()));
            const regex = /^((?:[0-9A-Fa-f]{2}[:-]){5}(?:[0-9A-Fa-f]{2}))\s*(.*)/gm;
            let m;
            const cmdQueue = decodeURIComponent(data.toString()).split('\r\n');
            for (const cmd of cmdQueue) {
                if ((m = regex.exec(cmd)) !== null) {
                    if (m[2] == 'client reconnect') {
                        this.ioUtil.logdebug(`doTelnet received reconnect for : ${m[1]}`);
                        this.getServerstatus();
                    }
                    if (m[2] == 'client disconnect') {
                        this.ioUtil.logdebug(`doTelnet received disconnect for : ${m[1]}`);
                        this.getServerstatus();
                    }
                    if (m[2] == 'client new') {
                        this.ioUtil.logdebug(`doTelnet received disconnect for : ${m[1]}`);
                        this.getServerstatus();
                    }
                    if (m[2] == 'power 0') {
                        this.ioUtil.logdebug(`doTelnet received power off : ${m[1]}`);
                        this.getServerstatus();
                    }
                    if (m[2] == 'power 1') {
                        this.ioUtil.logdebug(`doTelnet received power on : ${m[1]}`);
                        this.getServerstatus();
                    }
                }
            }
        });
        this.telnet.on('end', () => {
            this.ioUtil.logdebug('doTelnet disconnected from server');
        });
        this.telnet.on('timeout', () => {
            this.ioUtil.logdebug('doTelnet Socket timeout, closing');
            this.telnet.close();
        });
        this.telnet.on('error', err => {
            this.ioUtil.logdebug(`doTelnet Socket error: ${err.message}`);
        });
        this.telnet.on('close', err => {
            this.ioUtil.logdebug(`doTelnet Socket closed ${err.message}`);
        });
    };
    /**
     * Closes the Telnet connection by ending the socket connection with the server.
     * Logs the action for debugging purposes.
     */
    this.doTelnetClose = function () {
        this.ioUtil.logdebug('doTelnetClose');
        this.telnet.end();
    };

    /**
     * Closes all active connections by invoking the appropriate closing
     * methods for Telnet and Discovery servers based on the adapter configuration.
     * Logs the action for debugging purposes.
     */
    this.closeConnections = function () {
        this.ioUtil.logdebug('closeConnections');
        if (this.adapter.config.usetelnet) {
            this.doTelnetClose();
        }
        if (this.adapter.config.usediscovery) {
            this.doDiscoverServerClose();
        }
    };
    /**
     * Retrieves the current server status and sync group information.
     *
     * @description
     * Logs the initiation of the server status retrieval process. Sends a request
     * for the server status with a specified range and another request for the
     * synchronization groups. The results are processed by respective callback
     * functions.
     */
    this.getServerstatus = function () {
        this.ioUtil.logdebug('getServerstatus');
        this.request('', ['serverstatus', '0', '888'], this.doServerstatus.bind(this));
        this.request('', ['syncgroups', '?'], this.doSyncgroups.bind(this));
    };
    /**
     * Processes the result of a syncgroups request.
     *
     * @description
     * Takes the result of a syncgroups request, sanitizes the player names
     * and creates or updates the respective state object. The state object
     * value is set to the JSON string of the syncgroups_loop array.
     * Logs the action for debugging purposes.
     * @param result The result of the syncgroups request.
     */
    this.doSyncgroups = function (result) {
        this.ioUtil.logdebug('doSyncgroups');
        if (result.result && result.result.syncgroups_loop) {
            const key = 'syncgroups';
            const stateTemplate = this.sbServerStatus[key];
            if (result.result?.syncgroups_loop?.[0]?.sync_member_names) {
                result.result.syncgroups_loop[0].sync_member_names =
                    result.result?.syncgroups_loop?.[0]?.sync_member_names
                        .split(',')
                        .map(el => this.sanitizePlayername(el));
            }
            this.createObject(stateTemplate, this.ServerStatePath, null, () =>
                this.setState(
                    this.sbServerStatus[key].name,
                    JSON.stringify(result.result.syncgroups_loop),
                    this.ServerStatePath,
                ),
            );
        }
    };
    /**
     * Processes the result of a serverstatus request.
     *
     * @description
     * Takes the result of a serverstatus request, checks if the server status
     * states are up to date, creates or updates the respective state objects
     * and sets their values to the respective values in the result. If the
     * result contains a players_loop array, it checks if new players have been
     * added and if so, creates or updates the respective state objects and
     * sets their values. It also checks if any players have been removed and
     * if so, removes the respective state objects.
     * Logs the action for debugging purposes.
     * @param result The result of the serverstatus request.
     */
    this.doServerstatus = function (result) {
        this.ioUtil.logdebug('doServerstatus');
        this.checkServerstatusStates(result);
        for (const key in this.sbServerStatus) {
            if (Object.prototype.hasOwnProperty.call(result.result, key)) {
                const stateTemplate = this.sbServerStatus[key];
                this.createObject(stateTemplate, this.ServerStatePath, null, () =>
                    this.setState(
                        this.sbServerStatus[key].name,
                        this.convertState(this.sbServerStatus[key], result.result[key]),
                        this.ServerStatePath,
                    ),
                );
            }
        }
        this.checkNewPlayer(result.result.players_loop);
        this.checkPlayer(result.result.players_loop);
    };
    /**
     * Retrieves and sets the favorites from the Logitech Media Server (LMS).
     *
     * @description
     * Logs the initiation of the favorites setting process. Sends a request to
     * retrieve the list of favorites from the LMS and processes the result to
     * update the favorites data points.
     */
    this.setFavorites = async function () {
        this.ioUtil.logdebug('setFavorites');
        this.getFavoritesLMS('', result => this.setFavoritesDP(result));
    };
    this.delFavorites = async function () {
        this.ioUtil.logdebug('delFavorites');
        let favobj = await this.getObjects(this.FavoritesStatePath);
        favobj = favobj.rows.filter(obj => obj.value.type === 'folder');
        for (let i = 0; i < favobj.length; i++) {
            await this.adapter.delForeignObjectAsync(favobj[i].id);
        }
    };
    /**
     * Retrieves the list of favorites from the Logitech Media Server (LMS).
     *
     * @description
     * Logs the initiation of the favorites retrieval process. Sends a request to
     * retrieve the list of favorites from the LMS and processes the result by
     * calling the callback function with the result.
     * @param id The ID of the favorite to retrieve. If not provided,
     *                         retrieves all favorites.
     * @param callback The callback function to be called with the
     *                             result of the request.
     */
    this.getFavoritesLMS = function (id, callback) {
        this.ioUtil.logdebug('getFavoritesLMS');
        this.request(
            '',
            ['favorites', 'items', '0', '888', 'want_url:1', `item_id:${id}`],
            result => callback(result.result.loop_loop), //.bind(this);
        );
    };
    /**
     * Processes the list of favorites retrieved from the LMS.
     *
     * @description
     * Logs the initiation of the favorites setting process. Creates the
     * necessary state paths and creates the objects for each favorite.
     * @param favorites The list of favorites retrieved from the LMS.
     */
    this.setFavoritesDP = async function (favorites) {
        this.ioUtil.logdebug('setFavoritesDP');
        await this.createFolder(this.FavoritesStatePath);
        for (const favkey in favorites) {
            const favorite = favorites[favkey];
            const oid = this.getFavId(favorite['id'], false);
            const id = this.getFavId(favorite['id']);
            for (const key in this.sbFavoritesState) {
                if (Object.prototype.hasOwnProperty.call(favorite, key)) {
                    if (key == 'id') {
                        favorite['id'] = oid;
                    }
                    if (key == 'image') {
                        let result = `http://${this.adapter.config.server}:${
                            this.adapter.config.port
                        }/html/images/favorites.png`;
                        if (/music\/(.*)\/cover.png/gm.test(favorite[key])) {
                            result = `http://${this.adapter.config.server}:${this.adapter.config.port}/${
                                favorite[key]
                            }`;
                        } else if (/imageproxy\/(.*)\/[^/]/gm.test(favorite[key])) {
                            const m = /imageproxy\/(.*)\/[^/]/gm.exec(favorite[key]);
                            if (m && m[1]) {
                                result = decodeURIComponent(m[1] || '');
                            }
                        } else if (favorite[key] === 'html/images/radio.png') {
                            result = `http://${this.adapter.config.server}:${
                                this.adapter.config.port
                            }/html/images/radio.png`;
                        } else if (favorite[key] === 'html/images/cover.png') {
                            result = `http://${this.adapter.config.server}:${
                                this.adapter.config.port
                            }/html/images/cover.png`;
                        } else if (favorite[key] === 'html/images/favorites.png') {
                            result = `http://${this.adapter.config.server}:${
                                this.adapter.config.port
                            }/html/images/favorites.png`;
                        }
                        favorite[key] = result;
                    }
                    const stateTemplate = this.sbFavoritesState[key];
                    await this.createFolder(id, this.FavoritesStatePath);
                    this.createObject(stateTemplate, this.FavoritesStatePath, id, () =>
                        this.setState(
                            this.sbFavoritesState[key].name,
                            this.convertState(this.sbFavoritesState[key], favorite[key]),
                            this.FavoritesStatePath,
                            id,
                            false,
                        ),
                    );
                }
            }
            if (favorite['hasitems'] > 0) {
                this.getFavoritesLMS(oid, result => this.setFavoritesDP(result));
            }
        }
    };
    /**
     * Extracts and optionally replaces periods in the favorite ID.
     *
     * @param id - The original favorite ID.
     * @param [replace] - Whether to replace periods with hyphens.
     * @returns - The processed favorite ID with optional replacements.
     */
    this.getFavId = function (id, replace = true) {
        let ret;
        if (id.indexOf('.') == 8) {
            ret = id.substr(9);
        } else {
            ret = id;
        }
        if (replace) {
            ret = ret.replace(/\./g, '-');
        }
        return ret;
    };
    /**
     * Checks if the server status datapoints exist and creates them if not.
     *
     * Iterates over the sbServerStatus object and checks if the datapoint exists.
     * If not, it creates the datapoint using createObject. Additionally, it
     * checks and creates the datapoints for getFavorites and syncgroups.
     *
     * @param result - The result of the serverstatus request.
     */
    this.checkServerstatusStates = async function (result) {
        this.ioUtil.logdebug('checkServerstatusStates');
        await this.createDevice(this.ServerStatePath);
        for (const key in this.sbServerStatus) {
            if (Object.prototype.hasOwnProperty.call(result.result, key)) {
                const stateTemplate = this.sbServerStatus[key];
                if (!this.currentStates[stateTemplate.name]) {
                    if (!stateTemplate.exist) {
                        this.sbServerStatus[key] = this.createObject(stateTemplate, this.ServerStatePath);
                    }
                }
            }
        }
        let key = 'getFavorites';
        let stateTemplate = this.sbServerStatus[key];
        if (!stateTemplate.exist) {
            this.sbServerStatus[key] = this.createObject(stateTemplate, this.ServerStatePath);
        }
        key = 'syncgroups';
        stateTemplate = this.sbServerStatus[key];
        if (!stateTemplate.exist) {
            this.sbServerStatus[key] = this.createObject(stateTemplate, this.ServerStatePath);
        }
    };
    /**
     * Checks for new players in the playersdata array.
     *
     * @description
     * Iterates over the playersdata array and checks if each player is already
     * present in the current list of players. If a player is not found, it
     * creates a new ioSBPlayer object for the player and adds it to the list.
     * Logs the action for debugging purposes.
     * @param playersdata The array containing player data to be checked.
     */
    this.checkNewPlayer = function (playersdata) {
        this.ioUtil.logdebug('checkNewPlayer');
        for (const key in playersdata) {
            if (!Object.prototype.hasOwnProperty.call(this.players, playersdata[key].playerid)) {
                this.players[playersdata[key].playerid] = new ioSBPlayer(this, playersdata[key]);
            }
        }
    };
    /**
     * Checks if any player connections have changed.
     *
     * @description
     * Iterates over the playersdata array and checks if each player's connection
     * state has changed. If a player's connection state has changed, it either
     * connects or disconnects the ioSBPlayer object for the player. Logs the action
     * for debugging purposes.
     * @param playersdata The array containing player data to be checked.
     */
    this.checkPlayer = function (playersdata) {
        this.ioUtil.logdebug('checkPlayer');
        this.checkTPE2();
        for (const key in playersdata) {
            if (this.players[playersdata[key].playerid].connected != playersdata[key].connected) {
                if (playersdata[key].connected == 0) {
                    this.players[playersdata[key].playerid].disconnect();
                }
                if (playersdata[key].connected == 1) {
                    this.players[playersdata[key].playerid].connect();
                }
            }
        }
    };
    /**
     * Checks the value of the LMS preference "useTPE2AsAlbumArtist"
     * and sets the TPE2Handling of all players accordingly.
     *
     * @description
     * This function requests the value of the LMS preference "useTPE2AsAlbumArtist"
     * and sets the TPE2Handling of all ioSBPlayer objects to the value of the
     * preference. This preference determines if the album artist should be taken
     * from the TPE2 tag of a song instead of the TPE1 tag.
     */
    this.checkTPE2 = function () {
        // eslint-disable-next-line prettier/prettier
        this.request(
            '',
            ['pref', 'useTPE2AsAlbumArtist', '?'],
            (result) => {
            if (result.ok) {
                if (Object.keys(result.result).length > 0) {
                    const value = result.result[Object.keys(result.result)[0]];
                    for (const key in this.players) {
                        if (Object.prototype.hasOwnProperty.call(this.players, key)) {
                            // console.log("setTPE2Handling", key, value);
                            this.players[key].setTPE2Handling(parseInt(value));
                        }
                    }
                }
            }
        });
    };
    /**
     * Handles state changes for server, favorites, and players.
     *
     * @param id - The state identifier, which is expected to be in dot-separated format.
     * @param state - The new state object; can be null if the state was deleted.
     *
     * The function logs the state change, splits the id into parts, and invokes the
     * appropriate state change handler based on the first part of the id.
     * It returns early if id, state, or state.ack is falsy.
     */
    this.stateChange = function (id, state) {
        this.ioUtil.logsilly('stateChange');
        // Warning, state can be null if it was deleted
        if (!id || !state || state.ack) {
            return;
        }
        const idParts = id.split('.');
        idParts.shift();
        idParts.shift();
        if (idParts[0] == this.ServerStatePath) {
            this.doServerStateChange(idParts, state);
        }
        if (idParts[0] == this.FavoritesStatePath) {
            this.doFavoritesStateChange(idParts, state);
        }
        if (idParts[0] == this.PlayersStatePath) {
            this.doPlayersStateChange(idParts, state);
        }
    };
    /**
     * Handles state changes for the server, such as changes to the favorites list.
     *
     * @param idParts - The state identifier split into parts.
     * @param state - The new state object; can be null if the state was deleted.
     *
     * The function logs the state change, splits the id into parts, and invokes the
     * appropriate state change handler based on the first part of the id.
     * It returns early if id, state, or state.ack is falsy.
     */
    this.doServerStateChange = function (idParts, state) {
        this.ioUtil.logdebug('doServerStateChange');
        idParts.shift();
        if (idParts[0] == 'getFavorites') {
            if (state.val == true) {
                this.delFavorites();
                this.setFavorites();
            }
        }
    };
    /**
     * Handles state changes for favorites.
     *
     * @param idParts - The state identifier split into parts.
     * @param state - The new state object; can be null if the state was deleted.
     *
     * Logs the state change and shifts the idParts array. Returns early if the state is truthy.
     */
    this.doFavoritesStateChange = function (idParts, state) {
        this.ioUtil.logdebug('doFavoritesStateChange');
        idParts.shift();
        if (state) {
            return;
        }
    };
    /**
     * Handles state changes for a player.
     *
     * @param idParts - The state identifier split into parts.
     * @param state - The new state object; can be null if the state was deleted.
     *
     * Shifts the idParts array and finds the player with the name in the first
     * part of the idParts array. If a player is found, it calls the player's
     * doStateChange method with the remaining idParts and state.
     */
    this.doPlayersStateChange = function (idParts, state) {
        this.ioUtil.logsilly('doPlayersStateChange');
        idParts.shift();
        const player = this.findPlayerByName(idParts[0]);
        if (player) {
            player.doStateChange(idParts, state);
        }
    };
    /**
     * Finds a player with a given name.
     *
     * @param name - The name of the player.
     * @returns The player object if found; otherwise, undefined.
     */
    this.findPlayerByName = function (name) {
        for (const key in this.players) {
            if (this.players[key].playername == name) {
                return this.players[key];
            }
        }
    };
    /**
     * Makes a request to the Logitech Media Server.
     *
     * @param playerid - The playerid of the player to request from, or '' for the server.
     * @param params - The parameters to pass to the request.
     * @param callback - The function to call with the result of the request.
     *
     * If the request is successful, sets the connected flag and clears the error counter.
     * If the request fails, decrements the error counter and calls disconnect if the counter reaches 0.
     * If the request fails and the firstStart flag is set, calls disconnect.
     */
    this.request = (playerid, params, callback) => {
        this.ioUtil.logsilly('request');
        this.sbServer.request(playerid, params, result => {
            if (result.ok) {
                this.connected = 1;
                this.errcnt = -1;
                this.firstStart = false;
                if (callback) {
                    callback(result);
                }
            } else {
                if (this.firstStart) {
                    this.disconnect();
                }
                if (this.errcnt == -1) {
                    this.errcnt = this.errmax;
                }
                this.errcnt--;
                if (this.errcnt == 0) {
                    this.errcnt = -1;
                    this.disconnect();
                }
            }
        });
    };
    /**
     * Asynchronous method to make a request to the Logitech Media Server.
     *
     * @param playerid - The player ID to request from, or an empty string for the server.
     * @param params - The parameters to pass to the request.
     * @returns A promise that resolves with the result of the request.
     *
     * Logs the request attempt and uses a promise to handle the asynchronous operation.
     * If the request is successful, sets the connected flag, clears the error counter,
     * and resolves the promise with the result.
     * If the request fails, manages error counters, may call disconnect,
     * and rejects the promise if the error threshold is reached.
     */
    this.requestAsync = async (playerid, params) => {
        this.ioUtil.logsilly('requestAsync');
        return new Promise((resolve, reject) => {
            this.sbServer.request(playerid, params, result => {
                if (result.ok) {
                    this.connected = 1;
                    this.errcnt = -1;
                    this.firstStart = false;
                    resolve(result);
                } else {
                    if (this.firstStart) {
                        this.disconnect();
                    }
                    if (this.errcnt == -1) {
                        this.errcnt = this.errmax;
                    }
                    this.errcnt--;
                    if (this.errcnt == 0) {
                        this.errcnt = -1;
                        this.disconnect();
                    }
                    reject();
                }
            });
        });
    };
    /**
     * Disconnects the server and its players.
     *
     * @description
     * Logs the disconnection event, updates the server's state to disconnected,
     * and clears related timeouts. It checks for server observers and performs
     * necessary state updates. Iterates over all players and disconnects them.
     * Sets an interval to periodically check the server status.
     */
    this.disconnect = () => {
        this.ioUtil.logdebug('Server disconnect');
        this.firstStart = false;
        this.connected = 0;
        this.clearTimeout('serverstatus');
        this.clearTimeout('favorites');
        if (this.connected == 0 && this.observers['checkserver']) {
            return;
        }
        this.setState('connection', false, 'info');
        for (const key in this.players) {
            this.players[key].disconnect();
        }
        this.setInterval('checkserver', this.doCheckServer.bind(this), 10 * 1000);
    };
    /**
     * Connects the server and its players.
     *
     * @description
     * Logs the connection event, clears the check server interval,
     * and sets the server connection state to true.
     * Calls init() to initialize players and other data.
     */
    this.connect = () => {
        this.ioUtil.logdebug('Server connect');
        this.clearInterval('checkserver');
        this.setState('connection', true, 'info');
        this.connected = 1;
        this.init();
    };
    /**
     * Checks the server status and attempts to reconnect if necessary.
     *
     * @description
     * Logs the server check action for debugging purposes. Sends a serverstatus
     * request to the Logitech Media Server. If the request is successful, it
     * initiates a server connection.
     */
    this.doCheckServer = () => {
        this.ioUtil.logdebug('doCheckServer');
        this.request('', ['serverstatus', '0', '888'], result => {
            if (result.ok) {
                this.connect();
            }
        });
    };
    /**
     * Sets the state of an object in the ioBroker system.
     *
     * @param name - The name of the state to set.
     * @param value - The value to set the state to.
     * @param [level1path] - The first level path to prepend to the state name, can be null or empty.
     * @param [level2path] - The second level path to prepend to the state name, can be null or empty.
     * @param [check] - If true, only sets the state if the current value differs from the new value.
     * @param [callback] - Optional callback function, called when the state is set in the adapter.
     */
    this.setState = function (name, value, level1path, level2path, check, callback) {
        name = (level1path ? `${level1path}.` : '') + (level2path ? `${level2path}.` : '') + name;
        if (this.currentStates[name] !== value && check) {
            this.currentStates[name] = value;
            this.ioUtil.logsilly(`setState name: ${name} value: ${value}`);
            this.adapter.setState(name, value, true, callback);
        } else {
            this.currentStates[name] = value;
            this.ioUtil.logsilly(`setState name: ${name} value: ${value}`);
            this.adapter.setState(name, value, true, callback);
        }
    };
    this.getState = function (name, level1path = false, level2path = false, callback) {
        name = (level1path ? `${level1path}.` : '') + (level2path ? `${level2path}.` : '') + name;
        this.ioUtil.logsilly(`getState ${name}`);
        this.adapter.getState(name, callback);
    };
    this.delObject = function (name, level1path, level2path, callback) {
        name = (level1path ? `${level1path}.` : '') + (level2path ? `${level2path}.` : '') + name;
        this.ioUtil.logsilly(`delObject ${name}`);
        delete this.currentStates[name];
        this.adapter.delObject(name, callback);
    };
    this.delState = function (name, level1path, level2path, callback) {
        name = (level1path ? `${level1path}.` : '') + (level2path ? `${level2path}.` : '') + name;
        this.ioUtil.logsilly(`delObject ${name}`);
        delete this.currentStates[name];
        this.adapter.delState(name, callback);
    };
    this.getStates = function (pattern, level1path, level2path, callback) {
        const name = (level1path ? `${level1path}.` : '') + (level2path ? `${level2path}.` : '') + pattern;
        this.adapter.getStates(name, callback);
    };
    this.getObjects = async function (level1path, level2path) {
        const name = `${this.adapter.namespace}.${level1path ? `${level1path}.` : ''}${level2path ? level2path : ''}`;
        return await this.adapter.getObjectListAsync({
            startkey: name,
            endkey: `${name}\u9999`,
        });
    };
    this.createObject = function (stateTemplate, level1path, level2path, callback) {
        const name = (level1path ? `${level1path}.` : '') + (level2path ? `${level2path}.` : '') + stateTemplate.name;
        this.ioUtil.logsilly(`createObject ${name}`);
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
    this.createState = function (stateTemplate, level1path = false, level2path = false, callback) {
        const name = (level1path ? `${level1path}.` : '') + (level2path ? `${level2path}.` : '') + stateTemplate.name;
        this.ioUtil.logsilly(`Create state ${name}`);
        this.adapter.createState(level1path, level2path, stateTemplate.name, stateTemplate, callback);
        stateTemplate.exist = true;
        return stateTemplate;
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
    /*     this.xlogsilly = s => {
        if (this.islogsilly) {
            this.adapter.log.silly(s);
        }
    };
    this.xlogerror = function (s) {
        this.adapter.log.error(s);
    };
    this.xloginfo = s => {
        this.adapter.log.info(s);
    }; */
    this.getDiscoverServers();
    this.sbServer.on('register', this.init.bind(this));
}
module.exports = IoSbServer;
