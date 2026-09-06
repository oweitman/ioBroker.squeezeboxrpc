'use strict';

const net = require('node:net');

const PLAYER_EVENT = /^((?:[0-9A-Fa-f]{2}[:-]){5}(?:[0-9A-Fa-f]{2}))\s*(.*)$/;

/**
 * Decodes one LMS CLI response line without allowing malformed URI escapes to
 * terminate the event connection.
 *
 * @param {string} line Raw LMS CLI line.
 * @returns {string} Decoded line, or the original line when decoding fails.
 */
function decodeLine(line) {
    try {
        return decodeURIComponent(line);
    } catch {
        return line;
    }
}

/**
 * Parses one LMS CLI notification.
 *
 * @param {string} line Raw LMS CLI line.
 * @returns {{ playerId: string, command: string } | null} Parsed player event.
 */
function parsePlayerEvent(line) {
    const match = PLAYER_EVENT.exec(decodeLine(line));
    if (!match) {
        return null;
    }
    return { playerId: match[1], command: match[2].trim() };
}

/** LMS CLI notification connection used alongside the JSON-RPC client. */
class LmsTelnetEventClient {
    /**
     * @param {object} options Client options.
     * @param {string} options.host LMS host.
     * @param {number} options.port LMS CLI port.
     * @param {string} [options.username] LMS username.
     * @param {string} [options.password] LMS password.
     * @param {(event: { playerId: string, command: string }) => void} options.onEvent Event callback.
     * @param {(message: string) => void} [options.logDebug] Debug logger.
     * @param {(options: object, listener: () => void) => import('node:net').Socket} [options.socketFactory]
     * Socket factory used by tests.
     */
    constructor(options) {
        this.host = options.host;
        this.port = options.port;
        this.username = options.username || '';
        this.password = options.password || '';
        this.onEvent = options.onEvent;
        this.logDebug = options.logDebug || (() => undefined);
        this.socketFactory = options.socketFactory || net.createConnection;
        this.socket = null;
        this.receiveBuffer = '';
    }

    /** Opens the LMS CLI connection and enables notification delivery. */
    start() {
        if (this.socket) {
            return;
        }

        const socket = this.socketFactory({ host: this.host, port: this.port }, () => {
            this.logDebug('Telnet event client connected to LMS');
            if (this.username || this.password) {
                socket.write(`login ${this.username} ${this.password}\r\n`);
            }
            socket.write('listen 1\r\n');
        });
        this.socket = socket;

        socket.on('data', data => this.#handleData(data));
        socket.on('end', () => this.logDebug('Telnet event client disconnected from LMS'));
        socket.on('timeout', () => {
            this.logDebug('Telnet event client timed out, closing socket');
            socket.destroy();
        });
        socket.on('error', error => this.logDebug(`Telnet event client socket error: ${error.message}`));
        socket.on('close', hadError => {
            this.logDebug(`Telnet event client socket closed${hadError ? ' after an error' : ''}`);
            if (this.socket === socket) {
                this.socket = null;
            }
            this.receiveBuffer = '';
        });
    }

    /**
     * @param {Buffer|string} data Incoming TCP data.
     */
    #handleData(data) {
        const chunk = data.toString();
        this.logDebug(`Telnet event client received data: ${chunk}`);
        this.receiveBuffer += chunk;

        let lineEnd;
        while ((lineEnd = this.receiveBuffer.indexOf('\n')) !== -1) {
            const line = this.receiveBuffer.slice(0, lineEnd).replace(/\r$/, '');
            this.receiveBuffer = this.receiveBuffer.slice(lineEnd + 1);
            const event = parsePlayerEvent(line);
            if (event) {
                this.onEvent(event);
            }
        }
    }

    /** Ends the LMS CLI connection. Safe to call more than once. */
    close() {
        const socket = this.socket;
        this.socket = null;
        this.receiveBuffer = '';
        if (socket && !socket.destroyed) {
            socket.end();
        }
    }
}

module.exports = { LmsTelnetEventClient, parsePlayerEvent };
