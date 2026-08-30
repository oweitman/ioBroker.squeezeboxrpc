import { VisRxWidget } from '@iobroker/vis-2-widgets-react-dev';

import { parseRequestFactory } from '../../../../widgets/squeezeboxrpc/js/sbClasses';
import { playerReferenceField } from '../values/PlayerStateWidget';
import { translate } from '../../shared/translate';
import { playerWidgetConfigurationMessage } from '../../shared/widgetConfiguration';
import {
    browserActionCommand,
    browserBreadcrumb,
    browserCommand,
    browserHomeItems,
    parseBrowserActions,
} from './browserUtils';
import { decodePlayerWidgetReference } from '../../shared/playerWidgetReferenceUtils';
import { subscribePlayerSelection } from '../../shared/playerSelectionBus';
import InlineSvgIcon from '../../shared/InlineSvgIcon';
import './browserWidget.css';

const WidgetBase = /** @type {any} */ (window.visRxWidget || VisRxWidget);

function BrowserIcon({ type }) {
    const name = type === 'back' ? 'menuback' : type === 'next' || type === 'add' ? type : 'play';
    return <InlineSvgIcon name={name} />;
}

class BrowserWidget extends WidgetBase {
    constructor(props) {
        super(props);
        const initialState = /** @type {Record<string, any>} */ (/** @type {unknown} */ (this.state));
        this.state = { ...initialState, browserItems: [], browserHistory: [], browserLoading: false, browserError: '' };
        this.selectionWidget = '';
        this.selection = null;
        this.playerId = '';
        this.unsubscribeSelection = null;
        this.browserRequest = 0;
    }

    get widgetState() {
        return /** @type {Record<string, any>} */ (/** @type {unknown} */ (this.state));
    }

    static getI18nPrefix() {
        return 'squeezeboxrpc_';
    }

    static getWidgetInfo() {
        return {
            id: 'tplSqueezeboxrpcBrowser2',
            visSet: 'squeezeboxrpc',
            visSetLabel: 'widget_set',
            visName: 'Squeezebox Browser',
            visAttrs: [
                {
                    name: 'common',
                    fields: [
                        playerReferenceField,
                        { name: 'debug', type: 'checkbox', default: false, label: 'squeezeboxrpc_debug' },
                        {
                            name: 'debugwithFetchResults',
                            type: 'checkbox',
                            default: false,
                            label: 'squeezeboxrpc_debug_fetch_results',
                        },
                    ],
                },
            ],
            visDefaultStyle: { width: 200, height: 200, overflow: 'hidden' },
            visPrev:
                '<span style="display:block;margin-left:auto;margin-right:auto;aspect-ratio:1;background-color:currentColor;-webkit-mask:url(widgets/squeezeboxrpc/img/browser.svg) center/contain no-repeat;mask:url(widgets/squeezeboxrpc/img/browser.svg) center/contain no-repeat;"></span>',
        };
    }

    getWidgetInfo() {
        return BrowserWidget.getWidgetInfo();
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
        this.browserRequest++;
        this.unsubscribeSelection?.();
        super.componentWillUnmount();
    }

    onRxDataChanged() {
        this.syncSelectionSubscription(true);
    }

    debug(...args) {
        const data = this.widgetState.rxData || this.widgetState.data || {};
        if (data.debug) console.log('[squeezeboxrpc browser]', ...args);
    }

    syncSelectionSubscription(configurationChanged = false) {
        const data = this.widgetState.rxData || this.widgetState.data || {};
        const widgetPlayer = decodePlayerWidgetReference(data.widgetPlayer);
        if (widgetPlayer !== this.selectionWidget) {
            this.unsubscribeSelection?.();
            this.selectionWidget = widgetPlayer;
            this.selection = null;
            this.unsubscribeSelection = widgetPlayer
                ? subscribePlayerSelection(
                      widgetPlayer,
                      selection => {
                          this.selection = selection;
                          void this.openBrowser();
                      },
                      this.props.context.views,
                  )
                : null;
            if (!widgetPlayer) this.setState({ browserItems: [], browserHistory: [], browserError: '' });
            return;
        }
        if (configurationChanged && this.selection) void this.openBrowser();
    }

    async openBrowser() {
        const instance = this.selection?.instance;
        const player = this.selection?.player;
        if (!instance || !player) {
            this.playerId = '';
            this.setState({ browserItems: [], browserHistory: [], browserLoading: false, browserError: '' });
            return;
        }
        const request = ++this.browserRequest;
        this.setState({ browserLoading: true, browserError: '' });
        try {
            const state = await this.props.context.socket.getState(`${instance}.Players.${player}.PlayerID`);
            if (request !== this.browserRequest) return;
            this.playerId = String(state?.val ?? '');
            const home = { id: 'home', title: 'Home', params: null };
            const items = await this.fetchChildren(home);
            if (request !== this.browserRequest) return;
            this.setState({ browserItems: items, browserHistory: [home], browserLoading: false, browserError: '' });
        } catch (error) {
            this.handleError(request, error);
        }
    }

    handleError(request, error) {
        if (request !== this.browserRequest) return;
        console.error(error);
        this.setState({
            browserItems: [],
            browserLoading: false,
            browserError: translate('squeezeboxrpc_browser_load_error'),
        });
    }

    async sendCommand(command) {
        if (!this.selection?.instance || !command) return null;
        this.debug('cmdGeneral', command);
        const response = await this.props.context.socket.sendTo(this.selection.instance, 'cmdGeneral', command);
        const data = this.widgetState.rxData || this.widgetState.data || {};
        if (data.debug && data.debugwithFetchResults) console.log('[squeezeboxrpc browser response]', response);
        return response;
    }

    async parsedMenu(command) {
        const response = await this.sendCommand(command);
        const menu = response ? parseRequestFactory(response) : null;
        return menu?.getMenuItems?.() || [];
    }

    async fetchChildren(item) {
        if (item.id === 'home') return browserHomeItems;
        if (item.id === 'radio')
            return this.parsedMenu({ playerid: this.playerId, cmdArray: ['radios', 0, '25000', 'menu:radio'] });
        if (item.id === 'favorites')
            return this.parsedMenu({
                playerid: this.playerId,
                cmdArray: ['favorites', 'items', 0, '25000', 'menu:favorites'],
            });
        if (item.id === 'apps')
            return this.parsedMenu({ playerid: this.playerId, cmdArray: ['myapps', 'items', 0, '25000', 'menu:1'] });
        if (item.id === 'myMusic' || item.id === 'extra') {
            const items = await this.parsedMenu({
                playerid: this.playerId,
                cmdArray: ['menu', 'items', 0, '25000', 'direct:1'],
            });
            return items
                .filter(menuItem => menuItem?.item?.node === item.id)
                .sort((a, b) => (a.item?.weight || 0) - (b.item?.weight || 0));
        }
        const action = parseBrowserActions(item.actions).next;
        const command = browserCommand(action, this.playerId);
        return command ? this.parsedMenu(command) : [];
    }

    async goDeeper(item) {
        const request = ++this.browserRequest;
        this.setState({ browserLoading: true, browserError: '' });
        try {
            const items = await this.fetchChildren(item);
            if (request !== this.browserRequest) return;
            this.setState(state => ({
                browserItems: items,
                browserHistory: [...state.browserHistory, item],
                browserLoading: false,
            }));
        } catch (error) {
            this.handleError(request, error);
        }
    }

    async goBack() {
        const history = this.widgetState.browserHistory;
        const nextHistory = history.length > 1 ? history.slice(0, -1) : history;
        const parent = nextHistory[nextHistory.length - 1];
        if (!parent) return;
        const request = ++this.browserRequest;
        this.setState({ browserLoading: true, browserError: '' });
        try {
            const items = await this.fetchChildren(parent);
            if (request !== this.browserRequest) return;
            this.setState({ browserItems: items, browserHistory: nextHistory, browserLoading: false });
        } catch (error) {
            this.handleError(request, error);
        }
    }

    async executeAction(item, actionName) {
        const action = parseBrowserActions(item.actions)[actionName];
        const command = browserActionCommand(action, this.playerId);
        if (!command) return;
        try {
            await this.sendCommand(command);
        } catch (error) {
            console.error(error);
            this.setState({ browserError: translate('squeezeboxrpc_browser_action_error') });
        }
    }

    renderAction(item, actionName) {
        const actions = parseBrowserActions(item.actions);
        if (!actions[actionName]) return null;
        const label = translate(`squeezeboxrpc_browser_${actionName}`);
        return (
            <button
                key={actionName}
                type="button"
                className="squeezeboxrpc-browser-action"
                title={label}
                aria-label={label}
                onClick={event => {
                    event.stopPropagation();
                    if (actionName === 'next') void this.goDeeper(item);
                    else void this.executeAction(item, actionName);
                }}
            >
                <BrowserIcon type={actionName} />
            </button>
        );
    }

    renderWidgetBody(props) {
        super.renderWidgetBody(props);
        const data = this.widgetState.rxData || this.widgetState.data || {};
        const configurationMessage = playerWidgetConfigurationMessage(data);
        if (configurationMessage) return <div>{configurationMessage}</div>;
        const history = this.widgetState.browserHistory;
        return (
            <div className="squeezeboxrpc-browser">
                <button
                    type="button"
                    className="squeezeboxrpc-browser-parent"
                    onClick={() => void this.goBack()}
                >
                    <span className="squeezeboxrpc-browser-menu-icon">
                        <BrowserIcon type="back" />
                    </span>
                    <span>{browserBreadcrumb(history)}</span>
                </button>
                {this.widgetState.browserError ? (
                    <div className="squeezeboxrpc-browser-status">{this.widgetState.browserError}</div>
                ) : null}
                {this.widgetState.browserLoading && !this.widgetState.browserItems.length ? (
                    <div className="squeezeboxrpc-browser-status">{translate('squeezeboxrpc_browser_loading')}</div>
                ) : null}
                <div className="squeezeboxrpc-browser-list">
                    {this.widgetState.browserItems.map((item, index) => {
                        const actions = parseBrowserActions(item.actions);
                        const clickable = Boolean(actions.next);
                        return (
                            <div
                                key={`${item.id ?? item.title}-${index}`}
                                className={`squeezeboxrpc-browser-item${clickable ? ' squeezeboxrpc-browser-item-clickable' : ''}`}
                                onClick={clickable ? () => void this.goDeeper(item) : undefined}
                            >
                                <div className="squeezeboxrpc-browser-item-content">{item.title}</div>
                                <div className="squeezeboxrpc-browser-actions">
                                    {['next', 'play', 'add'].map(action => this.renderAction(item, action))}
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>
        );
    }
}

export default BrowserWidget;
