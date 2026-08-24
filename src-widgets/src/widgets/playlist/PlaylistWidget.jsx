import { I18n } from '@iobroker/adapter-react-v5';
import { VisRxWidget } from '@iobroker/vis-2-widgets-react-dev';

import { playerReferenceField } from '../values/PlayerStateWidget';
import { decodePlayerWidgetReference } from '../../shared/playerWidgetReferenceUtils';
import { subscribePlayerSelection } from '../../shared/playerSelectionBus';
import { parsePlaylists, playlistLoadCommand } from './playlistUtils';
import './playlistWidget.css';

const WidgetBase = /** @type {any} */ (window.visRxWidget || VisRxWidget);

class PlaylistWidget extends WidgetBase {
    constructor(props) {
        super(props);
        const initialState = /** @type {Record<string, any>} */ (/** @type {unknown} */ (this.state));
        this.state = { ...initialState, playlists: [], loadingPlaylists: false, playlistError: '' };
        this.selectionWidget = '';
        this.selection = null;
        this.unsubscribeSelection = null;
        this.loadRequest = 0;
    }

    get widgetState() {
        return /** @type {Record<string, any>} */ (/** @type {unknown} */ (this.state));
    }

    static getI18nPrefix() {
        return 'squeezeboxrpc_';
    }

    static getWidgetInfo() {
        return {
            id: 'tplSqueezeboxrpcPlaylist2',
            visSet: 'vis2squeezeboxrpc',
            visSetLabel: 'widget_set',
            visName: 'Squeezebox Playlist',
            visAttrs: [{ name: 'common', fields: [playerReferenceField] }],
            visDefaultStyle: { width: 200, height: 200, overflow: 'hidden' },
            visPrev: 'widgets/squeezeboxrpc/img/playlist.png',
        };
    }

    getWidgetInfo() {
        return PlaylistWidget.getWidgetInfo();
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
        this.loadRequest++;
        this.unsubscribeSelection?.();
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
            this.unsubscribeSelection = widgetPlayer
                ? subscribePlayerSelection(widgetPlayer, selection => {
                      this.selection = selection;
                      void this.loadPlaylists();
                  })
                : null;
            if (!widgetPlayer) this.setState({ playlists: [], playlistError: '' });
            return;
        }
        if (configurationChanged && this.selection) void this.loadPlaylists();
    }

    async loadPlaylists() {
        const instance = this.selection?.instance;
        if (!instance) {
            this.setState({ playlists: [], loadingPlaylists: false, playlistError: '' });
            return;
        }
        const request = ++this.loadRequest;
        this.setState({ loadingPlaylists: true, playlistError: '' });
        try {
            const response = await this.props.context.socket.sendTo(instance, 'cmdGeneral', {
                playerid: '',
                cmdArray: ['playlists', '0', '999', 'tags:us'],
            });
            if (request !== this.loadRequest) return;
            this.setState({ playlists: parsePlaylists(response), loadingPlaylists: false, playlistError: '' });
        } catch (error) {
            if (request !== this.loadRequest) return;
            console.error(error);
            this.setState({ playlists: [], loadingPlaylists: false, playlistError: I18n.t('squeezeboxrpc_playlists_load_error') });
        }
    }

    async playPlaylist(playlistId) {
        if (!this.selection?.instance || !this.selection?.player) return;
        try {
            await this.props.context.socket.setState(
                `${this.selection.instance}.Players.${this.selection.player}.cmdGeneral`,
                playlistLoadCommand(playlistId),
            );
        } catch (error) {
            console.error(error);
        }
    }

    renderWidgetBody(props) {
        super.renderWidgetBody(props);
        if (!this.selectionWidget) return <div>{I18n.t('squeezeboxrpc_select_players_widget')}</div>;
        if (this.widgetState.playlistError) return <div>{this.widgetState.playlistError}</div>;
        return (
            <ul className="squeezeboxrpc-playlist">
                <li className="squeezeboxrpc-playlist-refresh-item">
                    <button type="button" className="squeezeboxrpc-playlist-refresh" title={I18n.t('squeezeboxrpc_refresh_playlists')} onClick={() => void this.loadPlaylists()}>
                        <svg focusable="false" aria-hidden="true" viewBox="0 0 24 24">
                            <path fill="currentColor" d="M17.65 6.35A7.96 7.96 0 0 0 12 4a8 8 0 1 0 7.73 10h-2.08A6 6 0 1 1 16.22 7.78L13 11h7V4z" />
                        </svg>
                    </button>
                </li>
                {this.widgetState.playlists.map(playlist => (
                    <li key={playlist.id} className="squeezeboxrpc-playlist-entry">
                        <button type="button" title={playlist.name} onClick={() => void this.playPlaylist(playlist.id)}>
                            {playlist.name}
                        </button>
                    </li>
                ))}
                {!this.widgetState.loadingPlaylists && !this.widgetState.playlists.length ? (
                    <li>{I18n.t('squeezeboxrpc_no_playlists')}</li>
                ) : null}
            </ul>
        );
    }
}

export default PlaylistWidget;
