'use strict';

const { createLmsClient } = require('./client');
const { LmsTelnetEventClient } = require('./telnetEventClient');

/**
 * Unified LMS connection facade.
 *
 * Commands currently use JSON-RPC. Optional notifications currently use the
 * LMS CLI connection. Future WebSocket support can replace both behind this
 * facade without changing adapter server or player code.
 */
class LmsConnection {
    /**
     * @param {object} options Connection options.
     * @param {string} options.host LMS host.
     * @param {number} options.port LMS JSON-RPC port.
     * @param {string} [options.username] LMS username.
     * @param {string} [options.password] LMS password.
     * @param {boolean} [options.useTelnet] Enables LMS CLI notifications.
     * @param {number} [options.telnetPort] LMS CLI port.
     * @param {(event: { playerId: string, command: string }) => void} [options.onEvent] Notification callback.
     * @param {(message: string) => void} [options.logDebug] Debug logger.
     * @param {(options: object) => {
     * request: (playerId: string, command: unknown[], callback?: (result: object) => void) => Promise<object>,
     * requestAsync: (playerId: string, command: unknown[]) => Promise<object>, close: () => void}} [options.clientFactory]
     * Command client factory used by tests.
     * @param {new (options: object) => {start: () => void, close: () => void}} [options.telnetClientClass]
     * Telnet client class used by tests.
     */
    constructor(options) {
        const clientFactory = options.clientFactory || createLmsClient;
        this.commandClient = clientFactory(options);
        this.telnetClient = null;

        if (options.useTelnet) {
            const TelnetClient = options.telnetClientClass || LmsTelnetEventClient;
            this.telnetClient = new TelnetClient({
                host: options.host,
                port: options.telnetPort,
                username: options.username,
                password: options.password,
                onEvent: options.onEvent || (() => undefined),
                logDebug: options.logDebug,
            });
        }
    }

    /** Starts configured push-notification transports. */
    start() {
        this.telnetClient?.start();
    }

    /**
     * Delegates a command while retaining the adapter's callback contract.
     *
     * @param {string} playerId LMS player ID, or an empty string for server commands.
     * @param {unknown[]} command LMS command tokens.
     * @param {(result: object) => void} [callback] Compatibility callback.
     * @returns {Promise<object>} Pending command result.
     */
    request(playerId, command, callback) {
        return this.commandClient.request(playerId, command, callback);
    }

    /**
     * Delegates a command using the promise API.
     *
     * @param {string} playerId LMS player ID, or an empty string for server commands.
     * @param {unknown[]} command LMS command tokens.
     * @returns {Promise<object>} Pending command result.
     */
    requestAsync(playerId, command) {
        return this.commandClient.requestAsync(playerId, command);
    }

    /** Closes command and notification transports. */
    close() {
        this.telnetClient?.close();
        this.telnetClient = null;
        this.commandClient.close();
    }
}

/**
 * Creates the configured LMS connection facade.
 *
 * @param {ConstructorParameters<typeof LmsConnection>[0]} options Connection options.
 * @returns {LmsConnection} Configured connection.
 */
function createLmsConnection(options) {
    return new LmsConnection(options);
}

module.exports = { LmsConnection, createLmsConnection };
