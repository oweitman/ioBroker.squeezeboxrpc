'use strict';
/* eslint-disable jsdoc/require-jsdoc */

const http = require('node:http');
const https = require('node:https');

const DEFAULT_TIMEOUT_MS = 10_000;
const MAX_RESPONSE_BYTES = 16 * 1024 * 1024;

/**
 * Minimal LMS HTTP JSON-RPC client.
 *
 * The callback response intentionally keeps the shape used by the adapter
 * while the adapter call sites are migrated to promises independently.
 */
class LmsJsonRpcClient {
    constructor({ host, port, username = '', password = '', protocol = 'http:', timeoutMs = DEFAULT_TIMEOUT_MS }) {
        this.url = new URL('/jsonrpc.js', `${protocol}//${host}:${port}`);
        this.timeoutMs = timeoutMs;
        this.nextRequestId = 1;
        this.closed = false;
        this.authorization =
            username && password ? `Basic ${Buffer.from(`${username}:${password}`).toString('base64')}` : '';
        this.agent =
            this.url.protocol === 'https:'
                ? new https.Agent({ keepAlive: true, maxSockets: 8 })
                : new http.Agent({ keepAlive: true, maxSockets: 8 });
    }

    request(playerId, command, callback) {
        const promise = this.requestAsync(playerId, command);
        if (callback) {
            promise.then(callback, error => callback(this.toLegacyError(error)));
        }
        return promise;
    }

    requestAsync(playerId, command) {
        if (this.closed) {
            return Promise.reject(new Error('LMS JSON-RPC client is closed'));
        }
        if (!Array.isArray(command)) {
            return Promise.reject(new TypeError('LMS command must be an array'));
        }

        const params = [playerId || '', command];
        const payload = JSON.stringify({
            id: `squeezeboxrpc.${process.pid}.${this.nextRequestId++}`,
            method: 'slim.request',
            params,
        });

        return new Promise((resolve, reject) => {
            const transport = this.url.protocol === 'https:' ? https : http;
            const headers = {
                Accept: 'application/json',
                'Content-Type': 'application/json',
                'Content-Length': Buffer.byteLength(payload),
            };
            if (this.authorization) {
                headers.Authorization = this.authorization;
            }

            const request = transport.request(
                this.url,
                {
                    method: 'POST',
                    agent: this.agent,
                    headers,
                },
                response => {
                    const chunks = [];
                    let responseBytes = 0;

                    response.on('data', chunk => {
                        responseBytes += chunk.length;
                        if (responseBytes > MAX_RESPONSE_BYTES) {
                            request.destroy(new Error('LMS JSON-RPC response is too large'));
                            return;
                        }
                        chunks.push(chunk);
                    });
                    response.on('end', () => {
                        const statusCode = response.statusCode || 0;
                        if (statusCode < 200 || statusCode >= 300) {
                            reject(new Error(`LMS JSON-RPC HTTP status ${statusCode || 'unknown'}`));
                            return;
                        }

                        const body = Buffer.concat(chunks).toString('utf8');
                        if (!body) {
                            reject(new Error('LMS JSON-RPC returned an empty response'));
                            return;
                        }

                        let reply;
                        try {
                            reply = JSON.parse(body);
                        } catch (error) {
                            reject(new Error(`Invalid LMS JSON-RPC response: ${error.message}`, { cause: error }));
                            return;
                        }

                        if (reply.error) {
                            const message = reply.error.message || reply.error.data || String(reply.error);
                            reject(new Error(`LMS JSON-RPC error: ${message}`));
                            return;
                        }
                        if (!Object.prototype.hasOwnProperty.call(reply, 'result')) {
                            reject(new Error('LMS JSON-RPC response has no result'));
                            return;
                        }

                        resolve({ ...reply, params: reply.params || params, ok: true });
                    });
                },
            );

            request.setTimeout(this.timeoutMs, () => request.destroy(new Error('LMS JSON-RPC request timed out')));
            request.on('error', reject);
            request.end(payload);
        });
    }

    toLegacyError(error) {
        return {
            ok: false,
            message: error instanceof Error ? error.message : String(error || 'Unknown LMS JSON-RPC error'),
            error,
        };
    }

    close() {
        this.closed = true;
        this.agent.destroy();
    }
}

module.exports = { LmsJsonRpcClient };
