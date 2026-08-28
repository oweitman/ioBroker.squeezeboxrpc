import { useEffect } from 'react';
import { translate } from './translate';

import {
    decodePlayerWidgetReference,
    encodePlayerWidgetReference,
    findPlayersWidgets,
} from './playerWidgetReferenceUtils';

export default function PlayerWidgetReferenceField({ data, onDataChange, props }) {
    const playersWidgets = findPlayersWidgets(props.context.views);
    const selected = decodePlayerWidgetReference(data.widgetPlayer);
    const options =
        selected && !playersWidgets.some(widget => widget.id === selected)
            ? [{ id: selected, instance: '', view: '', name: selected }, ...playersWidgets]
            : playersWidgets;

    useEffect(() => {
        if (selected && data.widgetPlayer === selected) {
            onDataChange({ ...data, widgetPlayer: encodePlayerWidgetReference(selected) });
        }
    }, [data, onDataChange, selected]);

    return (
        <select
            value={selected}
            onChange={event =>
                onDataChange({
                    ...data,
                    widgetPlayer: encodePlayerWidgetReference(event.target.value),
                })
            }
            style={{ boxSizing: 'border-box', minHeight: 36, width: '100%' }}
        >
            <option value="">{translate('squeezeboxrpc_none')}</option>
            {options.map(widget => (
                <option
                    key={widget.id}
                    value={widget.id}
                >
                    {widget.instance ? `${widget.instance} (${widget.view}: ${widget.name})` : widget.name}
                </option>
            ))}
        </select>
    );
}
