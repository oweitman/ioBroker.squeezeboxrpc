import { useEffect } from 'react';
import { I18n } from '@iobroker/adapter-react-v5';

import {
    decodePlayerWidgetReference,
    encodePlayerWidgetReference,
    findPlayersWidgets,
} from './playerWidgetReferenceUtils';

export default function PlayerWidgetReferenceField({ data, onDataChange, props }) {
    const playersWidgets = findPlayersWidgets(props.context.views, props.selectedView);
    const selected = decodePlayerWidgetReference(data.widgetPlayer);
    const options = selected && !playersWidgets.some(widget => widget.id === selected)
        ? [{ id: selected, label: selected }, ...playersWidgets]
        : playersWidgets;

    useEffect(() => {
        if (selected && data.widgetPlayer === selected) {
            onDataChange({ ...data, widgetPlayer: encodePlayerWidgetReference(selected) });
        }
    }, [data, onDataChange, selected]);

    return (
        <select
            value={selected}
            onChange={event => onDataChange({
                ...data,
                widgetPlayer: encodePlayerWidgetReference(event.target.value),
            })}
            style={{ boxSizing: 'border-box', minHeight: 36, width: '100%' }}
        >
            <option value="">{I18n.t('squeezeboxrpc_none')}</option>
            {options.map(widget => (
                <option key={widget.id} value={widget.id}>
                    {widget.label === widget.id ? widget.id : `${widget.label} (${widget.id})`}
                </option>
            ))}
        </select>
    );
}
