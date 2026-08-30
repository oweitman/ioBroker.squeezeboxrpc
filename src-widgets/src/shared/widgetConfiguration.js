import { decodePlayerWidgetReference } from './playerWidgetReferenceUtils';
import { translate } from './translate';

/**
 * Returns a user-facing message when a player-dependent widget is incomplete.
 *
 * @param {Record<string, unknown>} data Widget configuration.
 * @param {{ requireAttribute?: boolean }} [options] Validation options.
 * @returns {string} An empty string when the minimum configuration is present.
 */
export function playerWidgetConfigurationMessage(data, options = {}) {
    if (!decodePlayerWidgetReference(data?.widgetPlayer)) {
        return translate('squeezeboxrpc_select_players_widget');
    }
    if (options.requireAttribute && !String(data?.playerattribute || '').trim()) {
        return translate('squeezeboxrpc_select_player_attribute');
    }
    return '';
}
