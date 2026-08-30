import { VisRxWidget } from '@iobroker/vis-2-widgets-react-dev';

import { normalizePlaybackState, playerStateId } from './playButtonUtils';
import { subscribePlayerSelection } from '../../shared/playerSelectionBus';
import PlayerWidgetReferenceField from '../../shared/PlayerWidgetReferenceField';
import { decodePlayerWidgetReference } from '../../shared/playerWidgetReferenceUtils';
import { translate } from '../../shared/translate';
import { playerWidgetConfigurationMessage } from '../../shared/widgetConfiguration';
import InlineSvgIcon from '../../shared/InlineSvgIcon';
import './playButton.css';

const WidgetBase = /** @type {any} */ (window.visRxWidget || VisRxWidget);

function DefaultIcon({ mode, fill, stroke, strokeWidth }) {
    return (
        <InlineSvgIcon
            name={mode === 'pause' ? 'pause' : 'play'}
            fill={fill}
            stroke={stroke}
            strokeWidth={strokeWidth}
        />
    );
}

class PlayButtonWidget extends WidgetBase {
    constructor(props) {
        super(props);
        const initialState = /** @type {Record<string, any>} */ (/** @type {unknown} */ (this.state));
        this.state = { ...initialState, playerState: 2, playerStateId: '' };
        this.selectionWidget = '';
        this.unsubscribeSelection = null;
        this.subscribedStateId = '';
        this.stateRequest = 0;
        this.handlePlayerState = this.handlePlayerState.bind(this);
    }

    get widgetState() {
        return /** @type {Record<string, any>} */ (/** @type {unknown} */ (this.state));
    }

    static getWidgetInfo() {
        return {
            id: 'tplSqueezeboxrpcPlay2',
            visSet: 'squeezeboxrpc',
            visSetLabel: 'widget_set',
            visName: 'Squeezebox Play button',
            visAttrs: [
                {
                    name: 'common',
                    fields: [
                        {
                            name: 'widgetPlayer',
                            type: 'custom',
                            label: 'squeezeboxrpc_players_widget_reference',
                            component: (field, data, onDataChange, props) => (
                                <PlayerWidgetReferenceField
                                    data={data}
                                    onDataChange={onDataChange}
                                    props={props}
                                />
                            ),
                        },
                        { name: 'imagepause', type: 'image', label: 'squeezeboxrpc_pause_image' },
                        { name: 'imageplay', type: 'image', label: 'squeezeboxrpc_play_image' },
                        { name: 'imagestop', type: 'image', label: 'squeezeboxrpc_stop_image' },
                    ],
                },
                {
                    name: 'svgSettings',
                    label: 'squeezeboxrpc_svg_settings',
                    fields: [
                        { name: 'fillcolor', type: 'color', label: 'squeezeboxrpc_fill_color' },
                        { name: 'strokecolor', type: 'color', label: 'squeezeboxrpc_stroke_color' },
                        { name: 'strokewidth', type: 'number', default: 0.3, label: 'squeezeboxrpc_stroke_width' },
                    ],
                },
            ],
            visDefaultStyle: { width: 50, height: 50 },
            visPrev:
                '<span style="display:block;margin-left:auto;margin-right:auto;aspect-ratio:1;background-color:currentColor;-webkit-mask:url(widgets/squeezeboxrpc/img/play.svg) center/contain no-repeat;mask:url(widgets/squeezeboxrpc/img/play.svg) center/contain no-repeat;"></span>',
        };
    }

    static getI18nPrefix() {
        return 'squeezeboxrpc_';
    }

    getWidgetInfo() {
        return PlayButtonWidget.getWidgetInfo();
    }

    componentDidMount() {
        super.componentDidMount();
        this.syncSelectionSubscription();
    }

    componentDidUpdate() {
        this.syncSelectionSubscription();
    }

    componentWillUnmount() {
        this.unsubscribeSelection?.();
        this.unsubscribePlayerState();
        super.componentWillUnmount();
    }

    onRxDataChanged() {
        this.syncSelectionSubscription();
    }

    syncSelectionSubscription() {
        const data = this.widgetState.rxData || this.widgetState.data || {};
        const widgetPlayer = decodePlayerWidgetReference(data.widgetPlayer);
        if (widgetPlayer === this.selectionWidget) return;

        this.unsubscribeSelection?.();
        this.unsubscribeSelection = null;
        this.selectionWidget = widgetPlayer;
        this.unsubscribePlayerState();
        if (widgetPlayer) {
            this.unsubscribeSelection = subscribePlayerSelection(
                widgetPlayer,
                selection => {
                    void this.usePlayerSelection(selection);
                },
                this.props.context.views,
            );
        }
    }

    async usePlayerSelection(selection) {
        const stateId = playerStateId(selection);
        if (stateId === this.subscribedStateId) return;

        this.unsubscribePlayerState();
        const request = ++this.stateRequest;
        if (!stateId) {
            this.setState({ playerState: 2, playerStateId: '' });
            return;
        }

        this.subscribedStateId = stateId;
        this.props.context.socket.subscribeState(stateId, this.handlePlayerState);
        this.setState({ playerStateId: stateId });
        try {
            const state = await this.props.context.socket.getState(stateId);
            if (request === this.stateRequest && stateId === this.subscribedStateId) {
                this.handlePlayerState(stateId, state);
            }
        } catch (error) {
            console.error(error);
        }
    }

    unsubscribePlayerState() {
        this.stateRequest++;
        if (this.subscribedStateId) {
            this.props.context.socket.unsubscribeState(this.subscribedStateId, this.handlePlayerState);
            this.subscribedStateId = '';
        }
    }

    handlePlayerState(id, state) {
        if (id !== this.subscribedStateId || !state) return;
        this.setState({ playerState: normalizePlaybackState(state.val) });
    }

    async togglePlayback() {
        if (!this.widgetState.playerStateId) return;
        const nextState = this.widgetState.playerState === 1 ? 0 : 1;
        try {
            await this.props.context.socket.setState(this.widgetState.playerStateId, nextState);
        } catch (error) {
            console.error(error);
        }
    }

    renderWidgetBody(props) {
        super.renderWidgetBody(props);
        const data = this.widgetState.rxData || this.widgetState.data || {};
        const configurationMessage = playerWidgetConfigurationMessage(data);
        if (configurationMessage) return <div>{configurationMessage}</div>;
        const mode = this.widgetState.playerState === 1 ? 'pause' : 'play';
        const image =
            mode === 'pause'
                ? data.imagepause
                : this.widgetState.playerState === 2
                  ? data.imagestop || data.imageplay
                  : data.imageplay;

        return (
            <button
                type="button"
                className="squeezeboxrpc-play-button"
                disabled={!this.widgetState.playerStateId}
                title={mode === 'pause' ? translate('squeezeboxrpc_pause') : translate('squeezeboxrpc_play')}
                onClick={() => void this.togglePlayback()}
            >
                {image ? (
                    <img
                        src={image}
                        alt=""
                    />
                ) : (
                    <DefaultIcon
                        mode={mode}
                        fill={data.fillcolor || 'currentColor'}
                        stroke={data.strokecolor || 'currentColor'}
                        strokeWidth={Number(data.strokewidth ?? 0.3)}
                    />
                )}
            </button>
        );
    }
}

export { DefaultIcon };
export default PlayButtonWidget;
