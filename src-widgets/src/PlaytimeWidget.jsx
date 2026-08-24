import { VisRxWidget } from '@iobroker/vis-2-widgets-react-dev';

import { cssLength } from './playerConfigUtils';
import { playtimePercent, playtimeStateIds } from './playerStateUtils';
import { subscribePlayerSelection } from './playerSelectionBus';
import { playerReferenceField } from './PlayerStateWidget';
import { decodePlayerWidgetReference } from './playerWidgetReferenceUtils';
import './playtimeWidget.css';

const WidgetBase = /** @type {any} */ (window.visRxWidget || VisRxWidget);

class PlaytimeWidget extends WidgetBase {
    constructor(props) {
        super(props);
        const initialState = /** @type {Record<string, any>} */ (/** @type {unknown} */ (this.state));
        this.state = { ...initialState, duration: 0, time: 0, playback: 0, playtimeIds: null };
        this.selectionWidget = '';
        this.unsubscribeSelection = null;
        this.subscribedIds = [];
        this.stateRequest = 0;
        this.handleState = this.handleState.bind(this);
    }

    get widgetState() { return /** @type {Record<string, any>} */ (/** @type {unknown} */ (this.state)); }
    static getI18nPrefix() { return 'squeezeboxrpc_'; }

    static getWidgetInfo() {
        return {
            id: 'tplSqueezeboxrpcPlaytime2', visSet: 'vis2squeezeboxrpc', visSetLabel: 'widget_set',
            visName: 'Squeezebox Playtime bar',
            visAttrs: [{ name: 'common', fields: [
                playerReferenceField,
                { name: 'mainbarcolor', type: 'color', default: '#909090', label: 'squeezeboxrpc_main_bar_color' },
                { name: 'playtimebarcolor', type: 'color', default: '#00ff00', label: 'squeezeboxrpc_playtime_color' },
                { name: 'borderwidth', type: 'text', default: '2px', label: 'squeezeboxrpc_border_width' },
                { name: 'borderstyle', type: 'select', default: 'solid', label: 'squeezeboxrpc_border_style', options: ['none', 'hidden', 'dotted', 'dashed', 'solid', 'double', 'groove', 'ridge', 'inset', 'outset'].map(value => ({ value, label: value })) },
                { name: 'bordercolor', type: 'color', default: '#ffffff', label: 'squeezeboxrpc_border_color' },
                { name: 'borderradius', type: 'text', default: '2px', label: 'squeezeboxrpc_border_radius' },
            ] }],
            visDefaultStyle: { width: 200, height: 10 },
            visPrev: 'widgets/squeezeboxrpc/img/playtime.png',
        };
    }

    getWidgetInfo() { return PlaytimeWidget.getWidgetInfo(); }

    componentDidMount() { super.componentDidMount(); this.syncSelectionSubscription(); }
    componentDidUpdate() { this.syncSelectionSubscription(); }
    onRxDataChanged() { this.syncSelectionSubscription(); }
    componentWillUnmount() {
        this.unsubscribeSelection?.();
        this.unsubscribeStates();
        super.componentWillUnmount();
    }

    syncSelectionSubscription() {
        const data = this.widgetState.rxData || this.widgetState.data || {};
        const widgetPlayer = decodePlayerWidgetReference(data.widgetPlayer);
        if (widgetPlayer === this.selectionWidget) return;
        this.unsubscribeSelection?.();
        this.unsubscribeSelection = null;
        this.selectionWidget = widgetPlayer;
        this.unsubscribeStates();
        if (widgetPlayer) this.unsubscribeSelection = subscribePlayerSelection(widgetPlayer, selection => void this.usePlayerSelection(selection));
    }

    async usePlayerSelection(selection) {
        const ids = playtimeStateIds(selection);
        const nextIds = ids ? [ids.duration, ids.time, ids.playback] : [];
        if (nextIds.join('|') === this.subscribedIds.join('|')) return;
        this.unsubscribeStates();
        const request = ++this.stateRequest;
        if (!ids) {
            this.setState({ duration: 0, time: 0, playback: 0, playtimeIds: null });
            return;
        }
        this.subscribedIds = nextIds;
        nextIds.forEach(id => this.props.context.socket.subscribeState(id, this.handleState));
        this.setState({ duration: 0, time: 0, playback: 0, playtimeIds: ids });
        try {
            const states = await Promise.all(nextIds.map(id => this.props.context.socket.getState(id)));
            if (request === this.stateRequest && nextIds.join('|') === this.subscribedIds.join('|')) {
                states.forEach((state, index) => { if (state) this.handleState(nextIds[index], state); });
            }
        } catch (error) {
            console.error(error);
        }
    }

    unsubscribeStates() {
        this.stateRequest++;
        this.subscribedIds.forEach(id => this.props.context.socket.unsubscribeState(id, this.handleState));
        this.subscribedIds = [];
    }

    handleState(id, state) {
        const ids = this.widgetState.playtimeIds;
        if (!state || !ids) return;
        if (id === ids.duration) this.setState({ duration: Number(state.val) || 0 });
        else if (id === ids.time) this.setState({ time: Number(state.val) || 0 });
        else if (id === ids.playback) this.setState({ playback: Number(state.val) || 0 });
    }

    async seek(event) {
        const ids = this.widgetState.playtimeIds;
        if (!ids || !(this.widgetState.duration > 0)) return;
        const rect = event.currentTarget.getBoundingClientRect();
        if (!(rect.width > 0)) return;
        const ratio = Math.min(1, Math.max(0, (event.clientX - rect.left) / rect.width));
        const time = ratio * this.widgetState.duration;
        try {
            await this.props.context.socket.setState(ids.goTime, String(time));
        } catch (error) {
            console.error(error);
        }
    }

    renderWidgetBody(props) {
        super.renderWidgetBody(props);
        const data = this.widgetState.rxData || this.widgetState.data || {};
        const width = playtimePercent(this.widgetState.time, this.widgetState.duration, this.widgetState.playback);
        return <div
            className={`squeezeboxrpc-playtime${this.widgetState.playtimeIds ? '' : ' disabled'}`}
            onClick={event => void this.seek(event)}
            style={{
                backgroundColor: data.mainbarcolor || '#909090',
                border: `${cssLength(data.borderwidth, '2px')} ${data.borderstyle || 'solid'} ${data.bordercolor || '#ffffff'}`,
                borderRadius: cssLength(data.borderradius, '2px'),
            }}
        ><div className="squeezeboxrpc-playtime-value" style={{ width: `${width}%`, backgroundColor: data.playtimebarcolor || '#00ff00' }} /></div>;
    }
}

export default PlaytimeWidget;
