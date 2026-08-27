/* globals $,vis */
'use strict';

export const syncgroup = {
    createWidget: function (widgetID, view, data, style) {
        const $div = $(`#${widgetID}`);
        // if nothing found => wait
        if (!$div.length) {
            return setTimeout(function () {
                vis.binds['squeezeboxrpc'].syncgroup.createWidget(widgetID, view, data, style);
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
            function (fdata) {
                const data = fdata.data;
                const boundstates = [];
                const players = vis.binds['squeezeboxrpc'].getPlayerValues(data.widgetPlayer);
                for (let i = 0; i < players.length; i++) {
                    boundstates.push(`${ainstance[0]}.${ainstance[1]}.Players.${players[i]}.PlayerID`);
                    boundstates.push(`${ainstance[0]}.${ainstance[1]}.Players.${players[i]}.SyncMaster`);
                    boundstates.push(`${ainstance[0]}.${ainstance[1]}.Players.${players[i]}.SyncSlaves`);
                }
                return boundstates;
            },
            function () {
                setTimeout(function () {
                    vis.binds['squeezeboxrpc'].syncgroup.createWidget(widgetID, view, data, style);
                }, 100);
            },
        );
        vis.binds['squeezeboxrpc'].setChanged(data.widgetPlayer, fdata, this.setState.bind(fdata));

        if (vis.binds['squeezeboxrpc'].getPlayerWidgetType(view, data.widgetPlayer) == 'formatselect') {
            $div.html('Only Player formattype button is supported');
            return false;
        }

        const players = vis.binds['squeezeboxrpc'].getPlayerValues(data.widgetPlayer);

        const dataplayer = vis.binds.squeezeboxrpc.getPlayerWidgetData(data.widgetPlayer);

        const picWidth = dataplayer.picWidth;
        const picHeight = dataplayer.picHeight;
        const borderwidth = data.borderwidth;
        const borderstyle = data.borderstyle;
        const bordercolornogroup = data.bordercolornogroup;
        const bordercolorowngroup = data.bordercolorowngroup;
        const bordercolorothergroup = data.bordercolorothergroup;
        const borderradius = data.borderradius;
        const buttonmargin = data.buttonmargin || '0px';

        let text = '';
        text += '<style>\n';
        text += `#${widgetID} div {\n`;
        text += '     display: inline-block; \n';
        text += '}\n';
        text += `#${widgetID} div div {\n`;
        text += '     position: relative; \n';
        text += `     margin: 0px ${buttonmargin} ${buttonmargin} 0px; \n`;
        text += '}\n';
        text += `#${widgetID} input[type="checkbox"] {\n`;
        text += '    display: none;\n';
        text += '}\n';
        text += `#${widgetID} label > span {\n`;
        text += '    display: inline-block;\n';
        text += `    width: ${picWidth}px;\n`;
        text += `    height: ${picHeight}px;\n`;
        text += `    border: ${borderwidth} ${borderstyle} ${bordercolornogroup};\n`;
        text += `    border-radius: ${borderradius};\n`;
        text += '    overflow: hidden;\n';
        text += '    vertical-align: top;\n';
        text += '}\n';
        text += `#${widgetID} canvas {\n`;
        text += '    display: block;\n';
        text += '    opacity: 1;\n';
        text += `    width: ${picWidth}px;\n`;
        text += `    height: ${picHeight}px;\n`;
        text += '    border: 0;\n';
        text += '}\n';
        text += `#${widgetID} label > span:active {\n`;
        text += '    transform: scale(0.9, 0.9);\n';
        text += `    border: ${borderwidth} ${borderstyle} ${bordercolorowngroup};\n`;
        text += '}\n';
        text += `#${widgetID} input[type="checkbox"]:checked + label > span {\n`;
        text += `    border: ${borderwidth} ${borderstyle} ${bordercolorowngroup};\n`;
        text += '}\n';
        text += `#${widgetID} input[type="checkbox"][othergroup="true"] + label > span {\n`;
        text += `    border: ${borderwidth} ${borderstyle} ${bordercolorothergroup};\n`;
        text += '}\n';
        text += '</style>\n';

        text += `<div id="${widgetID}container" >`;
        let valid = false;
        for (let i = 0; i < players.length; i++) {
            const stateid = `${data.ainstance.join('.')}.Players` + `.${players[i]}.PlayerID`;
            const playerid =
                vis.states[`${stateid}.val`] || vis.states[`${stateid}.val`] === 0 ? vis.states[`${stateid}.val`] : '';
            valid = valid || playerid;
            text += '  <div>';
            text += `    <input type="checkbox" id="${widgetID}${players[i]}" name="${widgetID}" playername="${
                players[i]
            }" value="${playerid}" disabled>`;
            text += `    <label for="${widgetID}${players[i]}">`;
            text += '      <span>';
            text += '      <canvas></canvas>';
            text += '      </span>';
            text += '    </label>';
            text += '  </div>';
        }
        if (!valid) {
            return setTimeout(function () {
                vis.binds['squeezeboxrpc'].syncgroup.createWidget(widgetID, view, data, style);
            }, 100);
        }
        text += '</div>';
        $(`#${widgetID}`).html(text);

        for (let i = 0; i < players.length; i++) {
            const source = $(`#${data.widgetPlayer} input[value="${players[i]}"] + label span :first-child`)[0];
            const destination = $(`#${widgetID}${players[i]} + label span canvas`)[0];
            if (!source || !destination) {
                continue;
            }

            const drawPlayerImage = function () {
                const isCanvas = source.tagName == 'CANVAS';
                const width = isCanvas ? source.width : $(source).width() || source.naturalWidth || source.width;
                const height = isCanvas ? source.height : $(source).height() || source.naturalHeight || source.height;
                if (!width || !height) {
                    return;
                }
                destination.width = width;
                destination.height = height;
                const context = destination.getContext('2d');
                if (isCanvas) {
                    context.drawImage(source, 0, 0);
                } else {
                    context.drawImage(source, 0, 0, width, height);
                }
            };

            if (source.tagName == 'IMG' && !source.complete) {
                $(source).one('load.syncgroup', drawPlayerImage);
            } else {
                drawPlayerImage();
            }
        }

        const syncgroupbtns = $(`input[name=${widgetID}]`);
        syncgroupbtns.off('change.syncgroup').on('change.syncgroup', fdata, function (event) {
            const fdata = event.data;
            const data = fdata.data;
            const self = fdata.self;
            const syncplayer = this.value;
            const playername = vis.binds['squeezeboxrpc'].getPlayerName(data.widgetPlayer);
            const syncplayername = $(this).attr('playername');
            let stateid;
            if (syncplayer) {
                if (!$(this).prop('checked')) {
                    stateid = `${ainstance[0]}.${ainstance[1]}.Players` + `.${syncplayername}.cmdGeneral`;
                    vis.setValue(stateid, '"sync","-"');
                } else {
                    stateid = `${ainstance[0]}.${ainstance[1]}.Players` + `.${playername}.cmdGeneral`;
                    vis.setValue(stateid, `"sync","${syncplayer}"`);
                }
            }
            self.setState(fdata);
        });
        this.setState(fdata);
    },
    onChange: function () {
        this.self.setState(this);
    },
    setState: function (fdata) {
        const data = fdata.data;
        const widgetID = fdata.widgetID;

        const players = vis.binds['squeezeboxrpc'].getPlayerValues(data.widgetPlayer);
        const syncgroups = [];
        for (let ip = 0; ip < players.length; ip++) {
            const playername = players[ip];
            const stateid1 = `${data.ainstance.join('.')}.Players` + `.${playername}.SyncMaster`;
            const stateid2 = `${data.ainstance.join('.')}.Players` + `.${playername}.SyncSlaves`;
            const state1 =
                vis.states[`${stateid1}.val`] || vis.states[`${stateid1}.val`] === 0
                    ? vis.states[`${stateid1}.val`]
                    : '';
            const state2 =
                vis.states[`${stateid2}.val`] || vis.states[`${stateid2}.val`] === 0
                    ? vis.states[`${stateid2}.val`]
                    : '';
            let state = state1.split(',').concat(state2.split(','));
            state = state.filter(item => item != '');
            if (Array.isArray(state)) {
                if (
                    !syncgroups.reduce(function (acc, val) {
                        return state[0] == '' || state.length == 0 || acc || val.includes(state[0]);
                    }, false)
                ) {
                    syncgroups.push(state);
                }
            }
        }
        const playername = vis.binds['squeezeboxrpc'].getPlayerName(data.widgetPlayer);
        if (!playername) {
            return setTimeout(function () {
                vis.binds['squeezeboxrpc'].syncgroup.setState(fdata);
            }, 100);
        }
        const stateid1 = `${data.ainstance.join('.')}.Players` + `.${playername}.SyncMaster`;
        const stateid2 = `${data.ainstance.join('.')}.Players` + `.${playername}.SyncSlaves`;
        const stateid3 = `${data.ainstance.join('.')}.Players` + `.${playername}.PlayerID`;
        const state1 =
            vis.states[`${stateid1}.val`] || vis.states[`${stateid1}.val`] === 0 ? vis.states[`${stateid1}.val`] : '';
        const state2 =
            vis.states[`${stateid2}.val`] || vis.states[`${stateid2}.val`] === 0 ? vis.states[`${stateid2}.val`] : '';
        const state3 =
            vis.states[`${stateid3}.val`] || vis.states[`${stateid3}.val`] === 0 ? vis.states[`${stateid3}.val`] : '';
        let owngroup = null;
        for (let i = 0; i < syncgroups.length; i++) {
            if (syncgroups[i].includes(state3)) {
                owngroup = i;
                break;
            }
        }
        let state = state1.split(',').concat(state2.split(','));
        state = state.filter(item => item != '');
        for (let ip = 0; ip < players.length; ip++) {
            const playerbutton = players[ip];
            const playerstateid = `${data.ainstance.join('.')}.Players` + `.${playerbutton}.PlayerID`;
            const playerid =
                vis.states[`${playerstateid}.val`] || vis.states[`${playerstateid}.val`] === 0
                    ? vis.states[`${playerstateid}.val`]
                    : '';
            let playergroup = null;
            for (let is = 0; is < syncgroups.length; is++) {
                if (syncgroups[is].includes(playerid)) {
                    playergroup = is;
                    break;
                }
            }

            const $btn = $(`input[id=${widgetID}${playerbutton}]`);
            if (state.includes(playerid) && playerid !== state3) {
                $btn.prop('checked', true);
            } else {
                $btn.prop('checked', false);
            }
            if (playerid == state3) {
                $btn.prop('disabled', true);
            } else {
                $btn.prop('disabled', false);
            }
            if (playergroup != null && playergroup != owngroup) {
                $btn.attr('othergroup', true);
            } else {
                $btn.attr('othergroup', false);
            }
        }
    },
};
