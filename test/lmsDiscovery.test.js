'use strict';

const { EventEmitter } = require('node:events');
const { expect } = require('chai');
const { createDiscoveryRequest, LmsDiscovery, parseDiscoveryResponse } = require('../lib/lms/discovery');

function field(tag, value) {
    const content = Buffer.from(value);
    return Buffer.concat([Buffer.from(tag, 'ascii'), Buffer.from([content.length]), content]);
}

class FakeSocket extends EventEmitter {
    bind(port, address, callback) {
        this.bound = { port, address };
        callback();
    }

    setBroadcast(value) {
        this.broadcast = value;
    }

    send(packet, port, address, callback) {
        this.lastSend = { packet, port, address };
        callback(null);
    }

    close() {
        this.closed = true;
    }
}

describe('LMS discovery protocol', () => {
    it('creates the compatible LMS discovery request', () => {
        expect(createDiscoveryRequest()).to.deep.equal(Buffer.from('eIPAD\0NAME\0JSON\0UUID\0VERS'));
    });

    it('parses length-prefixed discovery fields without string offsets', () => {
        const packet = Buffer.concat([
            Buffer.from('E'),
            field('NAME', 'Living LMS'),
            field('JSON', '9000'),
            field('UUID', 'server-id'),
        ]);

        expect(parseDiscoveryResponse(packet, '192.168.1.20', 1234)).to.deep.equal({
            NAME: 'Living LMS',
            JSON: '9000',
            UUID: 'server-id',
            ADDRESS: '192.168.1.20',
            TIMESTAMP: 1234,
        });
    });

    it('rejects unrelated and truncated UDP packets', () => {
        expect(parseDiscoveryResponse(Buffer.from('x'), '127.0.0.1')).to.equal(null);
        expect(parseDiscoveryResponse(Buffer.from('ENAME\x05abc'), '127.0.0.1')).to.equal(null);
    });

    it('owns broadcast scheduling, server collection and shutdown', async () => {
        const socket = new FakeSocket();
        const servers = [];
        let scheduled = /** @type {null | (() => void)} */ (null);
        const discovery = new LmsDiscovery({
            intervalMs: 30_000,
            onServer: server => {
                servers.push(server);
            },
            onExpired: () => undefined,
            onError: error => {
                throw error;
            },
            schedule: callback => {
                scheduled = callback;
            },
            cancelSchedule: () => {
                scheduled = null;
            },
            socketFactory: () =>
                /** @type {import('node:dgram').Socket} */ (/** @type {unknown} */ (socket)),
        });

        discovery.start();
        socket.emit('message', Buffer.concat([Buffer.from('E'), field('NAME', 'LMS')]), {
            address: '192.168.1.20',
        });
        await Promise.resolve();

        expect(socket.bound).to.deep.equal({ port: 3483, address: '0.0.0.0' });
        expect(socket.broadcast).to.equal(true);
        expect(discovery.getServers()).to.have.length(1);
        expect(servers).to.have.length(1);

        if (!scheduled) {
            throw new Error('Discovery search was not scheduled');
        }
        scheduled();
        if (!socket.lastSend) {
            throw new Error('Discovery request was not sent');
        }
        expect(socket.lastSend).to.deep.include({ port: 3483, address: '255.255.255.255' });
        expect(socket.lastSend.packet).to.deep.equal(createDiscoveryRequest());

        discovery.close();
        expect(socket.closed).to.equal(true);
        expect(scheduled).to.equal(null);
    });
});
