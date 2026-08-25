import { useEffect, useState } from 'react';
import { I18n } from '@iobroker/adapter-react-v5';
import { VisRxWidget } from '@iobroker/vis-2-widgets-react-dev';

import FavoriteConfigField from './FavoriteConfigField';
import { playerReferenceField } from '../values/PlayerStateWidget';
import { decodePlayerWidgetReference } from '../../shared/playerWidgetReferenceUtils';
import { mergeFavorites, parseFavorites, readConfiguredFavorites } from './favoriteUtils';
import { subscribePlayerSelection } from '../../shared/playerSelectionBus';
import { cssLength } from '../../shared/playerConfigUtils';
import TextImage from '../../shared/TextImage';
import './favoritesWidget.css';

const WidgetBase = /** @type {any} */ (window.visRxWidget || VisRxWidget);

function FavoriteContent({ favorite, width, height, backgroundColor, wrapCamelCase, style, indexHelper }) {
    const [imageFailed, setImageFailed] = useState(false);
    useEffect(() => setImageFailed(false), [favorite.image]);
    const showImage = Boolean(favorite.image) && !imageFailed;
    return (
        <div className="squeezeboxrpc-favorite-content" style={style}>
            {showImage ? (
                <img
                    src={favorite.image}
                    alt={favorite.text || favorite.name || favorite.id}
                    onError={() => setImageFailed(true)}
                />
            ) : (
                <TextImage
                    text={favorite.text || favorite.name || favorite.id}
                    width={width}
                    height={height}
                    backgroundColor={backgroundColor}
                    wrapCamelCase={wrapCamelCase}
                    style={{ color: '#fff' }}
                />
            )}
            {indexHelper === null ? null : (
                <span className="squeezeboxrpc-favorite-index-helper">{indexHelper}</span>
            )}
        </div>
    );
}

class FavoritesWidget extends WidgetBase {
    constructor(props) {
        super(props);
        const initialState = /** @type {Record<string, any>} */ (/** @type {unknown} */ (this.state));
        this.state = { ...initialState, discoveredFavorites: [], favoritesError: '', activeFavorite: '' };
        this.selectionWidget = '';
        this.selection = null;
        this.unsubscribeSelection = null;
        this.favoritePattern = '';
        this.favoriteStates = {};
        this.loadRequest = 0;
        this.handleFavoriteState = this.handleFavoriteState.bind(this);
    }

    get widgetState() {
        return /** @type {Record<string, any>} */ (/** @type {unknown} */ (this.state));
    }

    static getI18nPrefix() {
        return 'squeezeboxrpc_';
    }

    static getWidgetInfo() {
        return {
            id: 'tplSqueezeboxrpcFavorites2',
            visSet: 'vis2squeezeboxrpc',
            visSetLabel: 'widget_set',
            visName: 'Squeezebox Favorites',
            visAttrs: [
                {
                    name: 'common',
                    fields: [
                        playerReferenceField,
                        {
                            name: 'favoriteConfiguration',
                            type: 'custom',
                            label: 'squeezeboxrpc_favorite_configuration',
                            component: (field, data, onDataChange, props) => (
                                <FavoriteConfigField data={data} onDataChange={onDataChange} props={props} />
                            ),
                        },
                        {
                            name: 'editmodehelper',
                            type: 'checkbox',
                            default: false,
                            label: 'squeezeboxrpc_edit_mode_index_helper',
                        },
                        { name: 'wrapcamelcase', type: 'checkbox', default: true, label: 'squeezeboxrpc_wrap_camel_case' },
                    ],
                },
                {
                    name: 'buttonSettings',
                    label: 'squeezeboxrpc_button_settings',
                    fields: [
                        { name: 'picWidth', type: 'number', default: 50, min: 1, label: 'squeezeboxrpc_image_width' },
                        { name: 'picHeight', type: 'number', default: 50, min: 1, label: 'squeezeboxrpc_image_height' },
                        { name: 'opacity', type: 'slider', default: 0.5, min: 0, max: 1, step: 0.05, label: 'squeezeboxrpc_opacity' },
                        { name: 'borderwidth', type: 'text', default: '2px', label: 'squeezeboxrpc_border_width' },
                        {
                            name: 'borderstyle', type: 'select', default: 'solid', label: 'squeezeboxrpc_border_style', noTranslation: true,
                            options: ['none', 'hidden', 'dotted', 'dashed', 'solid', 'double', 'groove', 'ridge', 'inset', 'outset'],
                        },
                        { name: 'bordercolornormal', type: 'color', default: '#2e2e2e', label: 'squeezeboxrpc_border_normal' },
                        { name: 'bordercoloractive', type: 'color', default: '#87ceeb', label: 'squeezeboxrpc_border_active' },
                        { name: 'borderradius', type: 'text', default: '5px', label: 'squeezeboxrpc_border_radius' },
                        { name: 'buttonbkcolor', type: 'color', default: '#000000', label: 'squeezeboxrpc_background' },
                        { name: 'buttonmargin', type: 'text', default: '0px', label: 'squeezeboxrpc_button_margin' },
                    ],
                },
                {
                    name: 'individualFavorites',
                    label: 'squeezeboxrpc_individual_favorites',
                    indexFrom: 0,
                    indexTo: 'favoriteLastIndex',
                    fields: [
                        { name: 'buttonsImage', type: 'image', label: 'squeezeboxrpc_button_image' },
                        { name: 'buttonsText', type: 'text', label: 'squeezeboxrpc_button_text' },
                    ],
                },
            ],
            visDefaultStyle: { width: 230, height: 210 },
            visPrev: 'widgets/squeezeboxrpc/img/favorites.png',
        };
    }

    getWidgetInfo() {
        return FavoritesWidget.getWidgetInfo();
    }

    componentDidMount() {
        super.componentDidMount();
        this.syncSelectionSubscription();
    }

    componentDidUpdate(prevProps, prevState) {
        super.componentDidUpdate(prevProps, prevState);
        this.syncSelectionSubscription();
    }

    componentWillUnmount() {
        this.unsubscribeSelection?.();
        this.unsubscribeFavorites();
        super.componentWillUnmount();
    }

    onRxDataChanged() {
        this.syncSelectionSubscription(true);
    }

    syncSelectionSubscription(configurationChanged = false) {
        const data = this.widgetState.rxData || this.widgetState.data || {};
        const widgetPlayer = decodePlayerWidgetReference(data.widgetPlayer);
        if (widgetPlayer !== this.selectionWidget) {
            this.unsubscribeSelection?.();
            this.unsubscribeFavorites();
            this.selectionWidget = widgetPlayer;
            this.selection = null;
            this.unsubscribeSelection = widgetPlayer
                ? subscribePlayerSelection(widgetPlayer, selection => {
                      this.selection = selection;
                      void this.loadFavorites();
                  }, this.props.context.views)
                : null;
            if (!widgetPlayer) this.setState({ discoveredFavorites: [], favoritesError: '', activeFavorite: '' });
            return;
        }
        if (configurationChanged && this.selection) void this.loadFavorites();
    }

    unsubscribeFavorites() {
        this.loadRequest++;
        if (this.favoritePattern) this.props.context.socket.unsubscribeState(this.favoritePattern, this.handleFavoriteState);
        this.favoritePattern = '';
        this.favoriteStates = {};
    }

    async loadFavorites() {
        const instance = this.selection?.instance;
        const pattern = instance ? `${instance}.Favorites.*` : '';
        if (!pattern) {
            this.unsubscribeFavorites();
            this.setState({ discoveredFavorites: [], favoritesError: '' });
            return;
        }
        if (pattern !== this.favoritePattern) {
            this.unsubscribeFavorites();
            this.favoritePattern = pattern;
            await this.props.context.socket.subscribeState(pattern, this.handleFavoriteState);
        }
        const request = ++this.loadRequest;
        try {
            const states = await this.props.context.socket.getStates(pattern);
            if (request !== this.loadRequest) return;
            this.favoriteStates = states || {};
            this.setState({ discoveredFavorites: parseFavorites(this.favoriteStates, instance), favoritesError: '' });
        } catch (error) {
            if (request !== this.loadRequest) return;
            console.error(error);
            this.setState({ discoveredFavorites: [], favoritesError: I18n.t('squeezeboxrpc_favorites_load_error') });
        }
    }

    handleFavoriteState(id, state) {
        if (!this.favoritePattern || !id.startsWith(this.favoritePattern.slice(0, -1))) return;
        if (state) this.favoriteStates = { ...this.favoriteStates, [id]: state };
        else {
            this.favoriteStates = { ...this.favoriteStates };
            delete this.favoriteStates[id];
        }
        this.setState({ discoveredFavorites: parseFavorites(this.favoriteStates, this.selection?.instance) });
    }

    async playFavorite(favoriteId) {
        if (!this.selection?.instance || !this.selection?.player) return;
        this.setState({ activeFavorite: favoriteId });
        try {
            await this.props.context.socket.setState(
                `${this.selection.instance}.Players.${this.selection.player}.cmdPlayFavorite`,
                favoriteId,
            );
        } catch (error) {
            console.error(error);
        }
    }

    renderWidgetBody(props) {
        super.renderWidgetBody(props);
        const data = this.widgetState.rxData || this.widgetState.data || {};
        if (this.widgetState.favoritesError) return <div>{this.widgetState.favoritesError}</div>;
        const favorites = mergeFavorites(readConfiguredFavorites(data), this.widgetState.discoveredFavorites)
            .map((favorite, configurationIndex) => ({ ...favorite, configurationIndex }))
            .filter(favorite => favorite.enabled !== false);
        if (!favorites.length) return <div>{I18n.t('squeezeboxrpc_no_favorites')}</div>;
        const width = Math.max(1, Number(data.picWidth) || 50);
        const height = Math.max(1, Number(data.picHeight) || 50);
        const opacity = Number(data.opacity ?? 0.5);
        return (
            <div className="squeezeboxrpc-favorites" style={{ gap: cssLength(data.buttonmargin, '0px') }}>
                {favorites.map(favorite => {
                    const active = favorite.id === this.widgetState.activeFavorite;
                    const borderColor = active ? data.bordercoloractive || '#87ceeb' : data.bordercolornormal || '#2e2e2e';
                    return (
                        <button
                            key={favorite.id}
                            type="button"
                            className="squeezeboxrpc-favorite-button"
                            title={favorite.name || favorite.id}
                            onClick={() => void this.playFavorite(favorite.id)}
                            style={/** @type {any} */ ({ '--squeezeboxrpc-active-border-color': data.bordercoloractive || '#87ceeb' })}
                        >
                            <FavoriteContent
                                favorite={favorite}
                                width={width}
                                height={height}
                                backgroundColor={data.buttonbkcolor || '#000000'}
                                wrapCamelCase={data.wrapcamelcase !== false}
                                indexHelper={this.props.editMode && data.editmodehelper ? favorite.configurationIndex : null}
                                style={{
                                    boxSizing: 'border-box', width, height,
                                    border: `${cssLength(data.borderwidth, '2px')} ${data.borderstyle || 'solid'} ${borderColor}`,
                                    borderRadius: cssLength(data.borderradius, '5px'), opacity: active ? 1 : opacity,
                                }}
                            />
                        </button>
                    );
                })}
            </div>
        );
    }
}

export default FavoritesWidget;
