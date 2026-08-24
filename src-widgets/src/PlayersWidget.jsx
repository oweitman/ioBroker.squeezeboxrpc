import { I18n } from '@iobroker/adapter-react-v5';
import { VisRxWidget } from '@iobroker/vis-2-widgets-react-dev';

import PlayerConfigField from './PlayerConfigField';
import InstanceConfigField from './InstanceConfigField';
import TextImage from './TextImage';
import {
    cssLength,
    mergePlayerNames,
    normalizeInstance,
    readConfiguredPlayers,
    selectPlayerAfterLoad,
} from './playerConfigUtils';
import './players.css';

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
        this.playerInstance = '';
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
                        {
                            name: 'ainstance',
                            type: 'custom',
                            label: 'squeezeboxrpc_instance',
                            component: (field, data, onDataChange, props) => (
                                <InstanceConfigField data={data} onDataChange={onDataChange} props={props} />
                            ),
                        },
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
                            name: 'borderstyle',
                            type: 'select',
                            default: 'solid',
                            label: 'squeezeboxrpc_border_style',
                            options: ['none', 'hidden', 'dotted', 'dashed', 'solid', 'double', 'groove', 'ridge', 'inset', 'outset'].map(value => ({ value, label: value })),
                        },
                        { name: 'bordercolornormal', type: 'color', default: '#2e2e2e', label: 'squeezeboxrpc_border_normal' },
                        { name: 'bordercoloractive', type: 'color', default: '#87ceeb', label: 'squeezeboxrpc_border_active' },
                        { name: 'borderradius', type: 'text', default: '5px', label: 'squeezeboxrpc_border_radius' },
                        { name: 'buttonbkcolor', type: 'color', default: '#000000', label: 'squeezeboxrpc_background' },
                        { name: 'buttonmargin', type: 'text', default: '0px', label: 'squeezeboxrpc_button_margin' },
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
            this.playerInstance = '';
            this.setState({ playerNames: [], selectedPlayer: '', loadingPlayers: false, playerError: I18n.t('squeezeboxrpc_select_instance') });
            return;
        }

        const instanceChanged = instance !== this.playerInstance;
        this.playerInstance = instance;
        this.setState({
            loadingPlayers: true,
            playerError: '',
            ...(instanceChanged ? { playerNames: [], selectedPlayer: '' } : {}),
        });
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
                selectedPlayer: selectPlayerAfterLoad(
                    available,
                    previousState.selectedPlayer,
                    defaultPlayer,
                    instanceChanged,
                ),
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

        const opacity = Number(data.opacity ?? 0.5);
        return (
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: cssLength(data.buttonmargin, '0px') }}>
                {players.map(player => {
                    const selected = player.name === this.widgetState.selectedPlayer;
                    const borderColor = selected ? data.bordercoloractive || '#87ceeb' : data.bordercolornormal || '#2e2e2e';
                    const commonStyle = {
                        boxSizing: /** @type {const} */ ('border-box'),
                        width: Number(data.picWidth || 50),
                        height: Number(data.picHeight || 50),
                        border: `${cssLength(data.borderwidth, '2px')} ${data.borderstyle || 'solid'} ${borderColor}`,
                        borderRadius: cssLength(data.borderradius, '5px'),
                        opacity: selected ? 1 : opacity,
                    };
                    return (
                        <button
                            key={player.name}
                            className="squeezeboxrpc-player-button"
                            type="button"
                            title={player.name}
                            onClick={() => this.setState({ selectedPlayer: player.name })}
                            style={{
                                padding: 0,
                                border: 0,
                                background: 'transparent',
                                cursor: 'pointer',
                                '--squeezeboxrpc-active-border-color': data.bordercoloractive || '#87ceeb',
                            }}
                        >
                            {player.image ? (
                                <img src={player.image} alt={displayName(player, false)} style={commonStyle} />
                            ) : (
                                <TextImage
                                    text={displayName(player, false)}
                                    width={commonStyle.width}
                                    height={commonStyle.height}
                                    backgroundColor={data.buttonbkcolor || '#000000'}
                                    wrapCamelCase={data.wrapcamelcase !== false}
                                    style={{ ...commonStyle, color: '#fff' }}
                                />
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
