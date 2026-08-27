/* globals $,vis,window */
'use strict';

import { createTextImage, Font, getEffectiveBackgroundColor, resolveLegacyDefaultColor } from '../textImage.js';
import { legacyPlayerConfiguration, parseItemConfiguration, visibleConfiguredItems } from '../itemConfiguration.js';

export const players = {
    createWidget: async function (widgetID, view, data, style) {
        const $div = $(`#${widgetID}`);
        // if nothing found => wait
        if (!$div.length) {
            return setTimeout(function () {
                vis.binds['squeezeboxrpc'].players.createWidget(widgetID, view, data, style);
            }, 100);
        }
        // VIS may expose the saved widget configuration as a frozen object, while
        // the data passed to the renderer contains already resolved bindings.
        // Keep both in a mutable copy and prefer the resolved runtime values.
        data = { ...vis.views[view].widgets[widgetID].data, ...(data || {}) };
        style = vis.views[view].widgets[widgetID].style;
        data.ainstance = data.ainstance ? data.ainstance.split('.').slice(0, 2).join('.') : '';
        const ainstance = data.ainstance.split('.');
        if (ainstance[0] != 'squeezeboxrpc' || !ainstance[1]) {
            $div.html('Please select an instance');
            return;
        }

        const renderPlayers = function (playerNames) {
            const configuration =
                parseItemConfiguration(data.playerConfiguration) || legacyPlayerConfiguration(data, playerNames);
            const configuredPlayers = visibleConfiguredItems(configuration, playerNames);

            const picWidth = data.picWidth;
            const picHeight = data.picHeight;
            const opacity = data.opacity;
            const borderwidth = data.borderwidth;
            const borderstyle = data.borderstyle;
            const bordercoloractive = data.bordercoloractive;
            const borderradius = data.borderradius;
            const buttonmargin = data.buttonmargin || '0px';

            const defaultPlayer = configuredPlayers.some(player => player.id == configuration.defaultId)
                ? configuration.defaultId
                : configuredPlayers[0]?.id || '';
            if (data.formattype == 'formatselect') {
                let text = '';
                let option = '';
                option += '<option value=""></option>';
                for (let i = 0; i < configuredPlayers.length; i++) {
                    const buttonsText = configuredPlayers[i].text || configuredPlayers[i].id;
                    option += `<option value="${configuredPlayers[i].id}" ${
                        configuredPlayers[i].id == defaultPlayer ? 'selected' : ''
                    }>${buttonsText}</option>`;
                }
                text += `<select type="text" id="${widgetID}select">${option}</select>`;
                $(`#${widgetID}`).html(text);
            }
            if (data.formattype == 'formatbutton') {
                const widgetElement = $div[0];
                const computedStyle = window.getComputedStyle(widgetElement, null);
                const foregroundColor = computedStyle.color || '#ffffff';
                const backgroundColor = resolveLegacyDefaultColor(
                    data.buttonbkcolor,
                    '#000000',
                    getEffectiveBackgroundColor(widgetElement, '#000000'),
                );
                const bordercolornormal = data.bordercolornormal;

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
                text += `#${widgetID} label > span {\n`;
                text += '    display: inline-block;\n';
                text += `    width: ${picWidth}px;\n`;
                text += `    height: ${picHeight}px;\n`;
                text += `    border: ${borderwidth} ${borderstyle} ${bordercolornormal};\n`;
                text += `    border-radius: ${borderradius};\n`;
                text += '    overflow: hidden;\n';
                text += '    vertical-align: top;\n';
                text += '}\n';
                text += `#${widgetID} img, #${widgetID} canvas {\n`;
                text += '    display: block;\n';
                text += `    opacity: ${opacity};\n`;
                text += `    width: ${picWidth}px;\n`;
                text += `    height: ${picHeight}px;\n`;
                text += '    border: 0;\n';
                text += '}\n';
                text += `#${widgetID} label > span:active {\n`;
                text += '    transform: scale(0.9, 0.9);\n';
                text += `    border: ${borderwidth} ${borderstyle} ${bordercoloractive};\n`;
                text += '}\n';
                text += `#${widgetID} label > span:active img, #${widgetID} label > span:active canvas {\n`;
                text += '    opacity: 1;\n';
                text += '}\n';
                text += `#${widgetID} input[type="radio"]:checked + label > span {\n`;
                text += `    border: ${borderwidth} ${borderstyle} ${bordercoloractive};\n`;
                text += '}\n';
                text += `#${widgetID} input[type="radio"]:checked + label > span img,\n`;
                text += `#${widgetID} input[type="radio"]:checked + label > span canvas {\n`;
                text += '    opacity: 1;\n';
                text += '}\n';
                text += '</style>\n';

                text += `<div id="${widgetID}container" >`;

                for (let i = 0; i < configuredPlayers.length; i++) {
                    const player = configuredPlayers[i];
                    text += '  <div >';
                    text += `    <input type="radio" id="${widgetID}${player.id}" name="${widgetID}" value="${player.id}" ${
                        player.id == defaultPlayer ? 'checked' : ''
                    }>`;
                    text += `    <label for="${widgetID}${player.id}">`;
                    text += '      <span>';
                    const buttonsImage = player.image || '';
                    if (buttonsImage.trim() != '') {
                        text += `        <img src="${buttonsImage}">`;
                    }
                    text += '      </span>';
                    text += '    </label>';
                    text += '  </div>';
                }
                text += '</div>';

                $(`#${widgetID}`).html(text);

                const spans = $(`#${widgetID} span`);
                const font = new Font($(`#${widgetID}`));
                const opt = {};
                opt.wrapCamelCase = data.wrapcamelcase;
                opt.style = {
                    color: foregroundColor,
                    direction: computedStyle.direction,
                    textAlign: computedStyle.textAlign || 'center',
                };
                opt.backgroundcolor = backgroundColor;
                for (let i = 0; i < configuredPlayers.length; i++) {
                    const buttonsImage = configuredPlayers[i].image || '';
                    const buttonsText = configuredPlayers[i].text || configuredPlayers[i].id;
                    if (buttonsImage.trim() == '') {
                        $(spans[i]).append(createTextImage(buttonsText, font, picWidth, picHeight, opt));
                    }
                }
            }
            $(`#${widgetID}`)
                .off('change.playerselection')
                .on('change.playerselection', () => vis.binds.squeezeboxrpc.publishPlayerSelection(widgetID));
            vis.binds.squeezeboxrpc.publishPlayerSelection(widgetID);
            $('body').trigger('squeezeboxrpcplayerschanged', [widgetID]);
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
};
