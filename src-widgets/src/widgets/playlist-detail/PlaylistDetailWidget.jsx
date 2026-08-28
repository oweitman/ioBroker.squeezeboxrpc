import { VisRxWidget } from '@iobroker/vis-2-widgets-react-dev';

import { cssLength } from '../../shared/playerConfigUtils';
import { subscribePlayerSelection } from '../../shared/playerSelectionBus';
import { decodePlayerWidgetReference } from '../../shared/playerWidgetReferenceUtils';
import { playerReferenceField } from '../values/PlayerStateWidget';
import { translate } from '../../shared/translate';
import {
    formatPlaylistDuration,
    parsePlaylistDetail,
    playlistDeleteCommand,
    playlistDetailStateIds,
} from './playlistDetailUtils';
import './playlistDetailWidget.css';

const WidgetBase = /** @type {any} */ (window.visRxWidget || VisRxWidget);

function PlayIcon() {
    return (
        <svg
            focusable="false"
            aria-hidden="true"
            viewBox="0 0 24 24"
        >
            <path
                fill="currentColor"
                d="M8 5v14l11-7z"
            />
        </svg>
    );
}

function DeleteIcon() {
    return (
        <svg
            focusable="false"
            aria-hidden="true"
            viewBox="0 0 24 24"
        >
            <path
                fill="currentColor"
                d="M6 19c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V7H6v12zM8 9h8v10H8V9zm7.5-5-1-1h-5l-1 1H5v2h14V4z"
            />
        </svg>
    );
}

class PlaylistDetailWidget extends WidgetBase {
    constructor(props) {
        super(props);
        const initialState = /** @type {Record<string, any>} */ (/** @type {unknown} */ (this.state));
        this.state = { ...initialState, entries: [], currentIndex: -1, playlistStateIds: null };
        this.selectionWidget = '';
        this.unsubscribeSelection = null;
        this.subscribedIds = [];
        this.playlistStateIds = null;
        this.stateRequest = 0;
        this.handleState = this.handleState.bind(this);
    }

    get widgetState() {
        return /** @type {Record<string, any>} */ (/** @type {unknown} */ (this.state));
    }

    static getI18nPrefix() {
        return 'squeezeboxrpc_';
    }

    static getWidgetInfo() {
        return {
            id: 'tplSqueezeboxrpcPlaylistDetail2',
            visSet: 'squeezeboxrpc',
            visSetLabel: 'widget_set',
            visName: 'Squeezebox PlaylistDetail',
            visAttrs: [
                { name: 'common', fields: [playerReferenceField] },
                {
                    name: 'rowSettings',
                    label: 'squeezeboxrpc_row_settings',
                    fields: [
                        {
                            name: 'rowBackground',
                            type: 'color',
                            default: '#f5f7fa',
                            label: 'squeezeboxrpc_row_background',
                        },
                        {
                            name: 'activeRowBackground',
                            type: 'color',
                            default: '#dbeafe',
                            label: 'squeezeboxrpc_active_row_background',
                        },
                        {
                            name: 'rowBorderColor',
                            type: 'color',
                            default: '#cbd5e1',
                            label: 'squeezeboxrpc_border_color',
                        },
                        { name: 'rowBorderWidth', type: 'text', default: '1px', label: 'squeezeboxrpc_border_width' },
                        {
                            name: 'rowBorderStyle',
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
                        { name: 'rowSpacing', type: 'text', default: '4px', label: 'squeezeboxrpc_row_spacing' },
                        {
                            name: 'showThumbnail',
                            type: 'checkbox',
                            default: true,
                            label: 'squeezeboxrpc_show_thumbnail',
                        },
                        {
                            name: 'showIndex',
                            type: 'checkbox',
                            default: true,
                            label: 'squeezeboxrpc_show_index',
                        },
                    ],
                },
            ],
            visDefaultStyle: { width: 480, height: 320, overflow: 'hidden' },
            visPrev: 'widgets/squeezeboxrpc/img/playlistdetail.png',
        };
    }

    getWidgetInfo() {
        return PlaylistDetailWidget.getWidgetInfo();
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
        this.syncSelectionSubscription();
    }

    syncSelectionSubscription() {
        const data = this.widgetState.rxData || this.widgetState.data || {};
        const widgetPlayer = decodePlayerWidgetReference(data.widgetPlayer);
        if (widgetPlayer === this.selectionWidget) {
            return;
        }
        this.unsubscribeSelection?.();
        this.unsubscribeSelection = null;
        this.selectionWidget = widgetPlayer;
        this.unsubscribeStates();
        if (widgetPlayer) {
            this.unsubscribeSelection = subscribePlayerSelection(
                widgetPlayer,
                selection => void this.usePlayerSelection(selection),
                this.props.context.views,
            );
        } else {
            this.setState({ entries: [], currentIndex: -1, playlistStateIds: null });
        }
    }

    async usePlayerSelection(selection) {
        const ids = playlistDetailStateIds(selection);
        const nextIds = ids ? [ids.playlist, ids.currentIndex] : [];
        if (nextIds.join('|') === this.subscribedIds.join('|')) {
            return;
        }
        this.unsubscribeStates();
        const request = ++this.stateRequest;
        if (!ids) {
            this.setState({ entries: [], currentIndex: -1, playlistStateIds: null });
            return;
        }
        this.playlistStateIds = ids;
        this.subscribedIds = nextIds;
        nextIds.forEach(id => this.props.context.socket.subscribeState(id, this.handleState));
        this.setState({ entries: [], currentIndex: -1, playlistStateIds: ids });
        try {
            const states = await Promise.all(nextIds.map(id => this.props.context.socket.getState(id)));
            if (request === this.stateRequest && nextIds.join('|') === this.subscribedIds.join('|')) {
                states.forEach((state, index) => {
                    if (state) {
                        this.handleState(nextIds[index], state);
                    }
                });
            }
        } catch (error) {
            console.error(error);
        }
    }

    unsubscribeStates() {
        this.stateRequest++;
        this.subscribedIds.forEach(id => this.props.context.socket.unsubscribeState(id, this.handleState));
        this.subscribedIds = [];
        this.playlistStateIds = null;
    }

    handleState(id, state) {
        const ids = this.playlistStateIds;
        if (!ids || !state) {
            return;
        }
        if (id === ids.playlist) {
            this.setState({ entries: parsePlaylistDetail(state.val) });
        } else if (id === ids.currentIndex) {
            const currentIndex = Number(state.val);
            this.setState({ currentIndex: Number.isFinite(currentIndex) ? currentIndex : -1 });
        }
    }

    async play(index) {
        const ids = this.playlistStateIds;
        if (!ids) {
            return;
        }
        this.setState({ currentIndex: index });
        try {
            await this.props.context.socket.setState(ids.currentIndex, String(index));
        } catch (error) {
            console.error(error);
        }
    }

    async remove(index) {
        const ids = this.playlistStateIds;
        if (!ids) {
            return;
        }
        try {
            await this.props.context.socket.setState(ids.command, playlistDeleteCommand(index));
        } catch (error) {
            console.error(error);
        }
    }

    renderWidgetBody(props) {
        super.renderWidgetBody(props);
        const data = this.widgetState.rxData || this.widgetState.data || {};
        const showThumbnail = data.showThumbnail !== false;
        const showIndex = data.showIndex !== false;
        if (!this.selectionWidget) {
            return <div>{translate('squeezeboxrpc_select_players_widget')}</div>;
        }
        if (!this.widgetState.entries.length) {
            return <div>{translate('squeezeboxrpc_playlist_detail_empty')}</div>;
        }
        return (
            <div className="squeezeboxrpc-playlist-detail">
                {this.widgetState.entries.map(entry => {
                    const active = entry.index === this.widgetState.currentIndex;
                    const activeBackground = data.activeRowBackground || '#dbeafe';
                    const title = showIndex ? `${entry.index + 1}. ${entry.title}` : entry.title;
                    return (
                        <div
                            key={`${entry.id}-${entry.index}`}
                            className={`squeezeboxrpc-playlist-detail-row${showThumbnail ? '' : ' no-thumbnail'}`}
                            style={
                                /** @type {any} */ ({
                                    marginBottom: cssLength(data.rowSpacing, '4px'),
                                    border: `${cssLength(data.rowBorderWidth, '1px')} ${data.rowBorderStyle || 'solid'} ${data.rowBorderColor || '#cbd5e1'}`,
                                    '--squeezeboxrpc-row-background': active
                                        ? activeBackground
                                        : data.rowBackground || '#f5f7fa',
                                    '--squeezeboxrpc-row-hover-background': activeBackground,
                                })
                            }
                        >
                            {showThumbnail ? (
                                <div>
                                    {entry.artworkUrl ? (
                                        <img
                                            className="squeezeboxrpc-playlist-detail-thumbnail"
                                            src={entry.artworkUrl}
                                            alt=""
                                            onError={event => {
                                                event.currentTarget.style.visibility = 'hidden';
                                            }}
                                        />
                                    ) : null}
                                </div>
                            ) : null}
                            <div className="squeezeboxrpc-playlist-detail-text">
                                <div
                                    className="squeezeboxrpc-playlist-detail-line squeezeboxrpc-playlist-detail-title"
                                    title={title}
                                >
                                    {title}
                                </div>
                                <div
                                    className="squeezeboxrpc-playlist-detail-line"
                                    title={entry.artist}
                                >
                                    {entry.artist}
                                </div>
                                <div
                                    className="squeezeboxrpc-playlist-detail-line"
                                    title={entry.album}
                                >
                                    {entry.album}
                                </div>
                            </div>
                            <div className="squeezeboxrpc-playlist-detail-actions">
                                <span className="squeezeboxrpc-playlist-detail-duration">
                                    {formatPlaylistDuration(entry.duration)}
                                </span>
                                <div className="squeezeboxrpc-playlist-detail-buttons">
                                    <button
                                        type="button"
                                        className="squeezeboxrpc-playlist-detail-button"
                                        title={translate('squeezeboxrpc_play')}
                                        onClick={() => void this.play(entry.index)}
                                    >
                                        <PlayIcon />
                                    </button>
                                    <button
                                        type="button"
                                        className="squeezeboxrpc-playlist-detail-button"
                                        title={translate('squeezeboxrpc_playlist_detail_delete')}
                                        onClick={() => void this.remove(entry.index)}
                                    >
                                        <DeleteIcon />
                                    </button>
                                </div>
                            </div>
                        </div>
                    );
                })}
            </div>
        );
    }
}

export default PlaylistDetailWidget;
