import React from 'react';

import add from '../../../widgets/squeezeboxrpc/img/add.svg?raw';
import deleteIcon from '../../../widgets/squeezeboxrpc/img/delete.svg?raw';
import fwd from '../../../widgets/squeezeboxrpc/img/fwd.svg?raw';
import menuback from '../../../widgets/squeezeboxrpc/img/menuback.svg?raw';
import next from '../../../widgets/squeezeboxrpc/img/next.svg?raw';
import pause from '../../../widgets/squeezeboxrpc/img/pause.svg?raw';
import play from '../../../widgets/squeezeboxrpc/img/play.svg?raw';
import repeat0 from '../../../widgets/squeezeboxrpc/img/repeat0.svg?raw';
import repeat1 from '../../../widgets/squeezeboxrpc/img/repeat1.svg?raw';
import refresh from '../../../widgets/squeezeboxrpc/img/refresh.svg?raw';
import rew from '../../../widgets/squeezeboxrpc/img/rew.svg?raw';
import shuffle0 from '../../../widgets/squeezeboxrpc/img/shuffle0.svg?raw';
import shuffle2 from '../../../widgets/squeezeboxrpc/img/shuffle2.svg?raw';
import stop from '../../../widgets/squeezeboxrpc/img/stop.svg?raw';

export const svgIcons = {
    add,
    delete: deleteIcon,
    fwd,
    menuback,
    next,
    pause,
    play,
    refresh,
    repeat0,
    repeat1,
    rew,
    shuffle0,
    shuffle2,
    stop,
};

const escapeAttribute = value =>
    String(value)
        .split('&')
        .join('&amp;')
        .split('"')
        .join('&quot;')
        .split('<')
        .join('&lt;')
        .split('>')
        .join('&gt;');

/**
 * @param {string} source SVG source text
 * @param {{ fill?: string, stroke?: string, strokeWidth?: string | number }} options SVG appearance
 */
export function prepareInlineSvg(source, { fill = 'currentColor', stroke = fill, strokeWidth } = {}) {
    let result = String(source || '')
        .replace(/^\s*<\?xml[^>]*>\s*/i, '')
        .trim()
        .split('fill="currentColor"')
        .join(`fill="${escapeAttribute(fill)}"`)
        .split('stroke="currentColor"')
        .join(`stroke="${escapeAttribute(stroke)}"`);

    if (strokeWidth !== undefined && strokeWidth !== null) {
        result = result.replace(/stroke-width="[^"]*"/g, `stroke-width="${escapeAttribute(strokeWidth)}"`);
    }
    return result;
}

/** @param {{ name: string, fill?: string, stroke?: string, strokeWidth?: string | number, className?: string }} props */
export default function InlineSvgIcon({ name, fill, stroke, strokeWidth, className }) {
    const source = svgIcons[name];
    if (!source) return null;
    return (
        <span
            className={className}
            aria-hidden="true"
            style={{ display: 'contents' }}
            dangerouslySetInnerHTML={{ __html: prepareInlineSvg(source, { fill, stroke, strokeWidth }) }}
        />
    );
}
