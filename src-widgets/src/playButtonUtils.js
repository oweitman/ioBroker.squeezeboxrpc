import { normalizeInstance } from './playerConfigUtils';

export function normalizePlaybackState(value) {
    const state = Number.parseInt(String(value), 10);
    return state === 0 || state === 1 || state === 2 ? state : 2;
}

export function playerStateId(selection) {
    const instance = normalizeInstance(selection?.instance);
    const player = String(selection?.player || '').trim();
    return instance && player ? `${instance}.Players.${player}.state` : '';
}
