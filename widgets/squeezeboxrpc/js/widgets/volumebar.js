/* globals $,vis */
'use strict';

import { calculateActiveLevels, calculateVolume } from '../volumeUtils.js';

export const volumebar = {
    createWidget: function (widgetID, view, data, style) {
        const $div = $(`#${widgetID}`);
        if (!$div.length) {
            return setTimeout(function () {
                vis.binds['squeezeboxrpc'].volumebar.createWidget(widgetID, view, data, style);
            }, 100);
        }

        data = vis.views[view].widgets[widgetID].data;
        style = vis.views[view].widgets[widgetID].style;

        const ainstance = (data.ainstance = vis.binds['squeezeboxrpc'].checkAttributes($div, data.widgetPlayer));
        if (!ainstance) {
            return;
        }

        const fdata = {
            self: this,
            widgetID: widgetID,
            view: view,
            data: data,
            style: style,
            ainstance: ainstance,
        };
        //if ($('#' + data.widgetPlayer).length>0) this.playersChanged({data:fdata});

        vis.binds['squeezeboxrpc'].setPlayersChanged(
            $div,
            data.widgetPlayer,
            fdata,
            this.onChange.bind(fdata),
            function () {
                const boundstates = [];
                const players = vis.binds['squeezeboxrpc'].getPlayerValues(data.widgetPlayer);
                for (let i = 0; i < players.length; i++) {
                    boundstates.push(`${ainstance[0]}.${ainstance[1]}.Players.${players[i]}.Volume`);
                }
                return boundstates;
            },
        );
        vis.binds['squeezeboxrpc'].setChanged(data.widgetPlayer, fdata, this.setState.bind(fdata));

        const calctype = data.calctype || 'segstep';
        const segments = data.segments || 11;
        const position = data.position || 'vertical';
        let segheight, segwidth;
        if (position == 'vertical') {
            segheight = data.segheight || '100%';
            segwidth = data.segwidth || '100%';
        } else {
            segheight = data.segheight || '100%';
            segwidth = data.segwidth || '20px';
        }
        const borderwidth = data.borderwidth || '1px';
        const bordercolornormal = data.bordercolornormal || '#909090';
        const bordercoloractive = data.bordercoloractive || '#87ceeb';
        const fillcolornormal = data.fillcolornormal || '#005000';
        const fillcoloractive = data.fillcoloractive || '#00ff00';
        const reverse = data.reverse || false;
        const margin = data.margin || '1px';

        data.calctype = calctype;
        data.segments = segments;
        data.position = position;

        data.segheight = segheight;
        data.segwidth = segwidth;
        data.borderwidth = borderwidth;
        data.bordercolornormal = bordercolornormal;
        data.bordercoloractive = bordercoloractive;
        data.fillcolornormal = fillcolornormal;
        data.fillcoloractive = fillcoloractive;
        data.reverse = reverse;
        data.margin = margin;

        let text = '';
        text += '<style> \n';
        text += `    #${widgetID} .volume { \n`;
        text += '        box-sizing: border-box; \n';
        text += '        display: inline-block; \n';
        text += '        font-size:0px; \n';
        text += '        width: 100%; \n';
        text += '        height: 100%; \n';
        text += '        overflow: visible; \n';
        if (position == 'horizontal') {
            text += '        white-space: nowrap; \n';
        }
        text += '    } \n';
        text += `    #${widgetID} .level { \n`;
        text += '        box-sizing: border-box; \n';
        text += '        display: inline-block; \n';
        text += `        outline: ${borderwidth} solid ${bordercolornormal}; \n`;
        if (position == 'horizontal') {
            text += `        height: calc(100% - ( 2 * ${margin} )); \n`;
            text += `        width: calc((100% / ${segments}) - ( 2 * ${margin} )); \n`;
        }
        if (position == 'vertical') {
            text += `        height: calc((100% / ${segments}) - ( 2 * ${margin} )); \n`;
            text += `        width: calc(100% - ( 2 * ${margin} )); \n`;
        }
        text += `        background-color: ${fillcolornormal}; \n`;
        text += `        margin: ${margin};         \n`;
        text += '    } \n';
        text += `    #${widgetID} .active { \n`;
        text += `        border-color: ${bordercoloractive}; \n`;
        text += `        background-color: ${fillcoloractive}; \n`;
        text += '    } \n';
        text += '</style> \n';

        text += '<div class="volume"> \n';
        for (let i = 0; i < segments; i++) {
            text += `    <div class="level" value="${i}"></div> \n`;
        }
        text += '</div> \n';
        $(`#${widgetID}`).html(text);
        $(`#${widgetID} div.volume`).off('click.volume').on('click.volume', fdata, this.onClick);
        this.setState(fdata);
        if (vis.editMode) {
            vis.inspectWidgets(view, view);
        }
    },
    onClick: function (event) {
        const offset = $(this).offset();
        const x = event.pageX - offset.left;
        const y = event.pageY - offset.top;

        const data = event.data.data;
        const playername = vis.binds['squeezeboxrpc'].getPlayerName(data.widgetPlayer);
        const stateid = `${data.ainstance.join('.')}.Players` + `.${playername}.Volume`;

        const position = data.position == 'horizontal' ? x : y;
        const size = data.position == 'horizontal' ? this.clientWidth : this.clientHeight;
        const state = calculateVolume(position, size, data.segments, data.calctype, data.reverse);

        vis.binds['squeezeboxrpc'].volumebar.renderState(event.data, state);
        vis.setValue(stateid, state);
    },
    onChange: function () {
        this.self.setState(this);
    },
    setState: function (fdata) {
        const data = fdata.data;
        const playername = vis.binds['squeezeboxrpc'].getPlayerName(data.widgetPlayer);
        if (!playername) {
            return setTimeout(function () {
                vis.binds['squeezeboxrpc'].volumebar.setState(fdata);
            }, 100);
        }
        const stateid = `${data.ainstance.join('.')}.Players` + `.${playername}.Volume`;
        let state =
            vis.states[`${stateid}.val`] || vis.states[`${stateid}.val`] === 0 ? vis.states[`${stateid}.val`] : 0;
        if (vis.editMode) {
            state = 50;
        }

        this.renderState(fdata, state);
    },
    renderState: function (fdata, state) {
        const data = fdata.data;
        const widgetID = fdata.widgetID;
        const reverse = data.reverse;
        const level = calculateActiveLevels(state, data.segments);
        const selector = reverse
            ? `#${widgetID} div.volume > div.level:nth-last-child(-n+${level})`
            : `#${widgetID} div.volume > div.level:nth-child(-n+${level})`;
        $(`#${widgetID} div.volume > div.level`).removeClass('active');
        $(selector).addClass('active');
    },
};
