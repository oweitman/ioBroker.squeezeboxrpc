/* globals $,vis */
'use strict';

/**
 * Normalize PlaylistRepeat to one of the three supported states.
 *
 * @param {string|number|undefined|null} value State value.
 */
export function normalizeRepeatState(value) {
    const state = Number.parseInt(String(value), 10);
    return state === 0 || state === 1 || state === 2 ? state : 0;
}

/**
 * Return the next PlaylistRepeat state.
 *
 * @param {string|number|undefined|null} value Current state value.
 */
export function nextRepeatState(value) {
    return (normalizeRepeatState(value) + 1) % 3;
}

export const buttonrepeat = {
    createWidget: function (widgetID, view, data, style) {
        const $div = $(`#${widgetID}`);
        if (!$div.length) {
            return setTimeout(function () {
                vis.binds['squeezeboxrpc'].buttonrepeat.createWidget(widgetID, view, data, style);
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
                    boundstates.push(`${ainstance[0]}.${ainstance[1]}.Players.${players[i]}.PlaylistRepeat`);
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
        this.setState({ self: this, widgetID: widgetID, view: view, data: data, style: style });
    },
    onClick: function (event) {
        const data = event.data.data;
        const playername = vis.binds['squeezeboxrpc'].getPlayerName(data.widgetPlayer);
        if (!playername) {
            return;
        }
        const stateid = `${data.ainstance.join('.')}.Players` + `.${playername}.PlaylistRepeat`;
        const state = vis.states[`${stateid}.val`];
        vis.setValue(stateid, nextRepeatState(state));
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
                vis.binds['squeezeboxrpc'].buttonrepeat.setState(fdata);
            }, 100);
        }
        const stateid = `${data.ainstance.join('.')}.Players` + `.${playername}.PlaylistRepeat`;

        const state = normalizeRepeatState(vis.states[`${stateid}.val`]);
        const imagerepeat0 = data.imagerepeat0 || '';
        const imagerepeat1 = data.imagerepeat1 || '';
        const imagerepeat2 = data.imagerepeat2 || '';

        const svgfill = data.fillcolor || '#ffffff';
        const svgstroke = data.strokecolor || '#ffffff';
        const svgstrokeWidth = data.strokewidth || '0.3';

        // 0 = repeat0 disabled, 1 = repeat1 enabled, 2 = custom repeat2 or repeat0 enabled
        const image =
            state === 1
                ? imagerepeat1 || svg.repeat1
                : state === 2
                  ? imagerepeat2 || imagerepeat0 || svg.repeat0
                  : imagerepeat0 || svg.repeat0;
        $(`#${widgetID} input`).val(state);
        $(`#${widgetID} img`).off('click.repeat', this.onClick);
        $(`#${widgetID} svg`).off('click.repeat', this.onClick);
        if (image.startsWith('<svg')) {
            $(`#${widgetID} span`).html(image);
            const $g = $(`#${widgetID} svg > g`);
            if ($g.length) {
                $g.attr('fill', svgfill);
                $g.attr('stroke', svgstroke);
                $g.attr('stroke-width', svgstrokeWidth);
            }
        } else {
            $(`#${widgetID} span`).html(`<img src="${image}">`);
        }
        $(`#${widgetID} img, #${widgetID} svg`).css('opacity', state === 0 ? '0.5' : '1');
        $(`#${widgetID} img`).on('click.repeat', fdata, this.onClick);
        $(`#${widgetID} svg`).on('click.repeat', fdata, this.onClick);
    },
};
