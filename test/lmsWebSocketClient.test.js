'use strict';

const { EventEmitter } = require('node:events');
const { expect } = require('chai');
const { LmsWebSocketClient } = require('../lib/lms/webSocketClient');

class FakeWebSocket extends EventEmitter {
    static instances = [];

    constructor(url, options) {
        super();
        this.url = url;
        this.options = options;
        this.readyState = 0;
        this.sent = [];
        FakeWebSocket.instances.push(this);
    }

    send(data) {
        this.sent.push(JSON.parse(data));
    }

    open() {
        this.readyState = 1;
        this.emit('open');
    }

    close() {
        this.readyState = 3;
        this.emit('close');
    }
}

describe('LMS WebSocket client', () => {
    beforeEach(() => {
        FakeWebSocket.instances = [];
    });

    it('enables notifications and resolves command responses', async () => {
        const client = new LmsWebSocketClient({
            host: 'lms.local',
            port: 9000,
            username: 'user',
            password: 'secret',
            webSocketClass: FakeWebSocket,
        });

        const resultPromise = client.requestAsync('00:11:22:33:44:55', ['status', '-', '1']);
        const socket = FakeWebSocket.instances[0];
        expect(socket.url.toString()).to.equal('ws://lms.local:9000/ws');
        expect(socket.options.headers.Authorization).to.equal(`Basic ${Buffer.from('user:secret').toString('base64')}`);
        socket.open();
        await new Promise(resolve => setImmediate(resolve));

        expect(socket.sent[0]).to.have.property('listen', 1);
        expect(socket.sent[1].request).to.deep.equal(['00:11:22:33:44:55', ['status', '-', '1']]);
        socket.emit('message', JSON.stringify({ id: socket.sent[1].id, result: { mode: 'play' } }));

        expect(await resultPromise).to.deep.include({
            result: { mode: 'play' },
            params: ['00:11:22:33:44:55', ['status', '-', '1']],
            ok: true,
        });
        client.close();
    });

    it('normalizes LMS push notifications', () => {
        const events = [];
        const client = new LmsWebSocketClient({
            host: 'lms.local',
            port: 9000,
            onEvent: event => events.push(event),
            webSocketClass: FakeWebSocket,
        });

        client.start();
        const socket = FakeWebSocket.instances[0];
        socket.open();
        socket.emit(
            'message',
            JSON.stringify({ event: ['00:11:22:33:44:55', ['playlist', 'newsong'], { title: 'New title' }] }),
        );

        expect(events).to.deep.equal([
            {
                playerId: '00:11:22:33:44:55',
                command: 'playlist newsong',
                data: { title: 'New title' },
            },
        ]);
        client.close();
    });

    it('returns protocol errors through the compatibility callback', async () => {
        const client = new LmsWebSocketClient({
            host: 'lms.local',
            port: 9000,
            webSocketClass: FakeWebSocket,
        });
        let callbackResult;
        const resultPromise = client.request('', ['serverstatus', '0', '1'], result => (callbackResult = result));
        const socket = FakeWebSocket.instances[0];
        socket.open();
        await new Promise(resolve => setImmediate(resolve));
        socket.emit('message', JSON.stringify({ id: socket.sent[1].id, error: { message: 'Bad dispatch' } }));

        let rejected = false;
        try {
            await resultPromise;
        } catch {
            rejected = true;
        }
        await Promise.resolve();
        expect(rejected).to.equal(true);
        expect(callbackResult).to.include({ ok: false, message: 'LMS WebSocket error: Bad dispatch' });
        client.close();
    });
});
