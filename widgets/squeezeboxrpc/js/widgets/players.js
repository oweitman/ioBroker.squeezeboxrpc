/* globals $,vis,window */
'use strict';

import { createTextImage, Font } from '../textImage.js';

export const players = {
    createWidget: async function (widgetID, view, data, style) {
        const $div = $(`#${widgetID}`);
        // if nothing found => wait
        if (!$div.length) {
            return setTimeout(function () {
                vis.binds['squeezeboxrpc'].players.createWidget(widgetID, view, data, style);
            }, 100);
        }
        // VIS 2 may expose the VIS 1 widget configuration as a frozen object.
        // Keep runtime-only values in a mutable working copy.
        data = { ...vis.views[view].widgets[widgetID].data };
        style = vis.views[view].widgets[widgetID].style;
        data.ainstance = data.ainstance ? data.ainstance.split('.').slice(0, 2).join('.') : '';
        const ainstance = data.ainstance.split('.');
        if (ainstance[0] != 'squeezeboxrpc' || !ainstance[1]) {
            $div.html('Please select an instance');
            return;
        }

        const renderPlayers = function (playerNames) {
            let redrawinspectwidgets = false;
            const players = playerNames;
            vis.binds['squeezeboxrpc'].viewIndexMetadata[widgetID] = {
                functionname: 'players',
                viewindexcheck: players,
            };

            const editmodehelper = data.editmodehelper;
            const picWidth = data.picWidth;
            const picHeight = data.picHeight;
            const opacity = vis.editMode && editmodehelper ? 1 : data.opacity;
            const borderwidth = data.borderwidth;
            const borderstyle = data.borderstyle;
            const bordercolornormal = data.bordercolornormal;
            const bordercoloractive = data.bordercoloractive;
            const borderradius = data.borderradius;
            const buttonmargin = data.buttonmargin || '0px';

            if (!data.viewindex || data.viewindex.trim() == '') {
                data.viewindex = this.getViewindex(players).join(', ');
            }

            data.defaultPlayer = data.defaultPlayer || Object.keys(players)[0] || '0';

            if (vis.editMode && data.bCount != Math.min(players.length, data.viewindex.split(',').length)) {
                data.bCount = Math.min(players.length, data.viewindex.split(',').length);
                redrawinspectwidgets = true;
            }

            const viewindex = data.viewindex.split(', ');
            if (data.formattype == 'formatselect') {
                let text = '';
                let option = '';
                option += '<option value=""></option>';
                for (let i = 0; i < viewindex.length; i++) {
                    let buttonsText = data[`buttonsText${viewindex[i] + 1}`] || '';
                    buttonsText = buttonsText.trim() != '' ? buttonsText : players[viewindex[i]];
                    if (vis.editMode && editmodehelper) {
                        buttonsText += ` [${viewindex[i]}]`;
                    }

                    option += `<option value="${players[viewindex[i]]}">${buttonsText}</option>`;
                }
                text += `<select type="text" id="${widgetID}select">${option}</select>`;
                $(`#${widgetID}`).html(text);
            }
            if (data.formattype == 'formatbutton') {
                let text = '';

                text += '<style>\n';
                text += `#${widgetID} div {\n`;
                text += '     display: inline-block; \n';
                text += '}\n';
                text += `#${widgetID} div div {\n`;
                text += '     position: relative; \n';
                text += `     margin: 0px ${buttonmargin} ${buttonmargin} 0px; \n`;
                text += '}\n';
                text += `#${widgetID} input[type="radio"] {\n`;
                text += '    display: none;\n';
                text += '}\n';
                text += `#${widgetID} img {\n`;
                text += `    opacity: ${opacity};\n`;
                text += `    width: ${picWidth}px;\n`;
                text += `    height: ${picHeight}px;\n`;
                text += `    border: ${borderwidth} ${borderstyle} ${bordercolornormal};\n`;
                text += `    border-radius: ${borderradius};\n`;
                text += '}\n';
                text += `#${widgetID} canvas {\n`;
                text += `    opacity: ${opacity};\n`;
                text += `    width: ${picWidth}px;\n`;
                text += `    height: ${picHeight}px;\n`;
                text += `    border: ${borderwidth} ${borderstyle} ${bordercolornormal};\n`;
                text += `    border-radius: ${borderradius};\n`;
                text += '}\n';
                text += `#${widgetID} img:active {\n`;
                text += '    transform: scale(0.9, 0.9);\n';
                text += '    opacity: 1;\n';
                text += `    border: ${borderwidth} ${borderstyle} ${bordercoloractive};\n`;
                text += `    border-radius: ${borderradius};\n`;
                text += '}\n';
                text += `#${widgetID} canvas:active {\n`;
                text += '    transform: scale(0.9, 0.9);\n';
                text += '    opacity: 1;\n';
                text += `    border: ${borderwidth} ${borderstyle} ${bordercoloractive};\n`;
                text += `    border-radius: ${borderradius};\n`;
                text += '}\n';
                text += `#${widgetID} input[type="radio"]:checked + label img {\n`;
                text += '    opacity: 1;\n';
                text += `    border: ${borderwidth} ${borderstyle} ${bordercoloractive};\n`;
                text += `    border-radius: ${borderradius};\n`;
                text += '}\n';
                text += `#${widgetID} input[type="radio"]:checked + label canvas {\n`;
                text += '    opacity: 1;\n';
                text += `    border: ${borderwidth} ${borderstyle} ${bordercoloractive};\n`;
                text += `    border-radius: ${borderradius};\n`;
                text += '}\n';
                text += '</style>\n';

                text += `<div id="${widgetID}container" >`;

                for (let i = 0; i < viewindex.length; i++) {
                    text += '  <div >';
                    text += `    <input type="radio" id="${widgetID}${players[viewindex[i]]}" name="${
                        widgetID
                    }" value="${players[viewindex[i]]}" ${viewindex[i] == data.defaultPlayer ? 'checked' : ''}>`;
                    text += `    <label for="${widgetID}${players[viewindex[i]]}">`;
                    text += '      <span>';
                    const buttonsImage = data[`buttonsImage${parseInt(viewindex[i]) + 1}`] || '';
                    if (buttonsImage.trim() != '') {
                        text += `        <img src="${data[`buttonsImage${parseInt(viewindex[i]) + 1}`]}">`;
                    }
                    text += '      </span>';
                    text += '    </label>';
                    if (vis.editMode && editmodehelper) {
                        text += `<div style="position: absolute;top: 0;right: 0;background-color: black;color: white;border-width: 1px;border-color: white;border-style: solid;font-size: xx-small;padding: 1px;margin:0px;">${
                            viewindex[i]
                        }</div>`;
                    }
                    text += '  </div>';
                }
                text += '</div>';

                $(`#${widgetID}`).html(text);

                const spans = $(`#${widgetID} span`);
                const font = new Font($(`#${widgetID}`));
                const opt = {};
                opt.wrapCamelCase = data.wrapcamelcase;
                opt.style = window.getComputedStyle($(`#${widgetID}`)[0], null);
                opt.backgroundcolor = data.buttonbkcolor;
                for (let i = 0; i < viewindex.length; i++) {
                    const buttonsImage = data[`buttonsImage${parseInt(viewindex[i]) + 1}`] || '';
                    let buttonsText = data[`buttonsText${parseInt(viewindex[i]) + 1}`] || '';
                    buttonsText = buttonsText.trim() != '' ? buttonsText : players[viewindex[i]];
                    if (buttonsImage.trim() == '') {
                        $(spans[i]).append(createTextImage(buttonsText, font, picWidth, picHeight, opt));
                    }
                }
            }
            if (vis.editMode && redrawinspectwidgets) {
                vis.binds['squeezeboxrpc'].redrawInspectWidgets(view);
            }
            $(`#${widgetID}`).trigger('playerschanged');
        }.bind(this);

        try {
            const playerNames = await vis.binds['squeezeboxrpc'].sendToAsync(data.ainstance, 'getPlayerNames', {});
            if (!Array.isArray(playerNames)) {
                throw new TypeError(`Invalid getPlayerNames response: ${JSON.stringify(playerNames)}`);
            }
            renderPlayers(playerNames);
        } catch (error) {
            console.error(`Cannot read player names for ${data.ainstance}:`, error);
            $div.html('Cannot read players');
        }
    },
    getViewindex: function (players) {
        return Object.keys(players);
    },
    checkViewindexExist: function (viewindex, players) {
        return viewindex.map(function (item) {
            return item < players.length ? item : 0;
        });
    },
};
