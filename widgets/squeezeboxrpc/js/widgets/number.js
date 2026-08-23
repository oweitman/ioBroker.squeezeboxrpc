/* globals $,vis */
'use strict';

export const number = {
    createWidget: function (widgetID, view, data, style) {
        const $div = $(`#${widgetID}`);
        if (!$div.length) {
            return setTimeout(function () {
                vis.binds['squeezeboxrpc'].number.createWidget(widgetID, view, data, style);
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
                vis.binds['squeezeboxrpc'].number.setState(fdata);
            }, 100);
        }
        const stateid = `${data.ainstance.join('.')}.Players` + `.${playername}.${data.playerattribute}`;

        let state = vis.states[`${stateid}.val`] ? vis.states[`${stateid}.val`] : '';
        // if (vis.editMode) state = data.test_html || "";
        state = parseFloat(state);
        if (state === undefined || state === null || isNaN(state)) {
            state = 0;
        }
        if (data.digits || data.digits !== '') {
            state = state.toFixed(parseFloat(data.digits, 10));
        }
        if (data.is_tdp && data.is_tdp !== '') {
            state = state.toString().split('.');
            state[0] = state[0].replace(/\d{1,3}(?=(\d{3})+(?!\d))/g, '$&,');
            state = state.join('.');
        }
        if (data.is_comma && data.is_comma !== '') {
            state = state
                .split('.')
                .map(e => e.replace(/,/g, '.'))
                .join(',');
        }

        const html_prepend = data.html_prepend || '';
        const html_append = data.html_append || '';
        $(`#${widgetID}`).html(html_prepend + state + html_append);
    },
};
