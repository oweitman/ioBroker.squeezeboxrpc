import { I18n } from '@iobroker/adapter-react-v5';
import { VisRxWidget } from '@iobroker/vis-2-widgets-react-dev';

import PlayerConfigField from './PlayerConfigField';
import { mergePlayerNames, normalizeInstance, readConfiguredPlayers } from './playerConfigUtils';

const WidgetBase = /** @type {any} */ (window.visRxWidget || VisRxWidget);

function visiblePlayers(data, playerNames) {
    return mergePlayerNames(readConfiguredPlayers(data), playerNames).filter(
        player => player.enabled !== false && playerNames.includes(player.name),
    );
}

function displayName(player, wrapCamelCase) {
    const text = player.text || player.name;
    return wrapCamelCase ? text.replace(/([a-z])([A-Z])/g, '$1\u200b$2') : text;
}

class PlayersWidget extends WidgetBase {
    constructor(props) {
        super(props);
        const initialState = /** @type {Record<string, any>} */ (/** @type {unknown} */ (this.state));
        this.state = {
            ...initialState,
            playerNames: [],
            selectedPlayer: '',
            loadingPlayers: false,
            playerError: '',
        };
        this.playerRequest = 0;
    }

    get widgetState() {
        return /** @type {Record<string, any>} */ (/** @type {unknown} */ (this.state));
    }

    static getWidgetInfo() {
        return {
            id: 'tplSqueezeboxrpcPlayers2',
            visSet: 'vis2squeezeboxrpc',
            visSetLabel: 'squeezeboxrpc_widget_set',
            visName: 'squeezeboxrpc_players_widget',
            visAttrs: [
                {
                    name: 'common',
                    fields: [
                        { name: 'ainstance', type: 'id', label: 'squeezeboxrpc_instance' },
                        {
                            name: 'formattype',
                            type: 'select',
                            label: 'squeezeboxrpc_format',
                            default: 'formatbutton',
                            options: [
                                { value: 'formatbutton', label: 'squeezeboxrpc_format_buttons' },
                                { value: 'formatselect', label: 'squeezeboxrpc_format_select' },
                            ],
                        },
                        {
                            name: 'playerConfiguration',
                            type: 'custom',
                            label: 'squeezeboxrpc_player_configuration',
                            component: (field, data, onDataChange, props) => (
                                <PlayerConfigField data={data} onDataChange={onDataChange} props={props} />
                            ),
                        },
                        { name: 'wrapcamelcase', type: 'checkbox', default: true, label: 'squeezeboxrpc_wrap_camel_case' },
                        { name: 'editmodehelper', type: 'checkbox', default: true, label: 'squeezeboxrpc_edit_mode_helper' },
                    ],
                },
                {
                    name: 'buttonSettings',
                    label: 'squeezeboxrpc_button_settings',
                    fields: [
                        { name: 'picWidth', type: 'number', default: 50, min: 1, label: 'squeezeboxrpc_image_width' },
                        { name: 'picHeight', type: 'number', default: 50, min: 1, label: 'squeezeboxrpc_image_height' },
                        { name: 'opacity', type: 'slider', default: 0.5, min: 0, max: 1, step: 0.05, label: 'squeezeboxrpc_opacity' },
                        { name: 'borderwidth', type: 'number', default: 2, min: 0, label: 'squeezeboxrpc_border_width' },
                        {
                            name: 'borderstyle',
                            type: 'select',
                            default: 'solid',
                            label: 'squeezeboxrpc_border_style',
                            options: ['none', 'hidden', 'dotted', 'dashed', 'solid', 'double', 'groove', 'ridge', 'inset', 'outset'].map(value => ({ value, label: value })),
                        },
                        { name: 'bordercolornormal', type: 'color', default: '#2e2e2e', label: 'squeezeboxrpc_border_normal' },
                        { name: 'bordercoloractive', type: 'color', default: '#87ceeb', label: 'squeezeboxrpc_border_active' },
                        { name: 'borderradius', type: 'number', default: 5, min: 0, label: 'squeezeboxrpc_border_radius' },
                        { name: 'buttonbkcolor', type: 'color', default: '#000000', label: 'squeezeboxrpc_background' },
                        { name: 'buttonmargin', type: 'number', default: 0, min: 0, label: 'squeezeboxrpc_button_margin' },
                    ],
                },
                {
                    name: 'individualButtons',
                    label: 'squeezeboxrpc_individual_buttons',
                    indexFrom: 1,
                    indexTo: 'playerCount',
                    fields: [
                        { name: 'buttonsImage', type: 'image', label: 'squeezeboxrpc_button_image' },
                        { name: 'buttonsText', type: 'text', label: 'squeezeboxrpc_button_text' },
                    ],
                },
            ],
            visDefaultStyle: { width: 230, height: 210 },
            visPrev: 'widgets/squeezeboxrpc/img/players.png',
        };
    }

    static getI18nPrefix() {
        return 'squeezeboxrpc_';
    }

    getWidgetInfo() {
        return PlayersWidget.getWidgetInfo();
    }

    componentDidMount() {
        super.componentDidMount();
        void this.loadPlayers();
    }

    onRxDataChanged() {
        void this.loadPlayers();
    }

    async loadPlayers() {
        const request = ++this.playerRequest;
        const data = this.widgetState.rxData || this.widgetState.data || {};
        const instance = normalizeInstance(data.ainstance);
        if (!instance) {
            this.setState({ playerNames: [], selectedPlayer: '', loadingPlayers: false, playerError: I18n.t('squeezeboxrpc_select_instance') });
            return;
        }

        this.setState({ loadingPlayers: true, playerError: '' });
        try {
            const playerNames = await this.props.context.socket.sendTo(instance, 'getPlayerNames', {});
            if (request !== this.playerRequest) {
                return;
            }
            if (!Array.isArray(playerNames)) {
                throw new TypeError(I18n.t('squeezeboxrpc_invalid_response'));
            }
            const available = visiblePlayers(data, playerNames);
            const defaultPlayer = available.some(player => player.name === data.defaultPlayer)
                ? data.defaultPlayer
                : available[0]?.name || '';
            this.setState(previousState => ({
                playerNames,
                selectedPlayer: available.some(player => player.name === previousState.selectedPlayer)
                    ? previousState.selectedPlayer
                    : defaultPlayer,
                loadingPlayers: false,
                playerError: '',
            }));
        } catch (error) {
            if (request !== this.playerRequest) {
                return;
            }
            console.error(error);
            this.setState({ loadingPlayers: false, playerError: I18n.t('squeezeboxrpc_players_load_error') });
        }
    }

    renderWidgetBody(props) {
        super.renderWidgetBody(props);
        const data = this.widgetState.rxData || this.widgetState.data || {};
        const players = visiblePlayers(data, this.widgetState.playerNames);

        if (this.widgetState.playerError) {
            return <div>{this.widgetState.playerError}</div>;
        }
        if (this.widgetState.loadingPlayers && !players.length) {
            return <div>…</div>;
        }
        if (!players.length) {
            return <div>{I18n.t('squeezeboxrpc_no_visible_players')}</div>;
        }
        if (data.formattype === 'formatselect') {
            return (
                <select value={this.widgetState.selectedPlayer} onChange={event => this.setState({ selectedPlayer: event.target.value })}>
                    {players.map(player => (
                        <option key={player.name} value={player.name}>{displayName(player, false)}</option>
                    ))}
                </select>
            );
        }

        const editMode = Boolean(this.props.editMode);
        const opacity = editMode && data.editmodehelper ? 1 : Number(data.opacity ?? 0.5);
        return (
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: Number(data.buttonmargin || 0) }}>
                {players.map(player => {
                    const selected = player.name === this.widgetState.selectedPlayer;
                    const borderColor = selected ? data.bordercoloractive || '#87ceeb' : data.bordercolornormal || '#2e2e2e';
                    const commonStyle = {
                        boxSizing: /** @type {const} */ ('border-box'),
                        width: Number(data.picWidth || 50),
                        height: Number(data.picHeight || 50),
                        border: `${Number(data.borderwidth ?? 2)}px ${data.borderstyle || 'solid'} ${borderColor}`,
                        borderRadius: Number(data.borderradius ?? 5),
                        opacity: selected ? 1 : opacity,
                    };
                    return (
                        <button
                            key={player.name}
                            type="button"
                            title={player.name}
                            onClick={() => this.setState({ selectedPlayer: player.name })}
                            style={{ padding: 0, border: 0, background: 'transparent', cursor: 'pointer' }}
                        >
                            {player.image ? (
                                <img src={player.image} alt={displayName(player, false)} style={commonStyle} />
                            ) : (
                                <span
                                    style={{
                                        ...commonStyle,
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        overflow: 'hidden',
                                        padding: 2,
                                        color: '#fff',
                                        background: data.buttonbkcolor || '#000000',
                                        textAlign: 'center',
                                        overflowWrap: 'anywhere',
                                    }}
                                >
                                    {displayName(player, data.wrapcamelcase !== false)}
                                </span>
                            )}
                        </button>
                    );
                })}
            </div>
        );
    }
}

export { displayName, visiblePlayers };
export default PlayersWidget;
