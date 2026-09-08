// @ts-nocheck Dynamic adapter test doubles intentionally implement only the methods exercised here.
'use strict';

const { expect } = require('chai');
const { ioUtil } = require('../lib/ioUtil');

function createAdapter() {
    const calls = [];
    const adapter = {
        namespace: 'squeezeboxrpc.0',
        log: {
            silly: message => calls.push(['silly', message]),
            debug: message => calls.push(['debug', message]),
            error: message => calls.push(['error', message]),
            info: message => calls.push(['info', message]),
        },
        setObjectNotExistsAsync: async (...args) => calls.push(['setObjectNotExistsAsync', ...args]),
        getObject: (name, callback) => callback(null, adapter.existingObject),
        setObjectNotExists: (...args) => calls.push(['setObjectNotExists', ...args]),
        delObject: (...args) => {
            calls.push(['delObject', ...args]);
            return Promise.resolve();
        },
        extendObjectAsync: async (...args) => calls.push(['extendObjectAsync', ...args]),
        setState: (...args) => {
            calls.push(['setState', ...args]);
            return Promise.resolve();
        },
        getObjectListAsync: async query => ({ rows: [{ id: 'one' }, { id: 'two' }], query }),
        getStatesAsync: async name => ({ name }),
        getState: (...args) => calls.push(['getState', ...args]),
        getStateAsync: async name => ({ name }),
        setTimeout: (...args) => {
            calls.push(['setTimeout', ...args]);
            return { timer: calls.length };
        },
        clearTimeout: timer => calls.push(['clearTimeout', timer]),
        clearInterval: timer => calls.push(['clearInterval', timer]),
        delay: async ms => ms,
    };
    return { adapter, calls };
}

describe('ioUtil', () => {
    it('creates channel, state, folder and device objects with composed paths', async () => {
        const { adapter, calls } = createAdapter();
        const util = new ioUtil(adapter, false, false);
        const state = { name: 'Volume', type: 'number' };

        await util.createObjectChannelAsync({ name: 'Controls' }, 'Players', 'Kitchen');
        await util.createObjectAsync(state, 'Players', 'Kitchen');
        await util.createObjectNotExistsAsync(state, 'Players', 'Kitchen');
        await util.createFolderNotExistsAsync('Presets', 'Players', 'Kitchen');
        await util.createDeviceNotExistsAsync('Kitchen', 'Players');

        expect(calls.filter(call => call[0] === 'setObjectNotExistsAsync')).to.deep.equal([
            ['setObjectNotExistsAsync', 'Players.Kitchen.Controls', { type: 'channel', common: { name: 'Controls' }, native: {} }],
            ['setObjectNotExistsAsync', 'Players.Kitchen.Volume', { type: 'state', common: state, native: {} }],
            ['setObjectNotExistsAsync', 'Players.Kitchen.Volume', { type: 'state', common: state, native: {} }],
            ['setObjectNotExistsAsync', 'Players.Kitchen.Presets', { type: 'folder', common: { name: 'Presets' } }],
            ['setObjectNotExistsAsync', 'Players.Kitchen', { type: 'device', common: { name: 'Kitchen' }, native: {} }],
        ]);
    });

    it('supports callback object creation for missing and existing objects', () => {
        const { adapter, calls } = createAdapter();
        const util = new ioUtil(adapter, false, false);
        let callbackCount = 0;

        util.createObjectState({ name: 'Power', type: 'boolean' }, 'Players', 'Kitchen', () => callbackCount++);
        expect(calls.some(call => call[0] === 'setObjectNotExists')).to.equal(true);

        adapter.existingObject = { type: 'state' };
        util.createObjectState({ name: 'Power' }, null, null, () => callbackCount++);
        expect(callbackCount).to.equal(1);
    });

    it('delegates object and state operations with the expected paths and acknowledgements', async () => {
        const { adapter, calls } = createAdapter();
        const util = new ioUtil(adapter, false, false);
        const callback = () => undefined;

        await util.deleteObjectAsync('Old', 'Players', 'Kitchen');
        util.deleteObject('Old', 'Players', 'Kitchen', callback);
        await util.extendObjectAsync('Power', 'Players', 'Kitchen', { common: { read: true } });
        await util.setStateAsync('Power', true, 'Players', 'Kitchen');
        util.setStateNack('Command', 'play', 'Players', 'Kitchen', callback);
        util.setStateNack('Command', 'stop', 'Players', 'Kitchen');
        util.setState('Volume', 25, 'Players', 'Kitchen', callback);
        util.setState('Volume', 30, 'Players', 'Kitchen');
        util.getState('Power', 'Players', 'Kitchen', callback);
        expect(await util.getStateAsync('Power', 'Players', 'Kitchen')).to.deep.equal({ name: 'Players.Kitchen.Power' });
        expect(await util.getStates('*', 'Players', 'Kitchen')).to.deep.equal({ name: 'Players.Kitchen.*' });

        expect(calls).to.deep.include(['delObject', 'Players.Kitchen.Old', { recursive: true }]);
        expect(calls).to.deep.include(['extendObjectAsync', 'Players.Kitchen.Power', { common: { read: true } }]);
        expect(calls).to.deep.include(['setState', 'Players.Kitchen.Power', true, true]);
        expect(calls).to.deep.include(['setState', 'Players.Kitchen.Command', 'play', false, callback]);
        expect(calls).to.deep.include(['setState', 'Players.Kitchen.Command', 'stop', true]);
        expect(calls).to.deep.include(['getState', 'Players.Kitchen.Power', callback]);
    });

    it('converts object lists and delegates delays', async () => {
        const { adapter } = createAdapter();
        const util = new ioUtil(adapter, false, false);

        expect(await util.getObjects('Players')).to.deep.equal({ one: { id: 'one' }, two: { id: 'two' } });
        expect(await util.delay(17)).to.equal(17);
    });

    it('owns timers and prevents new timers after closing', () => {
        const { adapter, calls } = createAdapter();
        const util = new ioUtil(adapter, false, false);

        util.setMyTimeout('poll', () => undefined, 100, 'a', 'b');
        const firstTimer = util.observers.poll;
        util.setMyTimeout('poll', () => undefined, 200);
        util.observers.interval = { interval: true };
        util.clearInterval('interval');
        util.closeConnections();
        util.setMyTimeout('ignored', () => undefined, 1);

        expect(calls).to.deep.include(['clearTimeout', firstTimer]);
        expect(calls.some(call => call[0] === 'clearInterval')).to.equal(true);
        expect(util.observers).to.deep.equal([]);
        expect(util.doClose).to.equal(true);
        expect(calls.filter(call => call[0] === 'setTimeout')).to.have.length(2);
    });

    it('normalizes configured timer strings and rejects invalid delays', () => {
        const { adapter, calls } = createAdapter();
        const util = new ioUtil(adapter, false, false);

        util.setMyTimeout('player', () => undefined, '950');
        util.setMyTimeout('invalid', () => undefined, 'not-a-number');
        util.setMyTimeout('negative', () => undefined, -1);

        expect(calls.find(call => call[0] === 'setTimeout' && call[2] === 950)).to.exist;
        expect(calls.filter(call => call[0] === 'setTimeout')).to.have.length(1);
        expect(calls.filter(call => call[0] === 'error')).to.have.length(2);
    });

    it('logs at configured levels, adds translations and validates ranges', () => {
        const { adapter, calls } = createAdapter();
        const util = new ioUtil(adapter, true, true);
        const objects = { Power: {}, Volume: {} };

        util.logsilly('detail');
        util.logdebug('debug');
        util.logerror('error');
        util.loginfo('info');
        util.addTranslations({ getTranslatedObject: key => `translated:${key}` }, objects, 'player');

        expect(calls.slice(0, 4)).to.deep.equal([
            ['silly', 'detail'],
            ['debug', 'debug'],
            ['error', 'error'],
            ['info', 'info'],
        ]);
        expect(objects.Power.desc).to.equal('translated:player_Power');
        expect(objects.Volume.desc).to.equal('translated:player_Volume');
        expect(util.checkNumberRange('5', 1, 10, 3)).to.equal(5);
        expect(util.checkNumberRange('20', 1, 10, 3)).to.equal(3);
        expect(util.checkNumberRange('invalid', 1, 10, 3)).to.equal(3);
    });
});
