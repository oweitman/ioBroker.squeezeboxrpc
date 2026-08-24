import { normalizeInstance } from '../../shared/playerConfigUtils';

export const PLAYER_ATTRIBUTES = [
    'Playername',
    'PlayerID',
    'Connected',
    'IP',
    'Power',
    'Mode',
    'Time',
    'Rate',
    'SyncSlaves',
    'SyncMaster',
    'Volume',
    'PlaylistRepeat',
    'PlaylistShuffle',
    'Remote',
    'Playlist',
    'PlaylistCurrentIndex',
    'state',
    'Duration',
    'Bitrate',
    'Album',
    'ArtworkUrl',
    'Genre',
    'Type',
    'Title',
    'Artist',
    'Albumartist',
    'Trackartist',
    'Band',
    'Url',
    'RadioName',
];

export function playerAttributeStateId(selection, attribute) {
    const instance = normalizeInstance(selection?.instance);
    const player = String(selection?.player || '').trim();
    const normalizedAttribute = String(attribute || '').trim();
    return instance && player && PLAYER_ATTRIBUTES.includes(normalizedAttribute)
        ? `${instance}.Players.${player}.${normalizedAttribute}`
        : '';
}

export function playtimeStateIds(selection) {
    const instance = normalizeInstance(selection?.instance);
    const player = String(selection?.player || '').trim();
    if (!instance || !player) {
        return null;
    }
    const base = `${instance}.Players.${player}`;
    return {
        duration: `${base}.Duration`,
        time: `${base}.Time`,
        playback: `${base}.state`,
        goTime: `${base}.cmdGoTime`,
    };
}

export function formatNumber(value, digits, thousandsSeparator, decimalComma) {
    let number = Number.parseFloat(value);
    if (!Number.isFinite(number)) {
        number = 0;
    }
    let result =
        digits !== undefined && digits !== ''
            ? number.toFixed(Math.max(0, Number.parseInt(digits, 10) || 0))
            : String(number);
    if (thousandsSeparator) {
        const parts = result.split('.');
        parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ',');
        result = parts.join('.');
    }
    if (decimalComma) {
        result = result
            .split('.')
            .map(part => part.replace(/,/g, '.'))
            .join(',');
    }
    return result;
}

export function formatDateTime(value, factor, format) {
    const numericValue = Number(value);
    if (!Number.isFinite(numericValue)) {
        return '';
    }
    const multiplier = factor !== undefined && factor !== '' ? Number(factor) : 1;
    const offset = 60_000 * new Date(0).getTimezoneOffset();
    const date = new Date(numericValue * (Number.isFinite(multiplier) ? multiplier : 1) + offset);
    if (Number.isNaN(date.getTime())) {
        return '';
    }
    const pad = number => String(number).padStart(2, '0');
    const replacements = {
        YYYY: String(date.getFullYear()),
        YY: String(date.getFullYear()).slice(-2),
        MM: pad(date.getMonth() + 1),
        DD: pad(date.getDate()),
        hh: pad(date.getHours()),
        mm: pad(date.getMinutes()),
        ss: pad(date.getSeconds()),
    };
    return String(format || 'DD.MM.YYYY hh:mm:ss').replace(/YYYY|YY|MM|DD|hh|mm|ss/g, token => replacements[token]);
}

export function volumeFromPointer(position, size, segments, calculation, reverse) {
    const safeSize = Number(size);
    const safeSegments = Math.max(2, Number.parseInt(segments, 10) || 2);
    if (!Number.isFinite(safeSize) || safeSize <= 0) {
        return 0;
    }
    let safePosition = Math.min(Math.max(Number(position) || 0, 0), safeSize);
    if (reverse) {
        safePosition = safeSize - safePosition;
    }
    if (calculation === 'exact') {
        return Math.round((safePosition / safeSize) * 100);
    }
    const segment = Math.min(Math.floor(safePosition / (safeSize / safeSegments)), safeSegments - 1);
    return Math.round((segment / (safeSegments - 1)) * 100);
}

export function activeVolumeSegments(volume, segments) {
    const safeSegments = Math.max(2, Number.parseInt(segments, 10) || 2);
    const safeVolume = Math.min(Math.max(Number(volume) || 0, 0), 100);
    return Math.round(safeVolume / (100 / (safeSegments - 1))) + 1;
}

export function playtimePercent(time, duration, playbackState) {
    if (Number(playbackState) === 2 || !(Number(duration) > 0)) {
        return 0;
    }
    return Math.min(100, Math.max(0, Math.floor((Number(time) / Number(duration)) * 100) || 0));
}
