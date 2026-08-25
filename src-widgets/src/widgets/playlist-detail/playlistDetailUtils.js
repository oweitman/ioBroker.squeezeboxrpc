export function parsePlaylistDetail(value) {
    let entries = value;
    if (typeof value === 'string') {
        try {
            entries = JSON.parse(value);
        } catch {
            return [];
        }
    }
    if (!Array.isArray(entries)) {
        return [];
    }
    return entries.map((entry, position) => ({
        index: Number.isInteger(Number(entry?.index)) ? Number(entry.index) : position,
        id: String(entry?.id ?? `${position}`),
        title: String(entry?.title || ''),
        artworkUrl: String(entry?.ArtworkUrl || ''),
        artist: String(entry?.Artist || ''),
        album: String(entry?.Album || ''),
        duration: Number(entry?.Duration),
    }));
}

export function formatPlaylistDuration(value) {
    const seconds = Number(value);
    if (!Number.isFinite(seconds) || seconds < 0) {
        return '--:--';
    }
    const totalSeconds = Math.floor(seconds);
    const maximum = 99 * 3600 + 59 * 60 + 59;
    if (totalSeconds > maximum) {
        return '>99:59:59';
    }
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const remainingSeconds = totalSeconds % 60;
    const pad = number => String(number).padStart(2, '0');
    return hours
        ? `${pad(hours)}:${pad(minutes)}:${pad(remainingSeconds)}`
        : `${pad(minutes)}:${pad(remainingSeconds)}`;
}

export function playlistDetailStateIds(selection) {
    if (!selection?.instance || !selection?.player) {
        return null;
    }
    const base = `${selection.instance}.Players.${selection.player}`;
    return {
        playlist: `${base}.Playlist`,
        currentIndex: `${base}.PlaylistCurrentIndex`,
        command: `${base}.cmdGeneral`,
    };
}

export function playlistDeleteCommand(index) {
    return `"playlist","delete","${Number(index)}"`;
}
