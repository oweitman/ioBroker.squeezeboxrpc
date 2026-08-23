'use strict';

/**
 * Convert a click position into an ioBroker volume value.
 *
 * @param {number} position Click position inside the bar.
 * @param {number} size Width or height of the bar.
 * @param {number} segments Number of displayed segments.
 * @param {string} calctype Calculation mode.
 * @param {boolean} reverse Whether the direction is reversed.
 * @returns {number} Volume between 0 and 100.
 */
export function calculateVolume(position, size, segments, calctype, reverse) {
    const safeSize = Number(size);
    const safeSegments = Math.max(2, Number.parseInt(segments, 10) || 2);
    if (!Number.isFinite(safeSize) || safeSize <= 0) {
        return 0;
    }

    let safePosition = Math.min(Math.max(Number(position) || 0, 0), safeSize);
    if (reverse) {
        safePosition = safeSize - safePosition;
    }

    if (calctype === 'exact') {
        return Math.round((safePosition / safeSize) * 100);
    }

    const segment = Math.min(Math.floor(safePosition / (safeSize / safeSegments)), safeSegments - 1);
    return Math.round((segment / (safeSegments - 1)) * 100);
}

/**
 * Calculate how many segments should be active for a volume value.
 *
 * @param {number} volume Volume between 0 and 100.
 * @param {number} segments Number of displayed segments.
 * @returns {number} Number of active segments.
 */
export function calculateActiveLevels(volume, segments) {
    const safeSegments = Math.max(2, Number.parseInt(segments, 10) || 2);
    const safeVolume = Math.min(Math.max(Number(volume) || 0, 0), 100);
    return Math.round(safeVolume / (100 / (safeSegments - 1))) + 1;
}
