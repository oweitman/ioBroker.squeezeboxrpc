export function parsePlaylists(response) {
    const playlists = response?.result?.playlists_loop || response?.playlists_loop || [];
    if (!Array.isArray(playlists)) {
        return [];
    }

    return playlists
        .map(playlist => ({
            id: String(playlist?.id ?? '').trim(),
            name: String(playlist?.playlist ?? playlist?.name ?? '').trim(),
        }))
        .filter(playlist => playlist.id && playlist.name);
}

export function playlistLoadCommand(playlistId) {
    return `"playlistcontrol","cmd:load","playlist_id:${String(playlistId || '').trim()}"`;
}
