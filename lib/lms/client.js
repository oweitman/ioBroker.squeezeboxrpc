'use strict';

const { LmsJsonRpcClient } = require('./jsonRpcClient');
const { LmsWebSocketClient } = require('./webSocketClient');

/**
 * Creates the configured LMS connection.
 *
 * Keeping transport selection in one place allows an experimental WebSocket
 * connection to be added without changing server, player or announcement code.
 *
 * @param options LMS connection options.
 * @returns The configured LMS client.
 */
function createLmsClient(options) {
    if (options.connectionType === 'websocket') {
        return new LmsWebSocketClient(options);
    }
    return new LmsJsonRpcClient(options);
}

module.exports = { createLmsClient };
