/* globals $,vis */
'use strict';

export const playtime = {
    createWidget: function (widgetID, view, data, style) {
        const $div = $(`#${widgetID}`);
        if (!$div.length) {
            return setTimeout(function () {
                vis.binds['squeezeboxrpc'].playtime.createWidget(widgetID, view, data, style);
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
                    boundstates.push(`${ainstance[0]}.${ainstance[1]}.Players.${players[i]}.Duration`);
                    boundstates.push(`${ainstance[0]}.${ainstance[1]}.Players.${players[i]}.Time`);
                    boundstates.push(`${ainstance[0]}.${ainstance[1]}.Players.${players[i]}.state`);
                    boundstates.push(`${ainstance[0]}.${ainstance[1]}.Players.${players[i]}.cmdGoTime`);
                }
                return boundstates;
            },
        );
        vis.binds['squeezeboxrpc'].setChanged(data.widgetPlayer, fdata, this.setState.bind(fdata));

        const mainbarcolor = data.mainbarcolor;
        const playtimebarcolor = data.playtimebarcolor;
        const borderwidth = data.borderwidth;
        const borderstyle = data.borderstyle;
        const bordercolor = data.bordercolor;
        const borderradius = data.borderradius;

        let text = '';
        text += '<style> \n';
        text += `#${widgetID} .playtimemain {\n`;
        text += '    width: 100%;\n';
        text += '    height: 100%;\n';
        text += `    background-color: ${mainbarcolor};\n`;
        text += `    border: ${bordercolor} ${borderwidth} ${borderstyle};\n`;
        text += `    border-radius: ${borderradius};\n`;
        text += '    overflow: hidden;\n';
        text += '}';

        text += `#${widgetID} .playtimebar {\n`;
        text += '  height: 100%;\n';
        text += `  background-color: ${playtimebarcolor};\n`;
        text += '}\n';
        text += '</style> \n';

        text += '<div class="playtimemain">\n';
        text += '    <div class="playtimebar"></div>\n';
        text += '</div>\n';

        $(`#${widgetID}`).html(text);
        $(`#${widgetID} div.playtimemain`).on('click.playtime', fdata, this.onClick);

        this.setState(fdata);
    },
    onClick: function (event) {
        const data = event.data.data;
        const playername = vis.binds['squeezeboxrpc'].getPlayerName(data.widgetPlayer);
        const stateid_duration = `${data.ainstance.join('.')}.Players` + `.${playername}.Duration`;
        const stateid_gotime = `${data.ainstance.join('.')}.Players` + `.${playername}.cmdGoTime`;

        const state_duration =
            vis.states[`${stateid_duration}.val`] || vis.states[`${stateid_duration}.val`] === 0
                ? parseInt(vis.states[`${stateid_duration}.val`])
                : 0;
        const clickx = event.offsetX;
        const width = $(this).width();

        const time = (clickx / width) * state_duration;
        if (time > state_duration) {
            return;
        }
        vis.setValue(stateid_gotime, time.toString());
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
                vis.binds['squeezeboxrpc'].playtime.setState(fdata);
            }, 100);
        }
        const stateid_duration = `${data.ainstance.join('.')}.Players` + `.${playername}.Duration`;
        const stateid_state = `${data.ainstance.join('.')}.Players` + `.${playername}.state`;
        const stateid_time = `${data.ainstance.join('.')}.Players` + `.${playername}.Time`;

        const state_duration =
            vis.states[`${stateid_duration}.val`] || vis.states[`${stateid_duration}.val`] === 0
                ? parseInt(vis.states[`${stateid_duration}.val`])
                : 0;
        const state_state =
            vis.states[`${stateid_state}.val`] || vis.states[`${stateid_state}.val`] === 0
                ? parseInt(vis.states[`${stateid_state}.val`])
                : 0;
        const state_time =
            vis.states[`${stateid_time}.val`] || vis.states[`${stateid_time}.val`] === 0
                ? parseInt(vis.states[`${stateid_time}.val`])
                : 0;

        let width = state_duration == 0 ? 0 : $(`#${widgetID} div.playtimebar`).width();
        if (state_state == 2) {
            width = 0;
        } //0 if player stop
        if (vis.editMode) {
            width = 50;
        } else {
            width = Math.floor((state_time / state_duration) * 100);
        }
        $(`#${widgetID} div.playtimebar`).width(`${width}%`);
    },
};
