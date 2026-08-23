/* globals $,vis */
'use strict';

export const image = {
    createWidget: function (widgetID, view, data, style) {
        const $div = $(`#${widgetID}`);
        if (!$div.length) {
            return setTimeout(function () {
                vis.binds['squeezeboxrpc'].image.createWidget(widgetID, view, data, style);
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
        let imgstyle = 'width:100%;';
        if (data.stretch) {
            imgstyle += 'height:100%;';
        }
        let text = '';
        text += data.html_prepend || '';
        text += `<img style="${imgstyle}"></img> \n`;
        text += data.html_append || '';
        $(`#${widgetID}`).html(text);
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
                vis.binds['squeezeboxrpc'].image.setState(fdata);
            }, 100);
        }
        const stateid = `${data.ainstance.join('.')}.Players` + `.${playername}.${data.playerattribute}`;

        const state = vis.states[`${stateid}.val`] ? vis.states[`${stateid}.val`] : '';
        // if (vis.editMode) state = data.test_html || "";
        $(`#${widgetID} img`).attr('src', state);
    },
};
