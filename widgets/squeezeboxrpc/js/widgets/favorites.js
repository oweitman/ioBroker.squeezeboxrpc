/* globals $,vis,window */
'use strict';

import { createTextImage, Font } from '../textImage.js';

export const favorites = {
    createWidget: function (widgetID, view, data, style) {
        const $div = $(`#${widgetID}`);
        // if nothing found => wait
        if (!$div.length) {
            return setTimeout(function () {
                vis.binds['squeezeboxrpc'].favorites.createWidget(widgetID, view, data, style);
            }, 100);
        }

        // Keep the saved configuration and already resolved runtime bindings in
        // a mutable object. Resolved values must win over their raw expressions.
        data = { ...vis.views[view].widgets[widgetID].data, ...(data || {}) };
        style = vis.views[view].widgets[widgetID].style;
        let redrawinspectwidgets = false;

        const ainstance = (data.ainstance = vis.binds['squeezeboxrpc'].checkAttributes($div, data.widgetPlayer));
        if (!ainstance) {
            return;
        }

        const fdata = { self: this, widgetID: widgetID, view: view, data: data, style: style };

        const key = `${ainstance[0]}.${ainstance[1]}.` + `Favorites.*`;
        vis.conn.gettingStates = 0;
        vis.conn.getStates(
            key,
            function (err, obj) {
                let favorites = this.getFavorites(obj, ainstance);
                favorites = this.filterFavorites(favorites);
                vis.binds['squeezeboxrpc'].viewIndexMetadata[widgetID] = {
                    functionname: 'favorites',
                    viewindexcheck: favorites,
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
                    data.viewindex = this.getViewindex(favorites).join(', ');
                }

                if (vis.editMode && data.bCount != Math.min(favorites.length, data.viewindex.split(',').length)) {
                    data.bCount = Math.min(favorites.length, data.viewindex.split(',').length);
                    redrawinspectwidgets = true;
                }

                let text = '';

                text += '<style>\n';
                text += `#${widgetID} div {\n`;
                text += '     display: inline-block; \n';
                text += '}\n';
                text += `#${widgetID} div div {\n`;
                text += '     position: relative; \n';
                text += `     margin: 0px ${buttonmargin} ${buttonmargin} 0px; \n`;
                text += '}\n';
                text += `#${widgetID} #${widgetID}container {\n`;
                text += '    box-sizing: border-box;\n';
                text += '    display: block;\n';
                text += '    width: 100%;\n';
                text += '    height: 100%;\n';
                text += '    overflow: auto;\n';
                text += '    scrollbar-width: thin;\n';
                text += '}\n';
                text += `#${widgetID} #${widgetID}container::-webkit-scrollbar {\n`;
                text += '    width: 6px;\n';
                text += '    height: 6px;\n';
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

                text += `<div id="${widgetID}container">`;
                const viewindex = data.viewindex.split(', ');
                for (let i = 0; i < viewindex.length; i++) {
                    const favorite = this.findById(favorites, viewindex[i]);
                    text += '  <div>';
                    text += `    <input type="radio" id="${widgetID}${favorite.id}" name="${widgetID}" value="${
                        favorite.id
                    }" >`;
                    text += `    <label for="${widgetID}${favorite.id}">`;
                    text += '      <span>';
                    let favimage = favorite.image || '';
                    let favtext = favorite.id || '';
                    let attrimage = data[`buttonsImage${i + 1}`] || '';
                    let attrtext = data[`buttonsText${i + 1}`] || '';

                    favimage = favimage.trim();
                    favtext = favtext.trim();
                    attrimage = attrimage.trim();
                    attrtext = attrtext.trim();

                    const buttonsImage = attrimage || favimage;

                    if (!attrtext && buttonsImage) {
                        text += `        <img src="${buttonsImage}">`;
                    }
                    text += '      </span>';
                    text += '    </label>';
                    if (vis.editMode && editmodehelper) {
                        text += `<div style="position: absolute;top: 0;right: 0;background-color: black;color: white;border-width: 1px;border-color: white;border-style: solid;font-size: xx-small;padding: 1px;">${
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
                const computedStyle = window.getComputedStyle($(`#${widgetID}`)[0], null);

                opt.style = {
                    color: style?.color || '#ffffff',
                    direction: computedStyle.direction,
                    textAlign: computedStyle.textAlign || 'center',
                };
                opt.backgroundcolor = data.buttonbkcolor || '#000000';
                for (let i = 0; i < viewindex.length; i++) {
                    const favorite = this.findById(favorites, viewindex[i]);

                    let favimage = favorite.image || '';
                    let favtext = `${favorite.id || ''}(${i})`;
                    let attrimage = data[`buttonsImage${i + 1}`] || '';
                    let attrtext = data[`buttonsText${i + 1}`] || '';

                    favimage = favimage.trim();
                    favtext = favtext.trim();
                    attrimage = attrimage.trim();
                    attrtext = attrtext.trim();

                    const buttonsImage = attrimage || favimage;

                    const buttonsText = attrtext || favtext;
                    if (attrtext || !buttonsImage) {
                        $(spans[i]).append(createTextImage(buttonsText, font, picWidth, picHeight, opt));
                    }
                }
                const favbtns = $(`input[name=${widgetID}]`);
                favbtns.off('change.favorite').on('change.favorite', fdata, function (event) {
                    const fdata = event.data;
                    const data = fdata.data;
                    const favorite = this.value;
                    const playername = vis.binds['squeezeboxrpc'].getPlayerName(data.widgetPlayer);
                    const state = `${ainstance[0]}.${ainstance[1]}.Players` + `.${playername}.cmdPlayFavorite`;
                    //vis.conn._socket.emit('setState', state, favorite);
                    vis.setValue(state, favorite);
                });
                if (vis.editMode && redrawinspectwidgets) {
                    vis.binds['squeezeboxrpc'].redrawInspectWidgets(view);
                }
            }.bind(this),
        );
    },
    getFavorites: function (datapoints, ainstance) {
        const regex = new RegExp(`^${ainstance[0]}\\.${ainstance[1]}\\.Favorites`, '');
        return Object.keys(datapoints).reduce(
            function (acc, cur) {
                if (regex.test(cur)) {
                    const key = cur.split('.')[3];
                    const name = cur.split('.')[4];
                    if (!acc[key]) {
                        acc[key] = {};
                    }
                    acc[key][name] = this[cur].val;
                }
                return acc;
            }.bind(datapoints),
            [],
        );
    },
    filterFavorites: function (favorites) {
        favorites = Object.values(favorites);
        return favorites.filter(function (cur) {
            return cur.isaudio === 1;
        });
    },
    findById: function (favorites, id) {
        return favorites.find(
            function (cur) {
                return cur.id.trim() == this.trim();
            }.bind(id),
        );
    },
    getViewindex: function (favorites) {
        return favorites.map(cur => cur.id);
    },
    checkViewindexExist: function (viewindex, favorites) {
        return viewindex.map(function (item) {
            return favorites.find(el => el.id == item) ? item : '0';
        });
    },
};
