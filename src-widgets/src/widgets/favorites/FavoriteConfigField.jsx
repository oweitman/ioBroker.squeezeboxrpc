import { useCallback, useEffect, useRef, useState } from 'react';
import { I18n } from '@iobroker/adapter-react-v5';
import { Alert, Button, Checkbox, FormControlLabel, Stack, Typography } from '@mui/material';

import { configuredPlayerSelection, decodePlayerWidgetReference } from '../../shared/playerWidgetReferenceUtils';
import {
    mergeFavorites,
    moveFavorite,
    parseFavorites,
    readConfiguredFavorites,
    writeConfiguredFavorites,
} from './favoriteUtils';

export default function FavoriteConfigField({ data, onDataChange, props }) {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [dragIndex, setDragIndex] = useState(-1);
    const automaticRefreshKey = useRef('');
    const favorites = readConfiguredFavorites(data);
    const widgetId = decodePlayerWidgetReference(data.widgetPlayer);
    const instance = configuredPlayerSelection(props.context.views, widgetId)?.instance || '';

    const update = useCallback(updated => onDataChange(writeConfiguredFavorites(data, updated)), [data, onDataChange]);

    const refresh = useCallback(async () => {
        if (!instance) {
            setError(I18n.t('squeezeboxrpc_select_players_widget'));
            return;
        }
        setLoading(true);
        setError('');
        try {
            const states = await props.context.socket.getStates(`${instance}.Favorites.*`);
            update(mergeFavorites(favorites, parseFavorites(states, instance)));
        } catch (loadError) {
            console.error(loadError);
            setError(I18n.t('squeezeboxrpc_favorites_load_error'));
        } finally {
            setLoading(false);
        }
    }, [favorites, instance, props.context.socket, update]);

    useEffect(() => {
        const key = `${widgetId}:${instance}`;
        if (instance && automaticRefreshKey.current !== key) {
            automaticRefreshKey.current = key;
            void refresh();
        }
    }, [instance, refresh, widgetId]);

    return (
        <Stack
            spacing={1}
            sx={{ width: '100%' }}
        >
            <Button
                disabled={loading || !instance}
                onClick={() => void refresh()}
            >
                {I18n.t('squeezeboxrpc_refresh_favorites')}
            </Button>
            {error ? <Alert severity="warning">{error}</Alert> : null}
            {!favorites.length && !loading ? (
                <Typography variant="body2">{I18n.t('squeezeboxrpc_no_favorites')}</Typography>
            ) : null}
            {favorites.map((favorite, index) => (
                <Stack
                    key={favorite.id}
                    direction="row"
                    spacing={0.5}
                    alignItems="center"
                    draggable
                    onDragStart={event => {
                        setDragIndex(index);
                        event.dataTransfer.effectAllowed = 'move';
                        event.dataTransfer.setData('text/plain', favorite.id);
                    }}
                    onDragOver={event => {
                        event.preventDefault();
                        event.dataTransfer.dropEffect = 'move';
                    }}
                    onDrop={event => {
                        event.preventDefault();
                        if (dragIndex >= 0) update(moveFavorite(favorites, dragIndex, index));
                        setDragIndex(-1);
                    }}
                    onDragEnd={() => setDragIndex(-1)}
                    sx={{
                        border: '1px solid',
                        borderColor: dragIndex === index ? 'primary.main' : 'divider',
                        borderRadius: 1,
                        cursor: 'grab',
                        padding: 0.5,
                    }}
                >
                    <span
                        aria-hidden="true"
                        style={{ fontSize: 20, lineHeight: 1 }}
                    >
                        ☰
                    </span>
                    <FormControlLabel
                        sx={{ flexGrow: 1, marginRight: 0, minWidth: 0 }}
                        control={
                            <Checkbox
                                checked={favorite.enabled !== false}
                                onChange={event =>
                                    update(
                                        favorites.map((item, itemIndex) =>
                                            itemIndex === index ? { ...item, enabled: event.target.checked } : item,
                                        ),
                                    )
                                }
                            />
                        }
                        label={favorite.name ? `${favorite.id} — ${favorite.name}` : favorite.id}
                    />
                </Stack>
            ))}
        </Stack>
    );
}
