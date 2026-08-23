/* globals $,vis */
'use strict';

export const playlist = {
    createWidget: function (widgetID, view, data, style) {
        const $div = $(`#${widgetID}`);
        if (!$div.length) {
            return setTimeout(function () {
                vis.binds['squeezeboxrpc'].playlist.createWidget(widgetID, view, data, style);
            }, 100);
        }

        data = vis.views[view].widgets[widgetID].data;
        style = vis.views[view].widgets[widgetID].style;

        const ainstance = (data.ainstance = vis.binds['squeezeboxrpc'].checkAttributes($div, data.widgetPlayer));
        if (!ainstance) {
            return;
        }

        const fdata = { self: this, widgetID: widgetID, view: view, data: data, style: style };

        this.setState(fdata);
    },
    onChange: function () {
        this.self.setState(this);
    },
    setState: async function (fdata) {
        const data = fdata.data;
        const widgetID = fdata.widgetID;
        const $div = $(`#${widgetID}`);
        const playername = vis.binds['squeezeboxrpc'].getPlayerName(data.widgetPlayer);
        if (!playername) {
            return setTimeout(function () {
                vis.binds['squeezeboxrpc'].playlist.setState(fdata);
            }, 100);
        }
        const ainstance = (data.ainstance = vis.binds['squeezeboxrpc'].checkAttributes($div, data.widgetPlayer));
        let result = await vis.binds['squeezeboxrpc'].getPlaylistData(ainstance.join('.'));
        let playlist = result.result.playlists_loop;
        let text = '';
        text += `
            <style>
            #${widgetID} ul.plcontainer {
                list-style-type: none;
                padding-left: 0px;
                margin: 0px;
            }
            #${widgetID} li.plentry {
                cursor: pointer;
                height: 1em;
                margin: 5px 0px;
            }
            #${widgetID} li.plentry div {
                text-overflow: ellipsis;
                overflow: hidden;
                white-space: nowrap;
            }
            #${widgetID} li.plrefresh {
                width: 1em;
                height: 1em;
                margin: 5px 0px;
            }
            </style>
            `;
        text += '<ul class="plcontainer">';
        text +=
            '<li class="plrefresh"><div><svg focusable="false" aria-hidden="true" viewBox="0 0 24 24" data-testid="RefreshIcon"><path fill="currentColor" d="M17.65 6.35C16.2 4.9 14.21 4 12 4c-4.42 0-7.99 3.58-7.99 8s3.57 8 7.99 8c3.73 0 6.84-2.55 7.73-6h-2.08c-.82 2.33-3.04 4-5.65 4-3.31 0-6-2.69-6-6s2.69-6 6-6c1.66 0 3.14.69 4.22 1.78L13 11h7V4z"></path></svg></div></li>';
        for (let i = 0; i < playlist.length; i++) {
            let pl = playlist[i];
            text += `<li class="plentry"><div class="pltext" data-plid="${pl.id}" data-pln="${playername}" data-ins="${ainstance.join('.')}" onclick="vis.binds.squeezeboxrpc.playlist.onclickplaylist(this,event)">${pl.playlist}</div></li>`;
        }
        text += '</ul>';
        $(`#${widgetID}`).html(text);
        $(`#${widgetID} li.refresh`).click(
            function (fdata) {
                vis.binds.squeezeboxrpc.playlist.setState(fdata);
            }.bind(this, fdata),
        );
    },
    onclickplaylist: function (el) {
        const playlistid = el.dataset.plid || '';
        const playername = el.dataset.pln || '';
        const instance = el.dataset.ins || '';
        const stateid = `${instance}.Players` + `.${playername}.cmdGeneral`;
        vis.setValue(stateid, `"playlistcontrol","cmd:load","playlist_id:${playlistid}"`);
    },
    onclickrefresh: function (el) {
        const playlistid = el.dataset.plid || '';
        const playername = el.dataset.pln || '';
        const instance = el.dataset.ins || '';
        const stateid = `${instance}.Players` + `.${playername}.cmdGeneral`;
        vis.setValue(stateid, `"playlistcontrol","cmd:load","playlist_id:${playlistid}"`);
    },
};
