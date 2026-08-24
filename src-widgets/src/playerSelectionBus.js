const selections = new Map();
const listeners = new Map();

function sameSelection(left, right) {
    return left?.version === right?.version && left?.instance === right?.instance && left?.player === right?.player;
}

export function publishPlayerSelection(widgetId, selection) {
    if (!widgetId) {
        return;
    }

    const normalized =
        selection?.instance && selection?.player
            ? { version: 1, instance: selection.instance, player: selection.player }
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
