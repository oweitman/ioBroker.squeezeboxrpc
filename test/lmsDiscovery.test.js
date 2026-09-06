'use strict';

const { expect } = require('chai');
const { createDiscoveryRequest, parseDiscoveryResponse } = require('../lib/lms/discovery');

function field(tag, value) {
    const content = Buffer.from(value);
    return Buffer.concat([Buffer.from(tag, 'ascii'), Buffer.from([content.length]), content]);
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
});
