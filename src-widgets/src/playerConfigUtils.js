export function normalizeInstance(value) {
    const match = String(value || '').match(/(?:system\.adapter\.)?(squeezeboxrpc\.\d+)/);
    return match ? match[1] : '';
}

export function readConfiguredPlayers(data = {}) {
    const count = Math.max(0, Number.parseInt(data.playerCount, 10) || 0);
    const players = [];

    for (let index = 1; index <= count; index++) {
        const name = String(data[`playerName${index}`] || '').trim();
        if (!name || players.some(player => player.name === name)) {
            continue;
        }
        players.push({
            name,
            enabled: data[`playerEnabled${index}`] !== false,
            text: String(data[`buttonsText${index}`] || ''),
            image: String(data[`buttonsImage${index}`] || ''),
        });
    }

    return players;
}

export function mergePlayerNames(configuredPlayers, playerNames) {
    const remoteNames = [...new Set((playerNames || []).filter(name => typeof name === 'string' && name.length))];
    if (!remoteNames.length) {
        return configuredPlayers.map(player => ({ ...player }));
    }

    const merged = configuredPlayers.map(player => ({ ...player }));
    for (const name of remoteNames) {
        if (!merged.some(player => player.name === name)) {
            merged.push({ name, enabled: true, text: '', image: '' });
        }
    }
    return merged;
}

export function writeConfiguredPlayers(data, players, requestedDefaultPlayer) {
    const result = { ...data, playerCount: players.length };
    const previousCount = Math.max(Number.parseInt(data.playerCount, 10) || 0, players.length);

    for (let index = 1; index <= previousCount; index++) {
        delete result[`playerName${index}`];
        delete result[`playerEnabled${index}`];
        delete result[`buttonsText${index}`];
        delete result[`buttonsImage${index}`];
    }

    players.forEach((player, arrayIndex) => {
        const index = arrayIndex + 1;
        result[`playerName${index}`] = player.name;
        result[`playerEnabled${index}`] = player.enabled !== false;
        result[`buttonsText${index}`] = player.text || '';
        result[`buttonsImage${index}`] = player.image || '';
    });

    const visiblePlayers = players.filter(player => player.enabled !== false);
    result.defaultPlayer = visiblePlayers.some(player => player.name === requestedDefaultPlayer)
        ? requestedDefaultPlayer
        : visiblePlayers[0]?.name || '';
    return result;
}

export function movePlayer(players, index, offset) {
    const target = index + offset;
    if (index < 0 || index >= players.length || target < 0 || target >= players.length) {
        return players.map(player => ({ ...player }));
    }
    const result = players.map(player => ({ ...player }));
    const [player] = result.splice(index, 1);
    result.splice(target, 0, player);
    return result;
}
