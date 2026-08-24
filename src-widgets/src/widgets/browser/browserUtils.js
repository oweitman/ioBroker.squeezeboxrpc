export const browserHomeItems = [
    { title: 'My Music', actions: JSON.stringify({ next: 'mymusic' }), id: 'myMusic' },
    { title: 'Radio', actions: JSON.stringify({ next: 'radio' }), id: 'radio' },
    { title: 'Favorites', actions: JSON.stringify({ next: 'favorites' }), id: 'favorites' },
    { title: 'Apps', actions: JSON.stringify({ next: 'apps' }), id: 'apps' },
    { title: 'Extra', actions: JSON.stringify({ next: 'extra' }), id: 'extra' },
];

export function parseBrowserActions(actions) {
    if (!actions) {
        return {};
    }
    if (typeof actions === 'object') {
        return actions;
    }
    try {
        const parsed = JSON.parse(actions);
        return parsed && typeof parsed === 'object' ? parsed : {};
    } catch {
        return {};
    }
}

export function browserCommand(action, playerId, range = [0, 25000]) {
    if (!action || !Array.isArray(action.command)) {
        return null;
    }
    const params = Array.isArray(action.params) ? action.params : [];
    const specialRange = params.some(param => param === 'mode:floptracks' || param === 'mode:toptracks')
        ? [0, 200]
        : range;
    return { playerid: playerId, cmdArray: [...action.command, ...specialRange, ...params] };
}

export function browserActionCommand(action, playerId) {
    if (!action || !Array.isArray(action.command)) {
        return null;
    }
    return {
        playerid: playerId,
        cmdArray: [...action.command, ...(Array.isArray(action.params) ? action.params : [])],
    };
}

export function browserBreadcrumb(history) {
    return history.map(item => item.title).join(' / ');
}
