'use strict';

const { expect } = require('chai');
const { Announcement, getResultValue, validateSource } = require('../lib/announce');

function createAnnouncement({ remote = 0, mode = 'play', duration = 0.01, volumeLagQueries = 0 } = {}) {
    const commands = [];
    const values = { mode, _volume: 40, time: 12.5, remote, duration, path: 'http://example.org/announce.mp3' };
    let pendingVolume;
    let remainingVolumeLag = 0;
    const adapter = {
        namespace: 'squeezeboxrpc.0',
        config: { announceVolume: 65 },
        delay: async () => {},
        log: { debug() {}, warn() {} },
    };
    const player = {
        adapter,
        playerid: '00:11:22:33:44:55',
        playername: 'Kitchen',
        statePath: 'Players',
        currentStates: {
            'Players.Kitchen.Mode': mode,
            'Players.Kitchen.Volume': 40,
            'Players.Kitchen.Time': 12.5,
            'Players.Kitchen.Remote': remote,
            'Players.Kitchen.Url': 'file:///music/song.mp3',
            'Players.Kitchen.PlaylistCurrentIndex': 1,
            'Players.Kitchen.Playlist': JSON.stringify([
                { url: 'file:///music/first.mp3', title: 'First' },
                { url: 'file:///music/song.mp3', title: 'Song' },
            ]),
        },
        server: {
            async requestAsync(playerid, command) {
                commands.push(command);
                if (command[0] === 'mixer' && command[1] === 'volume' && command.at(-1) !== '?') {
                    pendingVolume = Number(command[2]);
                    remainingVolumeLag = volumeLagQueries;
                }
                const queryKey = command.at(-1) === '?' ? (command[0] === 'mixer' ? '_volume' : command[0]) : undefined;
                if (queryKey === '_volume' && pendingVolume !== undefined) {
                    if (remainingVolumeLag > 0) {
                        remainingVolumeLag--;
                    } else {
                        values._volume = pendingVolume;
                    }
                }
                return { ok: true, result: queryKey ? { [queryKey]: values[queryKey] } : {} };
            },
        },
    };
    return { announcement: new Announcement(player), commands };
}

function lastSetVolume(commands) {
    return commands
        .filter(command => command[0] === 'mixer' && command[1] === 'volume' && command.at(-1) !== '?')
        .at(-1);
}

describe('announcement playback', () => {
    it('accepts supported HTTP URLs and absolute paths on every platform', () => {
        expect(validateSource('https://example.org/sounds/door.mp3?token=1')).to.include({
            local: false,
            extension: '.mp3',
        });
        expect(validateSource('C:\\sounds\\door.wav')).to.include({ local: true, extension: '.wav' });
        expect(validateSource('/sounds/door.flac')).to.include({ local: true, extension: '.flac' });
        expect(validateSource('\\\\server\\share\\door.mp3')).to.include({ local: true, extension: '.mp3' });
    });

    it('rejects relative and unsupported sources', () => {
        expect(() => validateSource('sounds/door.mp3')).to.throw('absolute file path');
        expect(() => validateSource('https://example.org/door.txt')).to.throw('Unsupported');
    });

    it('extracts named and single LMS result values', () => {
        expect(getResultValue({ result: { mode: 'play' } }, 'mode')).to.equal('play');
        expect(getResultValue({ result: { arbitrary: 42 } }, 'missing')).to.equal(42);
    });

    it('plays the announcement and restores the queue and local track position', async () => {
        const { announcement, commands } = createAnnouncement();
        await announcement.play('http://example.org/announce.mp3');

        expect(commands).to.deep.include(['playlist', 'play', 'http://example.org/announce.mp3', 'Announcement', '0']);
        expect(commands).to.deep.include(['playlist', 'play', 'file:///music/first.mp3', 'First', '0']);
        expect(commands).to.deep.include(['playlist', 'add', 'file:///music/song.mp3', 'Song']);
        expect(commands).to.deep.include(['playlist', 'index', '1']);
        expect(commands).to.deep.include(['time', '12.5']);
        expect(commands).to.deep.include(['play']);
        expect(commands).to.deep.include(['mixer', 'volume', 65]);
        expect(lastSetVolume(commands)).to.deep.equal(['mixer', 'volume', 40]);
        expect(commands.some(command => command[0] === 'playlist' && command[1] === 'save')).to.equal(false);
        expect(commands.some(command => command[0] === 'playlist' && command[1] === 'resume')).to.equal(false);
        expect(commands.filter(command => command.at(-1) === '?').map(command => command[0])).not.to.include('remote');
        expect(
            commands
                .filter(command => command[0] === 'mixer' && command[1] === 'volume' && command.at(-1) !== '?')
                .map(command => command[2]),
        ).to.have.members([0, 65, 0, 40]);
    });

    it('does not seek when restoring a remote stream', async () => {
        const { announcement, commands } = createAnnouncement({ remote: 1 });
        await announcement.play('http://example.org/announce.mp3');

        expect(commands.some(command => command[0] === 'time' && command.at(-1) !== '?')).to.equal(false);
        expect(commands).to.deep.include(['play']);
    });

    it('restores volume without restarting when playback was stopped', async () => {
        const { announcement, commands } = createAnnouncement({ mode: 'stop' });
        await announcement.play('http://example.org/announce.mp3');

        expect(commands).not.to.deep.include(['play']);
        expect(lastSetVolume(commands)).to.deep.equal(['mixer', 'volume', 40]);
    });

    it('stops the announcement when there was no playlist to restore', async () => {
        const { announcement, commands } = createAnnouncement({ mode: 'stop' });
        announcement.player.currentStates['Players.Kitchen.Url'] = '';
        announcement.player.currentStates['Players.Kitchen.Playlist'] = '';
        await announcement.play('http://example.org/announce.mp3');

        expect(commands.some(command => command[0] === 'playlist' && command[1] === 'save')).to.equal(false);
        expect(commands).to.deep.include(['stop']);
    });

    it('still restores the original volume when restoring the queue fails', async () => {
        const { announcement, commands } = createAnnouncement();
        const requestAsync = announcement.player.server.requestAsync;
        announcement.player.server.requestAsync = async (playerid, command) => {
            if (command[0] === 'playlist' && command[1] === 'add') {
                commands.push(command);
                throw new Error('restore failed');
            }
            return requestAsync(playerid, command);
        };

        let error;
        try {
            await announcement.play('http://example.org/announce.mp3');
        } catch (caught) {
            error = caught;
        }

        expect(error).to.be.instanceOf(Error);
        expect(lastSetVolume(commands)).to.deep.equal(['mixer', 'volume', 40]);
    });

    it('waits until LMS confirms a delayed announcement volume change', async () => {
        const { announcement, commands } = createAnnouncement({ volumeLagQueries: 2 });

        await announcement.setVolumeAndWait(65);

        expect(commands.filter(command => command[0] === 'mixer' && command.at(-1) === '?')).to.have.length(3);
        expect(lastSetVolume(commands)).to.deep.equal(['mixer', 'volume', 65]);
    });
});
