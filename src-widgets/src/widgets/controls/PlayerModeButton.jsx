import { VisRxWidget } from '@iobroker/vis-2-widgets-react-dev';

import { nextModeState, normalizeModeState, playerModeStateId } from './playerModeUtils';
import { subscribePlayerSelection } from '../../shared/playerSelectionBus';
import PlayerWidgetReferenceField from '../../shared/PlayerWidgetReferenceField';
import { decodePlayerWidgetReference } from '../../shared/playerWidgetReferenceUtils';
import { translate } from '../../shared/translate';
import { playerWidgetConfigurationMessage } from '../../shared/widgetConfiguration';
import InlineSvgIcon from '../../shared/InlineSvgIcon';
import './playerModeButton.css';

const WidgetBase = /** @type {any} */ (window.visRxWidget || VisRxWidget);

export function DefaultModeIcon({ mode, state, fill, stroke, strokeWidth }) {
    const name = mode === 'repeat' ? (state === 1 ? 'repeat1' : 'repeat0') : state === 2 ? 'shuffle2' : 'shuffle0';
    return (
        <InlineSvgIcon
            name={name}
            fill={fill}
            stroke={stroke}
            strokeWidth={strokeWidth}
        />
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
                        { name: 'fillcolor', type: 'color', label: 'squeezeboxrpc_fill_color' },
                        { name: 'strokecolor', type: 'color', label: 'squeezeboxrpc_stroke_color' },
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
                        fill={data.fillcolor || 'currentColor'}
                        stroke={data.strokecolor || 'currentColor'}
                        strokeWidth={Number(data.strokewidth ?? 0.3)}
                    />
                )}
            </button>
        );
    }
}

export default PlayerModeButton;
