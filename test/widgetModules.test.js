'use strict';

const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');
const esbuild = require('esbuild');
const { expect } = require('chai');

const projectRoot = path.join(__dirname, '..');
const widgetSource = path.join(projectRoot, 'widgets', 'squeezeboxrpc', 'js');
const widgetNames = [
    'browser',
    'favorites',
    'players',
    'buttonplay',
    'buttonfwd',
    'buttonrew',
    'buttonrepeat',
    'buttonshuffle',
    'volumebar',
    'syncgroup',
    'playtime',
    'string',
    'playlist',
    'playlistdetail',
    'number',
    'datetime',
    'image',
];

describe('VIS widget modules', () => {
    it('includes the VIS widget entry file in the npm package', () => {
        const packageJson = JSON.parse(fs.readFileSync(path.join(projectRoot, 'package.json'), 'utf8'));

        expect(packageJson.files).to.include('widgets/*.html');
        expect(packageJson.files).to.include('widgets/!(node_modules)/**/build/*.{js,map}');
        expect(packageJson.files).to.include('widgets/vis2squeezeboxrpc/');
        expect(packageJson.files).not.to.include('widgets/!(node_modules)/**/*.{html,css,png,svg,jpg,js}');
        expect(fs.existsSync(path.join(projectRoot, 'widgets', 'squeezeboxrpc.html'))).to.equal(true);
        expect(fs.existsSync(path.join(projectRoot, 'widgets', 'vis2squeezeboxrpc', 'customWidgets.js'))).to.equal(
            true,
        );
        expect(fs.readdirSync(path.join(projectRoot, 'widgets', 'vis2squeezeboxrpc', 'assets')).length).to.be.greaterThan(
            0,
        );
    });

    it('registers the separate VIS-2 player widget set', () => {
        const ioPackage = JSON.parse(fs.readFileSync(path.join(projectRoot, 'io-package.json'), 'utf8'));
        const widgetSet = ioPackage.common.visWidgets.vis2squeezeboxrpc;

        expect(widgetSet.bundlerType).to.equal('module');
        expect(widgetSet.url).to.be.oneOf([
            'vis2squeezeboxrpc/customWidgets.js',
            'http://localhost:4173/customWidgets.js',
        ]);
        expect(widgetSet.components).to.deep.equal([
            'PlayersWidget',
            'PlayButtonWidget',
            'ForwardButtonWidget',
            'RewindButtonWidget',
            'ShuffleButtonWidget',
            'RepeatButtonWidget',
            'VolumeWidget',
            'PlaytimeWidget',
            'StringWidget',
            'NumberWidget',
            'DateTimeWidget',
            'ImageWidget',
            'SyncGroupWidget',
            'FavoritesWidget',
            'PlaylistWidget',
            'PlaylistDetailWidget',
            'BrowserWidget',
        ]);
        expect(ioPackage.common.restartAdapters).to.include('vis-2');
    });

    it('keeps every widget in its own source module', () => {
        const mainSource = fs.readFileSync(path.join(widgetSource, 'squeezeboxrpc.js'), 'utf8');

        for (const widgetName of widgetNames) {
            const modulePath = path.join(widgetSource, 'widgets', `${widgetName}.js`);
            expect(fs.existsSync(modulePath), `${widgetName}.js should exist`).to.equal(true);
            expect(fs.readFileSync(modulePath, 'utf8')).to.include(`export const ${widgetName} =`);
            expect(mainSource).to.include(`import { ${widgetName} } from './widgets/${widgetName}.js';`);
        }
    });

    it('retries DateTime updates through the DateTime widget', () => {
        const datetimeSource = fs.readFileSync(path.join(widgetSource, 'widgets', 'datetime.js'), 'utf8');
        const html = fs.readFileSync(path.join(projectRoot, 'widgets', 'squeezeboxrpc.html'), 'utf8');

        expect(datetimeSource).to.include("vis.binds['squeezeboxrpc'].datetime.setState(fdata)");
        expect(datetimeSource).not.to.include("vis.binds['squeezeboxrpc'].number.setState(fdata)");
        expect(datetimeSource).to.include('export function formatDateTime(value, factor, format)');
        expect(datetimeSource).to.include('/YYYY|YY|MM|DD|hh|mm|ss/g');
        expect(datetimeSource).not.to.include('state.format(');
        expect(html).to.include('format[hh:mm:ss]');
    });

    it('keeps the VIS-1 favorites content inside the widget bounds', () => {
        const favoritesSource = fs.readFileSync(path.join(widgetSource, 'widgets', 'favorites.js'), 'utf8');

        expect(favoritesSource).to.include("text += '    width: 100%;\\n'");
        expect(favoritesSource).to.include("text += '    height: 100%;\\n'");
        expect(favoritesSource).to.include("text += '    overflow: auto;\\n'");
    });

    it('registers the VIS-1 PlaylistDetail contract', () => {
        const html = fs.readFileSync(path.join(projectRoot, 'widgets', 'squeezeboxrpc.html'), 'utf8');
        const source = fs.readFileSync(path.join(widgetSource, 'widgets', 'playlistdetail.js'), 'utf8');

        expect(html).to.include('id="tplSqueezeboxrpcPlaylistDetail"');
        expect(html).to.include('showThumbnail[true]/checkbox');
        expect(html).to.include('showIndex[true]/checkbox');
        expect(source).to.include('.PlaylistCurrentIndex`');
        expect(source).to.include('.cmdGeneral`');
        expect(source).to.include('"playlist","delete"');
        expect(source).to.include('previousScrollTop');
        expect(source).to.include(".scrollTop(previousScrollTop)");
    });

    it('initializes Syncgroup without scheduling a recreate during initial state binding', () => {
        const syncgroupSource = fs.readFileSync(path.join(widgetSource, 'widgets', 'syncgroup.js'), 'utf8');
        const bindingCallback = syncgroupSource.slice(
            syncgroupSource.indexOf("vis.binds['squeezeboxrpc'].setPlayersChanged("),
            syncgroupSource.indexOf("vis.binds['squeezeboxrpc'].setChanged("),
        );

        expect(bindingCallback).to.include('return boundstates;');
        expect(bindingCallback.indexOf('return boundstates;')).to.be.lessThan(bindingCallback.indexOf('setTimeout'));
        expect(syncgroupSource).to.match(/syncgroupbtns[\s\S]*this\.setState\(fdata\);\s*\n\s*},\s*\n\s*onChange/);
    });

    it('maps Volume Bar clicks predictably to values between 0 and 100', async () => {
        const result = await esbuild.build({
            entryPoints: [path.join(widgetSource, 'volumeUtils.js')],
            bundle: true,
            format: 'cjs',
            target: ['node22'],
            write: false,
        });
        const module = { exports: {} };
        vm.runInNewContext(result.outputFiles[0].text, { module, exports: module.exports });
        const { calculateActiveLevels, calculateVolume } = module.exports;

        expect(calculateVolume(0, 100, 10, 'exact', false)).to.equal(0);
        expect(calculateVolume(50, 100, 10, 'exact', false)).to.equal(50);
        expect(calculateVolume(100, 100, 10, 'exact', false)).to.equal(100);
        expect(calculateVolume(100, 100, 10, 'segstep', false)).to.equal(100);
        expect(calculateVolume(25, 100, 5, 'segstep', true)).to.equal(75);
        expect(calculateVolume(50, 0, 10, 'exact', false)).to.equal(0);
        expect(calculateActiveLevels(50, 11)).to.equal(6);
    });

    it('exposes the same widget runtime contract from the real bundle', async () => {
        const result = await esbuild.build({
            entryPoints: [path.join(widgetSource, 'bundle.js')],
            bundle: true,
            format: 'iife',
            target: ['es6'],
            write: false,
        });
        const eventHandlers = [];
        const jquery = element => {
            if (element && typeof element === 'object') {
                return element;
            }
            return {
                length: element === '#volume' || element === '#players' ? 1 : 0,
                off() {
                    return this;
                },
                on(...args) {
                    if (element === '.vis-view') {
                        eventHandlers.push(args.at(-1));
                    }
                    return this;
                },
                html() {
                    return this;
                },
                trigger() {
                    return this;
                },
            };
        };
        jquery.extend = () => undefined;
        const vis = { binds: {}, states: {}, conn: {} };
        const context = {
            $: jquery,
            console: { log: () => undefined },
            fetch: async () => ({ json: async () => ({}) }),
            systemDictionary: {},
            vis,
            window: {},
            setTimeout,
            clearTimeout,
        };
        context.window = context;

        vm.runInNewContext(result.outputFiles[0].text, context);
        await Promise.resolve();

        const runtime = vis.binds.squeezeboxrpc;
        expect(runtime).to.be.an('object');
        for (const widgetName of widgetNames) {
            expect(runtime[widgetName], widgetName).to.be.an('object');
            expect(runtime[widgetName].createWidget, `${widgetName}.createWidget`).to.be.a('function');
        }

        const immediateBindings = [];
        const playerChanges = [];
        runtime.bindStates = (element, states) => immediateBindings.push({ element, states });
        const widgetElement = {};
        runtime.setPlayersChanged(
            widgetElement,
            'player-widget',
            { widgetID: 'play-button' },
            () => undefined,
            () => ['squeezeboxrpc.0.Players.living-room.state'],
            fdata => playerChanges.push(fdata.widgetID),
        );
        expect(immediateBindings).to.deep.equal([
            {
                element: widgetElement,
                states: ['squeezeboxrpc.0.Players.living-room.state'],
            },
        ]);
        expect(playerChanges).to.deep.equal([]);

        eventHandlers.at(-1)();

        expect(immediateBindings).to.have.lengthOf(2);
        expect(playerChanges).to.deep.equal(['play-button']);

        const frozenPlayerData = Object.freeze({
            ainstance: 'squeezeboxrpc.0',
            viewindex: '0',
            formattype: '',
        });
        vis.editMode = false;
        vis.views = {
            main: {
                widgets: {
                    players: { data: frozenPlayerData, style: {} },
                },
            },
        };
        const sendToRequests = [];
        runtime.sendToAsync = async (instance, command, message) => {
            sendToRequests.push({ instance, command, message });
            return ['living-room'];
        };

        await runtime.players.createWidget('players', 'main', {}, {});
        expect(sendToRequests).to.deep.equal([
            {
                instance: 'squeezeboxrpc.0',
                command: 'getPlayerNames',
                message: {},
            },
        ]);
        expect(frozenPlayerData).not.to.have.property('functionname');
        expect(runtime.viewIndexMetadata.players.functionname).to.equal('players');
        expect(runtime.viewIndexMetadata.players.viewindexcheck).to.deep.equal(['living-room']);

        const volumeUpdates = [];
        vis.editMode = false;
        vis.views = {
            main: {
                widgets: {
                    volume: {
                        data: { widgetPlayer: 'player-widget', segments: 10 },
                        style: {},
                    },
                },
            },
        };
        runtime.checkAttributes = () => ['squeezeboxrpc', '0'];
        runtime.setPlayersChanged = () => undefined;
        runtime.setChanged = () => undefined;
        runtime.volumebar.setState = fdata => volumeUpdates.push(fdata);

        runtime.volumebar.createWidget('volume', 'main', {}, {});

        expect(volumeUpdates).to.have.lengthOf(1);
        expect(volumeUpdates[0].widgetID).to.equal('volume');

        const renderedVolumes = [];
        const writtenVolumes = [];
        runtime.getPlayerName = () => 'living-room';
        runtime.volumebar.renderState = (fdata, state) => renderedVolumes.push({ fdata, state });
        vis.setValue = (stateId, state) => writtenVolumes.push({ stateId, state });
        const clickData = {
            widgetID: 'volume',
            data: {
                ainstance: ['squeezeboxrpc', '0'],
                widgetPlayer: 'player-widget',
                position: 'horizontal',
                segments: 11,
                calctype: 'exact',
                reverse: false,
            },
        };
        const volumeElement = {
            clientWidth: 200,
            clientHeight: 100,
            offset: () => ({ left: 10, top: 20 }),
        };

        runtime.volumebar.onClick.call(volumeElement, { pageX: 110, pageY: 20, data: clickData });

        expect(renderedVolumes).to.deep.equal([{ fdata: clickData, state: 50 }]);
        expect(writtenVolumes).to.deep.equal([{ stateId: 'squeezeboxrpc.0.Players.living-room.Volume', state: 50 }]);
    });

    it('subscribes even when the initial state does not exist yet', async () => {
        const result = await esbuild.build({
            entryPoints: [path.join(widgetSource, 'bundle.js')],
            bundle: true,
            format: 'iife',
            target: ['es6'],
            write: false,
        });
        const data = new Map();
        const widgetElement = {
            data(key, value) {
                if (arguments.length === 2) {
                    data.set(key, value);
                    return this;
                }
                return data.get(key);
            },
        };
        const jquery = element => (element === widgetElement ? widgetElement : { length: 0 });
        jquery.extend = () => undefined;
        const subscribed = [];
        const bound = [];
        const vis = {
            binds: {},
            states: {
                bind: (state, callback) => bound.push({ state, callback }),
                unbind: () => undefined,
            },
            conn: {
                getStates: (states, callback) => callback(null, {}),
                subscribe: states => subscribed.push(...states),
            },
            updateStates: () => undefined,
        };
        const context = {
            $: jquery,
            console: { log: () => undefined },
            fetch: async () => ({ json: async () => ({}) }),
            systemDictionary: {},
            vis,
            window: {},
            setTimeout,
            clearTimeout,
        };
        context.window = context;
        vm.runInNewContext(result.outputFiles[0].text, context);
        await Promise.resolve();

        const callback = () => undefined;
        vis.binds.squeezeboxrpc.bindStates(widgetElement, ['squeezeboxrpc.0.Players.living-room.state'], callback, {});

        expect(subscribed).to.deep.equal(['squeezeboxrpc.0.Players.living-room.state']);
        expect(bound).to.deep.equal([
            {
                state: 'squeezeboxrpc.0.Players.living-room.state.val',
                callback,
            },
        ]);
    });
});
