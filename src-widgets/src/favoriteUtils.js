import { normalizeImageSource } from './playerConfigUtils';

export function parseFavorites(states = {}, instance = '') {
    const prefix = `${instance}.Favorites.`;
    const grouped = new Map();

    Object.entries(states).forEach(([stateId, state]) => {
        if (!stateId.startsWith(prefix) || !state) {
            return;
        }
        const path = stateId.slice(prefix.length).split('.');
        if (path.length < 2) {
            return;
        }
        const key = path.shift();
        const property = path.join('.');
        const favorite = grouped.get(key) || {};
        favorite[property] = state.val;
        grouped.set(key, favorite);
    });

    return [...grouped.values()]
        .filter(favorite => Number(favorite.isaudio) === 1 && String(favorite.id || '').trim())
        .map(favorite => ({
            id: String(favorite.id).trim(),
            name: String(favorite.Name || favorite.name || '').trim(),
            image: normalizeImageSource(favorite.image),
        }));
}

export function readConfiguredFavorites(data = {}) {
    const count = Math.max(0, Number.parseInt(data.favoriteCount, 10) || 0);
    const startIndex = Object.prototype.hasOwnProperty.call(data, 'favoriteId0') ? 0 : 1;
    const favorites = [];
    for (let offset = 0; offset < count; offset++) {
        const index = startIndex + offset;
        const id = String(data[`favoriteId${index}`] || '').trim();
        if (!id || favorites.some(favorite => favorite.id === id)) {
            continue;
        }
        favorites.push({
            id,
            name: String(data[`favoriteName${index}`] || '').trim(),
            enabled: data[`favoriteEnabled${index}`] !== false,
            text: String(data[`buttonsText${index}`] || ''),
            image: normalizeImageSource(data[`buttonsImage${index}`]),
        });
    }
    return favorites;
}

export function mergeFavorites(configured, discovered) {
    const remote = new Map((discovered || []).map(favorite => [favorite.id, favorite]));
    const result = configured
        .filter(favorite => remote.has(favorite.id))
        .map(favorite => {
            const discoveredFavorite = remote.get(favorite.id);
            return {
                ...discoveredFavorite,
                ...favorite,
                name: discoveredFavorite.name || favorite.name || '',
                text: favorite.text || discoveredFavorite.name || '',
                image: favorite.image || discoveredFavorite.image || '',
            };
        });
    (discovered || []).forEach(favorite => {
        if (!result.some(item => item.id === favorite.id)) {
            result.push({
                ...favorite,
                enabled: true,
                text: favorite.name || '',
                image: favorite.image || '',
            });
        }
    });
    return result;
}

export function writeConfiguredFavorites(data, favorites) {
    const result = {
        ...data,
        favoriteCount: favorites.length,
        favoriteLastIndex: favorites.length - 1,
    };
    const previousCount = Math.max(Number.parseInt(data.favoriteCount, 10) || 0, favorites.length);
    for (let index = 0; index <= previousCount; index++) {
        delete result[`favoriteId${index}`];
        delete result[`favoriteName${index}`];
        delete result[`favoriteEnabled${index}`];
        delete result[`buttonsText${index}`];
        delete result[`buttonsImage${index}`];
    }
    favorites.forEach((favorite, arrayIndex) => {
        const index = arrayIndex;
        result[`favoriteId${index}`] = favorite.id;
        result[`favoriteName${index}`] = favorite.name || '';
        result[`favoriteEnabled${index}`] = favorite.enabled !== false;
        result[`buttonsText${index}`] = favorite.text || '';
        result[`buttonsImage${index}`] = favorite.image || '';
    });
    return result;
}

export function moveFavorite(favorites, sourceIndex, targetIndex) {
    if (
        sourceIndex === targetIndex ||
        sourceIndex < 0 ||
        targetIndex < 0 ||
        sourceIndex >= favorites.length ||
        targetIndex >= favorites.length
    ) {
        return favorites.map(favorite => ({ ...favorite }));
    }
    const result = favorites.map(favorite => ({ ...favorite }));
    const [favorite] = result.splice(sourceIndex, 1);
    result.splice(targetIndex, 0, favorite);
    return result;
}
