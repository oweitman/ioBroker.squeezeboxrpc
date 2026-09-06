'use strict';

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

module.exports = { createDiscoveryRequest, parseDiscoveryResponse };
