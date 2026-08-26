'use strict';

const { expect } = require('chai');
const proxyquire = require('proxyquire').noCallThru();

class IoUtilStub {
    addTranslations() {}
    logsilly() {}
    logdebug() {}
    createFolderNotExistsAsync() {
        return Promise.resolve();
    }
    createDeviceNotExistsAsync() {
        return Promise.resolve();
    }
    createObjectState(stateTemplate, level1path, level2path, callback) {
        if (callback) {
            callback();
        }
    }
    setMyTimeout() {}
}

const IoSBPlayer = proxyquire('../lib/iosbplayer', {
    './ioUtil': { ioUtil: IoUtilStub },
});

function createPlayer() {
    const writes = [];
    const adapter = {
        config: {
            outputplayerdebug: false,
            outputplayersilly: false,
            server: 'lms.local',
            port: 9000,
            useplaylist: false,
        },
        log: {
            error() {},
            info() {},
        },
        getObject(name, callback) {
            callback(null, {});
        },
        setState(name, value, ack) {
            writes.push({ name, value, ack });
        },
    };
    const server = {
        adapter,
        PlayersStatePath: 'Players',
    };
    const player = new IoSBPlayer(
        server,
        { playerid: '00:11:22:33:44:55', name: 'Living Room', connected: 1 },
        {},
    );
    return { player, writes };
}

function statusResult(player, playlistItem, full = true) {
    return {
        params: [player.playerid, ['status', full ? '0' : '-', full ? '999' : '1', full ? player.fullStatus : player.smallStatus]],
        result: {
            playlist_cur_index: 0,
            playlist_loop: [{ 'playlist index': 0, ...playlistItem }],
        },
    };
}

describe('player status state updates', () => {
    it('writes coverid artwork and track artist only once per full status', () => {
        const { player, writes } = createPlayer();
        const result = statusResult(player, { coverid: 'abc123', trackartist: 'Prince' });

        player.doPlayerUpdateStatus(result);

        expect(writes.filter(write => write.name.endsWith('.ArtworkUrl'))).to.deep.equal([
            { name: 'Players.Living_Room.ArtworkUrl', value: 'http://lms.local:9000/music/abc123/cover.jpg', ack: true },
        ]);
        expect(writes.filter(write => write.name.endsWith('.Artist'))).to.deep.equal([
            { name: 'Players.Living_Room.Artist', value: 'Prince', ack: true },
        ]);

        writes.length = 0;
        player.doPlayerUpdateStatus(result);
        expect(writes).to.deep.equal([]);
    });

    it('does not clear values omitted from a small status response', () => {
        const { player, writes } = createPlayer();
        player.doPlayerUpdateStatus(statusResult(player, { coverid: 'abc123', artist: 'Prince' }));
        writes.length = 0;

        player.doPlayerUpdateStatus(statusResult(player, { url: 'file:///music/song.mp3' }, false));

        expect(writes.some(write => write.name.endsWith('.ArtworkUrl') || write.name.endsWith('.Artist'))).to.equal(false);
    });

    it('uses artwork_url when no usable coverid exists', () => {
        const { player, writes } = createPlayer();

        player.doPlayerUpdateStatus(statusResult(player, { coverid: '-1', artwork_url: 'html/images/radio.png' }));

        expect(writes.filter(write => write.name.endsWith('.ArtworkUrl'))).to.deep.equal([
            { name: 'Players.Living_Room.ArtworkUrl', value: 'http://lms.local:9000/html/images/radio.png', ack: true },
        ]);
    });
});
