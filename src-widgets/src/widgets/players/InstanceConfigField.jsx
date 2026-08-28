import { useEffect, useState } from 'react';

import { instanceId, normalizeInstance } from '../../shared/playerConfigUtils';
import { translate } from '../../shared/translate';

export default function InstanceConfigField({ data, onDataChange, props }) {
    const [instances, setInstances] = useState(/** @type {string[]} */ ([]));
    const [error, setError] = useState('');
    const selectedInstance = normalizeInstance(data.ainstance);

    useEffect(() => {
        let active = true;
        props.context.socket
            .getAdapterInstances('squeezeboxrpc')
            .then(result => {
                if (!active) return;
                setInstances(
                    [...new Set((Array.isArray(result) ? result : []).map(instanceId).filter(Boolean))].sort((a, b) =>
                        a.localeCompare(b, undefined, { numeric: true }),
                    ),
                );
                setError('');
            })
            .catch(loadError => {
                console.error(loadError);
                if (active) setError(translate('squeezeboxrpc_instances_load_error'));
            });
        return () => {
            active = false;
        };
    }, [props.context.socket]);

    const options = selectedInstance && !instances.includes(selectedInstance) ? [selectedInstance, ...instances] : instances;
    return (
        <div style={{ width: '100%' }}>
            <select
                value={selectedInstance}
                onChange={event => onDataChange({ ...data, ainstance: event.target.value })}
                style={{ boxSizing: 'border-box', minHeight: 36, width: '100%' }}
            >
                <option value="">{translate('squeezeboxrpc_select_instance')}</option>
                {options.map(instance => <option key={instance} value={instance}>{instance}</option>)}
            </select>
            {error ? <div style={{ color: '#d32f2f', marginTop: 4 }}>{error}</div> : null}
        </div>
    );
}
