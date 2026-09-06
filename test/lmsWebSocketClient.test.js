'use strict';

const { EventEmitter } = require('node:events');
const { expect } = require('chai');
const { createWebSocketUrl, LmsWebSocketClient } = require('../lib/lms/webSocketClient');

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

    it('supports an independent HTTP(S) web-server URL', () => {
        expect(createWebSocketUrl({ host: 'ignored', port: 9000, webSocketUrl: 'http://192.168.1.87/' }).href).to.equal(
            'ws://192.168.1.87/ws',
        );
        expect(createWebSocketUrl({ host: 'ignored', port: 9000, webSocketUrl: 'https://lms.local/custom' }).href).to.equal(
            'wss://lms.local/custom',
        );
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
        expect(socket.options.origin).to.equal('http://lms.local:9000');
        socket.open();
        await new Promise(resolve => setImmediate(resolve));

        expect(socket.sent[0]).to.have.property('listen', 1);
        expect(socket.sent[0].id).to.be.a('number');
        expect(socket.sent[1].request).to.deep.equal(['00:11:22:33:44:55', ['status', '-', '1']]);
        expect(socket.sent[1].id).to.be.a('number');
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

    it('paginates and combines large LMS list requests', async () => {
        const client = new LmsWebSocketClient({
            host: 'lms.local',
            port: 9000,
            webSocketClass: FakeWebSocket,
        });
        const command = ['artists', 0, 25000, 'mode:artists'];
        const resultPromise = client.requestAsync('player', command);
        const socket = FakeWebSocket.instances[0];
        socket.open();
        await new Promise(resolve => setImmediate(resolve));

        const firstRequest = socket.sent[1];
        expect(firstRequest.request[1].slice(0, 3)).to.deep.equal(['artists', 0, 100]);
        socket.emit(
            'message',
            JSON.stringify({
                id: firstRequest.id,
                result: { count: 102, artists_loop: Array.from({ length: 100 }, (_, id) => ({ id })) },
            }),
        );
        await new Promise(resolve => setImmediate(resolve));

        const secondRequest = socket.sent[2];
        expect(secondRequest.request[1].slice(0, 3)).to.deep.equal(['artists', 100, 100]);
        socket.emit(
            'message',
            JSON.stringify({
                id: secondRequest.id,
                result: { count: 102, artists_loop: [{ id: 100 }, { id: 101 }] },
            }),
        );

        const result = await resultPromise;
        expect(result.result.count).to.equal(102);
        expect(result.result.artists_loop).to.have.length(102);
        expect(result.params).to.deep.equal(['player', command]);
        client.close();
    });
});
