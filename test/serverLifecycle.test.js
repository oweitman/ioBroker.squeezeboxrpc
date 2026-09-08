// @ts-nocheck Proxyquire test doubles intentionally implement only the server dependencies exercised here.
'use strict';

const { expect } = require('chai');
const proxyquire = require('proxyquire').noCallThru();

function createFixture(config = {}) {
    const calls = [];
    let connectionOptions;
    const connection = {
        start: () => calls.push(['connection.start']),
        close: () => calls.push(['connection.close']),
        request: (playerId, command, callback) => {
            calls.push(['request', playerId, command]);
            callback(connection.nextResult || { ok: true, result: {} });
        },
    };

    class FakeIoUtil {
        constructor() {
            this.observers = [];
        }

        addTranslations() {}
        logdebug(message) {
            calls.push(['debug', message]);
        }
        logsilly() {}
        logerror(message) {
            calls.push(['error', message]);
        }
        setMyTimeout(id, callback, delay) {
            calls.push(['timeout', id, delay]);
            this.observers[id] = { callback };
        }
        clearTimeout(id) {
            calls.push(['clearTimeout', id]);
            delete this.observers[id];
        }
        closeConnections() {
            calls.push(['io.close']);
        }
        async createFolderNotExistsAsync(...args) {
            calls.push(['folder', ...args]);
        }
        async createDeviceNotExistsAsync(...args) {
            calls.push(['device', ...args]);
        }
    }

    class FakePlayer {
        constructor(server, data) {
            this.playername = server.sanitizePlayername(data.name);
            this.connected = data.connected;
            this.ioUtil = { closeConnections: () => calls.push(['player.close', data.playerid]) };
            this.connect = () => calls.push(['player.connect', data.playerid]);
            this.disconnect = () => calls.push(['player.disconnect', data.playerid]);
            this.doStateChange = (parts, state) => calls.push(['player.state', parts, state]);
            this.getPlayerUpdateStatus = full => calls.push(['player.update', data.playerid, full]);
        }
    }

    class FakeDiscovery {
        constructor(options) {
            this.options = options;
            this.servers = [{ NAME: 'LMS', ADDRESS: '192.0.2.1' }];
        }
        start() {
            calls.push(['discovery.start']);
        }
        close() {
            calls.push(['discovery.close']);
        }
        getServers() {
            return this.servers;
        }
    }

    const adapter = {
        namespace: 'squeezeboxrpc.0',
        config: {
            server: 'lms.local',
            port: '9000',
            telnetport: '9090',
            serverrefresh: 30,
            favoriterefresh: 5,
            discoveryrefresh: 60,
            usefavorites: false,
            usediscovery: false,
            ...config,
        },
        log: { debug() {}, silly() {}, error() {}, info() {} },
        setTimeout,
        clearTimeout,
        setState: (...args) => calls.push(['setState', ...args]),
        subscribeStates: pattern => calls.push(['subscribeStates', pattern]),
        sendTo: (...args) => calls.push(['sendTo', ...args]),
        getObjectListAsync: async () => ({ rows: [] }),
        delForeignObjectAsync: async id => calls.push(['delForeignObjectAsync', id]),
        getObject: (id, callback) => callback(null, null),
        setObjectNotExists: (...args) => calls.push(['setObjectNotExists', ...args]),
        delObject: (...args) => calls.push(['delObject', ...args]),
        delState: (...args) => calls.push(['delState', ...args]),
        getState: (...args) => calls.push(['getState', ...args]),
        getStates: (...args) => calls.push(['getStates', ...args]),
        getForeignObject: (id, callback) => callback(null, { _id: id }),
    };
    const i18n = { getTranslatedObject: key => key };
    const IoSbServer = proxyquire('../lib/iosbserver', {
        './ioUtil': { ioUtil: FakeIoUtil },
        './lms/connection': {
            createLmsConnection: options => {
                connectionOptions = options;
                return connection;
            },
        },
        './lms/discovery': { LmsDiscovery: FakeDiscovery },
        './iosbplayer': FakePlayer,
    });
    const server = new IoSbServer(adapter, i18n);
    return { server, adapter, calls, connection, connectionOptions };
}

describe('server lifecycle and command handling', () => {
    it('initializes the configured transport and observers', () => {
        const { calls, connectionOptions } = createFixture({ connectionType: 'websocket', webSocketUrl: 'http://lms/' });

        expect(connectionOptions).to.include({
            host: 'lms.local',
            port: 9000,
            connectionType: 'websocket',
            webSocketUrl: 'http://lms/',
        });
        expect(calls).to.deep.include(['subscribeStates', '*']);
        expect(calls).to.deep.include(['connection.start']);
        expect(calls).to.deep.include(['timeout', 'serverstatus', 30000]);
        expect(calls).to.deep.include(['timeout', 'favorites', 300000]);
    });

    it('uses JSON-RPC when an older instance has no connection type', () => {
        const { connectionOptions } = createFixture({ connectionType: '' });

        expect(connectionOptions.connectionType).to.equal('jsonrpc');
    });

    it('dispatches SendTo messages and validates general commands', async () => {
        const { server, calls } = createFixture();
        server.players.one = { playername: 'Kitchen' };

        server.processMessages({ command: 'getPlayerNames', from: 'vis.0', callback: 'cb' });
        await server.sendCmdGeneral('cmdGeneral', { cmdArray: 'invalid' }, 'vis.0', 'cb');
        await server.sendCmdGeneral('cmdGeneral', { playerid: 'one', cmdArray: ['power', '?'] }, 'vis.0', 'cb');

        expect(calls).to.deep.include(['sendTo', 'vis.0', 'getPlayerNames', ['Kitchen'], 'cb']);
        expect(calls).to.deep.include(['sendTo', 'vis.0', 'cmdGeneral', 'error: cmdArray is not an array', 'cb']);
        expect(calls.some(call => call[0] === 'sendTo' && call[2] === 'cmdGeneral' && call[3].ok)).to.equal(true);
    });

    it('discovers servers and sanitizes player names', () => {
        const { server, calls } = createFixture({ usediscovery: true });
        server.discoverLMS('discoverlms', {}, 'admin.0', 'cb');

        expect(server.sanitizePlayername('Living room!')).to.equal('Living_room_');
        expect(calls).to.deep.include([
            'sendTo',
            'admin.0',
            'discoverlms',
            [
                { value: '', label: '---' },
                { label: 'LMS/192.0.2.1', value: '192.0.2.1' },
            ],
            'cb',
        ]);
        server.doDiscoverServerClose();
        expect(calls).to.deep.include(['discovery.close']);
    });

    it('creates players, routes state changes and reacts to push events', () => {
        const { server, connectionOptions, calls } = createFixture();
        server.checkNewPlayer([{ playerid: 'one', name: 'Living room', connected: 1 }]);

        server.stateChange('squeezeboxrpc.0.Players.Living_room.Power', { val: true, ack: false });
        connectionOptions.onEvent({ playerId: 'one', command: 'playlist newsong' });
        server.ioUtil.observers['player-event-one'].callback();

        expect(calls.some(call => call[0] === 'player.state')).to.equal(true);
        expect(calls).to.deep.include(['player.update', 'one', true]);
    });

    it('tracks successful and failed requests and reconnects', async () => {
        const { server, connection, calls } = createFixture();
        connection.nextResult = { ok: true, result: { version: '9.2' } };
        expect(await server.requestAsync('', ['version', '?'])).to.deep.equal(connection.nextResult);

        connection.nextResult = { ok: false, message: 'offline' };
        let error;
        try {
            await server.requestAsync('', ['version', '?']);
        } catch (requestError) {
            error = requestError;
        }
        expect(error.message).to.equal('offline');
        server.disconnect();
        expect(calls).to.deep.include(['timeout', 'checkserver', 10000]);

        connection.nextResult = { ok: true, result: {} };
        await server.doCheckServer();
        expect(server.connected).to.equal(1);
    });

    it('updates states only on changes and closes owned resources', () => {
        const { server, calls } = createFixture({ usediscovery: true });
        server.setState('Version', '9.2', 'Server');
        server.setState('Version', '9.2', 'Server');
        server.players.one = { ioUtil: { closeConnections: () => calls.push(['player.close']) } };
        server.closeConnections();

        expect(calls.filter(call => call[0] === 'setState' && call[1] === 'Server.Version')).to.have.length(1);
        expect(calls).to.deep.include(['io.close']);
        expect(calls).to.deep.include(['player.close']);
        expect(calls).to.deep.include(['connection.close']);
    });

    it('suppresses pending favorite work after the object database closes', async () => {
        const { server, calls } = createFixture({ usefavorites: true });
        server.delFavorites = async () => {
            throw new Error('DB closed');
        };
        server.setFavorites = async () => {
            throw new Error('DB closed');
        };

        server.ioUtil.doClose = true;
        server.doObserverFavorites();
        await Promise.resolve();
        await Promise.resolve();

        expect(calls.some(call => call[0] === 'error' && call[1].includes('DB closed'))).to.equal(false);
    });

    it('converts state values and checks object existence', async () => {
        const { server } = createFixture();
        expect(server.convertState({ type: 'string' }, 12)).to.equal('12');
        expect(server.convertState({ type: 'number' }, '12')).to.equal(12);
        expect(server.convertState({ type: 'boolean' }, true)).to.equal(true);
        expect(await server.existsObjectAsync('Players.Kitchen')).to.equal(true);
        expect(server.getFavId('favorite.1.2')).to.equal('1-2');
        expect(server.getFavId('short.1')).to.equal('short-1');
    });
});
