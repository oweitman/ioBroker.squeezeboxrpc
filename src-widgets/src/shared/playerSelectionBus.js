const STORE_KEY = '__squeezeboxrpcPlayerSelectionBusV1';
let store = Reflect.get(globalThis, STORE_KEY);
if (!store) {
    store = { selections: new Map(), listeners: new Map() };
    Reflect.set(globalThis, STORE_KEY, store);
}
const selections = store.selections;
const listeners = store.listeners;

function sameSelection(left, right) {
    return (
        left?.version === right?.version &&
        left?.instance === right?.instance &&
        left?.player === right?.player &&
        JSON.stringify(left?.players || []) === JSON.stringify(right?.players || []) &&
        JSON.stringify(left?.appearance || {}) === JSON.stringify(right?.appearance || {})
    );
}

export function publishPlayerSelection(widgetId, selection) {
    if (!widgetId) {
        return;
    }

    const normalized =
        selection?.instance && selection?.player
            ? {
                  version: 1,
                  instance: selection.instance,
                  player: selection.player,
                  ...(Array.isArray(selection.players) ? { players: selection.players } : {}),
                  ...(selection.appearance ? { appearance: selection.appearance } : {}),
              }
            : null;
    if (sameSelection(selections.get(widgetId), normalized) || (!selections.has(widgetId) && !normalized)) {
        return;
    }

    if (normalized) {
        selections.set(widgetId, normalized);
    } else {
        selections.delete(widgetId);
    }

    listeners.get(widgetId)?.forEach(listener => listener(normalized));
}

export function subscribePlayerSelection(widgetId, listener) {
    if (!widgetId || typeof listener !== 'function') {
        return () => {};
    }

    const widgetListeners = listeners.get(widgetId) || new Set();
    widgetListeners.add(listener);
    listeners.set(widgetId, widgetListeners);
    listener(selections.get(widgetId) || null);

    return () => {
        widgetListeners.delete(listener);
        if (!widgetListeners.size) {
            listeners.delete(widgetId);
        }
    };
}

export function clearPlayerSelection(widgetId) {
    publishPlayerSelection(widgetId, null);
}
