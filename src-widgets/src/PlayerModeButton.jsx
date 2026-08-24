import { I18n } from '@iobroker/adapter-react-v5';
import { VisRxWidget } from '@iobroker/vis-2-widgets-react-dev';

import { nextModeState, normalizeModeState, playerModeStateId } from './playerModeUtils';
import { subscribePlayerSelection } from './playerSelectionBus';
import PlayerWidgetReferenceField from './PlayerWidgetReferenceField';
import { decodePlayerWidgetReference } from './playerWidgetReferenceUtils';
import './playerModeButton.css';

const WidgetBase = /** @type {any} */ (window.visRxWidget || VisRxWidget);

function RepeatIcon({ state }) {
    return (
        <>
            <path d="M9.385 5.456h7.688a3.93 3.93 0 0 1 3.93 3.93v7.687a3.93 3.93 0 0 1-3.93 3.93H9.385a3.93 3.93 0 0 1-3.93-3.93V9.386a3.93 3.93 0 0 1 3.93-3.93zm1.2 2.57H9.65a1.62 1.62 0 0 0-1.62 1.62v7.168a1.62 1.62 0 0 0 1.62 1.62h7.168a1.62 1.62 0 0 0 1.62-1.62V9.646a1.62 1.62 0 0 0-1.62-1.62h-1.073" />
            <path d="M10.11 9.413V4.053c0-.36.398-.58.705-.394l4.808 2.8-4.808 2.9a.46.46 0 0 1-.705-.395z" />
            {state === 1 ? <path d="M17.972 8v8.86a2.75 2.75 0 1 0 1.056 2.17v-7.77c1.842.324 1.968 2.919 1.747 3.646-.084.276.064.482.342 0 1.986-3.443-2.09-4.962-2.09-6.924z" /> : null}
        </>
    );
}

function ShuffleIcon({ state }) {
    return state === 2 ? (
        <>
            <path d="M5.6 5.4h10.2v2.45H5.6zM10.8 9.8H21v2.45H10.8zM5.6 14.2h10.2v2.45H5.6zM10.8 18.6h3.5V21h-3.5z" />
            <rect x="14.9" y="15.2" width="6.1" height="5.8" rx="0.5" />
        </>
    ) : (
        <path d="M5.6 5.4h10.2v2.45H5.6zM10.8 9.8H21v2.45H10.8zM5.6 14.2h10.2v2.45H5.6zM10.8 18.6H21V21H10.8z" />
    );
}

export function DefaultModeIcon({ mode, state, fill, stroke, strokeWidth }) {
    return (
        <svg viewBox="0 0 26.458 26.458" aria-hidden="true">
            <g fill={fill} stroke={stroke} strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round">
                {mode === 'repeat' ? <RepeatIcon state={state} /> : <ShuffleIcon state={state} />}
            </g>
        </svg>
    );
}

class PlayerModeButton extends WidgetBase {
    constructor(props) {
        super(props);
        const initialState = /** @type {Record<string, any>} */ (/** @type {unknown} */ (this.state));
        this.state = { ...initialState, modeState: 0, modeStateId: '' };
        this.selectionWidget = '';
        this.unsubscribeSelection = null;
        this.subscribedStateId = '';
        this.stateRequest = 0;
        this.handleModeState = this.handleModeState.bind(this);
    }

    get widgetState() {
        return /** @type {Record<string, any>} */ (/** @type {unknown} */ (this.state));
    }

    get modeConfig() {
        return /** @type {{ mode: string, imagePrefix: string, titleKey: string }} */ (
            /** @type {unknown} */ (this.constructor)
        );
    }

    static createWidgetInfo(settings) {
        return {
            id: settings.id,
            visSet: 'vis2squeezeboxrpc',
            visSetLabel: 'widget_set',
            visName: settings.visName,
            visAttrs: [
                {
                    name: 'common',
                    fields: [
                        {
                            name: 'widgetPlayer',
                            type: 'custom',
                            label: 'squeezeboxrpc_players_widget_reference',
                            component: (field, data, onDataChange, props) => (
                                <PlayerWidgetReferenceField data={data} onDataChange={onDataChange} props={props} />
                            ),
                        },
                        { name: `${settings.imagePrefix}0`, type: 'image', label: 'squeezeboxrpc_mode_off_image' },
                        { name: `${settings.imagePrefix}1`, type: 'image', label: 'squeezeboxrpc_mode_one_image' },
                        { name: `${settings.imagePrefix}2`, type: 'image', label: 'squeezeboxrpc_mode_two_image' },
                    ],
                },
                {
                    name: 'svgSettings',
                    label: 'squeezeboxrpc_svg_settings',
                    fields: [
                        { name: 'fillcolor', type: 'color', default: '#ffffff', label: 'squeezeboxrpc_fill_color' },
                        { name: 'strokecolor', type: 'color', default: '#ffffff', label: 'squeezeboxrpc_stroke_color' },
                        { name: 'strokewidth', type: 'number', default: 0.3, label: 'squeezeboxrpc_stroke_width' },
                    ],
                },
            ],
            visDefaultStyle: { width: 50, height: 50 },
            visPrev: settings.preview,
        };
    }

    static getI18nPrefix() {
        return 'squeezeboxrpc_';
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
        this.unsubscribeModeState();
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
        this.unsubscribeModeState();
        if (widgetPlayer) {
            this.unsubscribeSelection = subscribePlayerSelection(widgetPlayer, selection => {
                void this.usePlayerSelection(selection);
            });
        }
    }

    async usePlayerSelection(selection) {
        const stateId = playerModeStateId(selection, this.modeConfig.mode);
        if (stateId === this.subscribedStateId) return;

        this.unsubscribeModeState();
        const request = ++this.stateRequest;
        if (!stateId) {
            this.setState({ modeState: 0, modeStateId: '' });
            return;
        }

        this.subscribedStateId = stateId;
        this.props.context.socket.subscribeState(stateId, this.handleModeState);
        this.setState({ modeState: 0, modeStateId: stateId });
        try {
            const state = await this.props.context.socket.getState(stateId);
            if (request === this.stateRequest && stateId === this.subscribedStateId && state) {
                this.handleModeState(stateId, state);
            }
        } catch (error) {
            console.error(error);
        }
    }

    unsubscribeModeState() {
        this.stateRequest++;
        if (this.subscribedStateId) {
            this.props.context.socket.unsubscribeState(this.subscribedStateId, this.handleModeState);
            this.subscribedStateId = '';
        }
    }

    handleModeState(id, state) {
        if (id !== this.subscribedStateId || !state) return;
        this.setState({ modeState: normalizeModeState(state.val) });
    }

    async advanceMode() {
        if (!this.widgetState.modeStateId) return;
        try {
            await this.props.context.socket.setState(
                this.widgetState.modeStateId,
                nextModeState(this.widgetState.modeState),
            );
        } catch (error) {
            console.error(error);
        }
    }

    renderWidgetBody(props) {
        super.renderWidgetBody(props);
        const data = this.widgetState.rxData || this.widgetState.data || {};
        const state = this.widgetState.modeState;
        const image = data[`${this.modeConfig.imagePrefix}${state}`];
        return (
            <button
                type="button"
                className="squeezeboxrpc-mode-button"
                data-mode-state={state}
                disabled={!this.widgetState.modeStateId}
                title={I18n.t(this.modeConfig.titleKey)}
                onClick={() => void this.advanceMode()}
            >
                {image ? <img src={image} alt="" /> : (
                    <DefaultModeIcon
                        mode={this.modeConfig.mode}
                        state={state}
                        fill={data.fillcolor || '#ffffff'}
                        stroke={data.strokecolor || '#ffffff'}
                        strokeWidth={Number(data.strokewidth ?? 0.3)}
                    />
                )}
            </button>
        );
    }
}

export default PlayerModeButton;
