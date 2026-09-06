'use strict';

const WebSocket = require('ws');

const DEFAULT_TIMEOUT_MS = 10_000;
const DEFAULT_RECONNECT_MS = 3_000;

/** Experimental LMS WebSocket command and notification client. */
class LmsWebSocketClient {
    /**
     * @param {object} options Client options.
     * @param {string} options.host LMS host.
     * @param {number} options.port LMS HTTP/WebSocket port.
     * @param {string} [options.username] LMS username.
     * @param {string} [options.password] LMS password.
     * @param {(event: {playerId: string, command: string, data: object}) => void} [options.onEvent]
     * Notification callback.
     * @param {(message: string) => void} [options.logDebug] Debug logger.
     * @param {number} [options.timeoutMs] Request timeout.
     * @param {number} [options.reconnectMs] Reconnect delay.
     * @param {typeof WebSocket} [options.webSocketClass] WebSocket implementation used by tests.
     */
    constructor(options) {
        this.url = new URL('/ws', `ws://${options.host}:${options.port}`);
        this.username = options.username || '';
        this.password = options.password || '';
        this.onEvent = options.onEvent || (() => undefined);
        this.logDebug = options.logDebug || (() => undefined);
        this.timeoutMs = options.timeoutMs || DEFAULT_TIMEOUT_MS;
        this.reconnectMs = options.reconnectMs || DEFAULT_RECONNECT_MS;
        this.WebSocketClass = options.webSocketClass || WebSocket;
        this.socket = null;
        this.connectPromise = null;
        this.reconnectTimer = null;
        this.nextRequestId = 1;
        this.pendingRequests = new Map();
        this.closed = false;
    }

    /** Starts connecting. Commands also connect lazily when necessary. */
    start() {
        void this.#ensureConnected().catch(error => this.logDebug(`LMS WebSocket connection failed: ${error.message}`));
    }

    /**
     * Sends an LMS command and optionally reports the result through a callback.
     *
     * @param {string} playerId LMS player ID, or an empty string for server commands.
     * @param {unknown[]} command LMS command tokens.
     * @param {(result: object) => void} [callback] Compatibility callback.
     * @returns {Promise<object>} Pending command result.
     */
    request(playerId, command, callback) {
        const promise = this.requestAsync(playerId, command);
        if (callback) {
            promise.then(callback, error => callback(this.#toLegacyError(error)));
        }
        return promise;
    }

    /**
     * Sends an LMS command over the WebSocket plugin endpoint.
     *
     * @param {string} playerId LMS player ID, or an empty string for server commands.
     * @param {unknown[]} command LMS command tokens.
     * @returns {Promise<object>} Pending command result.
     */
    async requestAsync(playerId, command) {
        if (!Array.isArray(command)) {
            throw new TypeError('LMS command must be an array');
        }
        const socket = await this.#ensureConnected();
        const id = `squeezeboxrpc.${process.pid}.${this.nextRequestId++}`;
        const params = [playerId || '', command];

        return new Promise((resolve, reject) => {
            const timeout = setTimeout(() => {
                this.pendingRequests.delete(id);
                reject(new Error('LMS WebSocket request timed out'));
            }, this.timeoutMs);
            this.pendingRequests.set(id, { resolve, reject, timeout, params });
            try {
                socket.send(JSON.stringify({ id, request: params }));
            } catch (error) {
                clearTimeout(timeout);
                this.pendingRequests.delete(id);
                reject(error);
            }
        });
    }

    /** Permanently closes this client and rejects pending commands. */
    close() {
        this.closed = true;
        if (this.reconnectTimer) {
            clearTimeout(this.reconnectTimer);
            this.reconnectTimer = null;
        }
        this.#rejectPending(new Error('LMS WebSocket client is closed'));
        const socket = this.socket;
        this.socket = null;
        this.connectPromise = null;
        if (socket && socket.readyState !== WebSocket.CLOSED) {
            socket.close();
        }
    }

    async #ensureConnected() {
        if (this.closed) {
            throw new Error('LMS WebSocket client is closed');
        }
        if (this.socket?.readyState === WebSocket.OPEN) {
            return this.socket;
        }
        if (this.connectPromise) {
            return this.connectPromise;
        }

        this.connectPromise = new Promise((resolve, reject) => {
            const headers = {};
            if (this.username && this.password) {
                headers.Authorization = `Basic ${Buffer.from(`${this.username}:${this.password}`).toString('base64')}`;
            }
            const socket = new this.WebSocketClass(this.url, { headers });
            this.socket = socket;
            let settled = false;

            socket.once('open', () => {
                settled = true;
                this.connectPromise = null;
                this.logDebug('Connected to LMS WebSocket');
                socket.send(JSON.stringify({ id: `listen.${this.nextRequestId++}`, listen: 1 }));
                resolve(socket);
            });
            socket.on('message', data => this.#handleMessage(data));
            socket.once('error', error => {
                this.logDebug(`LMS WebSocket error: ${error.message}`);
                if (!settled) {
                    settled = true;
                    this.connectPromise = null;
                    reject(error);
                }
            });
            socket.once('close', () => {
                this.logDebug('LMS WebSocket disconnected');
                if (this.socket === socket) {
                    this.socket = null;
                }
                if (!settled) {
                    settled = true;
                    this.connectPromise = null;
                    reject(new Error('LMS WebSocket closed before connecting'));
                }
                this.#rejectPending(new Error('LMS WebSocket connection closed'));
                this.#scheduleReconnect();
            });
        });
        return this.connectPromise;
    }

    #handleMessage(data) {
        let message;
        try {
            message = JSON.parse(data.toString());
        } catch (error) {
            this.logDebug(`Invalid LMS WebSocket message: ${error.message}`);
            return;
        }

        if (Array.isArray(message.event)) {
            const [playerId = '', command = [], eventData = {}] = message.event;
            this.onEvent({
                playerId: String(playerId),
                command: Array.isArray(command) ? command.map(String).join(' ') : String(command),
                data: eventData && typeof eventData === 'object' ? eventData : {},
            });
            return;
        }

        const pending = this.pendingRequests.get(message.id);
        if (!pending) {
            return;
        }
        clearTimeout(pending.timeout);
        this.pendingRequests.delete(message.id);
        if (message.error) {
            const errorMessage = message.error.message || message.error.data || String(message.error);
            pending.reject(new Error(`LMS WebSocket error: ${errorMessage}`));
            return;
        }
        if (!Object.prototype.hasOwnProperty.call(message, 'result')) {
            pending.reject(new Error('LMS WebSocket response has no result'));
            return;
        }
        pending.resolve({ ...message, params: message.params || pending.params, ok: true });
    }

    #rejectPending(error) {
        for (const pending of this.pendingRequests.values()) {
            clearTimeout(pending.timeout);
            pending.reject(error);
        }
        this.pendingRequests.clear();
    }

    #scheduleReconnect() {
        if (this.closed || this.reconnectTimer) {
            return;
        }
        this.reconnectTimer = setTimeout(() => {
            this.reconnectTimer = null;
            this.start();
        }, this.reconnectMs);
    }

    #toLegacyError(error) {
        return {
            ok: false,
            message: error instanceof Error ? error.message : String(error || 'Unknown LMS WebSocket error'),
            error,
        };
    }
}

module.exports = { LmsWebSocketClient };
