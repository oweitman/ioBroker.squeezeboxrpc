'use strict';

const path = require('node:path');
const vm = require('node:vm');
const esbuild = require('esbuild');
const { expect } = require('chai');

async function loadPlayerConfigUtils() {
    const result = await esbuild.build({
        entryPoints: [path.join(__dirname, '..', 'src-widgets', 'src', 'playerConfigUtils.js')],
        bundle: true,
        format: 'cjs',
        platform: 'node',
        target: ['node22'],
        write: false,
    });
    const module = { exports: {} };
    vm.runInNewContext(result.outputFiles[0].text, { module, exports: module.exports });
    return module.exports;
}

describe('VIS-2 Players configuration', () => {
    it('normalizes adapter instance object IDs', async () => {
        const { normalizeInstance } = await loadPlayerConfigUtils();
        expect(normalizeInstance('system.adapter.squeezeboxrpc.2')).to.equal('squeezeboxrpc.2');
        expect(normalizeInstance('squeezeboxrpc.0.Players')).to.equal('squeezeboxrpc.0');
        expect(normalizeInstance('other.0')).to.equal('');
    });

    it('keeps configured order and appends newly discovered players', async () => {
        const { mergePlayerNames } = await loadPlayerConfigUtils();
        const configured = [
            { name: 'Kitchen', enabled: false, text: 'Küche', image: '' },
            { name: 'Living_room', enabled: true, text: '', image: 'living.png' },
        ];
        expect(mergePlayerNames(configured, ['Living_room', 'Office', 'Kitchen'])).to.deep.equal([
            ...configured,
            { name: 'Office', enabled: true, text: '', image: '' },
        ]);
    });

    it('does not erase saved players on an empty adapter response', async () => {
        const { mergePlayerNames } = await loadPlayerConfigUtils();
        const configured = [{ name: 'Kitchen', enabled: true, text: '', image: '' }];
        expect(mergePlayerNames(configured, [])).to.deep.equal(configured);
    });

    it('moves all player-specific settings and repairs an invisible default', async () => {
        const { movePlayer, readConfiguredPlayers, writeConfiguredPlayers } = await loadPlayerConfigUtils();
        const players = [
            { name: 'Living_room', enabled: true, text: 'Living', image: 'living.png' },
            { name: 'Kitchen', enabled: false, text: 'Kitchen', image: 'kitchen.png' },
        ];
        const moved = movePlayer(players, 1, -1);
        const data = writeConfiguredPlayers({}, moved, 'Kitchen');

        expect(data.defaultPlayer).to.equal('Living_room');
        expect(data.playerCount).to.equal(2);
        expect(readConfiguredPlayers(data)).to.deep.equal(moved);
    });
});
