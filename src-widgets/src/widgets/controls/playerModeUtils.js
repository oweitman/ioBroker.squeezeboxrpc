import { normalizeInstance } from '../../shared/playerConfigUtils';

const MODE_STATES = {
    repeat: 'PlaylistRepeat',
    shuffle: 'PlaylistShuffle',
};

export function normalizeModeState(value) {
    const state = Number.parseInt(String(value), 10);
    return state === 0 || state === 1 || state === 2 ? state : 0;
}

export function nextModeState(value) {
    return (normalizeModeState(value) + 1) % 3;
}

export function playerModeStateId(selection, mode) {
    const instance = normalizeInstance(selection?.instance);
    const player = String(selection?.player || '').trim();
    const state = MODE_STATES[mode];
    return instance && player && state ? `${instance}.Players.${player}.${state}` : '';
}
