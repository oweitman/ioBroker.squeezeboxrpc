import { useEffect, useState } from 'react';
import { VisRxWidget } from '@iobroker/vis-2-widgets-react-dev';

import { playerReferenceField } from '../values/PlayerStateWidget';
import { decodePlayerWidgetReference } from '../../shared/playerWidgetReferenceUtils';
import { mergePlayerNames, readConfiguredPlayers, cssLength } from '../../shared/playerConfigUtils';
import { subscribePlayerSelection } from '../../shared/playerSelectionBus';
import { syncCommand, syncGroupStatus } from './syncGroupUtils';
import TextImage from '../../shared/TextImage';
import { translate } from '../../shared/translate';
import './syncGroupWidget.css';

const WidgetBase = /** @type {any} */ (window.visRxWidget || VisRxWidget);
const STATE_NAMES = ['PlayerID', 'SyncMaster', 'SyncSlaves'];

function SyncPlayerContent({ player, text, width, height, backgroundColor, wrapCamelCase, style }) {
    const [imageFailed, setImageFailed] = useState(false);
    useEffect(() => setImageFailed(false), [player.image]);

    return (
        <div
            className="squeezeboxrpc-syncgroup-content"
            style={style}
        >
            <TextImage
                text={text}
                width={width}
                height={height}
                backgroundColor={backgroundColor}
                wrapCamelCase={wrapCamelCase}
                style={{ color: '#fff' }}
            />
            {player.image && !imageFailed ? (
                <img
                    src={player.image}
                    alt={text}
                    onError={() => setImageFailed(true)}
                />
            ) : null}
        </div>
    );
}

class SyncGroupWidget extends WidgetBase {
    constructor(props) {
        super(props);
        const initialState = /** @type {Record<string, any>} */ (/** @type {unknown} */ (this.state));
        this.state = { ...initialState, players: [], playerStates: {}, syncError: '' };
        this.selectionWidget = '';
        this.selection = null;
        this.unsubscribeSelection = null;
        this.subscribedStateIds = [];
        this.loadRequest = 0;
        this.handlePlayerState = this.handlePlayerState.bind(this);
    }

    get widgetState() {
        return /** @type {Record<string, any>} */ (/** @type {unknown} */ (this.state));
    }
    static getI18nPrefix() {
        return 'squeezeboxrpc_';
    }

    static getWidgetInfo() {
        return {
            id: 'tplSqueezeboxrpcSyncGroup2',
            visSet: 'squeezeboxrpc',
            visSetLabel: 'widget_set',
            visName: 'Squeezebox Syncgroup',
            visAttrs: [
                { name: 'common', fields: [playerReferenceField] },
                {
                    name: 'buttonSettings',
                    label: 'squeezeboxrpc_button_settings',
                    fields: [
                        { name: 'borderwidth', type: 'text', default: '2px', label: 'squeezeboxrpc_border_width' },
                        {
                            name: 'borderstyle',
                            type: 'select',
                            default: 'solid',
                            label: 'squeezeboxrpc_border_style',
                            noTranslation: true,
                            options: [
                                'none',
                                'hidden',
                                'dotted',
                                'dashed',
                                'solid',
                                'double',
                                'groove',
                                'ridge',
                                'inset',
                                'outset',
                            ],
                        },
                        {
                            name: 'bordercolornogroup',
                            type: 'color',
                            default: '#2e2e2e',
                            label: 'squeezeboxrpc_border_no_group',
                        },
                        {
                            name: 'bordercolorowngroup',
                            type: 'color',
                            default: '#87ceeb',
                            label: 'squeezeboxrpc_border_own_group',
                        },
                        {
                            name: 'bordercolorothergroup',
                            type: 'color',
                            default: '#ff0080',
                            label: 'squeezeboxrpc_border_other_group',
                        },
                        { name: 'borderradius', type: 'text', default: '5px', label: 'squeezeboxrpc_border_radius' },
                        { name: 'buttonbkcolor', type: 'color', default: '#000000', label: 'squeezeboxrpc_background' },
                        { name: 'buttonmargin', type: 'text', default: '0px', label: 'squeezeboxrpc_button_margin' },
                    ],
                },
            ],
            visDefaultStyle: { width: 230, height: 210 },
            visPrev: 'widgets/squeezeboxrpc/img/syncgroups.png',
        };
    }

    getWidgetInfo() {
        return SyncGroupWidget.getWidgetInfo();
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
        this.unsubscribeStates();
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
            this.selectionWidget = widgetPlayer;
            this.selection = null;
            this.unsubscribeStates();
            this.unsubscribeSelection = widgetPlayer
                ? subscribePlayerSelection(
                      widgetPlayer,
                      selection => {
                          this.selection = selection;
                          void this.loadPlayers();
                      },
                      this.props.context.views,
                  )
                : null;
            if (!widgetPlayer) this.setState({ players: [], playerStates: {}, syncError: '' });
            return;
        }
        if (configurationChanged && this.selection) void this.loadPlayers();
    }

    referencedPlayerData() {
        return this.props.context.views?.[this.props.view]?.widgets?.[this.selectionWidget]?.data || {};
    }

    async loadPlayers() {
        this.unsubscribeStates();
        const request = ++this.loadRequest;
        if (!this.selection?.instance || !this.selection?.player) {
            this.setState({ players: [], playerStates: {}, syncError: '' });
            return;
        }
        try {
            const publishedPlayers = Array.isArray(this.selection.players) ? this.selection.players : null;
            const names = publishedPlayers
                ? publishedPlayers.map(player => player.name)
                : await this.props.context.socket.sendTo(this.selection.instance, 'getPlayerNames', {});
            if (request !== this.loadRequest) return;
            if (!Array.isArray(names)) throw new TypeError('Invalid player response');
            const playerData = this.referencedPlayerData();
            const players =
                publishedPlayers ||
                mergePlayerNames(readConfiguredPlayers(playerData), names).filter(
                    player => player.enabled !== false && names.includes(player.name),
                );
            const stateIds = players.flatMap(player =>
                STATE_NAMES.map(name => `${this.selection.instance}.Players.${player.name}.${name}`),
            );
            this.subscribedStateIds = stateIds;
            stateIds.forEach(id => this.props.context.socket.subscribeState(id, this.handlePlayerState));
            const values = await Promise.all(stateIds.map(id => this.props.context.socket.getState(id)));
            if (request !== this.loadRequest) return;
            const playerStates = {};
            stateIds.forEach((id, index) => this.assignState(playerStates, id, values[index]));
            this.setState({ players, playerStates, syncError: '' });
        } catch (error) {
            if (request !== this.loadRequest) return;
            console.error(error);
            this.setState({ players: [], playerStates: {}, syncError: translate('squeezeboxrpc_players_load_error') });
        }
    }

    unsubscribeStates() {
        this.loadRequest++;
        this.subscribedStateIds.forEach(id => this.props.context.socket.unsubscribeState(id, this.handlePlayerState));
        this.subscribedStateIds = [];
    }

    assignState(target, id, state) {
        if (!state) return;
        const parts = id.split('.');
        const name = parts.at(-1);
        const player = parts.at(-2);
        target[player] = { ...(target[player] || {}), [name]: state.val };
    }

    handlePlayerState(id, state) {
        if (!this.subscribedStateIds.includes(id) || !state) return;
        this.setState(previous => {
            const playerStates = { ...previous.playerStates };
            this.assignState(playerStates, id, state);
            return { playerStates };
        });
    }

    async togglePlayer(playerName) {
        const command = syncCommand(
            this.selection?.instance,
            this.selection?.player,
            playerName,
            this.widgetState.playerStates,
        );
        if (!command) return;
        try {
            await this.props.context.socket.setState(command.stateId, command.value);
        } catch (error) {
            console.error(error);
        }
    }

    renderWidgetBody(props) {
        super.renderWidgetBody(props);
        const data = this.widgetState.rxData || this.widgetState.data || {};
        const playerData = { ...this.referencedPlayerData(), ...(this.selection?.appearance || {}) };
        if (this.widgetState.syncError) return <div>{this.widgetState.syncError}</div>;
        if (!this.widgetState.players.length) return <div>{translate('squeezeboxrpc_no_visible_players')}</div>;
        const width = Math.max(1, Number(playerData.picWidth) || 50);
        const height = Math.max(1, Number(playerData.picHeight) || 50);
        return (
            <div
                className="squeezeboxrpc-syncgroup"
                style={{ gap: cssLength(data.buttonmargin, '0px') }}
            >
                {this.widgetState.players.map(player => {
                    const status = syncGroupStatus(this.widgetState.playerStates, this.selection?.player, player.name);
                    const borderColor =
                        status === 'own'
                            ? data.bordercolorowngroup || '#87ceeb'
                            : status === 'other'
                              ? data.bordercolorothergroup || '#ff0080'
                              : data.bordercolornogroup || '#2e2e2e';
                    const contentStyle = {
                        boxSizing: /** @type {const} */ ('border-box'),
                        width,
                        height,
                        border: `${cssLength(data.borderwidth, '2px')} ${data.borderstyle || 'solid'} ${borderColor}`,
                        borderRadius: cssLength(data.borderradius, '5px'),
                    };
                    const text = player.text || player.name;
                    return (
                        <button
                            key={player.name}
                            type="button"
                            className="squeezeboxrpc-syncgroup-button"
                            title={player.name}
                            disabled={status === 'selected'}
                            onClick={() => void this.togglePlayer(player.name)}
                        >
                            <SyncPlayerContent
                                player={player}
                                text={text}
                                width={width}
                                height={height}
                                backgroundColor={data.buttonbkcolor || '#000000'}
                                wrapCamelCase={playerData.wrapcamelcase !== false}
                                style={contentStyle}
                            />
                        </button>
                    );
                })}
            </div>
        );
    }
}

export default SyncGroupWidget;
