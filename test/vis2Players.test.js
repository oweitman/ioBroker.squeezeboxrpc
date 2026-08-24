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

async function loadModule(file) {
    const result = await esbuild.build({
        entryPoints: [path.join(__dirname, '..', 'src-widgets', 'src', file)],
        bundle: true,
        format: 'cjs',
        platform: 'node',
        target: ['node22'],
        write: false,
        external: ['react', '@iobroker/adapter-react-v5'],
    });
    const module = { exports: {} };
    vm.runInNewContext(result.outputFiles[0].text, { module, exports: module.exports, require });
    return module.exports;
}

describe('VIS-2 Players configuration', () => {
    it('exports translations in the VIS-2 language dictionary format', async () => {
        const translations = (await loadModule('translations.js')).default;
        expect(translations.prefix).to.equal('squeezeboxrpc_');
        expect(translations.en).to.have.property('squeezeboxrpc_players_widget', 'Players');
        expect(translations.de).to.have.property('squeezeboxrpc_players_widget', 'Player');
        expect(translations.ru).to.equal(translations.en);
    });

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

    it('extracts only squeezeboxrpc instance IDs', async () => {
        const { instanceId } = await loadPlayerConfigUtils();
        expect(instanceId({ _id: 'system.adapter.squeezeboxrpc.3' })).to.equal('squeezeboxrpc.3');
        expect(instanceId({ _id: 'system.adapter.other.0' })).to.equal('');
    });

    it('wraps CamelCase labels for the text canvas', async () => {
        const { wrapText } = await loadModule('TextImage.jsx');
        const context = { measureText: text => ({ width: text.length * 10 }) };
        expect(wrapText(context, 'LivingRoom', 60, true)).to.deep.equal(['Living', 'Room']);
        expect(wrapText(context, 'LivingRoom', 200, false)).to.deep.equal(['LivingRoom']);
    });

    it('normalizes numeric and relative CSS lengths', async () => {
        const { cssLength } = await loadPlayerConfigUtils();
        expect(cssLength(5, '1px')).to.equal('5px');
        expect(cssLength('1.5em', '1px')).to.equal('1.5em');
        expect(cssLength('20%', '1px')).to.equal('20%');
        expect(cssLength('invalid', '1px')).to.equal('1px');
    });

    it('selects the default player after an adapter instance change', async () => {
        const { selectPlayerAfterLoad } = await loadPlayerConfigUtils();
        const available = [{ name: 'Kitchen' }, { name: 'Living' }];
        expect(selectPlayerAfterLoad(available, 'Kitchen', 'Living', false)).to.equal('Kitchen');
        expect(selectPlayerAfterLoad(available, 'Kitchen', 'Living', true)).to.equal('Living');
    });

    it('builds and validates the selected player state ID', async () => {
        const { normalizePlaybackState, playerStateId } = await loadModule('playButtonUtils.js');
        expect(playerStateId({ version: 1, instance: 'squeezeboxrpc.2', player: 'Living_room' }))
            .to.equal('squeezeboxrpc.2.Players.Living_room.state');
        expect(playerStateId({ instance: '', player: 'Living_room' })).to.equal('');
        expect(normalizePlaybackState(0)).to.equal(0);
        expect(normalizePlaybackState('1')).to.equal(1);
        expect(normalizePlaybackState(undefined)).to.equal(2);
        expect(normalizePlaybackState(99)).to.equal(2);
    });

    it('builds forward and rewind command state IDs', async () => {
        const { playerCommandStateId } = await loadModule('playerCommandUtils.js');
        const selection = { version: 1, instance: 'squeezeboxrpc.2', player: 'Living_room' };

        expect(playerCommandStateId(selection, 'forward'))
            .to.equal('squeezeboxrpc.2.Players.Living_room.btnForward');
        expect(playerCommandStateId(selection, 'rewind'))
            .to.equal('squeezeboxrpc.2.Players.Living_room.btnRewind');
        expect(playerCommandStateId(selection, 'unknown')).to.equal('');
        expect(playerCommandStateId({ instance: '', player: 'Living_room' }, 'forward')).to.equal('');
    });

    it('builds and cycles shuffle and repeat mode states', async () => {
        const { nextModeState, normalizeModeState, playerModeStateId } = await loadModule('playerModeUtils.js');
        const selection = { version: 1, instance: 'squeezeboxrpc.2', player: 'Living_room' };

        expect(playerModeStateId(selection, 'shuffle'))
            .to.equal('squeezeboxrpc.2.Players.Living_room.PlaylistShuffle');
        expect(playerModeStateId(selection, 'repeat'))
            .to.equal('squeezeboxrpc.2.Players.Living_room.PlaylistRepeat');
        expect(playerModeStateId(selection, 'unknown')).to.equal('');
        expect(normalizeModeState(undefined)).to.equal(0);
        expect(normalizeModeState('2')).to.equal(2);
        expect(nextModeState(0)).to.equal(1);
        expect(nextModeState(1)).to.equal(2);
        expect(nextModeState(2)).to.equal(0);
    });

    it('builds player attribute IDs and formats value widgets', async () => {
        const { formatDateTime, formatNumber, playerAttributeStateId } = await loadModule('playerStateUtils.js');
        const selection = { instance: 'squeezeboxrpc.1', player: 'Kitchen' };

        expect(playerAttributeStateId(selection, 'Title')).to.equal('squeezeboxrpc.1.Players.Kitchen.Title');
        expect(playerAttributeStateId(selection, 'not-an-attribute')).to.equal('');
        expect(formatNumber(1234.5, 2, true, false)).to.equal('1,234.50');
        expect(formatNumber(1234.5, 2, true, true)).to.equal('1.234,50');
        expect(formatNumber(undefined, '', false, false)).to.equal('0');
        expect(formatDateTime(0, 1000, 'DD.MM.YYYY hh:mm:ss')).to.equal('01.01.1970 00:00:00');
    });

    it('keeps the VIS-2 update lifecycle active for player value widgets', () => {
        const source = require('node:fs').readFileSync(
            path.join(__dirname, '..', 'src-widgets', 'src', 'PlayerStateWidget.jsx'),
            'utf8',
        );

        expect(source).to.match(/playerAttributeField\s*=\s*{[\s\S]*?noTranslation:\s*true/);
        expect(source).to.match(
            /componentDidUpdate\(prevProps, prevState\)\s*{\s*super\.componentDidUpdate\(prevProps, prevState\);/,
        );
    });

    it('calculates volume and playtime values within their valid range', async () => {
        const { activeVolumeSegments, playtimePercent, volumeFromPointer } = await loadModule('playerStateUtils.js');

        expect(volumeFromPointer(50, 100, 11, 'exact', false)).to.equal(50);
        expect(volumeFromPointer(25, 100, 5, 'segstep', true)).to.equal(75);
        expect(activeVolumeSegments(50, 11)).to.equal(6);
        expect(playtimePercent(25, 100, 1)).to.equal(25);
        expect(playtimePercent(25, 100, 2)).to.equal(0);
        expect(playtimePercent(120, 100, 1)).to.equal(100);
    });

    it('builds all playtime state IDs from the selected player', async () => {
        const { playtimeStateIds } = await loadModule('playerStateUtils.js');
        expect(playtimeStateIds({ instance: 'squeezeboxrpc.0', player: 'Living' })).to.deep.equal({
            duration: 'squeezeboxrpc.0.Players.Living.Duration',
            time: 'squeezeboxrpc.0.Players.Living.Time',
            playback: 'squeezeboxrpc.0.Players.Living.state',
            goTime: 'squeezeboxrpc.0.Players.Living.cmdGoTime',
        });
        expect(playtimeStateIds({ instance: '', player: 'Living' })).to.equal(null);
    });

    it('delivers the current player selection independent of mount order', async () => {
        const { clearPlayerSelection, publishPlayerSelection, subscribePlayerSelection } = await loadModule('playerSelectionBus.js');
        const received = [];
        publishPlayerSelection('w00001', { instance: 'squeezeboxrpc.0', player: 'Kitchen' });
        const unsubscribe = subscribePlayerSelection('w00001', selection => received.push(selection));
        publishPlayerSelection('w00001', { instance: 'squeezeboxrpc.0', player: 'Living' });
        unsubscribe();
        clearPlayerSelection('w00001');

        expect(received.map(selection => selection?.player)).to.deep.equal(['Kitchen', 'Living']);
    });

    it('lists Players widgets without creating a VIS-2 widget ownership relation', async () => {
        const { decodePlayerWidgetReference, encodePlayerWidgetReference, findPlayersWidgets } =
            await loadModule('playerWidgetReferenceUtils.js');
        const views = {
            main: {
                widgets: {
                    w2: { tpl: 'tplSqueezeboxrpcPlayers2', data: { name: 'Living players' } },
                    w1: { tpl: 'tplSqueezeboxrpcPlayers2', data: {} },
                    w3: { tpl: 'tplSqueezeboxrpcPlay2', data: {} },
                },
            },
        };
        expect(findPlayersWidgets(views, 'main')).to.deep.equal([
            { id: 'w2', label: 'Living players' },
            { id: 'w1', label: 'w1' },
        ]);
        expect(encodePlayerWidgetReference('w1')).to.equal('squeezeboxrpc-player:w1');
        expect(decodePlayerWidgetReference('squeezeboxrpc-player:w1')).to.equal('w1');
        expect(decodePlayerWidgetReference('w1')).to.equal('w1');
    });
});
