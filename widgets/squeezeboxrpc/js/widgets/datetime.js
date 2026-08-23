/* globals $,vis */
'use strict';

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

        let state = vis.states[`${stateid}.val`] ? vis.states[`${stateid}.val`] : '';
        //if (vis.editMode) state = data.test_html || "";
        if (data.factor && data.factor !== '') {
            state = state * data.factor;
        }
        const offset = 1000 * 60 * new Date(0).getTimezoneOffset();
        state = new Date(offset + state);
        if (isNaN(state)) {
            state = '';
        }
        if (state instanceof Date) {
            state = state.format(data.format);
        }
        const html_prepend = data.html_prepend || '';
        const html_append = data.html_append || '';
        $(`#${widgetID}`).html(html_prepend + state + html_append);
    },
};
