'use strict';

const WebSocket = require('ws');

const DEFAULT_TIMEOUT_MS = 10_000;
const DEFAULT_RECONNECT_MS = 3_000;
const ERROR_LOG_INTERVAL_MS = 60_000;
const LIST_PAGE_SIZE = 100;
const PAGED_COMMANDS = new Set([
    'albums',
    'artists',
    'favorites',
    'genres',
    'menu',
    'musicfolder',
    'myapps',
    'playlists',
    'radios',
    'songs',
    'titles',
    'tracks',
    'works',
    'years',
]);

/**
 * Builds the WebSocket endpoint from an optional independent web-server URL.
 * HTTP(S) URLs are accepted for convenient configuration and converted to
 * WS(S). A root path is completed with the LMS plugin endpoint `/ws`.
 *
 * @param {object} options Client options.
 * @param {string} options.host LMS host.
 * @param {number} options.port LMS HTTP port.
 * @param {string} [options.webSocketUrl] Independent WebSocket web-server URL.
 * @returns {URL} Normalized WebSocket endpoint.
 */
function createWebSocketUrl(options) {
    let configuredUrl = options.webSocketUrl?.trim();
    if (!configuredUrl) {
        return new URL('/ws', `ws://${options.host}:${options.port}`);
    }
    if (!/^[a-z][a-z\d+.-]*:\/\//i.test(configuredUrl)) {
        configuredUrl = `ws://${configuredUrl}`;
    }
    const url = new URL(configuredUrl);
    if (url.protocol === 'http:') {
        url.protocol = 'ws:';
    } else if (url.protocol === 'https:') {
        url.protocol = 'wss:';
    } else if (url.protocol !== 'ws:' && url.protocol !== 'wss:') {
        throw new Error('LMS WebSocket URL must use HTTP(S) or WS(S)');
    }
    if (url.pathname === '/') {
        url.pathname = '/ws';
    }
    return url;
}

/** Experimental LMS WebSocket command and notification client. */
class LmsWebSocketClient {
    /**
     * @param {object} options Client options.
     * @param {string} options.host LMS host.
     * @param {number} options.port LMS HTTP/WebSocket port.
     * @param {string} [options.username] LMS username.
     * @param {string} [options.password] LMS password.
     * @param {string} [options.webSocketUrl] Independent WebSocket URL.
     * @param {(event: {playerId: string, command: string, data: object}) => void} [options.onEvent]
     * Notification callback.
     * @param {(message: string) => void} [options.logDebug] Debug logger.
     * @param {(message: string) => void} [options.logError] Error logger.
     * @param {number} [options.timeoutMs] Request timeout.
     * @param {number} [options.reconnectMs] Reconnect delay.
     * @param {typeof WebSocket} [options.webSocketClass] WebSocket implementation used by tests.
     */
    constructor(options) {
        this.url = createWebSocketUrl(options);
        this.origin = `${this.url.protocol === 'wss:' ? 'https:' : 'http:'}//${this.url.host}`;
        this.username = options.username || '';
        this.password = options.password || '';
        this.onEvent = options.onEvent || (() => undefined);
        this.logDebug = options.logDebug || (() => undefined);
        this.logError = options.logError || this.logDebug;
        this.timeoutMs = options.timeoutMs || DEFAULT_TIMEOUT_MS;
        this.reconnectMs = options.reconnectMs || DEFAULT_RECONNECT_MS;
        this.WebSocketClass = options.webSocketClass || WebSocket;
        this.socket = null;
        this.connectPromise = null;
        this.reconnectTimer = null;
        this.nextRequestId = 1;
        this.pendingRequests = new Map();
        this.closed = false;
        this.lastErrorLog = 0;
    }

    /** Starts connecting. Commands also connect lazily when necessary. */
    start() {
        void this.#ensureConnected().catch(error => this.#reportConnectionError(error));
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
        const rangeIndex = this.#findLargeRange(command);
        if (rangeIndex !== -1) {
            return this.#requestPaged(playerId, command, rangeIndex);
        }
        return this.#requestSingle(playerId, command);
    }

    async #requestSingle(playerId, command) {
        const socket = await this.#ensureConnected();
        const id = this.nextRequestId++;
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

    #findLargeRange(command) {
        if (!PAGED_COMMANDS.has(String(command[0]))) {
            return -1;
        }
        for (let index = 1; index < Math.min(command.length - 1, 4); index++) {
            const start = Number(command[index]);
            const count = Number(command[index + 1]);
            if (Number.isInteger(start) && start >= 0 && Number.isInteger(count) && count > LIST_PAGE_SIZE) {
                return index;
            }
        }
        return -1;
    }

    async #requestPaged(playerId, command, rangeIndex) {
        const originalStart = Number(command[rangeIndex]);
        const requestedCount = Number(command[rangeIndex + 1]);
        let offset = originalStart;
        let combined;
        let loopKey;

        while (offset - originalStart < requestedCount) {
            const pageCommand = [...command];
            pageCommand[rangeIndex] = offset;
            pageCommand[rangeIndex + 1] = Math.min(LIST_PAGE_SIZE, requestedCount - (offset - originalStart));
            const page = await this.#requestSingle(playerId, pageCommand);
            const pageResult = page.result;
            const currentLoopKey = Object.keys(pageResult).find(
                key => key.endsWith('_loop') && Array.isArray(pageResult[key]),
            );

            if (!combined) {
                combined = { ...page, result: { ...pageResult }, params: [playerId || '', command] };
                loopKey = currentLoopKey;
                if (loopKey) {
                    combined.result[loopKey] = [...pageResult[loopKey]];
                }
            } else if (loopKey && currentLoopKey === loopKey) {
                combined.result[loopKey].push(...pageResult[loopKey]);
            }

            const received = currentLoopKey ? pageResult[currentLoopKey].length : 0;
            offset += received;
            if (!currentLoopKey || received < pageCommand[rangeIndex + 1]) {
                break;
            }
        }
        return combined;
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
            const socket = new this.WebSocketClass(this.url, { headers, origin: this.origin });
            this.socket = socket;
            let settled = false;

            socket.once('open', () => {
                settled = true;
                this.connectPromise = null;
                this.lastErrorLog = 0;
                this.logDebug('Connected to LMS WebSocket');
                socket.send(JSON.stringify({ id: this.nextRequestId++, listen: 1 }));
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

    #reportConnectionError(error) {
        const now = Date.now();
        if (now - this.lastErrorLog >= ERROR_LOG_INTERVAL_MS) {
            this.lastErrorLog = now;
            this.logError(`LMS WebSocket connection to ${this.url.href} failed: ${error.message}`);
        }
    }

    #toLegacyError(error) {
        return {
            ok: false,
            message: error instanceof Error ? error.message : String(error || 'Unknown LMS WebSocket error'),
            error,
        };
    }
}

module.exports = { createWebSocketUrl, LmsWebSocketClient };
