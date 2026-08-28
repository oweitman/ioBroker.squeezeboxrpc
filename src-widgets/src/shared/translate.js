/**
 * Translate through the VIS-2 host widget base.
 *
 * Direct imports of I18n from adapter-react-v5 are unsafe in federated widget
 * sets: another remote can own the shared-module cache and provide a separate,
 * uninitialized I18n class. The host widget base always uses the I18n instance
 * into which VIS-2 loaded the component translations.
 */
export function translate(key, ...args) {
    const HostWidget = globalThis.window?.visRxWidget;
    if (typeof HostWidget?.t === 'function') {
        return HostWidget.t.call(HostWidget, key, ...args);
    }

    return args.reduce((text, value) => text.replace('%s', String(value)), key);
}
