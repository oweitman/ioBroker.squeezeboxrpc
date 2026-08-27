'use strict';

function normalizeItem(item) {
    const id = String(item?.id || '').trim();
    return id
        ? {
              id,
              enabled: item.enabled !== false,
              text: String(item.text || ''),
              image: String(item.image || ''),
          }
        : null;
}

/**
 * Parse a persisted item configuration.
 *
 * @param value persisted value
 */
export function parseItemConfiguration(value) {
    if (!value) {
        return null;
    }
    try {
        const parsed = typeof value == 'string' ? JSON.parse(value) : value;
        if (!parsed || parsed.version !== 1 || !Array.isArray(parsed.items)) {
            return null;
        }
        const items = [];
        parsed.items.forEach(item => {
            const normalized = normalizeItem(item);
            if (normalized && !items.some(existing => existing.id == normalized.id)) {
                items.push(normalized);
            }
        });
        return {
            version: 1,
            defaultId: String(parsed.defaultId || ''),
            items,
        };
    } catch {
        return null;
    }
}

/**
 * Serialize an item configuration for a VIS widget attribute.
 *
 * @param configuration item configuration
 */
export function serializeItemConfiguration(configuration) {
    return JSON.stringify({
        version: 1,
        defaultId: String(configuration.defaultId || ''),
        items: configuration.items.map(normalizeItem).filter(Boolean),
    });
}

/**
 * Merge saved items with currently discovered IDs without changing saved data.
 *
 * @param configuration saved configuration
 * @param discoveredItems currently available items
 */
export function mergeConfiguredItems(configuration, discoveredItems) {
    const discovered = new Map(
        discoveredItems
            .map(item => {
                const source = typeof item == 'string' ? { id: item } : item;
                const normalized = normalizeItem(source);
                return normalized ? { ...source, ...normalized } : null;
            })
            .filter(Boolean)
            .map(item => [item.id, item]),
    );
    const result = (configuration?.items || []).map(item => {
        const remote = discovered.get(item.id);
        discovered.delete(item.id);
        return {
            ...remote,
            ...item,
            discoveredImage: remote?.image || '',
            available: !!remote,
        };
    });
    discovered.forEach(item => result.push({ ...item, enabled: true, available: true }));
    return result;
}

/**
 * Return enabled and currently available items in their configured order.
 *
 * @param configuration saved configuration
 * @param discoveredItems currently available items
 */
export function visibleConfiguredItems(configuration, discoveredItems) {
    return mergeConfiguredItems(configuration, discoveredItems).filter(
        item => item.enabled !== false && item.available,
    );
}

function legacyList(value) {
    return String(value || '')
        .split(',')
        .map(item => item.trim())
        .filter(Boolean);
}

/**
 * Convert legacy positional Players settings in memory.
 *
 * @param data legacy widget data
 * @param playerNames discovered player names
 */
export function legacyPlayerConfiguration(data, playerNames) {
    const configuredIndices = legacyList(data.viewindex);
    const orderedIndices = configuredIndices.length ? configuredIndices : playerNames.map((_, index) => String(index));
    const enabled = new Set(orderedIndices);
    const items = [];
    orderedIndices.forEach(value => {
        const index = Number(value);
        if (
            Number.isInteger(index) &&
            playerNames[index] !== undefined &&
            !items.some(item => item.id == playerNames[index])
        ) {
            items.push({
                id: playerNames[index],
                enabled: true,
                text: String(data[`buttonsText${index + 1}`] || ''),
                image: String(data[`buttonsImage${index + 1}`] || ''),
            });
        }
    });
    playerNames.forEach((id, index) => {
        if (!items.some(item => item.id == id)) {
            items.push({
                id,
                enabled: !configuredIndices.length || enabled.has(String(index)),
                text: String(data[`buttonsText${index + 1}`] || ''),
                image: String(data[`buttonsImage${index + 1}`] || ''),
            });
        }
    });
    const defaultIndex = Number(data.defaultPlayer);
    const defaultId = playerNames[defaultIndex] || String(data.defaultPlayer || '') || items[0]?.id || '';
    return { version: 1, defaultId, items };
}

/**
 * Convert legacy Favorites settings in memory.
 *
 * @param data legacy widget data
 * @param favorites discovered favorites
 */
export function legacyFavoriteConfiguration(data, favorites) {
    const discoveredIds = favorites.map(favorite => favorite.id);
    const configuredIds = legacyList(data.viewindex);
    const orderedIds = configuredIds.length ? configuredIds : discoveredIds;
    const items = [];
    orderedIds.forEach((id, position) => {
        const favorite = favorites.find(item => item.id == id);
        if (favorite && !items.some(item => item.id == id)) {
            items.push({
                id,
                enabled: true,
                text: String(data[`buttonsText${position + 1}`] || ''),
                image: String(data[`buttonsImage${position + 1}`] || ''),
            });
        }
    });
    favorites.forEach(favorite => {
        if (!items.some(item => item.id == favorite.id)) {
            items.push({ id: favorite.id, enabled: false, text: '', image: '' });
        }
    });
    return { version: 1, defaultId: '', items };
}

/**
 * Return a reordered copy of the item list.
 *
 * @param items configured items
 * @param index source index
 * @param offset movement offset
 */
export function moveConfiguredItem(items, index, offset) {
    const target = index + offset;
    if (index < 0 || target < 0 || index >= items.length || target >= items.length) {
        return items;
    }
    const result = items.slice();
    const [item] = result.splice(index, 1);
    result.splice(target, 0, item);
    return result;
}
