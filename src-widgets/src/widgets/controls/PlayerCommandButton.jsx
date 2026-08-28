import { VisRxWidget } from '@iobroker/vis-2-widgets-react-dev';

import { playerCommandStateId } from './playerCommandUtils';
import { subscribePlayerSelection } from '../../shared/playerSelectionBus';
import PlayerWidgetReferenceField from '../../shared/PlayerWidgetReferenceField';
import { decodePlayerWidgetReference } from '../../shared/playerWidgetReferenceUtils';
import { translate } from '../../shared/translate';
import './playerCommandButton.css';

const WidgetBase = /** @type {any} */ (window.visRxWidget || VisRxWidget);

export function DefaultCommandIcon({ direction, fill, stroke, strokeWidth }) {
    const transform = direction === 'rewind' ? 'translate(26.458 0) scale(-1 1)' : undefined;
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
                transform={transform}
            >
                <path d="M5.376 18.805V7.588c0-.594.665-.984 1.159-.647l8.948 6.107-8.948 6.096c-.494.337-1.159-.052-1.159-.647z" />
                <path d="M10.668 18.805V7.588c0-.594.665-.984 1.159-.647l8.948 6.107-8.948 6.096c-.494.337-1.159-.052-1.159-.647z" />
                <rect
                    x="18.586"
                    y="5.357"
                    width="2.515"
                    height="15.744"
                    rx="0.289"
                />
            </g>
        </svg>
    );
}

class PlayerCommandButton extends WidgetBase {
    constructor(props) {
        super(props);
        const initialState = /** @type {Record<string, any>} */ (/** @type {unknown} */ (this.state));
        this.state = { ...initialState, commandStateId: '' };
        this.selectionWidget = '';
        this.unsubscribeSelection = null;
    }

    get widgetState() {
        return /** @type {Record<string, any>} */ (/** @type {unknown} */ (this.state));
    }

    get commandConfig() {
        return /** @type {{ command: string, imageName: string, titleKey: string }} */ (
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
                        { name: settings.imageName, type: 'image', label: settings.imageLabel },
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
        this.setState({ commandStateId: '' });
        if (widgetPlayer) {
            this.unsubscribeSelection = subscribePlayerSelection(
                widgetPlayer,
                selection => {
                    this.setState({ commandStateId: playerCommandStateId(selection, this.commandConfig.command) });
                },
                this.props.context.views,
            );
        }
    }

    async sendCommand() {
        if (!this.widgetState.commandStateId) return;
        try {
            await this.props.context.socket.setState(this.widgetState.commandStateId, true);
        } catch (error) {
            console.error(error);
        }
    }

    renderWidgetBody(props) {
        super.renderWidgetBody(props);
        const data = this.widgetState.rxData || this.widgetState.data || {};
        const image = data[this.commandConfig.imageName];
        return (
            <button
                type="button"
                className="squeezeboxrpc-command-button"
                disabled={!this.widgetState.commandStateId}
                title={translate(this.commandConfig.titleKey)}
                onClick={() => void this.sendCommand()}
            >
                {image ? (
                    <img
                        src={image}
                        alt=""
                    />
                ) : (
                    <DefaultCommandIcon
                        direction={this.commandConfig.command}
                        fill={data.fillcolor || '#ffffff'}
                        stroke={data.strokecolor || '#ffffff'}
                        strokeWidth={Number(data.strokewidth ?? 0.3)}
                    />
                )}
            </button>
        );
    }
}

export default PlayerCommandButton;
