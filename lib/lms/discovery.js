'use strict';

const dgram = require('node:dgram');

const DISCOVERY_PORT = 3483;
const BROADCAST_ADDRESS = '255.255.255.255';
const SERVER_TTL_MS = 60_000;

/**
 * Parses an LMS UDP discovery response using byte lengths from the protocol.
 *
 * @param {Buffer} packet UDP response packet.
 * @param {string} address Sender address.
 * @param {number} [timestamp] Reception timestamp.
 * @returns {Record<string, string | number> | null} Parsed LMS data.
 */
function parseDiscoveryResponse(packet, address, timestamp = Date.now()) {
    if (!Buffer.isBuffer(packet) || packet.length === 0 || packet[0] !== 0x45) {
        return null;
    }

    const server = Object.create(null);
    let offset = 1;
    while (offset < packet.length) {
        if (offset + 5 > packet.length) {
            return null;
        }
        const tag = packet.toString('ascii', offset, offset + 4);
        const valueLength = packet[offset + 4];
        offset += 5;
        if (offset + valueLength > packet.length) {
            return null;
        }
        server[tag] = packet.toString('utf8', offset, offset + valueLength);
        offset += valueLength;
    }
    server.ADDRESS = address;
    server.TIMESTAMP = timestamp;
    return server;
}

/** Returns the unchanged LMS UDP discovery request. */
function createDiscoveryRequest() {
    return Buffer.from('eIPAD\0NAME\0JSON\0UUID\0VERS');
}

/** Owns LMS UDP discovery independently from ioBroker state handling. */
class LmsDiscovery {
    /**
     * @param {object} options Discovery options.
     * @param {number} options.intervalMs Broadcast interval.
     * @param {(server: Record<string, string | number>) => void | Promise<void>} options.onServer Server callback.
     * @param {(server: Record<string, string | number>) => void} options.onExpired Expiration callback.
     * @param {(error: Error) => void} options.onError Error callback.
     * @param {(message: string) => void} [options.logDebug] Debug logger.
     * @param {(callback: () => void, delay: number) => void} options.schedule Timer scheduler.
     * @param {() => void} options.cancelSchedule Timer cancellation.
     * @param {typeof dgram.createSocket} [options.socketFactory] Socket factory used by tests.
     */
    constructor(options) {
        this.intervalMs = options.intervalMs;
        this.onServer = options.onServer;
        this.onExpired = options.onExpired;
        this.onError = options.onError;
        this.logDebug = options.logDebug || (() => undefined);
        this.schedule = options.schedule;
        this.cancelSchedule = options.cancelSchedule;
        this.socketFactory = options.socketFactory || dgram.createSocket;
        this.socket = null;
        this.servers = new Map();
        this.closed = false;
    }

    /** Opens the UDP listener and schedules the first discovery broadcast. */
    start() {
        if (this.socket || this.closed) {
            return;
        }
        const socket = this.socketFactory({ type: 'udp4', reuseAddr: true });
        this.socket = socket;
        socket.on('message', (packet, remote) => {
            const server = parseDiscoveryResponse(packet, remote.address);
            if (!server) {
                return;
            }
            this.servers.set(remote.address, server);
            Promise.resolve(this.onServer(server)).catch(error => this.onError(error));
        });
        socket.on('error', error => {
            this.onError(error);
            this.#closeSocket();
        });
        socket.bind(DISCOVERY_PORT, '0.0.0.0', () => socket.setBroadcast(true));
        this.schedule(() => this.search(), 1_000);
    }

    /** Sends one broadcast, expires stale entries and schedules the next run. */
    search() {
        if (!this.socket || this.closed) {
            return;
        }
        const now = Date.now();
        for (const [address, server] of this.servers) {
            if (now - Number(server.TIMESTAMP) > SERVER_TTL_MS) {
                this.servers.delete(address);
                this.onExpired(server);
            }
        }
        this.socket.send(createDiscoveryRequest(), DISCOVERY_PORT, BROADCAST_ADDRESS, error => {
            if (error) {
                this.onError(error);
            }
        });
        this.schedule(() => this.search(), this.intervalMs);
    }

    /** Returns currently known non-expired servers. */
    getServers() {
        const now = Date.now();
        return [...this.servers.values()].filter(server => now - Number(server.TIMESTAMP) <= SERVER_TTL_MS);
    }

    /** Stops timers and closes the UDP socket. */
    close() {
        this.closed = true;
        this.cancelSchedule();
        this.#closeSocket();
        this.servers.clear();
    }

    #closeSocket() {
        const socket = this.socket;
        this.socket = null;
        if (!socket) {
            return;
        }
        try {
            socket.close();
        } catch (error) {
            this.logDebug(`LMS discovery socket close failed: ${error.message}`);
        }
    }
}

module.exports = { createDiscoveryRequest, LmsDiscovery, parseDiscoveryResponse };
