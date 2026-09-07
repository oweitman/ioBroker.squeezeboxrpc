'use strict';

const { EventEmitter } = require('node:events');
const { expect } = require('chai');
const { LmsTelnetEventClient, parsePlayerEvent } = require('../lib/lms/telnetEventClient');

class FakeSocket extends EventEmitter {
    constructor() {
        super();
        this.destroyed = false;
        this.writes = [];
        this.ended = false;
    }

    write(value) {
        this.writes.push(value);
    }

    end() {
        this.ended = true;
    }

    destroy() {
        this.destroyed = true;
    }
}

describe('LMS Telnet event client', () => {
    it('parses encoded player notifications', () => {
        expect(parsePlayerEvent('00:11:22:33:44:55 playlist%20newsong')).to.deep.equal({
            playerId: '00:11:22:33:44:55',
            command: 'playlist newsong',
        });
        expect(parsePlayerEvent('serverstatus 0 10')).to.equal(null);
    });

    it('logs in, enables listening and preserves split TCP lines', () => {
        const socket = new FakeSocket();
        const events = [];
        let connected = /** @type {() => void} */ (() => undefined);
        const client = new LmsTelnetEventClient({
            host: 'lms.local',
            port: 9090,
            username: 'user',
            password: 'secret',
            onEvent: event => events.push(event),
            socketFactory: (options, listener) => {
                expect(options).to.deep.equal({ host: 'lms.local', port: 9090 });
                connected = listener;
                return /** @type {import('node:net').Socket} */ (/** @type {unknown} */ (socket));
            },
        });

        client.start();
        connected();
        socket.emit('data', Buffer.from('00:11:22:33:44:55 power%'));
        socket.emit('data', Buffer.from('201\r\n00:11:22:33:44:66 client%20new\r'));
        expect(events).to.deep.equal([{ playerId: '00:11:22:33:44:55', command: 'power 1' }]);
        socket.emit('data', Buffer.from('\n'));

        expect(socket.writes).to.deep.equal(['login user secret\r\n', 'listen 1\r\n']);
        expect(events).to.deep.equal([
            { playerId: '00:11:22:33:44:55', command: 'power 1' },
            { playerId: '00:11:22:33:44:66', command: 'client new' },
        ]);
    });

    it('does not duplicate connections and closes safely', () => {
        const socket = new FakeSocket();
        let calls = 0;
        const client = new LmsTelnetEventClient({
            host: 'lms.local',
            port: 9090,
            onEvent: () => undefined,
            socketFactory: () => {
                calls++;
                return /** @type {import('node:net').Socket} */ (/** @type {unknown} */ (socket));
            },
        });

        client.start();
        client.start();
        client.close();
        client.close();

        expect(calls).to.equal(1);
        expect(socket.ended).to.equal(true);
    });

    it('destroys a timed-out socket', () => {
        const socket = new FakeSocket();
        const client = new LmsTelnetEventClient({
            host: 'lms.local',
            port: 9090,
            onEvent: () => undefined,
            socketFactory: () => /** @type {import('node:net').Socket} */ (/** @type {unknown} */ (socket)),
        });

        client.start();
        socket.emit('timeout');

        expect(socket.destroyed).to.equal(true);
    });
});
