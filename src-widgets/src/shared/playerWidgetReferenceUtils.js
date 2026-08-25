import { normalizeInstance, readConfiguredPlayers } from './playerConfigUtils';

const REFERENCE_PREFIX = 'squeezeboxrpc-player:';

export function encodePlayerWidgetReference(widgetId) {
    const normalized = String(widgetId || '').trim();
    return normalized ? `${REFERENCE_PREFIX}${normalized}` : '';
}

export function decodePlayerWidgetReference(reference) {
    const normalized = String(reference || '').trim();
    return normalized.startsWith(REFERENCE_PREFIX) ? normalized.slice(REFERENCE_PREFIX.length) : normalized;
}

export function findPlayersWidgets(views) {
    return Object.entries(views || {})
        .flatMap(([view, viewConfig]) =>
            Object.entries(viewConfig?.widgets || {})
                .filter(([, widget]) => widget?.tpl === 'tplSqueezeboxrpcPlayers2')
                .map(([id, widget]) => ({
                    id,
                    view,
                    instance: normalizeInstance(widget?.data?.ainstance),
                    name: String(widget?.data?.name || id),
                    data: widget?.data || {},
                })),
        )
        .sort(
            (left, right) =>
                (left.instance || left.name).localeCompare(right.instance || right.name, undefined, {
                    numeric: true,
                }) || left.view.localeCompare(right.view, undefined, { numeric: true }),
        );
}

export function configuredPlayerSelection(views, widgetId) {
    const widget = findPlayersWidgets(views).find(entry => entry.id === widgetId);
    if (!widget?.instance) {
        return null;
    }
    const players = readConfiguredPlayers(widget.data).filter(player => player.enabled !== false);
    const player = players.some(entry => entry.name === widget.data.defaultPlayer)
        ? widget.data.defaultPlayer
        : players[0]?.name || '';
    return player
        ? {
              instance: widget.instance,
              player,
              players,
              appearance: {
                  picWidth: widget.data.picWidth,
                  picHeight: widget.data.picHeight,
                  wrapcamelcase: widget.data.wrapcamelcase,
              },
          }
        : null;
}
