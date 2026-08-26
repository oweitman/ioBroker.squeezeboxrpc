/* globals $,vis */
'use strict';

export const buttonplay = {
    createWidget: function (widgetID, view, data, style) {
        const $div = $(`#${widgetID}`);
        if (!$div.length) {
            return setTimeout(function () {
                vis.binds['squeezeboxrpc'].buttonplay.createWidget(widgetID, view, data, style);
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
                    boundstates.push(`${ainstance[0]}.${ainstance[1]}.Players.${players[i]}.state`);
                }
                return boundstates;
            },
        );
        vis.binds['squeezeboxrpc'].setChanged(data.widgetPlayer, fdata, this.setState.bind(fdata));

        let text = '';
        text += '<style> \n';
        text += `#${widgetID} div {\n`;
        text += '   display: inline-block; \n';
        text += '   width:  100%; \n';

        text += '} \n';
        text += `#${widgetID} input[type="submit"] { \n`;
        text += '  display: none; \n';
        text += '} \n';
        text += `#${widgetID} img { \n`;
        text += '  width:  100%; \n';

        text += '} \n';
        text += `#${widgetID} img:active { \n`;
        text += '  transform: scale(0.9, 0.9); \n';
        text += '} \n';
        text += `#${widgetID} svg { \n`;
        text += '  width:  100%; \n';
        text += '} \n';
        text += `#${widgetID} svg:active { \n`;
        text += '  transform: scale(0.9, 0.9); \n';
        text += '  transform-origin: 50% 50%; \n';
        text += '} \n';
        text += '</style> \n';

        text += '<div class="btn"> \n';
        text += '  <div> \n';
        text += `    <input type="submit" id="${widgetID}button" name="${widgetID}" value="" >`;
        text += '    <span> \n';
        text += '      <img src=""> \n';
        text += '    </span> \n';
        text += '  </div> \n';
        text += '</div> \n';

        $(`#${widgetID}`).html(text);
        this.setState(fdata);
    },
    onClick: function (event) {
        const data = event.data.data;
        const widgetID = event.data.widgetID;
        const playername = vis.binds['squeezeboxrpc'].getPlayerName(data.widgetPlayer);
        const stateid = `${data.ainstance.join('.')}.Players` + `.${playername}.state`;
        let state = $(`input[name=${widgetID}]`).val();
        state = state == 1 ? 0 : 1;
        vis.setValue(stateid, state);
    },
    onChange: function () {
        this.self.setState(this);
    },
    setState: function (fdata) {
        const data = fdata.data;
        const widgetID = fdata.widgetID;
        const svg = vis.binds['squeezeboxrpc'].svg;
        const playername = vis.binds['squeezeboxrpc'].getPlayerName(data.widgetPlayer);
        if (!playername) {
            return setTimeout(function () {
                vis.binds['squeezeboxrpc'].buttonplay.setState(fdata);
            }, 100);
        }
        const stateid = `${data.ainstance.join('.')}.Players` + `.${playername}.state`;

        const state =
            vis.states[`${stateid}.val`] || vis.states[`${stateid}.val`] === 0
                ? parseInt(vis.states[`${stateid}.val`])
                : 2;
        const imagepause = data.imagepause || '';
        const imageplay = data.imageplay || '';
        const imagestop = data.imagepause || '';

        let image = '';
        //0=pause
        //1=play
        //2=stop
        if (state == 0) {
            image = imageplay || svg.play;
        }
        if (state == 1) {
            image = imagepause || svg.pause;
        }
        if (state == 2) {
            image = imagestop || svg.play;
        }
        $(`#${widgetID} input`).val(state);
        $(`#${widgetID} img`).off('click.play', this.onClick);
        $(`#${widgetID} svg`).off('click.play', this.onClick);
        if (image.startsWith('<svg')) {
            $(`#${widgetID} span`).html(image);
            const $g = $(`#${widgetID} svg > g`);
            if ($g.length) {
                data.fillcolor && $g.attr('fill', data.fillcolor);
                data.strokecolor && $g.attr('stroke', data.strokecolor);
                data.strokewidth && $g.attr('stroke-width', data.strokewidth);
            }
        } else {
            $(`#${widgetID} img`).attr('src', image);
        }
        $(`#${widgetID} img`).on('click.play', fdata, this.onClick);
        $(`#${widgetID} svg`).on('click.play', fdata, this.onClick);
    },
};
