'use strict';
/* eslint-disable jsdoc/require-jsdoc */

const fs = require('node:fs/promises');
const path = require('node:path');

const AUDIO_EXTENSIONS = new Set(['.aac', '.aif', '.aiff', '.flac', '.m4a', '.mp3', '.ogg', '.opus', '.wav', '.wma']);
const POLL_MS = 500;
const DURATION_TIMEOUT_MS = 10_000;
const MAX_ANNOUNCEMENT_MS = 10 * 60 * 1000;
const VOLUME_CONFIRM_INTERVAL_MS = 200;
const VOLUME_CONFIRM_ATTEMPTS = 20;
const VOLUME_RESEND_ATTEMPT = 7;
const MODE_CONFIRM_INTERVAL_MS = 200;
const MODE_CONFIRM_ATTEMPTS = 20;
const MODE_CONFIRM_STABLE_READS = 5;
const MODE_RESEND_ATTEMPT = 7;

function getResultValue(response, key) {
    if (!response?.result) {
        return undefined;
    }
    if (Object.prototype.hasOwnProperty.call(response.result, key)) {
        return response.result[key];
    }
    const values = Object.values(response.result);
    return values.length === 1 ? values[0] : undefined;
}

function validateSource(source) {
    if (typeof source !== 'string' || source.trim() === '') {
        throw new Error('Announcement source is empty');
    }
    const value = source.trim();
    let extension;
    if (/^https?:\/\//i.test(value)) {
        extension = path.extname(new URL(value).pathname).toLowerCase();
        if (!AUDIO_EXTENSIONS.has(extension)) {
            throw new Error(`Unsupported announcement file type: ${extension || 'missing extension'}`);
        }
        return { source: value, extension, local: false };
    }
    if (!path.win32.isAbsolute(value) && !path.posix.isAbsolute(value)) {
        throw new Error('Announcement source must be an absolute file path or an HTTP(S) URL');
    }
    extension = path.extname(value).toLowerCase();
    if (!AUDIO_EXTENSIONS.has(extension)) {
        throw new Error(`Unsupported announcement file type: ${extension || 'missing extension'}`);
    }
    return { source: value, extension, local: true };
}

class Announcement {
    constructor(player) {
        this.player = player;
        this.adapter = player.adapter;
        this.running = false;
        this.queue = Promise.resolve();
        this.pendingAnnouncements = 0;
        this.playbackSession = null;
    }

    start(source) {
        let validated;
        try {
            validated = validateSource(source);
        } catch (error) {
            return Promise.reject(error);
        }

        // Capture the player before any asynchronous preparation or queued playback can
        // allow LMS status updates from an announcement to replace the original state.
        this.ensurePlaybackSession();
        this.pendingAnnouncements++;
        const operation = this.queue.then(async () => {
            this.running = true;
            let temporaryFile;
            let operationError;
            try {
                const media = validated.local
                    ? await this.publishLocalFile(validated.source, validated.extension)
                    : { url: validated.source };
                temporaryFile = media.temporaryFile;
                await this.play(media.url, true);
            } catch (error) {
                operationError = error;
            } finally {
                if (temporaryFile) {
                    try {
                        await this.adapter.delFileAsync(this.adapter.namespace, temporaryFile);
                    } catch (error) {
                        this.adapter.log.warn(
                            `Could not delete temporary announcement file ${temporaryFile}: ${error.message}`,
                        );
                    }
                }
                this.pendingAnnouncements--;
                if (this.pendingAnnouncements === 0) {
                    try {
                        await this.finishPlaybackSession();
                    } catch (error) {
                        operationError ||= error;
                    }
                    this.running = false;
                }
            }
            if (operationError) {
                throw operationError;
            }
        });
        this.queue = operation.catch(() => undefined);
        return operation;
    }

    ensurePlaybackSession() {
        if (this.playbackSession) {
            return this.playbackSession;
        }
        const original = this.getPlaybackState();
        this.playbackSession = {
            original,
            wasPlaying: original.mode === 'play',
            useFadeTools: this.adapter.config.announceUseFadeTools === true,
            fadeInSeconds: this.getFadeSeconds(this.adapter.config.announceFadeInSeconds),
            announcementStarted: false,
            playbackChanged: false,
        };
        return this.playbackSession;
    }

    async publishLocalFile(source, extension) {
        const baseUrl = String(this.adapter.config.announceWebUrl || '')
            .trim()
            .replace(/\/+$/, '');
        if (!baseUrl) {
            throw new Error(
                'A web URL must be configured in the adapter config before local announcement files can be used',
            );
        }
        const temporaryFile = `announce/${Date.now()}-${Math.random().toString(16).slice(2)}${extension}`;

        const metaId = this.adapter.namespace;
        const data = await fs.readFile(source);
        await this.adapter.writeFileAsync(metaId, temporaryFile, data);
        return { temporaryFile, url: `${baseUrl}/${this.adapter.namespace}/${temporaryFile}` };
    }

    async play(url, deferRestore = false) {
        const session = this.ensurePlaybackSession();
        const { wasPlaying, useFadeTools } = session;
        const fadeOutSeconds = this.getFadeSeconds(this.adapter.config.announceFadeOutSeconds);
        const announcementVolume = Math.min(100, Math.max(0, Number(this.adapter.config.announceVolume) || 0));
        const playbackDelayMs = this.getPlaybackDelayMs(this.adapter.config.announcePlaybackDelayMs);
        let playbackError;
        try {
            if (!session.prepared && wasPlaying) {
                session.playbackChanged = true;
                if (useFadeTools) {
                    await this.request(['fadeout', 'stop', String(fadeOutSeconds)]);
                    await this.delay(fadeOutSeconds * 1000);
                } else {
                    await this.setVolumeAndWait(0);
                }
            }
            session.prepared = true;
            await this.request(['stop']);
            session.playbackChanged = true;
            await this.setVolumeAndWait(announcementVolume);
            if (playbackDelayMs > 0) {
                await this.delay(playbackDelayMs);
            }
            await this.request(['playlist', 'play', url, 'Announcement', '0']);
            session.announcementStarted = true;
            await this.waitForCompletion(url);
        } catch (error) {
            playbackError = error instanceof Error ? error : new Error(String(error || 'Unknown LMS error'));
        }

        if (!deferRestore) {
            try {
                await this.finishPlaybackSession();
            } catch (error) {
                playbackError ||= error;
            }
        }
        if (playbackError) {
            throw playbackError;
        }
    }

    async finishPlaybackSession() {
        const session = this.playbackSession;
        if (!session) {
            return;
        }
        const { original, wasPlaying, useFadeTools, fadeInSeconds, announcementStarted, playbackChanged } = session;
        let playbackError;
        try {
            if (original.playlist.length) {
                await this.setVolumeAndWait(0);
                await this.restorePlaylist(original, wasPlaying);
            } else if (announcementStarted) {
                await this.setModeAndWait('stop');
            }
        } catch (error) {
            const restoreError =
                error instanceof Error ? error : new Error(String(error || 'Unknown LMS restore error'));
            this.adapter.log.warn(`Could not restore playlist for ${this.player.playername}: ${restoreError.message}`);
            playbackError = restoreError;
        }

        if (playbackChanged) {
            try {
                if (original.playlist.length) {
                    await this.request(['playlist', 'index', String(original.index)]);
                    if (!original.remote && Number.isFinite(original.time)) {
                        await this.request(['time', String(original.time)]);
                    }
                    if (wasPlaying && useFadeTools) {
                        await this.setVolumeAndWait(original.volume);
                        await this.request(['fadein', 'play', String(fadeInSeconds)]);
                    } else if (wasPlaying) {
                        await this.setModeAndWait('play');
                    } else if (original.mode === 'pause') {
                        await this.setModeAndWait('pause');
                    } else {
                        await this.setModeAndWait('stop');
                    }
                }
            } catch (error) {
                const resumeError =
                    error instanceof Error ? error : new Error(String(error || 'Unknown LMS resume error'));
                this.adapter.log.warn(
                    `Could not resume playback for ${this.player.playername}: ${resumeError.message}`,
                );
                playbackError ||= resumeError;
            }

            try {
                if (!useFadeTools || !wasPlaying || !original.playlist.length) {
                    await this.setVolumeAndWait(original.volume);
                }
            } catch (error) {
                const volumeError =
                    error instanceof Error ? error : new Error(String(error || 'Unknown LMS volume error'));
                this.adapter.log.warn(`Could not restore volume for ${this.player.playername}: ${volumeError.message}`);
                playbackError ||= volumeError;
            }
        }
        if (this.playbackSession === session) {
            this.playbackSession = null;
        }
        if (playbackError) {
            throw playbackError;
        }
    }

    getFadeSeconds(value) {
        const seconds = Number(value);
        return Number.isFinite(seconds) && seconds > 0 ? Math.min(60, Math.max(1, Math.round(seconds))) : 2;
    }

    getPlaybackDelayMs(value) {
        const milliseconds = Number(value);
        return Number.isFinite(milliseconds) && milliseconds > 0
            ? Math.min(10_000, Math.max(0, Math.round(milliseconds)))
            : 0;
    }

    getPlaybackState() {
        const statePrefix = `${this.player.statePath}.${this.player.playername}`;
        const mode = this.player.currentStates[`${statePrefix}.Mode`];
        const volume = this.player.currentStates[`${statePrefix}.Volume`];
        const time = this.player.currentStates[`${statePrefix}.Time`];
        const remote = this.player.currentStates[`${statePrefix}.Remote`];
        const url = this.player.currentStates[`${statePrefix}.Url`];
        const playlistState = this.player.currentStates[`${statePrefix}.Playlist`];
        const index = Number(this.player.currentStates[`${statePrefix}.PlaylistCurrentIndex`]);
        let playlist = [];
        try {
            const parsed = Array.isArray(this.player.currentPlaylist)
                ? this.player.currentPlaylist
                : JSON.parse(typeof playlistState === 'string' ? playlistState : '[]');
            if (Array.isArray(parsed)) {
                playlist = parsed
                    .filter(item => item && typeof item.url === 'string' && item.url)
                    .map(item => ({
                        url: item.url,
                        title: typeof item.title === 'string' ? item.title : '',
                    }));
            }
        } catch {
            // Fall back to the currently playing URL below.
        }
        if (!playlist.length && typeof url === 'string' && url) {
            playlist = [{ url, title: '' }];
        }
        return {
            mode: String(mode || 'stop'),
            volume: Math.min(100, Math.max(0, Number(volume) || 0)),
            time: Number(time),
            remote: Number(remote) === 1,
            url: typeof url === 'string' ? url : '',
            playlist,
            index: Number.isInteger(index) && index >= 0 && index < playlist.length ? index : 0,
        };
    }

    async restorePlaylist(original, startPlayback) {
        if (startPlayback) {
            const [first, ...remaining] = original.playlist;
            await this.request(['playlist', 'play', first.url, first.title, '0']);
            for (const item of remaining) {
                await this.request(['playlist', 'add', item.url, item.title]);
            }
            return;
        }

        await this.request(['playlist', 'clear']);
        for (const item of original.playlist) {
            await this.request(['playlist', 'add', item.url, item.title]);
        }
    }

    async waitForCompletion(url) {
        const started = Date.now();
        let duration = Number.NaN;
        while (Date.now() - started < DURATION_TIMEOUT_MS) {
            duration = Number(await this.query(['duration', '?'], 'duration'));
            if (Number.isFinite(duration) && duration > 0) {
                break;
            }
            if ((await this.query(['mode', '?'], 'mode')) === 'stop') {
                return;
            }
            await this.delay(POLL_MS);
        }
        if (Number.isFinite(duration) && duration > 0) {
            const elapsed = Number(await this.query(['time', '?'], 'time')) || 0;
            await this.delay(Math.max(0, (duration - elapsed) * 1000) + POLL_MS);
            return;
        }
        while (Date.now() - started < MAX_ANNOUNCEMENT_MS) {
            const [mode, currentPath] = await Promise.all([
                this.query(['mode', '?'], 'mode'),
                this.query(['path', '?'], 'path'),
            ]);
            if (mode === 'stop' || (currentPath && currentPath !== url)) {
                return;
            }
            await this.delay(POLL_MS);
        }
        throw new Error('Announcement did not finish within 10 minutes');
    }

    async setVolumeAndWait(volume) {
        const target = Math.min(100, Math.max(0, Math.round(volume)));
        await this.request(['mixer', 'volume', target]);

        let actual = Number.NaN;
        for (let attempt = 0; attempt < VOLUME_CONFIRM_ATTEMPTS; attempt++) {
            actual = Number(await this.query(['mixer', 'volume', '?'], '_volume'));
            if (Number.isFinite(actual) && Math.abs(actual - target) < 0.5) {
                return;
            }
            if (attempt === VOLUME_RESEND_ATTEMPT) {
                await this.request(['mixer', 'volume', target]);
            }
            await this.delay(VOLUME_CONFIRM_INTERVAL_MS);
        }

        throw new Error(
            `LMS volume did not reach ${target} for player ${this.player.playername} (last value: ${Number.isFinite(actual) ? actual : 'unknown'})`,
        );
    }

    async setModeAndWait(mode) {
        const commands = {
            play: ['play'],
            pause: ['pause', '1'],
            stop: ['stop'],
        };
        const command = commands[mode];
        if (!command) {
            throw new Error(`Unsupported playback mode: ${mode}`);
        }

        await this.request(command);
        let actual = '';
        let stableReads = 0;
        for (let attempt = 0; attempt < MODE_CONFIRM_ATTEMPTS; attempt++) {
            actual = String((await this.query(['mode', '?'], 'mode')) || '');
            stableReads = actual === mode ? stableReads + 1 : 0;
            if (stableReads >= MODE_CONFIRM_STABLE_READS) {
                return;
            }
            if (attempt === MODE_RESEND_ATTEMPT) {
                await this.request(command);
            }
            await this.delay(MODE_CONFIRM_INTERVAL_MS);
        }

        throw new Error(
            `LMS mode did not remain ${mode} for player ${this.player.playername} (last value: ${actual || 'unknown'})`,
        );
    }

    async query(command, key) {
        return getResultValue(await this.request(command), key);
    }

    request(command) {
        return this.player.server.requestAsync(this.player.playerid, command);
    }

    delay(milliseconds) {
        return this.adapter.delay(milliseconds);
    }
}

module.exports = { Announcement, getResultValue, validateSource };
