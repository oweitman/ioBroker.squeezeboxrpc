import { VisRxWidget } from '@iobroker/vis-2-widgets-react-dev';

import { nextModeState, normalizeModeState, playerModeStateId } from './playerModeUtils';
import { subscribePlayerSelection } from '../../shared/playerSelectionBus';
import PlayerWidgetReferenceField from '../../shared/PlayerWidgetReferenceField';
import { decodePlayerWidgetReference } from '../../shared/playerWidgetReferenceUtils';
import { translate } from '../../shared/translate';
import { playerWidgetConfigurationMessage } from '../../shared/widgetConfiguration';
import './playerModeButton.css';

const WidgetBase = /** @type {any} */ (window.visRxWidget || VisRxWidget);

function RepeatIcon({ state }) {
    return state === 1 ? (
        <>
            <path
                transform="scale(.26458)"
                d="m35.471 20.607c-8.2281 0-14.852 6.6235-14.852 14.852v29.055c0 8.2281 6.6235 14.852 14.852 14.852h15.297c-0.099283-0.23342-0.20508-0.4639-0.28516-0.70898-1.0314-3.157-0.36829-6.37 1.3789-9.084h-11.549c-5.4854 0-9.9004-4.415-9.9004-9.9004v-19.371c0-5.4853 4.415-9.9004 9.9004-9.9004h0.21094c-0.0026-0.04362-0.01758-0.08476-0.01758-0.12891v-9.6641zm25.035 0v9.6641c0 0.05752-0.0189 0.11131-0.02344 0.16797 1.6304 0.12928 3.1454 0.65289 4.4551 1.4707v-4.7422h10.172l-0.17773 3.0039v0.0078c0.0017 0.81652 0.51993 2.0016 1.6992 3.5879 0.75387 1.014 1.7283 2.1484 2.7461 3.3945v-1.7031c0-8.2281-6.6235-14.852-14.852-14.852zm14.426 28.418-0.0078 23.127c0.02228 1.1774-0.15778 2.3265-0.49805 3.4277 3.0352-2.7155 4.9512-6.6543 4.9512-11.066v-4.1504c-0.56305 0.11278-1.2016 0.10116-1.877-0.18359-1.5706-0.66221-1.9257-2.0105-2.0215-2.7676-0.09574-0.75705 3e-3 -1.3469 0.18359-1.9414 0.08357-0.27565 0.31768-3.3953-0.38281-5.7285-0.08795-0.29287-0.24795-0.45038-0.34766-0.7168z"
                fill="#fff"
                stroke="#fffffb"
                strokeLinecap="round"
            />
            <path d="m10.111 9.4094v-5.3598c-0.0082 0.01812-0.0021-0.17387 0.24672-0.34879 0.24874-0.17491 0.65793 0 0.65793 0l4.6078 2.7541s0.1702 0.09835 0.16971 0.29612c-5.03e-4 0.20056-0.1784 0.32361-0.1784 0.32361l-4.5991 2.7487s-0.39816 0.13052-0.65793-0.06357c-0.25976-0.19409-0.24672-0.35035-0.24672-0.35035z" />
            <path d="m19.028 7.9826h-1.0564v9.5915c-0.58411-0.2504-1.34-0.25388-2.0856 0.04816-1.3358 0.54165-2.1316 1.8592-1.7778 2.9424 0.35402 1.0835 1.7238 1.5224 3.0594 0.98077 1.1345-0.45993 1.8767-1.4796 1.8585-2.4399l0.0018-7.8441c1.842 0.32346 1.9681 2.9181 1.7475 3.6457-0.08378 0.27574 0.06375 0.48221 0.34217 0 1.9862-3.4426-2.0896-4.9615-2.0896-6.9244z" />
        </>
    ) : (
        <>
            <path
                transform="scale(.26458)"
                d="m35.473 20.621c-8.2281 0-14.852 6.6235-14.852 14.852v29.055c0 8.2281 6.6235 14.852 14.852 14.852h29.055c8.2281 0 14.852-6.6235 14.852-14.852v-29.055c0-8.2281-6.6235-14.852-14.852-14.852h-4.0195v9.6641c0 0.05754-0.01898 0.1113-0.02344 0.16797 5.108 0.40503 9.1016 4.6456 9.1016 9.8613v19.371c0 5.4854-4.415 9.9004-9.9004 9.9004h-19.371c-5.4854 0-9.9004-4.415-9.9004-9.9004v-19.371c0-5.4854 4.415-9.9004 9.9004-9.9004h0.21094c-0.0026-0.04363-0.01758-0.08477-0.01758-0.12891v-9.6641z"
                fill="#fff"
                strokeLinecap="round"
            />
            <path d="m10.111 9.4128v-5.3598c-0.0082 0.018122-0.0021-0.17387 0.24672-0.34879 0.24874-0.17491 0.65793 0 0.65793 0l4.6078 2.7541s0.1702 0.098349 0.16971 0.29612c-4.97e-4 0.20056-0.1784 0.32361-0.1784 0.32361l-4.5991 2.7487s-0.39816 0.13052-0.65793-0.063572c-0.25976-0.19409-0.24672-0.35035-0.24672-0.35035z" />
        </>
    );
}

function ShuffleIcon({ state }) {
    return state === 2 ? (
        <>
            <path d="M5.6 5.4h10.2v2.45H5.6zM10.8 9.8H21v2.45H10.8zM5.6 14.2h10.2v2.45H5.6zM10.8 18.6h3.5V21h-3.5z" />
            <rect
                x="14.9"
                y="15.2"
                width="6.1"
                height="5.8"
                rx="0.5"
            />
        </>
    ) : (
        <path d="M5.6 5.4h10.2v2.45H5.6zM10.8 9.8H21v2.45H10.8zM5.6 14.2h10.2v2.45H5.6zM10.8 18.6H21V21H10.8z" />
    );
}

export function DefaultModeIcon({ mode, state, fill, stroke, strokeWidth }) {
    return (
        <svg
            viewBox="0 0 26.458 26.458"
            aria-hidden="true"
        >
            <g
                fill={fill}
                stroke={stroke}
                strokeWidth={strokeWidth}
                strokeLinecap="round"
                strokeLinejoin="round"
            >
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
            visSet: 'squeezeboxrpc',
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
                                <PlayerWidgetReferenceField
                                    data={data}
                                    onDataChange={onDataChange}
                                    props={props}
                                />
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
        const configurationMessage = playerWidgetConfigurationMessage(data);
        if (configurationMessage) return <div>{configurationMessage}</div>;
        const state = this.widgetState.modeState;
        const configuredImage = data[`${this.modeConfig.imagePrefix}${state}`];
        const repeat0Fallback =
            this.modeConfig.mode === 'repeat' && state === 2 ? data[`${this.modeConfig.imagePrefix}0`] : '';
        const image = configuredImage || repeat0Fallback;
        return (
            <button
                type="button"
                className="squeezeboxrpc-mode-button"
                data-mode-state={state}
                disabled={!this.widgetState.modeStateId}
                title={translate(this.modeConfig.titleKey)}
                onClick={() => void this.advanceMode()}
            >
                {image ? (
                    <img
                        src={image}
                        alt=""
                    />
                ) : (
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
