'use strict';

/**
 * Normalize an ioBroker adapter-instance object or ID.
 *
 * @param value adapter instance object or ID
 * @returns normalized SqueezeboxRPC instance ID
 */
export function normalizeSqueezeboxInstance(value) {
    const id = String(value?._id || value?.id || value || '').replace(/^system\.adapter\./, '');
    return /^squeezeboxrpc\.\d+$/.test(id) ? id : '';
}

/**
 * Collect unique SqueezeboxRPC instance IDs from VIS objects or an object-view response.
 *
 * @param source VIS objects, object-view result, or instance list
 * @returns sorted unique instance IDs
 */
export function collectSqueezeboxInstances(source) {
    const values = Array.isArray(source)
        ? source
        : Array.isArray(source?.rows)
          ? source.rows.map(row => row.value?._id || row.id)
          : Object.entries(source || {}).map(([id, value]) => value?._id || id);
    return [...new Set(values.map(normalizeSqueezeboxInstance).filter(Boolean))].sort((left, right) =>
        left.localeCompare(right, undefined, { numeric: true }),
    );
}
