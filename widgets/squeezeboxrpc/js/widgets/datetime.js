/* globals $,vis */
'use strict';

/**
 * Format a player value with the same contract as the VIS-2 DateTime widget.
 *
 * @param {unknown} value Player state value
 * @param {unknown} factor Multiplier for the state value
 * @param {unknown} format Date/time format
 * @returns {string} Formatted value
 */
export function formatDateTime(value, factor, format) {
    const numericValue = Number(value);
    if (!Number.isFinite(numericValue)) {
        return '';
    }
    const multiplier = factor !== undefined && factor !== '' ? Number(factor) : 1;
    const offset = 60_000 * new Date(0).getTimezoneOffset();
    const date = new Date(numericValue * (Number.isFinite(multiplier) ? multiplier : 1) + offset);
    if (Number.isNaN(date.getTime())) {
        return '';
    }
    const pad = number => String(number).padStart(2, '0');
    const replacements = {
        YYYY: String(date.getFullYear()),
        YY: String(date.getFullYear()).slice(-2),
        MM: pad(date.getMonth() + 1),
        DD: pad(date.getDate()),
        hh: pad(date.getHours()),
        mm: pad(date.getMinutes()),
        ss: pad(date.getSeconds()),
    };
    return String(format || 'hh:mm:ss').replace(/YYYY|YY|MM|DD|hh|mm|ss/g, token => replacements[token]);
}

export const datetime = {
    createWidget: function (widgetID, view, data, style) {
        const $div = $(`#${widgetID}`);
        if (!$div.length) {
            return setTimeout(function () {
                vis.binds['squeezeboxrpc'].datetime.createWidget(widgetID, view, data, style);
            }, 100);
        }

        data = vis.views[view].widgets[widgetID].data;
        style = vis.views[view].widgets[widgetID].style;

        const ainstance = (data.ainstance = vis.binds['squeezeboxrpc'].checkAttributes($div, data.widgetPlayer));
        if (!ainstance) {
            return;
        }

        const fdata = { self: this, widgetID: widgetID, view: view, data: data, style: style };

        vis.binds['squeezeboxrpc'].setPlayersChanged(
            $div,
            data.widgetPlayer,
            fdata,
            this.onChange.bind(fdata),
            function () {
                const boundstates = [];
                const players = vis.binds['squeezeboxrpc'].getPlayerValues(data.widgetPlayer);
                for (let i = 0; i < players.length; i++) {
                    boundstates.push(`${ainstance[0]}.${ainstance[1]}.Players.${players[i]}.${data.playerattribute}`);
                }
                return boundstates;
            },
        );
        vis.binds['squeezeboxrpc'].setChanged(data.widgetPlayer, fdata, this.setState.bind(fdata));

        this.setState(fdata);
    },
    onChange: function () {
        this.self.setState(this);
    },
    setState: function (fdata) {
        const data = fdata.data;
        const widgetID = fdata.widgetID;
        const playername = vis.binds['squeezeboxrpc'].getPlayerName(data.widgetPlayer);
        if (!playername) {
            return setTimeout(function () {
                vis.binds['squeezeboxrpc'].datetime.setState(fdata);
            }, 100);
        }
        const stateid = `${data.ainstance.join('.')}.Players` + `.${playername}.${data.playerattribute}`;

        const state = formatDateTime(vis.states[`${stateid}.val`], data.factor, data.format);
        const html_prepend = data.html_prepend || '';
        const html_append = data.html_append || '';
        $(`#${widgetID}`).html(html_prepend + state + html_append);
    },
};
