'use strict';

const path = require('node:path');
const fs = require('node:fs');
const vm = require('node:vm');
const esbuild = require('esbuild');
const { expect } = require('chai');

async function loadPlayerConfigUtils() {
    const result = await esbuild.build({
        entryPoints: [path.join(__dirname, '..', 'src-widgets', 'src', 'shared', 'playerConfigUtils.js')],
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

async function loadTranslate(hostWidget) {
    const result = await esbuild.build({
        entryPoints: [path.join(__dirname, '..', 'src-widgets', 'src', 'shared', 'translate.js')],
        bundle: true,
        format: 'cjs',
        platform: 'node',
        target: ['node22'],
        write: false,
    });
    const module = { exports: {} };
    vm.runInNewContext(result.outputFiles[0].text, {
        module,
        exports: module.exports,
        window: hostWidget ? { visRxWidget: hostWidget } : {},
    });
    return module.exports;
}

async function loadModule(file) {
    const moduleDirectories = {
        'browserUtils.js': ['widgets', 'browser'],
        'favoriteUtils.js': ['widgets', 'favorites'],
        'playButtonUtils.js': ['widgets', 'controls'],
        'playerCommandUtils.js': ['widgets', 'controls'],
        'playerModeUtils.js': ['widgets', 'controls'],
        'playerSelectionBus.js': ['shared'],
        'playerStateUtils.js': ['widgets', 'values'],
        'playerWidgetReferenceUtils.js': ['shared'],
        'playlistDetailUtils.js': ['widgets', 'playlist-detail'],
        'playlistUtils.js': ['widgets', 'playlist'],
        'syncGroupUtils.js': ['widgets', 'sync'],
        'TextImage.jsx': ['shared'],
    };
    const result = await esbuild.build({
        entryPoints: [path.join(__dirname, '..', 'src-widgets', 'src', ...(moduleDirectories[file] || []), file)],
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
    it('parses playlist responses and keeps the VIS-1 load command contract', async () => {
        const { parsePlaylists, playlistLoadCommand } = await loadModule('playlistUtils.js');
        expect(parsePlaylists({ result: { playlists_loop: [{ id: 4, playlist: 'Radio Mantras' }] } })).to.deep.equal([
            { id: '4', name: 'Radio Mantras' },
        ]);
        expect(playlistLoadCommand(4)).to.equal('"playlistcontrol","cmd:load","playlist_id:4"');
    });

    it('registers the VIS-2 playlist widget federation module', () => {
        const source = fs.readFileSync(path.join(__dirname, '..', 'src-widgets', 'vite.config.ts'), 'utf8');
        const ioPackage = JSON.parse(fs.readFileSync(path.join(__dirname, '..', 'io-package.json'), 'utf8'));
        expect(source).to.include("'./PlaylistWidget': './src/widgets/playlist/PlaylistWidget'");
        expect(ioPackage.common.visWidgets['vis2vis-squeezeboxrpc'].components).to.include('PlaylistWidget');
    });

    it('parses and formats current playlist details', async () => {
        const {
            formatPlaylistDuration,
            parsePlaylistDetail,
            playlistDeleteCommand,
            playlistDetailStateIds,
        } = await loadModule('playlistDetailUtils.js');
        const entries = parsePlaylistDetail(JSON.stringify([{
            index: 2,
            id: 27945,
            title: 'Te Amo Corazon',
            ArtworkUrl: 'http://server/cover.jpg',
            Artist: 'Prince',
            Album: '3121',
            Duration: 215.823,
        }]));
        expect(entries).to.have.length(1);
        expect(entries[0]).to.deep.equal({
            index: 2,
            id: '27945',
            title: 'Te Amo Corazon',
            artworkUrl: 'http://server/cover.jpg',
            artist: 'Prince',
            album: '3121',
            duration: 215.823,
        });
        expect(parsePlaylistDetail('invalid')).to.deep.equal([]);
        expect(formatPlaylistDuration(215.823)).to.equal('03:35');
        expect(formatPlaylistDuration(3661)).to.equal('01:01:01');
        expect(formatPlaylistDuration(360000)).to.equal('>99:59:59');
        expect(formatPlaylistDuration(undefined)).to.equal('--:--');
        expect(playlistDetailStateIds({ instance: 'squeezeboxrpc.0', player: 'Living' })).to.deep.equal({
            playlist: 'squeezeboxrpc.0.Players.Living.Playlist',
            currentIndex: 'squeezeboxrpc.0.Players.Living.PlaylistCurrentIndex',
            command: 'squeezeboxrpc.0.Players.Living.cmdGeneral',
        });
        expect(playlistDeleteCommand(2)).to.equal('"playlist","delete","2"');
    });

    it('registers the VIS-2 PlaylistDetail widget', () => {
        const source = fs.readFileSync(path.join(__dirname, '..', 'src-widgets', 'vite.config.ts'), 'utf8');
        const ioPackage = JSON.parse(fs.readFileSync(path.join(__dirname, '..', 'io-package.json'), 'utf8'));
        expect(source).to.include("'./PlaylistDetailWidget': './src/widgets/playlist-detail/PlaylistDetailWidget'");
        expect(ioPackage.common.visWidgets['vis2vis-squeezeboxrpc'].components).to.include('PlaylistDetailWidget');
    });

    it('keeps the VIS-1 playlist layout styles in VIS-2', () => {
        const source = fs.readFileSync(
            path.join(__dirname, '..', 'src-widgets', 'src', 'widgets', 'playlist', 'playlistWidget.css'),
            'utf8',
        );
        expect(source).to.include('padding-left: 0;');
        expect(source).to.include('height: 1em;');
        expect(source).to.include('margin: 5px 0;');
        expect(source).to.include('text-overflow: ellipsis;');
        expect(source).to.include('white-space: nowrap;');
    });

    it('builds VIS-1 compatible browser commands and breadcrumbs', async () => {
        const { browserActionCommand, browserBreadcrumb, browserCommand, parseBrowserActions } = await loadModule('browserUtils.js');
        const actions = parseBrowserActions(JSON.stringify({
            next: { command: ['tracks'], params: ['mode:toptracks'] },
            play: { command: ['playlistcontrol'], params: ['cmd:load', 'album_id:4'] },
        }));
        expect(browserCommand(actions.next, 'aa:bb')).to.deep.equal({
            playerid: 'aa:bb',
            cmdArray: ['tracks', 0, 200, 'mode:toptracks'],
        });
        expect(browserActionCommand(actions.play, 'aa:bb')).to.deep.equal({
            playerid: 'aa:bb',
            cmdArray: ['playlistcontrol', 'cmd:load', 'album_id:4'],
        });
        expect(browserBreadcrumb([{ title: 'Home' }, { title: 'Radio' }])).to.equal('Home / Radio');
    });

    it('registers the VIS-2 browser widget federation module', () => {
        const source = fs.readFileSync(path.join(__dirname, '..', 'src-widgets', 'vite.config.ts'), 'utf8');
        const ioPackage = JSON.parse(fs.readFileSync(path.join(__dirname, '..', 'io-package.json'), 'utf8'));
        expect(source).to.include("'./BrowserWidget': './src/widgets/browser/BrowserWidget'");
        expect(ioPackage.common.visWidgets['vis2vis-squeezeboxrpc'].components).to.include('BrowserWidget');
    });

    it('renders browser icons with the configured foreground color', () => {
        const css = fs.readFileSync(
            path.join(__dirname, '..', 'src-widgets', 'src', 'widgets', 'browser', 'browserWidget.css'),
            'utf8',
        );
        const widget = fs.readFileSync(
            path.join(__dirname, '..', 'src-widgets', 'src', 'widgets', 'browser', 'BrowserWidget.jsx'),
            'utf8',
        );
        expect(css).to.include('fill: currentColor;');
        expect(css).to.include('align-items: center;');
        expect(widget).to.include('fill="currentColor"');
        expect(widget).to.include('stroke="currentColor"');
        expect(widget).to.include('strokeWidth=".3"');
        expect(widget).to.include("viewBox = '0 0 26.458 26.458'");
    });

    it('shows the optional zero-based favorite index helper only in edit mode', () => {
        const source = fs.readFileSync(
            path.join(__dirname, '..', 'src-widgets', 'src', 'widgets', 'favorites', 'FavoritesWidget.jsx'),
            'utf8',
        );

        expect(source).to.include("name: 'editmodehelper'");
        expect(source).to.include('this.props.editMode && data.editmodehelper');
        expect(source).to.include('favorite.configurationIndex');
        expect(source).to.include('const showImage = Boolean(favorite.image) && !imageFailed;');
        expect(source).to.include('{showImage ? (');
        expect(source).to.include('title={favorite.name || favorite.id}');
    });

    it('keeps VIS-2 favorites scrollable with a narrow scrollbar', () => {
        const css = fs.readFileSync(
            path.join(__dirname, '..', 'src-widgets', 'src', 'widgets', 'favorites', 'favoritesWidget.css'),
            'utf8',
        );

        expect(css).to.include('overflow: auto;');
        expect(css).to.include('scrollbar-width: thin;');
        expect(css).to.include('.squeezeboxrpc-favorites::-webkit-scrollbar');
        expect(css).to.include('width: 6px;');
    });

    it('exports translations in the VIS-2 language dictionary format', async () => {
        const translations = (await loadModule('translations.js')).default;
        expect(translations.prefix).to.equal('squeezeboxrpc_');
        expect(translations.en).to.have.property('squeezeboxrpc_players_widget', 'Players');
        expect(translations.de).to.have.property('squeezeboxrpc_players_widget', 'Player');
        expect(Object.keys(translations).sort()).to.deep.equal([
            'de',
            'en',
            'es',
            'fr',
            'it',
            'nl',
            'pl',
            'prefix',
            'pt',
            'ru',
            'uk',
            'zh-cn',
        ]);
        expect(translations.ru).to.have.property('squeezeboxrpc_players_widget');
    });

    it('translates through the initialized VIS-2 host instead of a federated I18n copy', async () => {
        const calls = [];
        const hostWidget = {
            t(key, ...args) {
                calls.push({ receiver: this, key, args });
                return `translated:${key}:${args.join(',')}`;
            },
        };
        const { translate } = await loadTranslate(hostWidget);

        expect(translate('squeezeboxrpc_test', 'one')).to.equal('translated:squeezeboxrpc_test:one');
        expect(calls).to.have.length(1);
        expect(calls[0].receiver).to.equal(hostWidget);

        const fallback = await loadTranslate(null);
        expect(fallback.translate('Value %s', 12)).to.equal('Value 12');
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
        const { cssLength, normalizeImageSource } = await loadPlayerConfigUtils();
        expect(cssLength(5, '1px')).to.equal('5px');
        expect(cssLength('1.5em', '1px')).to.equal('1.5em');
        expect(cssLength('20%', '1px')).to.equal('20%');
        expect(cssLength('invalid', '1px')).to.equal('1px');
        expect(normalizeImageSource('/vis.0/main/image.png')).to.equal('/vis.0/main/image.png');
        expect(normalizeImageSource({ value: '/vis.0/main/image.png' })).to.equal('/vis.0/main/image.png');
        expect(normalizeImageSource({ src: 'data:image/png;base64,abc' })).to.equal('data:image/png;base64,abc');
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
        expect(formatDateTime(0, 1000, '')).to.equal('00:00:00');
    });

    it('keeps the VIS-2 update lifecycle active for player value widgets', () => {
        const source = require('node:fs').readFileSync(
            path.join(__dirname, '..', 'src-widgets', 'src', 'widgets', 'values', 'PlayerStateWidget.jsx'),
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
        expect(playtimePercent(25, 0, 1)).to.equal(0);
        expect(playtimePercent(25, undefined, 1)).to.equal(0);
    });

    it('keeps playtime state IDs available while initial values are loaded', () => {
        const source = fs.readFileSync(
            path.join(__dirname, '..', 'src-widgets', 'src', 'widgets', 'values', 'PlaytimeWidget.jsx'),
            'utf8',
        );
        expect(source.indexOf('this.playtimeIds = ids;')).to.be.lessThan(source.indexOf('getState(id)'));
        expect(source).to.include('const ids = this.playtimeIds;');
        expect(source).to.include('event.preventDefault();');
        expect(source).to.include('event.stopPropagation();');
        expect(source).to.include('this.setState({ time });');
        expect(source).not.to.include('super.componentDidUpdate(prevProps, prevState);');
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

    it('classifies sync groups and builds sync commands', async () => {
        const { syncCommand, syncGroupStatus } = await loadModule('syncGroupUtils.js');
        const states = {
            Living: { PlayerID: 'aa', SyncMaster: 'aa', SyncSlaves: 'bb' },
            Kitchen: { PlayerID: 'bb', SyncMaster: 'aa', SyncSlaves: '' },
            Office: { PlayerID: 'cc', SyncMaster: 'cc', SyncSlaves: 'dd' },
            Bedroom: { PlayerID: 'ee', SyncMaster: '', SyncSlaves: '' },
        };
        expect(syncGroupStatus(states, 'Living', 'Living')).to.equal('selected');
        expect(syncGroupStatus(states, 'Living', 'Kitchen')).to.equal('own');
        expect(syncGroupStatus(states, 'Living', 'Office')).to.equal('other');
        expect(syncGroupStatus(states, 'Living', 'Bedroom')).to.equal('none');
        expect(syncGroupStatus(states, 'Kitchen', 'Living')).to.equal('own');
        expect(syncGroupStatus(states, 'Bedroom', 'Office')).to.equal('other');
        expect(syncCommand('squeezeboxrpc.0', 'Living', 'Kitchen', states)).to.deep.equal({
            stateId: 'squeezeboxrpc.0.Players.Kitchen.cmdGeneral', value: '"sync","-"',
        });
        expect(syncCommand('squeezeboxrpc.0', 'Living', 'Bedroom', states)).to.deep.equal({
            stateId: 'squeezeboxrpc.0.Players.Living.cmdGeneral', value: '"sync","ee"',
        });
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

    it('initializes a cross-view selection from the referenced Players widget', async () => {
        const { clearPlayerSelection, subscribePlayerSelection } = await loadModule('playerSelectionBus.js');
        const received = [];
        const views = { players: { widgets: { wRemote: {
            tpl: 'tplSqueezeboxrpcPlayers2',
            data: {
                ainstance: 'squeezeboxrpc.2', playerCount: 2, defaultPlayer: 'Kitchen',
                playerName1: 'Living', playerEnabled1: true,
                playerName2: 'Kitchen', playerEnabled2: true,
            },
        } } } };
        const unsubscribe = subscribePlayerSelection('wRemote', selection => received.push(selection), views);
        unsubscribe();
        clearPlayerSelection('wRemote');

        expect(received).to.have.length(1);
        expect(received[0]).to.include({ instance: 'squeezeboxrpc.2', player: 'Kitchen' });
    });

    it('publishes player appearance changes even when the selected player stays unchanged', async () => {
        const { clearPlayerSelection, publishPlayerSelection, subscribePlayerSelection } = await loadModule('playerSelectionBus.js');
        const received = [];
        const base = { instance: 'squeezeboxrpc.0', player: 'Kitchen' };
        const unsubscribe = subscribePlayerSelection('w00002', selection => received.push(selection));
        publishPlayerSelection('w00002', { ...base, players: [{ name: 'Kitchen', text: 'Kitchen' }] });
        publishPlayerSelection('w00002', { ...base, players: [{ name: 'Kitchen', text: 'Küche' }] });
        unsubscribe();
        clearPlayerSelection('w00002');

        expect(received.map(selection => selection?.players?.[0]?.text)).to.deep.equal([undefined, 'Kitchen', 'Küche']);
    });

    it('lists and resolves Players widgets across VIS-2 views', async () => {
        const { configuredPlayerSelection, decodePlayerWidgetReference, encodePlayerWidgetReference, findPlayersWidgets } =
            await loadModule('playerWidgetReferenceUtils.js');
        const views = {
            main: {
                widgets: {
                    w2: { tpl: 'tplSqueezeboxrpcPlayers2', data: {
                        name: 'Living players', ainstance: 'squeezeboxrpc.1', playerCount: 1,
                        playerName1: 'Living', playerEnabled1: true, defaultPlayer: 'Living',
                    } },
                    w3: { tpl: 'tplSqueezeboxrpcPlay2', data: {} },
                },
            },
            audio: { widgets: {
                w1: { tpl: 'tplSqueezeboxrpcPlayers2', data: { ainstance: 'squeezeboxrpc.0' } },
            } },
        };
        expect(findPlayersWidgets(views).map(widget => ({
            id: widget.id, view: widget.view, instance: widget.instance, name: widget.name,
        }))).to.deep.equal([
            { id: 'w1', view: 'audio', instance: 'squeezeboxrpc.0', name: 'w1' },
            { id: 'w2', view: 'main', instance: 'squeezeboxrpc.1', name: 'Living players' },
        ]);
        expect(configuredPlayerSelection(views, 'w2')).to.include({ instance: 'squeezeboxrpc.1', player: 'Living' });
        expect(encodePlayerWidgetReference('w1')).to.equal('squeezeboxrpc-player:w1');
        expect(decodePlayerWidgetReference('squeezeboxrpc-player:w1')).to.equal('w1');
        expect(decodePlayerWidgetReference('w1')).to.equal('w1');
    });

    it('parses, filters, orders and hides favorites by their stable IDs', async () => {
        const {
            mergeFavorites,
            moveFavorite,
            parseFavorites,
            readConfiguredFavorites,
            writeConfiguredFavorites,
        } = await loadModule('favoriteUtils.js');
        const states = {
            'squeezeboxrpc.0.Favorites.0.id': { val: 'Radio Paradise' },
            'squeezeboxrpc.0.Favorites.0.Name': { val: 'Radio Paradise Main Mix' },
            'squeezeboxrpc.0.Favorites.0.image': { val: 'radio.png' },
            'squeezeboxrpc.0.Favorites.0.isaudio': { val: 1 },
            'squeezeboxrpc.0.Favorites.1.id': { val: 'Folder' },
            'squeezeboxrpc.0.Favorites.1.isaudio': { val: 0 },
            'squeezeboxrpc.0.Favorites.2.id': { val: 'News' },
            'squeezeboxrpc.0.Favorites.2.isaudio': { val: '1' },
        };
        const discovered = parseFavorites(states, 'squeezeboxrpc.0');
        expect(discovered).to.deep.equal([
            { id: 'Radio Paradise', name: 'Radio Paradise Main Mix', image: 'radio.png' },
            { id: 'News', name: '', image: '' },
        ]);
        const saved = writeConfiguredFavorites({}, [
            { id: 'News', enabled: false, text: 'Nachrichten', image: 'news.png' },
            { id: 'Radio Paradise', enabled: true, text: '', image: '' },
        ]);
        const configured = readConfiguredFavorites(saved);
        expect(saved.favoriteId0).to.equal('News');
        expect(saved.favoriteLastIndex).to.equal(1);
        expect(saved.buttonsText1).to.equal('');
        expect(mergeFavorites(configured, discovered).map(favorite => favorite.id)).to.deep.equal([
            'News',
            'Radio Paradise',
        ]);
        expect(moveFavorite(configured, 0, 1).map(favorite => favorite.id)).to.deep.equal([
            'Radio Paradise',
            'News',
        ]);
        expect(configured[0].enabled).to.equal(false);
        const merged = mergeFavorites(configured, discovered);
        expect(merged[1].name).to.equal('Radio Paradise Main Mix');
        expect(merged[1].text).to.equal('Radio Paradise Main Mix');
        expect(merged[1].image).to.equal('radio.png');

        const legacyConfigured = readConfiguredFavorites({
            favoriteCount: 1,
            favoriteId1: 'Legacy',
            buttonsText1: 'Legacy name',
        });
        expect(legacyConfigured[0]).to.include({ id: 'Legacy', text: 'Legacy name' });
    });
});
