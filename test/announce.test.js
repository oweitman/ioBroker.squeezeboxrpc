'use strict';

const { expect } = require('chai');
const { Announcement, getResultValue, validateSource } = require('../lib/announce');

function createAnnouncement({ remote = 0, mode = 'play', duration = 0.01, volumeLagQueries = 0, config = {} } = {}) {
    const commands = [];
    const delays = [];
    const values = { mode, _volume: 40, time: 12.5, remote, duration, path: 'http://example.org/announce.mp3' };
    let pendingVolume;
    let remainingVolumeLag = 0;
    const adapter = {
        namespace: 'squeezeboxrpc.0',
        config: { announceVolume: 65, ...config },
        delay: async milliseconds => delays.push(milliseconds),
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
                if (command[0] === 'stop') {
                    values.mode = 'stop';
                } else if (command[0] === 'play' || command[0] === 'fadein') {
                    values.mode = 'play';
                } else if (command[0] === 'pause') {
                    values.mode = 'pause';
                } else if (command[0] === 'playlist' && ['play', 'index'].includes(command[1])) {
                    values.mode = 'play';
                }
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
    return { announcement: new Announcement(player), commands, delays };
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

    it('queues consecutive announcements for the same player', async () => {
        const { announcement } = createAnnouncement();
        const played = [];
        let finishFirst = () => {};
        announcement.play = async url => {
            played.push(url);
            if (played.length === 1) {
                await new Promise(resolve => (finishFirst = () => resolve(undefined)));
            }
        };

        const first = announcement.start('http://example.org/first.mp3');
        const second = announcement.start('http://example.org/second.mp3');
        await Promise.resolve();

        expect(played).to.deep.equal(['http://example.org/first.mp3']);
        expect(announcement.running).to.equal(true);
        finishFirst();
        await first;
        await second;

        expect(played).to.deep.equal(['http://example.org/first.mp3', 'http://example.org/second.mp3']);
        expect(announcement.running).to.equal(false);
    });

    it('continues the announcement queue after an earlier item fails', async () => {
        const { announcement } = createAnnouncement();
        const played = [];
        announcement.play = async url => {
            played.push(url);
            if (played.length === 1) {
                throw new Error('first failed');
            }
        };

        const first = announcement.start('http://example.org/first.mp3');
        const second = announcement.start('http://example.org/second.mp3');
        let error;
        try {
            await first;
        } catch (caught) {
            error = caught;
        }

        expect(error).to.be.instanceOf(Error).with.property('message', 'first failed');
        await second;
        expect(played).to.deep.equal(['http://example.org/first.mp3', 'http://example.org/second.mp3']);
    });

    it('treats queued announcements as one playback and FadeTools session', async () => {
        const { announcement, commands } = createAnnouncement({
            config: {
                announceUseFadeTools: true,
                announceFadeOutSeconds: 3,
                announceFadeInSeconds: 2,
            },
        });

        const first = announcement.start('http://example.org/first.mp3?ts=1');
        const second = announcement.start('http://example.org/second.mp3?ts=2');
        await first;
        await second;

        const playedUrls = commands
            .filter(command => command[0] === 'playlist' && command[1] === 'play')
            .map(command => command[2]);
        expect(playedUrls).to.deep.equal([
            'http://example.org/first.mp3?ts=1',
            'http://example.org/second.mp3?ts=2',
            'file:///music/first.mp3',
        ]);
        expect(commands.filter(command => command[0] === 'fadeout')).to.deep.equal([['fadeout', 'stop', '3']]);
        expect(commands.filter(command => command[0] === 'fadein')).to.deep.equal([['fadein', 'play', '2']]);
    });

    it('captures the original state when the first announcement is received', async () => {
        const { announcement, commands } = createAnnouncement();
        let releaseQueue;
        announcement.queue = new Promise(resolve => (releaseQueue = resolve));

        const gong = announcement.start('http://example.org/gong.mp3');

        // Simulate delayed player status updates already reporting the announcement
        // before the queued operation gets a chance to run.
        announcement.player.currentStates['Players.Kitchen.Mode'] = 'play';
        announcement.player.currentStates['Players.Kitchen.Volume'] = 65;
        announcement.player.currentStates['Players.Kitchen.Time'] = 0;
        announcement.player.currentStates['Players.Kitchen.Url'] = 'http://example.org/text.mp3';
        announcement.player.currentStates['Players.Kitchen.PlaylistCurrentIndex'] = 0;
        announcement.player.currentStates['Players.Kitchen.Playlist'] = JSON.stringify([
            { url: 'http://example.org/text.mp3', title: 'Announcement' },
        ]);

        const text = announcement.start('http://example.org/text.mp3');
        releaseQueue();
        await gong;
        await text;

        const playedUrls = commands
            .filter(command => command[0] === 'playlist' && command[1] === 'play')
            .map(command => command[2]);
        expect(playedUrls).to.deep.equal([
            'http://example.org/gong.mp3',
            'http://example.org/text.mp3',
            'file:///music/first.mp3',
        ]);
        expect(commands).to.deep.include(['playlist', 'index', '1']);
        expect(commands).to.deep.include(['time', '12.5']);
        expect(commands).to.deep.include(['play']);
        expect(lastSetVolume(commands)).to.deep.equal(['mixer', 'volume', 40]);
    });

    it('starts a new FadeTools session after the queue has become empty', async () => {
        const { announcement, commands } = createAnnouncement({
            config: { announceUseFadeTools: true },
        });

        await announcement.start('http://example.org/first.mp3');
        await announcement.start('http://example.org/second.mp3');

        expect(commands.filter(command => command[0] === 'fadeout')).to.have.length(2);
        expect(commands.filter(command => command[0] === 'fadein')).to.have.length(2);
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

    it('restores playlist position and stop mode without restarting playback', async () => {
        const { announcement, commands } = createAnnouncement({ mode: 'stop' });
        await announcement.play('http://example.org/announce.mp3');

        expect(commands).not.to.deep.include(['play']);
        expect(commands).to.deep.include(['playlist', 'index', '1']);
        expect(commands).to.deep.include(['time', '12.5']);
        expect(commands).to.deep.include(['playlist', 'clear']);
        expect(commands).to.deep.include(['playlist', 'add', 'file:///music/first.mp3', 'First']);
        expect(commands).to.deep.include(['playlist', 'add', 'file:///music/song.mp3', 'Song']);
        expect(
            commands.filter(command => command[0] === 'playlist' && command[1] === 'play').map(command => command[2]),
        ).to.deep.equal(['http://example.org/announce.mp3']);
        const finalStop = commands.findLastIndex(command => command[0] === 'stop');
        const confirmedStop = commands.findIndex(
            (command, index) => index > finalStop && command[0] === 'mode' && command[1] === '?',
        );
        const restoredVolume = commands.findLastIndex(
            command => command[0] === 'mixer' && command[1] === 'volume' && command.at(-1) !== '?',
        );
        expect(confirmedStop).to.be.greaterThan(finalStop);
        expect(restoredVolume).to.be.greaterThan(confirmedStop);
        expect(lastSetVolume(commands)).to.deep.equal(['mixer', 'volume', 40]);
    });

    it('restores playlist position and pause mode without starting playback', async () => {
        const { announcement, commands } = createAnnouncement({ mode: 'pause' });
        await announcement.play('http://example.org/announce.mp3');

        expect(commands).not.to.deep.include(['play']);
        expect(commands).to.deep.include(['playlist', 'index', '1']);
        expect(commands).to.deep.include(['time', '12.5']);
        expect(commands).to.deep.include(['playlist', 'clear']);
        expect(commands).to.deep.include(['playlist', 'add', 'file:///music/first.mp3', 'First']);
        expect(commands).to.deep.include(['playlist', 'add', 'file:///music/song.mp3', 'Song']);
        expect(
            commands.filter(command => command[0] === 'playlist' && command[1] === 'play').map(command => command[2]),
        ).to.deep.equal(['http://example.org/announce.mp3']);
        const finalPause = commands.findLastIndex(command => command[0] === 'pause' && command[1] === '1');
        const confirmedPause = commands.findIndex(
            (command, index) => index > finalPause && command[0] === 'mode' && command[1] === '?',
        );
        const restoredVolume = commands.findLastIndex(
            command => command[0] === 'mixer' && command[1] === 'volume' && command.at(-1) !== '?',
        );
        expect(confirmedPause).to.be.greaterThan(finalPause);
        expect(restoredVolume).to.be.greaterThan(confirmedPause);
        expect(
            commands.findIndex(
                (command, index) => index > confirmedPause && command[0] === 'pause' && command[1] === '1',
            ),
        ).to.equal(-1);
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

    it('waits the configured time after confirming volume and before playback', async () => {
        const { announcement, commands, delays } = createAnnouncement({
            config: { announcePlaybackDelayMs: 350 },
        });

        await announcement.play('http://example.org/announce.mp3');

        expect(delays).to.include(350);
        const volumeQuery = commands.findIndex(
            command => command[0] === 'mixer' && command[1] === 'volume' && command.at(-1) === '?',
        );
        const playback = commands.findIndex(
            command => command[0] === 'playlist' && command[1] === 'play' && command[2].includes('announce.mp3'),
        );
        expect(volumeQuery).to.be.lessThan(playback);
    });

    it('normalizes the announcement playback delay', () => {
        const { announcement } = createAnnouncement();

        expect(announcement.getPlaybackDelayMs(250.6)).to.equal(251);
        expect(announcement.getPlaybackDelayMs(-1)).to.equal(0);
        expect(announcement.getPlaybackDelayMs('invalid')).to.equal(0);
        expect(announcement.getPlaybackDelayMs(20_000)).to.equal(10_000);
    });

    it('requires the restored playback mode to remain stable', async () => {
        const { announcement, commands } = createAnnouncement();
        const replies = ['pause', 'play', 'pause', 'pause', 'pause', 'pause', 'pause'];
        announcement.player.server.requestAsync = async (playerid, command) => {
            commands.push(command);
            if (command[0] === 'mode' && command[1] === '?') {
                return { ok: true, result: { mode: replies.shift() } };
            }
            return { ok: true, result: {} };
        };

        await announcement.setModeAndWait('pause');

        expect(commands[0]).to.deep.equal(['pause', '1']);
        expect(commands.filter(command => command[0] === 'mode' && command[1] === '?')).to.have.length(7);
    });

    it('uses FadeTools only when enabled and waits for fade-out before the announcement', async () => {
        const { announcement, commands, delays } = createAnnouncement({
            config: {
                announceUseFadeTools: true,
                announceFadeOutSeconds: 3,
                announceFadeInSeconds: 2,
            },
        });

        await announcement.play('http://example.org/announce.mp3');

        const fadeOutIndex = commands.findIndex(command => command[0] === 'fadeout');
        const announcementIndex = commands.findIndex(
            command => command[0] === 'playlist' && command[1] === 'play' && command[2].includes('announce.mp3'),
        );
        expect(commands[fadeOutIndex]).to.deep.equal(['fadeout', 'stop', '3']);
        expect(delays).to.include(3000);
        expect(fadeOutIndex).to.be.lessThan(announcementIndex);
        expect(commands).to.deep.include(['fadein', 'play', '2']);
        expect(commands).not.to.deep.include(['play']);
    });

    it('does not send FadeTools commands when the option is disabled', async () => {
        const { announcement, commands } = createAnnouncement({
            config: {
                announceUseFadeTools: false,
                announceFadeOutSeconds: 3,
                announceFadeInSeconds: 2,
            },
        });

        await announcement.play('http://example.org/announce.mp3');

        expect(commands.some(command => command[0] === 'fadeout' || command[0] === 'fadein')).to.equal(false);
        expect(commands).to.deep.include(['play']);
    });

    it('normalizes FadeTools durations to whole seconds between 1 and 60', () => {
        const { announcement } = createAnnouncement();

        expect(announcement.getFadeSeconds(2.6)).to.equal(3);
        expect(announcement.getFadeSeconds(0.2)).to.equal(1);
        expect(announcement.getFadeSeconds(99)).to.equal(60);
        expect(announcement.getFadeSeconds('invalid')).to.equal(2);
    });
});
