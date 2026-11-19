'use strict';

const { expect } = require('chai');
const fs = require('node:fs');
const path = require('node:path');
const { COMMANDS, HELP } = require('../lib/help');

/**
 * A part of a source file
 *
 * @param {string} file - path relative to the root of the repository
 * @param {string} from - text where the part starts
 * @param {string} to - text after the part
 * @returns {string} the part
 */
function sourcePart(file, from, to) {
    const source = fs.readFileSync(path.join(__dirname, '..', file), 'utf8');
    const start = source.indexOf(from);
    const end = source.indexOf(to, start);
    expect(start, from).to.be.greaterThan(-1);
    expect(end, to).to.be.greaterThan(start);
    return source.slice(start, end);
}

/**
 * The commands of onMessage (squeezeboxrpc.js) and processMessages (lib/iosbserver.js)
 *
 * @returns {string[]} command names
 */
function answeredCommands() {
    const parts = [
        sourcePart('squeezeboxrpc.js', 'async onMessage(', 'onStateChange('),
        sourcePart('lib/iosbserver.js', 'this.processMessages = ', 'this.sendPlayerNames = '),
    ];
    return [...new Set(parts.flatMap(text => [...text.matchAll(/\.command === '([^']+)'/g)].map(m => m[1])))];
}

describe('help', () => {
    it('lists exactly the commands the adapter answers, each once', () => {
        const listed = COMMANDS.map(entry => entry.command);
        expect(new Set(listed).size).to.equal(listed.length);
        expect([...listed].sort()).to.deep.equal(answeredCommands().sort());
    });

    it('marks only cmdGeneral as write', () => {
        expect(COMMANDS.filter(entry => entry.write).map(entry => entry.command)).to.deep.equal(['cmdGeneral']);
    });

    it('names every command and every state a player or the server reacts to', () => {
        const player = sourcePart('lib/iosbplayer.js', 'this.doStateChange = ', 'this.createArtworkUrl = ');
        const server = sourcePart('lib/iosbserver.js', 'this.doServerStateChange = ', 'this.doFavoritesStateChange = ');
        const states = [...`${player}${server}`.matchAll(/idParts\[0\] == '([^']+)'/g)].map(m => m[1]);
        expect(states).to.include('Volume');
        for (const word of [
            ...COMMANDS.map(entry => entry.command).filter(command => command !== 'help'),
            ...states,
            'btnPreset_',
            'sendTo squeezeboxrpc.0',
            'How to talk to the user:',
        ]) {
            expect(HELP, word).to.include(word);
        }
    });

    it('keeps the lines short', () => {
        for (const line of HELP.split('\n')) {
            expect(line.length, line).to.be.at.most(120);
        }
    });
});
