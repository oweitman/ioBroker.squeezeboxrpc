import { normalizeInstance } from './playerConfigUtils';

const COMMAND_STATES = {
    forward: 'btnForward',
    rewind: 'btnRewind',
};

export function playerCommandStateId(selection, command) {
    const instance = normalizeInstance(selection?.instance);
    const player = String(selection?.player || '').trim();
    const state = COMMAND_STATES[command];
    return instance && player && state ? `${instance}.Players.${player}.${state}` : '';
}
