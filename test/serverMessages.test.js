'use strict';

const { expect } = require('chai');
const { getPlayerNames } = require('../lib/iosbserver');

describe('server SendTo messages', () => {
    it('returns all initialized player names in registration order', () => {
        const players = {
            '00:00:00:00:00:01': { playername: 'Living_room' },
            '00:00:00:00:00:02': { playername: '' },
            '00:00:00:00:00:03': { playername: 'Kitchen' },
            '00:00:00:00:00:04': undefined,
        };

        expect(getPlayerNames(players)).to.deep.equal(['Living_room', 'Kitchen']);
    });

    it('returns an empty list before players are initialized', () => {
        expect(getPlayerNames()).to.deep.equal([]);
    });
});
