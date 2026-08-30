/*
    ioBroker.vis squeezeboxrpc Widget-Set

    Copyright 2025 oweitman oweitman@gmx.de

*/
/* globals $,vis,systemDictionary */
'use strict';

// add translations for edit mode
import { version as pkgVersion } from '../../../package.json';
import { browser } from './widgets/browser.js';
import { favorites } from './widgets/favorites.js';
import { players } from './widgets/players.js';
import { buttonplay } from './widgets/buttonplay.js';
import { buttonfwd } from './widgets/buttonfwd.js';
import { buttonrew } from './widgets/buttonrew.js';
import { buttonrepeat } from './widgets/buttonrepeat.js';
import { buttonshuffle } from './widgets/buttonshuffle.js';
import { volumebar } from './widgets/volumebar.js';
import { syncgroup } from './widgets/syncgroup.js';
import { playtime } from './widgets/playtime.js';
import { string } from './widgets/string.js';
import { playlist } from './widgets/playlist.js';
import { playlistdetail } from './widgets/playlistdetail.js';
import { number } from './widgets/number.js';
import { datetime } from './widgets/datetime.js';
import { image } from './widgets/image.js';
import { configurationEditor } from './configurationEditor.js';
import { parseItemConfiguration } from './itemConfiguration.js';
import { collectSqueezeboxInstances } from './instanceSelection.js';
import { svgIcons } from './svgIcons.js';

var translations = require('../myi18n/translations.json');
$.extend(true, systemDictionary, translations);

/* fetch('widgets/squeezeboxrpc/myi18n/translations.json').then(async res => {
    const i18n = await res.json();

    $.extend(true, systemDictionary, i18n);
}); */

vis.binds['squeezeboxrpc'] = {
    version: pkgVersion,
    debug: false,
    fetchResults: false,
    playerSelections: {},
    showVersion: function () {
        if (vis.binds['squeezeboxrpc'].version) {
            console.log(`Version squeezeboxrpc: ${vis.binds['squeezeboxrpc'].version}`);
            vis.binds['squeezeboxrpc'].version = null;
        }
    },
    svg: svgIcons,
    playerattributes: [
        'Playername',
        'PlayerID',
        'Connected',
        'IP',
        'Power',
        'Mode',
        'Time',
        'Rate',
        'SyncSlaves',
        'SyncMaster',
        'Volume',
        'PlaylistRepeat',
        'PlaylistShuffle',
        'Remote',
        'Playlist',
        'PlaylistCurrentIndex',
        'state',
        'Duration',
        'Bitrate',
        'Album',
        'ArtworkUrl',
        'Genre',
        'Type',
        'Title',
        'Artist',
        'Albumartist',
        'Trackartist',
        'Band',
        'Url',
        'RadioName',
    ],
    playerConfigurationEditor: function (widAttr) {
        return configurationEditor('players', widAttr);
    },
    favoriteConfigurationEditor: function (widAttr) {
        return configurationEditor('favorites', widAttr);
    },
    instanceSelect: function (widAttr) {
        const inputID = `inspect_${widAttr}`;
        const optionHtml = instances =>
            ['']
                .concat(instances)
                .map(instance => `<option value="${instance}">${instance}</option>`)
                .join('');
        const knownInstances = collectSqueezeboxInstances(vis.objects || {});

        setTimeout(() => {
            if (typeof vis.conn.getObjectView != 'function') {
                return;
            }
            vis.conn.getObjectView(
                'system',
                'instance',
                {
                    startkey: 'system.adapter.squeezeboxrpc.',
                    endkey: 'system.adapter.squeezeboxrpc.\u9999',
                },
                (error, result) => {
                    if (error) {
                        console.error('Cannot read SqueezeboxRPC instances:', error);
                        return;
                    }
                    const $select = $(`#${inputID}`);
                    if (!$select.length) {
                        return;
                    }
                    const selected = $select.val();
                    const instances = collectSqueezeboxInstances(result);
                    if (selected && !instances.includes(selected)) {
                        instances.unshift(selected);
                    }
                    $select.html(optionHtml(instances)).val(selected);
                },
            );
        }, 0);

        return { input: `<select type="text" id="${inputID}">${optionHtml(knownInstances)}</select>` };
    },
    getPlayerWidgetData: function (playerWidgetID) {
        if (vis.widgets?.[playerWidgetID]?.data) {
            return vis.widgets[playerWidgetID].data;
        }
        for (const view of Object.values(vis.views || {})) {
            if (view.widgets?.[playerWidgetID]?.data) {
                return view.widgets[playerWidgetID].data;
            }
        }
        return null;
    },
    getPlayerWidgetType: function (_view, playerWidgetID) {
        return this.getPlayerWidgetData(playerWidgetID)?.formattype || '';
    },
    checkAttributes: function ($div, widgetPlayer) {
        if (!widgetPlayer) {
            $div.html('Please select a player widget');
            return false;
        }
        const playerData = this.getPlayerWidgetData(widgetPlayer);
        if (!playerData?.ainstance) {
            $div.html('Please select an instance at the playerwidget');
            return false;
        }
        const ainstance = playerData.ainstance.split('.');
        if (!ainstance || ainstance[0] != 'squeezeboxrpc') {
            $div.html('Please select an instance at the playerwidget');
            return false;
        }
        return ainstance;
    },
    setChanged: function (widgetPlayer, fdata) {
        $('body')
            .off(`squeezeboxrpcplayerchange.${fdata.widgetID}`)
            .on(`squeezeboxrpcplayerchange.${fdata.widgetID}`, fdata, function (_event, changedWidget) {
                if (changedWidget != widgetPlayer) {
                    return;
                }
                const self = fdata.self;
                self.setState(fdata);
            });
    },
    setPlayersChanged: function (
        $div,
        widgetPlayer,
        fdata,
        onChange_callback,
        boundstates_callback,
        playerChanged_callback,
    ) {
        const bindPlayerStates = () => {
            const boundstates = boundstates_callback(fdata);
            if (boundstates?.length) {
                vis.binds['squeezeboxrpc'].bindStates($div, boundstates, onChange_callback, fdata);
            }
        };

        $('body')
            .off(`squeezeboxrpcplayerschanged.${fdata.widgetID}`)
            .on(`squeezeboxrpcplayerschanged.${fdata.widgetID}`, (_event, changedWidget) => {
                if (changedWidget != widgetPlayer) {
                    return;
                }
                bindPlayerStates();
                playerChanged_callback?.(fdata);
            });

        bindPlayerStates();
    },
    bindStates: function (elem, bound, change_callback, fdata) {
        const $div = $(elem);
        const boundstates = $div.data('bound');
        if (boundstates) {
            for (let i = 0; i < boundstates.length; i++) {
                vis.states.unbind(boundstates[i], change_callback);
            }
        }
        $div.data('bound', null);
        $div.data('bindHandler', null);

        vis.conn.gettingStates = 0;
        vis.conn.getStates(
            bound,
            function (error, states) {
                if (error) {
                    console.error('Cannot read initial widget states:', error);
                }
                vis.updateStates(states || {});
                vis.conn.subscribe(bound);
                for (let i = 0; i < bound.length; i++) {
                    bound[i] = `${bound[i]}.val`;
                    vis.states.bind(bound[i], change_callback);
                }
                $div.data('bound', bound);
                $div.data('bindHandler', change_callback);
                change_callback.call(fdata);
            }.bind({ fdata, change_callback }),
        );
    },
    attrSelect: function (wid_attr, options) {
        if (wid_attr === 'widgetPlayer') {
            options = this.findPlayerWidgets();
        }
        if (wid_attr === 'widgetFavorites') {
            options = this.findFavoritesWidgets();
        }
        let html = '';
        for (let i = 0; i < options.length; i++) {
            const value = typeof options[i] == 'string' ? options[i] : options[i].value;
            const label = typeof options[i] == 'string' ? options[i] : options[i].label;
            html += `<option value="${value}">${label}</option>`;
        }
        const line = {
            input: `<select type="text" id="inspect_${wid_attr}">${html}</select>`,
        };
        return line;
    },
    playerAttrSelect: function (wid_attr) {
        let html = '';
        const playerattributes = vis.binds['squeezeboxrpc'].playerattributes.sort();
        for (let i = 0; i < playerattributes.length; i++) {
            html += `<option value="${playerattributes[i]}">${playerattributes[i]}</option>`;
        }
        const line = {
            input: `<select type="text" id="inspect_${wid_attr}">${html}</select>`,
        };
        return line;
    },
    findPlayerWidgets: function () {
        const result = [];
        for (const [viewName, view] of Object.entries(vis.views || {})) {
            for (const [widgetID, widget] of Object.entries(view.widgets || {})) {
                if (widget.tpl == 'tplSqueezeboxrpcPlayer') {
                    const instance = String(widget.data?.ainstance || '').replace(/^system\.adapter\./, '');
                    const name = String(widget.data?.name || widgetID);
                    result.push({
                        value: widgetID,
                        label: instance ? `${instance} (${viewName}: ${name})` : `${viewName}: ${name}`,
                    });
                }
            }
        }
        return result.sort((left, right) => left.label.localeCompare(right.label, undefined, { numeric: true }));
    },
    findFavoritesWidgets: function () {
        const widgets = vis.views[vis.activeView].widgets;
        const keys = Object.keys(widgets);
        const result = [];
        for (let i = 0; i < keys.length; i++) {
            if (widgets[keys[i]].tpl == 'tplSqueezeboxrpcFavorites') {
                result.push(keys[i]);
            }
        }
        return result;
    },
    getPlayerValues: function (widgetPlayer) {
        const domValues = $(`input[name=${widgetPlayer}], #${widgetPlayer} option`)
            .toArray()
            .reduce(function (acc, cur) {
                if ($(cur).val()) {
                    acc.push($(cur).val());
                }
                return acc;
            }, []);
        if (domValues.length) {
            return domValues;
        }
        const published = this.playerSelections[widgetPlayer]?.players;
        if (published?.length) {
            return published.slice();
        }
        const configuration = parseItemConfiguration(this.getPlayerWidgetData(widgetPlayer)?.playerConfiguration);
        return configuration ? configuration.items.filter(item => item.enabled !== false).map(item => item.id) : [];
    },
    getPlayerName: function (widgetPlayer) {
        const domValue = $(`input[name=${widgetPlayer}]:checked, #${widgetPlayer} option:checked`).val();
        if (domValue) {
            return domValue;
        }
        const published = this.playerSelections[widgetPlayer]?.player;
        if (published) {
            return published;
        }
        const configuration = parseItemConfiguration(this.getPlayerWidgetData(widgetPlayer)?.playerConfiguration);
        const players = configuration?.items.filter(item => item.enabled !== false) || [];
        return players.some(item => item.id == configuration?.defaultId) ? configuration.defaultId : players[0]?.id;
    },
    publishPlayerSelection: function (widgetPlayer) {
        const playerData = this.getPlayerWidgetData(widgetPlayer);
        const player = $(`input[name=${widgetPlayer}]:checked, #${widgetPlayer} option:checked`).val();
        const players = $(`input[name=${widgetPlayer}], #${widgetPlayer} option`)
            .toArray()
            .map(element => $(element).val())
            .filter(Boolean);
        if (!playerData?.ainstance || !player) {
            return;
        }
        this.playerSelections[widgetPlayer] = {
            instance: String(playerData.ainstance).replace(/^system\.adapter\./, ''),
            player,
            players,
        };
        $('body').trigger('squeezeboxrpcplayerchange', [widgetPlayer]);
    },
    getPlayerNameAsync: async function (widgetPlayer) {
        return new Promise((resolve, reject) => {
            (async () => {
                let i = 0;
                while (i < 1000) {
                    let playername = this.getPlayerName(widgetPlayer);
                    if (!playername) {
                        await new Promise(r => setTimeout(r, 100));
                    } else {
                        resolve(playername);
                        return;
                    }
                    i++;
                    console.log(i);
                }
                reject();
            })();
        });
    },
    onHorizChange: function (widgetID, view, newId) {
        const data = vis.views[view].widgets[widgetID].data;
        if (newId == 'vertical') {
            data.segheight = '100%';
            data.segwidth = '100%';
        } else {
            data.segheight = '20px';
            data.segwidth = '20px';
        }
        return true;
    },
    editDimension: function (widgetID, view, newId, attr) {
        if (newId && typeof newId !== 'object') {
            const e = newId.substring(newId.length - 2);
            if (e !== 'px' && e !== 'em' && newId[newId.length - 1] !== '%') {
                vis.views[view].widgets[widgetID].data[attr] = `${newId}px`;
            }
        }
    },
    browsesendToAsync: async function (instance, command, sendData) {
        let result = await vis.binds['squeezeboxrpc'].sendToAsync(instance, command, sendData);
        if (vis.binds['squeezeboxrpc'].fetchResults) {
            console.debug('debugbrowsersendtoasync', {
                debug: 'debug data',
                instance: instance,
                command: command,
                sendData: sendData,
                result: result,
            });
        }
        return result;
    },
    sendToAsync: async function (instance, command, sendData) {
        console.log(`sendToAsync ${command} ${JSON.stringify(sendData)}`);
        return new Promise((resolve /* , reject */) => {
            // eslint-disable-next-line no-useless-catch
            try {
                vis.conn.sendTo(instance, command, sendData, function (receiveData) {
                    resolve(receiveData);
                });
            } catch (error) {
                throw error;
                //reject(error);
            }
        });
    },
    getPlaylistData: async function (instance) {
        console.log(`getPlaylistData`);
        const data = {
            playerid: '',
            cmdArray: ['playlists', '0', '999', 'tags:us'],
        };
        return await this.sendToAsync(instance, 'cmdGeneral', data);
    },
    getPlayerID: async function (state) {
        console.log(`getPlayerID`);
        return new Promise((resolve, reject) => {
            try {
                vis.conn.gettingStates = 0;
                vis.conn.getStates([state], function (error, states) {
                    resolve(states[state].val);
                });
            } catch (error) {
                reject(error);
            }
        });
    },
    browser,
    favorites,
    players,
    buttonplay,
    buttonfwd,
    buttonrew,
    buttonrepeat,
    buttonshuffle,
    volumebar,
    syncgroup,
    playtime,
    string,
    playlist,
    playlistdetail,
    number,
    datetime,
    image,
};
vis.binds['squeezeboxrpc'].showVersion();
//function css() {} // remove tagged temlate string error message, tagging is needed to format the css code
// function html() {} // remove tagged temlate string error message, tagging is needed to format the html code
