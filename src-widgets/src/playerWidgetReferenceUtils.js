const REFERENCE_PREFIX = 'squeezeboxrpc-player:';

export function encodePlayerWidgetReference(widgetId) {
    const normalized = String(widgetId || '').trim();
    return normalized ? `${REFERENCE_PREFIX}${normalized}` : '';
}

export function decodePlayerWidgetReference(reference) {
    const normalized = String(reference || '').trim();
    return normalized.startsWith(REFERENCE_PREFIX) ? normalized.slice(REFERENCE_PREFIX.length) : normalized;
}

export function findPlayersWidgets(views, selectedView) {
    const widgets = views?.[selectedView]?.widgets || {};
    return Object.entries(widgets)
        .filter(([, widget]) => widget?.tpl === 'tplSqueezeboxrpcPlayers2')
        .map(([id, widget]) => ({
            id,
            label: String(widget?.data?.name || id),
        }))
        .sort((left, right) => left.label.localeCompare(right.label, undefined, { numeric: true }));
}
