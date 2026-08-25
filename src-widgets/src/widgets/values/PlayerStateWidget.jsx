import { VisRxWidget } from '@iobroker/vis-2-widgets-react-dev';

import { playerAttributeStateId, PLAYER_ATTRIBUTES } from './playerStateUtils';
import { subscribePlayerSelection } from '../../shared/playerSelectionBus';
import PlayerWidgetReferenceField from '../../shared/PlayerWidgetReferenceField';
import { decodePlayerWidgetReference } from '../../shared/playerWidgetReferenceUtils';

const WidgetBase = /** @type {any} */ (window.visRxWidget || VisRxWidget);

export const playerReferenceField = {
    name: 'widgetPlayer',
    type: 'custom',
    label: 'squeezeboxrpc_players_widget_reference',
    component: (field, data, onDataChange, props) => (
        <PlayerWidgetReferenceField data={data} onDataChange={onDataChange} props={props} />
    ),
};

export const playerAttributeField = {
    name: 'playerattribute',
    type: 'select',
    label: 'squeezeboxrpc_player_attribute',
    options: PLAYER_ATTRIBUTES.map(attribute => ({ value: attribute, label: attribute })),
    noTranslation: true,
};

class PlayerStateWidget extends WidgetBase {
    constructor(props) {
        super(props);
        const initialState = /** @type {Record<string, any>} */ (/** @type {unknown} */ (this.state));
        this.state = { ...initialState, playerValue: undefined, playerStateId: '' };
        this.selectionWidget = '';
        this.unsubscribeSelection = null;
        this.subscribedStateId = '';
        this.stateRequest = 0;
        this.currentSelection = null;
        this.handlePlayerState = this.handlePlayerState.bind(this);
    }

    get widgetState() {
        return /** @type {Record<string, any>} */ (/** @type {unknown} */ (this.state));
    }

    static getI18nPrefix() {
        return 'squeezeboxrpc_';
    }

    componentDidMount() {
        super.componentDidMount();
        this.syncStateSubscription();
    }

    componentDidUpdate(prevProps, prevState) {
        super.componentDidUpdate(prevProps, prevState);
        this.syncStateSubscription();
    }

    componentWillUnmount() {
        this.unsubscribeSelection?.();
        this.unsubscribePlayerState();
        super.componentWillUnmount();
    }

    onRxDataChanged() {
        this.syncStateSubscription(true);
    }

    syncStateSubscription(configurationChanged = false) {
        const data = this.widgetState.rxData || this.widgetState.data || {};
        const widgetPlayer = decodePlayerWidgetReference(data.widgetPlayer);
        if (widgetPlayer !== this.selectionWidget) {
            this.unsubscribeSelection?.();
            this.unsubscribeSelection = null;
            this.selectionWidget = widgetPlayer;
            this.currentSelection = null;
            this.unsubscribePlayerState();
            if (widgetPlayer) {
                this.unsubscribeSelection = subscribePlayerSelection(widgetPlayer, selection => {
                    this.currentSelection = selection;
                    void this.usePlayerSelection(selection);
                }, this.props.context.views);
            }
            return;
        }
        if (configurationChanged && this.currentSelection) void this.usePlayerSelection(this.currentSelection);
    }

    async usePlayerSelection(selection) {
        const data = this.widgetState.rxData || this.widgetState.data || {};
        const stateId = playerAttributeStateId(selection, data.playerattribute);
        if (stateId === this.subscribedStateId) return;
        this.unsubscribePlayerState();
        const request = ++this.stateRequest;
        if (!stateId) {
            this.setState({ playerValue: undefined, playerStateId: '' });
            return;
        }
        this.subscribedStateId = stateId;
        this.props.context.socket.subscribeState(stateId, this.handlePlayerState);
        this.setState({ playerValue: undefined, playerStateId: stateId });
        try {
            const state = await this.props.context.socket.getState(stateId);
            if (request === this.stateRequest && stateId === this.subscribedStateId && state) {
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
        this.setState({ playerValue: state.val });
    }
}

export default PlayerStateWidget;
