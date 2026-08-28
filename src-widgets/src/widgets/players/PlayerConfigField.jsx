import { useCallback, useEffect, useRef, useState } from 'react';
import { Alert, Box, Button, Checkbox, FormControlLabel, IconButton, Radio, Stack, Typography } from '@mui/material';
import { translate } from '../../shared/translate';

import {
    mergePlayerNames,
    movePlayer,
    normalizeInstance,
    readConfiguredPlayers,
    writeConfiguredPlayers,
} from '../../shared/playerConfigUtils';

export default function PlayerConfigField({ data, onDataChange, props }) {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const automaticRefreshInstance = useRef('');
    const players = readConfiguredPlayers(data);
    const instance = normalizeInstance(data.ainstance);

    const updatePlayers = useCallback(
        (updatedPlayers, defaultPlayer = data.defaultPlayer) => {
            onDataChange(writeConfiguredPlayers(data, updatedPlayers, defaultPlayer));
        },
        [data, onDataChange],
    );

    const refresh = useCallback(async () => {
        if (!instance) {
            setError(translate('squeezeboxrpc_select_instance'));
            return;
        }
        setLoading(true);
        setError('');
        try {
            const names = await props.context.socket.sendTo(instance, 'getPlayerNames', {});
            if (!Array.isArray(names)) {
                throw new TypeError('Invalid getPlayerNames response');
            }
            if (!names.length) {
                setError(translate('squeezeboxrpc_no_players_received'));
                return;
            }
            updatePlayers(mergePlayerNames(players, names));
        } catch (refreshError) {
            console.error(refreshError);
            setError(translate('squeezeboxrpc_players_load_error'));
        } finally {
            setLoading(false);
        }
    }, [instance, players, props.context.socket, updatePlayers]);

    useEffect(() => {
        if (instance && !players.length && automaticRefreshInstance.current !== instance) {
            automaticRefreshInstance.current = instance;
            void refresh();
        }
    }, [instance, players.length, refresh]);

    return (
        <Stack spacing={1} sx={{ width: '100%' }}>
            <Box>
                <Button disabled={loading || !instance} onClick={() => void refresh()}>
                    {translate('squeezeboxrpc_refresh_players')}
                </Button>
            </Box>
            {error ? <Alert severity="warning">{error}</Alert> : null}
            {!players.length && !loading ? (
                <Typography variant="body2">{translate('squeezeboxrpc_no_configured_players')}</Typography>
            ) : null}
            {players.map((player, index) => (
                <Stack key={player.name} direction="row" spacing={0.5} alignItems="center">
                    <Radio
                        size="small"
                        checked={data.defaultPlayer === player.name}
                        disabled={player.enabled === false}
                        onChange={() => updatePlayers(players, player.name)}
                        inputProps={{ 'aria-label': translate('squeezeboxrpc_default_player') }}
                    />
                    <FormControlLabel
                        sx={{ flexGrow: 1, marginRight: 0 }}
                        control={
                            <Checkbox
                                checked={player.enabled !== false}
                                onChange={event => {
                                    const updated = players.map((item, playerIndex) =>
                                        playerIndex === index ? { ...item, enabled: event.target.checked } : item,
                                    );
                                    updatePlayers(updated);
                                }}
                            />
                        }
                        label={player.name}
                    />
                    <IconButton
                        size="small"
                        disabled={index === 0}
                        aria-label={translate('squeezeboxrpc_move_up')}
                        onClick={() => updatePlayers(movePlayer(players, index, -1))}
                    >
                        ↑
                    </IconButton>
                    <IconButton
                        size="small"
                        disabled={index === players.length - 1}
                        aria-label={translate('squeezeboxrpc_move_down')}
                        onClick={() => updatePlayers(movePlayer(players, index, 1))}
                    >
                        ↓
                    </IconButton>
                </Stack>
            ))}
        </Stack>
    );
}
