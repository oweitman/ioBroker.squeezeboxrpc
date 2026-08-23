/* globals $,vis */
'use strict';

export const buttonrew = {
    createWidget: function (widgetID, view, data, style) {
        const $div = $(`#${widgetID}`);
        if (!$div.length) {
            return setTimeout(function () {
                vis.binds['squeezeboxrpc'].buttonrew.createWidget(widgetID, view, data, style);
            }, 100);
        }

        data = vis.views[view].widgets[widgetID].data;
        style = vis.views[view].widgets[widgetID].style;

        const ainstance = (data.ainstance = vis.binds['squeezeboxrpc'].checkAttributes($div, data.widgetPlayer));
        if (!ainstance) {
            return;
        }

        const svgfill = data.fillcolor || '#ffffff';
        const svgstroke = data.strokecolor || '#ffffff';
        const svgstrokeWidth = data.strokewidth || '0.3';

        const svg = vis.binds['squeezeboxrpc'].svg;

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
        text += `    <input type="submit" id="${widgetID}button" name="${widgetID}" value="rew" >`;
        text += '    <span> \n';
        text += '      <img src="widgets/squeezeboxrpc/img/rew.svg"> \n';
        text += '    </span> \n';
        text += '  </div> \n';
        text += '</div> \n';

        $(`#${widgetID}`).html(text);

        const image = data.imagerew || svg.rew;

        if (image.startsWith('<svg')) {
            $(`#${widgetID} span`).html(image);
            const $g = $(`#${widgetID} svg > g`);
            if ($g.length) {
                $g.attr('fill', svgfill);
                $g.attr('stroke', svgstroke);
                $g.attr('stroke-width', svgstrokeWidth);
            }
        } else {
            $(`#${widgetID} img`).attr('src', image);
        }

        //one onclick on span?
        $(`#${widgetID} img`).on(
            'click',
            { self: this, widgetID: widgetID, view: view, data: data, style: style },
            this.onClick,
        );
        $(`#${widgetID} svg`).on(
            'click',
            { self: this, widgetID: widgetID, view: view, data: data, style: style },
            this.onClick,
        );
    },
    onClick: function (event) {
        const data = event.data.data;
        const playername = vis.binds['squeezeboxrpc'].getPlayerName(data.widgetPlayer);
        const stateid = `${data.ainstance.join('.')}.Players` + `.${playername}.btnRewind`;
        const state = true;
        vis.setValue(stateid, state);
    },
};
