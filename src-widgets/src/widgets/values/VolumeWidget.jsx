import PlayerStateWidget, { playerReferenceField } from './PlayerStateWidget';
import { activeVolumeSegments, playerAttributeStateId, volumeFromPointer } from './playerStateUtils';
import { cssLength } from '../../shared/playerConfigUtils';
import './volumeWidget.css';

class VolumeWidget extends PlayerStateWidget {
    static getWidgetInfo() {
        return {
            id: 'tplSqueezeboxrpcVolume2',
            visSet: 'squeezeboxrpc',
            visSetLabel: 'widget_set',
            visName: 'Squeezebox Volume bar',
            visAttrs: [
                {
                    name: 'common',
                    fields: [
                        playerReferenceField,
                        {
                            name: 'calctype',
                            type: 'select',
                            default: 'segstep',
                            label: 'squeezeboxrpc_calculation',
                            options: [
                                { value: 'segstep', label: 'squeezeboxrpc_segment_steps' },
                                { value: 'exact', label: 'squeezeboxrpc_exact' },
                            ],
                        },
                        {
                            name: 'segments',
                            type: 'number',
                            default: 10,
                            min: 2,
                            max: 100,
                            label: 'squeezeboxrpc_segments',
                        },
                        {
                            name: 'position',
                            type: 'select',
                            default: 'vertical',
                            label: 'squeezeboxrpc_orientation',
                            options: [
                                { value: 'horizontal', label: 'squeezeboxrpc_horizontal' },
                                { value: 'vertical', label: 'squeezeboxrpc_vertical' },
                            ],
                        },
                        { name: 'reverse', type: 'checkbox', label: 'squeezeboxrpc_reverse' },
                    ],
                },
                {
                    name: 'segmentSettings',
                    label: 'squeezeboxrpc_segment_settings',
                    fields: [
                        {
                            name: 'fillcolornormal',
                            type: 'color',
                            default: '#005000',
                            label: 'squeezeboxrpc_inactive_fill',
                        },
                        {
                            name: 'fillcoloractive',
                            type: 'color',
                            default: '#00ff00',
                            label: 'squeezeboxrpc_active_fill',
                        },
                        {
                            name: 'bordercolornormal',
                            type: 'color',
                            default: '#909090',
                            label: 'squeezeboxrpc_border_normal',
                        },
                        {
                            name: 'bordercoloractive',
                            type: 'color',
                            default: '#87ceeb',
                            label: 'squeezeboxrpc_border_active',
                        },
                        { name: 'margin', type: 'text', default: '1px', label: 'squeezeboxrpc_segment_margin' },
                        { name: 'borderwidth', type: 'text', default: '1px', label: 'squeezeboxrpc_border_width' },
                    ],
                },
            ],
            visDefaultStyle: { width: 20, height: 100 },
            visPrev: 'widgets/squeezeboxrpc/img/volume.png',
        };
    }

    getWidgetInfo() {
        return VolumeWidget.getWidgetInfo();
    }

    async usePlayerSelection(selection) {
        const stateId = playerAttributeStateId(selection, 'Volume');
        if (stateId === this.subscribedStateId) return;
        this.unsubscribePlayerState();
        const request = ++this.stateRequest;
        if (!stateId) {
            this.setState({ playerValue: 0, playerStateId: '' });
            return;
        }
        this.subscribedStateId = stateId;
        this.props.context.socket.subscribeState(stateId, this.handlePlayerState);
        this.setState({ playerValue: 0, playerStateId: stateId });
        try {
            const state = await this.props.context.socket.getState(stateId);
            if (request === this.stateRequest && stateId === this.subscribedStateId && state)
                this.handlePlayerState(stateId, state);
        } catch (error) {
            console.error(error);
        }
    }

    async setVolume(event) {
        if (!this.widgetState.playerStateId) return;
        const data = this.widgetState.rxData || this.widgetState.data || {};
        const rect = event.currentTarget.getBoundingClientRect();
        const horizontal = data.position === 'horizontal';
        const position = horizontal ? event.clientX - rect.left : event.clientY - rect.top;
        const size = horizontal ? rect.width : rect.height;
        const volume = volumeFromPointer(position, size, data.segments, data.calctype, data.reverse);
        this.setState({ playerValue: volume });
        try {
            await this.props.context.socket.setState(this.widgetState.playerStateId, volume);
        } catch (error) {
            console.error(error);
        }
    }

    renderWidgetBody(props) {
        super.renderWidgetBody(props);
        const data = this.widgetState.rxData || this.widgetState.data || {};
        const configurationMessage = this.configurationMessage(false);
        if (configurationMessage) return <div>{configurationMessage}</div>;
        const segments = Math.max(2, Number.parseInt(data.segments, 10) || 10);
        const active = activeVolumeSegments(this.widgetState.playerValue, segments);
        const reverse = Boolean(data.reverse);
        const borderWidth = cssLength(data.borderwidth, '1px');
        const margin = cssLength(data.margin, '1px');
        return (
            <div
                className={`squeezeboxrpc-volume ${data.position === 'horizontal' ? 'horizontal' : 'vertical'}${this.widgetState.playerStateId ? '' : ' disabled'}`}
                onClick={event => void this.setVolume(event)}
            >
                {Array.from({ length: segments }, (_, index) => {
                    const isActive = reverse ? index >= segments - active : index < active;
                    return (
                        <div
                            key={index}
                            className="squeezeboxrpc-volume-segment"
                            style={{
                                margin,
                                outline: `${borderWidth} solid ${isActive ? data.bordercoloractive || '#87ceeb' : data.bordercolornormal || '#909090'}`,
                                backgroundColor: isActive
                                    ? data.fillcoloractive || '#00ff00'
                                    : data.fillcolornormal || '#005000',
                            }}
                        />
                    );
                })}
            </div>
        );
    }
}

export default VolumeWidget;
