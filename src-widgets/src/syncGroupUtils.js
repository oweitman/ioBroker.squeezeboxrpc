export function syncIds(value) {
    return String(value || '')
        .split(',')
        .map(id => id.trim())
        .filter(Boolean);
}

export function playerSyncGroup(states, playerName) {
    const player = states[playerName] || {};
    return [...new Set([...syncIds(player.SyncMaster), ...syncIds(player.SyncSlaves)])];
}

export function syncGroups(states) {
    const groups = [];
    Object.keys(states).forEach(playerName => {
        const playerId = String(states[playerName]?.PlayerID || '');
        const relatedIds = playerSyncGroup(states, playerName);
        const group = [...new Set([playerId, ...relatedIds].filter(Boolean))];
        if (group.length < 2) {
            return;
        }

        const overlapping = groups.filter(existing => existing.some(id => group.includes(id)));
        const merged = [...new Set([...group, ...overlapping.flat()])];
        overlapping.forEach(existing => groups.splice(groups.indexOf(existing), 1));
        groups.push(merged);
    });
    return groups;
}

export function syncGroupStatus(states, selectedPlayer, targetPlayer) {
    const selectedId = String(states[selectedPlayer]?.PlayerID || '');
    const targetId = String(states[targetPlayer]?.PlayerID || '');
    if (!selectedId || !targetId) {
        return 'none';
    }
    if (selectedId === targetId) {
        return 'selected';
    }

    const groups = syncGroups(states);
    const ownGroup = groups.findIndex(group => group.includes(selectedId));
    const targetGroup = groups.findIndex(group => group.includes(targetId));
    if (ownGroup !== -1 && targetGroup === ownGroup) {
        return 'own';
    }
    if (targetGroup !== -1) {
        return 'other';
    }
    return 'none';
}

export function syncCommand(instance, selectedPlayer, targetPlayer, states) {
    const status = syncGroupStatus(states, selectedPlayer, targetPlayer);
    if (status === 'selected') {
        return null;
    }
    if (status === 'own') {
        return {
            stateId: `${instance}.Players.${targetPlayer}.cmdGeneral`,
            value: '"sync","-"',
        };
    }
    const targetId = String(states[targetPlayer]?.PlayerID || '');
    return targetId
        ? {
              stateId: `${instance}.Players.${selectedPlayer}.cmdGeneral`,
              value: `"sync","${targetId}"`,
          }
        : null;
}
