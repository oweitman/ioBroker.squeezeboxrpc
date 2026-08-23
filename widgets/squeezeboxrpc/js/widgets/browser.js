/* globals $,vis */
'use strict';

import { parseRequestFactory } from '../sbClasses.js';
import { getTextWidth, Font } from '../textImage.js';

export const browser = {
    topitems: [
        {
            title: 'My Music',
            actions: JSON.stringify({ next: 'mymusic' }),
            id: 'myMusic',
        },
        {
            title: 'Radio',
            actions: JSON.stringify({ next: 'radio' }),
            id: 'radio',
        },
        {
            title: 'Favorites',
            actions: JSON.stringify({ next: 'favorites' }),
            id: 'favorites',
        },
        {
            title: 'Apps',
            actions: JSON.stringify({ next: 'apps' }),
            id: 'apps',
        },
        {
            title: 'Extra',
            actions: JSON.stringify({ next: 'extra' }),
            id: 'extra',
        },
    ],
    specialRangeHandling: [
        {
            mode: 'mode:floptracks',
            range: [0, 200],
        },
        {
            mode: 'mode:toptracks',
            range: [0, 200],
        },
    ],
    indexParam: [0, 25000],
    info: {},
    createWidget: async function (widgetID, view, data, style) {
        console.log(`createWidget ${widgetID}`);
        const $div = $(`#${widgetID}`);
        // if nothing found => wait
        if (!$div.length) {
            return setTimeout(function () {
                vis.binds['squeezeboxrpc'].browser.createWidget(widgetID, view, data, style);
            }, 100);
        }
        if (!this.info[widgetID]) {
            this.info[widgetID] = {
                history: [],
                data: data,
                style: style,
                view: view,
            };
        }
        vis.binds['squeezeboxrpc'].debug = data.debug || false;
        vis.binds['squeezeboxrpc'].fetchResults = data.debugwithFetchResults || false;

        this.info[widgetID].instance = data.ainstance = vis.binds['squeezeboxrpc'].checkAttributes(
            $div,
            data.widgetPlayer,
        );
        let ainstance = this.info[widgetID].instance;
        if (!ainstance) {
            return;
        }
        const playername = await vis.binds['squeezeboxrpc'].getPlayerNameAsync(data.widgetPlayer);
        const state = `${ainstance[0]}.${ainstance[1]}.Players` + `.${playername}.PlayerID`;
        this.info[widgetID].playerid = await vis.binds['squeezeboxrpc'].getPlayerID(state);
        this.goDeeper(widgetID, { id: 'home', title: 'Home', params: null });
    },
    async goDeeper(widgetID, data) {
        vis.binds['squeezeboxrpc'].debug && console.log(`goDeeper ${widgetID}`);
        let children = await this.fetchChildren(widgetID, data);
        if (!children) {
            vis.binds['squeezeboxrpc'].debug && console.log(`End of tree reached ${widgetID}`);
            return;
        }
        this.info[widgetID].history.push(data);
        this.render(widgetID, children);
    },
    async goBack(widgetID) {
        vis.binds['squeezeboxrpc'].debug && console.log(`goBack ${widgetID}`);
        if (this.info[widgetID].history.length > 1) {
            this.info[widgetID].history.pop();
        }
        if (this.info[widgetID].history.length == 0) {
            return;
        }
        let data = this.info[widgetID].history[this.info[widgetID].history.length - 1];
        let children = await this.fetchChildren(widgetID, data);
        this.render(widgetID, children);
    },
    async fetchChildren(widgetID, data) {
        vis.binds['squeezeboxrpc'].debug && console.log(`fetchChildren ${widgetID}`);
        let items = {};
        switch (data.id || '') {
            case 'home':
                items = this.topitems;
                // // title = target.title;
                break;
            case 'radio':
                items = await vis.binds['squeezeboxrpc'].browser.browseradio(widgetID, data);
                break;
            case 'favorites':
                items = await vis.binds['squeezeboxrpc'].browser.browserfavorites(widgetID, data);
                break;
            case 'apps':
                items = await vis.binds['squeezeboxrpc'].browser.browseapps(widgetID, data);
                break;
            case 'myMusic':
            case 'extra':
                items = await vis.binds['squeezeboxrpc'].browser.browsemenu(widgetID, data);
                break;
            default:
                if (data.actions) {
                    items = await vis.binds['squeezeboxrpc'].browser.browseparametermenu(widgetID, data);
                }
                break;
        }
        if (!items) {
            return;
        }
        return items.filter(el => el);
    },
    browseapps: async function (widgetID) {
        vis.binds['squeezeboxrpc'].debug && console.log(`browseapps ${widgetID}`);
        let ainstance = this.info[widgetID].instance;
        const cmd = {
            playerid: this.info[widgetID].playerid,
            cmdArray: ['myapps', 'items', 0, '25000', 'menu:1'],
        };
        let request = await vis.binds['squeezeboxrpc'].browsesendToAsync(ainstance.join('.'), 'cmdGeneral', cmd);
        let menu = parseRequestFactory(request);
        return menu.getMenuItems();
    },
    browseradio: async function (widgetID) {
        vis.binds['squeezeboxrpc'].debug && console.log(`browseradio ${widgetID}`);
        let ainstance = this.info[widgetID].instance;
        const cmd = {
            playerid: this.info[widgetID].playerid,
            cmdArray: ['radios', 0, '25000', 'menu:radio'],
        };
        let request = await vis.binds['squeezeboxrpc'].browsesendToAsync(ainstance.join('.'), 'cmdGeneral', cmd);
        let menu = parseRequestFactory(request);
        return menu.getMenuItems();
    },
    browserfavorites: async function (widgetID) {
        vis.binds['squeezeboxrpc'].debug && console.log(`browserfavorites ${widgetID}`);
        let ainstance = this.info[widgetID].instance;
        const cmd = {
            playerid: this.info[widgetID].playerid,
            cmdArray: ['favorites', 'items', 0, '25000', 'menu:favorites'],
        };
        let request = await vis.binds['squeezeboxrpc'].browsesendToAsync(ainstance.join('.'), 'cmdGeneral', cmd);
        let menu = parseRequestFactory(request);
        return menu.getMenuItems();
    },
    browsemenu: async function (widgetID, data) {
        vis.binds['squeezeboxrpc'].debug && console.log(`browsemenu ${widgetID}`);
        let ainstance = this.info[widgetID].instance;
        const data1 = {
            playerid: this.info[widgetID].playerid,
            cmdArray: ['menu', 'items', 0, '25000', 'direct:1'],
        };
        let request = await vis.binds['squeezeboxrpc'].browsesendToAsync(ainstance.join('.'), 'cmdGeneral', data1);
        let filter = item => item.item.node === data.id;
        let menu = parseRequestFactory(request);
        return menu
            .getMenuItems()
            .filter(filter)
            .sort((a, b) => a.item.weight - b.item.weight);
        //return this.parseResult(request, filter, data.id);
    },
    browseparametermenu: async function (widgetID, data) {
        vis.binds['squeezeboxrpc'].debug && console.log(`browseparametermenu ${widgetID}`);
        let parameter = JSON.parse(data.actions)['next'];
        let ainstance = this.info[widgetID].instance;
        let range = [...this.indexParam];
        if (parameter.params) {
            this.specialRangeHandling.forEach(item => {
                if (parameter.params.includes(item.mode)) {
                    range = item.range;
                }
            });
        } /* else {
                return;
            } */
        const cmd = {
            playerid: this.info[widgetID].playerid,
            cmdArray: [...parameter.command, ...range, ...parameter.params],
        };
        let request = await vis.binds['squeezeboxrpc'].browsesendToAsync(ainstance.join('.'), 'cmdGeneral', cmd);
        let menu = parseRequestFactory(request);
        return menu.getMenuItems();
    },
    clickhandler: async function (event, widgetID, func, id) {
        vis.binds['squeezeboxrpc'].debug && console.log(`clickhandler ${widgetID} ${func} ${id}`);
        let child;

        event.preventDefault();
        event.stopPropagation();
        if (id) {
            child = this.info[widgetID].currentChildren.find(c => c.id == id);
        }
        if (func == 'next') {
            /*                 if (!child.param) {
                    return;
                } */
            await this.goDeeper(widgetID, child);
        } else if (func == 'back') {
            await this.goBack(widgetID);
            return;
        } else {
            await this.doAction(widgetID, child, func, id);
            return;
        }
    },
    doAction: async function (widgetID, child, func /* , id */) {
        vis.binds['squeezeboxrpc'].debug && console.log(`doAction`);
        let actions = JSON.parse(child.actions);
        let parameter = actions[func];
        let ainstance = this.info[widgetID].instance;
        const cmd = {
            playerid: this.info[widgetID].playerid,
            cmdArray: [...parameter.command, ...parameter.params],
        };
        /* let request =  */ await vis.binds['squeezeboxrpc'].browsesendToAsync(ainstance.join('.'), 'cmdGeneral', cmd);
    },
    render(widgetID, children) {
        vis.binds['squeezeboxrpc'].debug && console.log(`render ${widgetID}`);
        let backTitle = '--';
        backTitle = this.info[widgetID].history.reduce((acc, val, i) => `${acc} ${i == 0 ? '' : '/'} ${val.title}`, '');
        const font = new Font($(`#${widgetID}`));
        let textwidth = getTextWidth(`...${backTitle}`, font);
        let widgetwidth = $(`#${widgetID}`).width();

        this.info[widgetID].currentChildren = children;
        let text = '';

        text += `
            <style>
                /* Grundlegendes Layout der Listen-Container */
                 #${widgetID} .sqbrowser-list-container {
                    width: 100%;
                    // max-width: 600px; /* Beispiel: feste max-Breite */
                    margin: 0 auto; /* zentriert auf der Seite */
                    box-sizing: border-box;
                }
                #${widgetID} .sqbrowser-parent-directory {
                    position: sticky;          /* "Klebt" an einer definierten Position */
                    top: 0;                    /* Fixiert oben im Container */
                    padding: 0rem 0rem;
                    z-index: 10;               /* Damit sie auch oben bleibt, falls andere Elemente darüberliegen könnten */
                    border-bottom: 1px solid #ccc;
                    background-color: black;
                    cursor: pointer;
                }
                #${widgetID} .sqbrowser-ellipsis {
                    white-space: nowrap;
                    text-overflow: ellipsis;
                    direction: rtl;
                    overflow: hidden;
                }
                #${widgetID} .sqbrowser-scrollable-area {
                    /* Hier legen wir die Höhe fest, ab der gescrollt werden soll */
                    /* max-height: 300px; */         /* Beispiel: 300px */
                    overflow-y: auto;          /* Vertikales Scrollen bei Überlauf */
                    padding: 0 0rem;
                }
                /* Einzelne List-Items */
                #${widgetID} .sqbrowser-list-item {
                    display: flex;
                    align-items: center;
                    justify-content: space-between;
                    padding: 0.2rem;
                    margin: 0.2rem 0;
                    // background-color: #f8f8f8;
                    border: 1px solid #ccc;
                    border-radius: 4px;
                    z-index: 1;
                }

                #${widgetID} .sqbrowser-list-item[onclick] {
                    cursor: pointer; /* signalisiert, dass klickbar ist */
                }

                /* Der Text-Bereich innerhalb eines List-Items */
                #${widgetID} .sqbrowser-list-item-content {
                    flex: 1; /* soll den verfügbaren Platz füllen */
                    margin-right: 1rem; /* Abstand zu den Buttons */
                    white-space: nowrap; /* verhindert Zeilenumbruch */
                    overflow: hidden; /* versteckt überfließenden Text */
                    text-overflow: ellipsis; /* fügt „...“ ein, wenn Text nicht passt */
                }

                /* Button-Gruppe auf der rechten Seite */
                 #${widgetID} .sqbrowser-button-group {
                    display: flex;
                    align-items: center;
                }

                /* Die Buttons selbst */
                 #${widgetID} .sqbrowser-action-btn {
                    margin-left: 0.2rem;
                    padding: 0.1rem 0.2rem;
                    cursor: pointer;
                    border: 1px solid #666;
                    background-color: #eee;
                    border-radius: 3px;
                    font-size: 1rem;
                }
                 #${widgetID} svg:active { 
                    transform: scale(0.8, 0.8);
                    transform-origin: 50% 50%;
                }

                /* Drei-Punkte-Button standardmäßig ausgeblendet, 
                nur sichtbar werden, wenn nicht genug Platz für Button2 ist */
                #${widgetID} .sqbrowser-more-btn {
                    display: none; /* wird per Media Query eingeblendet */
                }
                #${widgetID} .sqbrowser-btn-svg {
                    width: 1rem;
                    height: 1rem;
                    margin: 0px 1px;
                    cursor: pointer;
                }
                #${widgetID} .sqbrowser-btn-svg-action {
                    border: 1px solid white;
                }
                #${widgetID} .sqbrowser-btn-svg-menu {
                    display: inline-block;
                    vertical-align: middle;
                    height: fit-content;
                }
                    </style>
            `;
        text += ` 
            <div class="sqbrowser-list-container">
                <div class="sqbrowser-parent-directory ${textwidth - 10 > widgetwidth ? 'sqbrowser-ellipsis' : ''}" onclick="vis.binds.squeezeboxrpc.browser.clickhandler(event, '${widgetID}', 'back')">
                    <div class="sqbrowser-btn-svg sqbrowser-btn-svg-menu">
                        ${vis.binds['squeezeboxrpc'].svg.menuback}
                    </div>
                    <span>${backTitle}</span>
                </div>
                <div class="sqbrowser-scrollable-area">
            `;
        for (let i = 0; i < children.length; i++) {
            let buttons;
            if (children[i].actions) {
                buttons = JSON.parse(children[i].actions);
            }
            let click = '';
            if (buttons && buttons.next) {
                click = children[i].actions
                    ? `onclick="vis.binds.squeezeboxrpc.browser.clickhandler(event, '${widgetID}', 'next','${children[i].id}')"`
                    : ``;
            }
            text += /* html */ `
                    <div
                        class="sqbrowser-list-item"
                        ${click}
                    >
                        <div class="sqbrowser-list-item-content">${children[i].title}</div>
                        <div class="sqbrowser-button-group">
            `;

            if (buttons) {
                let actions = [
                    { id: 'next', svg: 'next' },
                    { id: 'play', svg: 'play' },
                    { id: 'add', svg: 'add' },
                ];
                for (let action = 0; action < actions.length; action++) {
                    if (buttons[actions[action].id]) {
                        text += `
                            <div class="sqbrowser-btn-svg sqbrowser-btn-svg-action" onclick="vis.binds.squeezeboxrpc.browser.clickhandler(event, '${widgetID}', '${actions[action].id}','${children[i].id}')">
                                ${vis.binds['squeezeboxrpc'].svg[actions[action].svg]}
                            </div>
                            `;
                    }
                }
            }
            text += `                         
                        </div>
                    </div>
                `;
        }
        text += /* html */ `
                </div></div>
            `;
        $(`#${widgetID}`).html(text);
    },
    parseResult: function (request, filter, rootmenu) {
        vis.binds['squeezeboxrpc'].debug && console.log(`parseResult`);
        let result = request.result;
        if (result.years_loop) {
            let items = result.years_loop;
            return items.map(item => {
                return {
                    id: item.year,
                    title: `${item.year}`,
                    type: 'years',
                    favorites_url: item.facorites_url,
                    rootmenu: rootmenu,
                };
            });
        }
        if (result.works_loop) {
            let items = result.works_loop;
            return items.map(item => {
                return {
                    id: `work_id:${item.work_id}`,
                    title: `${item.favorites_title}`,
                    type: 'work',
                    favorites_url: item.facorites_url,
                    albumid: item.album_id,
                    composer: item.composer,
                    composer_id: item.composer_id,
                    work: item.work,
                    rootmenu: rootmenu,
                };
            });
        }
        if (result.genres_loop) {
            let items = result.genres_loop;
            return items.map(item => {
                return {
                    id: item.id,
                    title: `${item.genre}`,
                    type: 'genre',
                    favorites_url: item.facorites_url,
                    rootmenu: rootmenu,
                };
            });
        }
        if (result.albums_loop) {
            let items = result.albums_loop;
            return items.map(item => {
                return {
                    id: item.id,
                    title: `${item.artist} / ${item.album} (${item.year})`,
                    image: `/music/${item.artwork_track_id}/cover_300x300_f`,
                    type: 'album',
                    favorites_url: item.facorites_url,
                    rootmenu: rootmenu,
                };
            });
        }
        if (result.artists_loop) {
            let items = result.artists_loop;
            return items.map(item => {
                return {
                    id: item.id,
                    title: item.artist,
                    image: `/imageproxy/mai/artist/${item.id}/image_300x300_f`,
                    type: 'artist',
                    favorites_url: item.favorites_url,
                    rootmenu: rootmenu,
                };
            });
        }
        if (result.item_loop) {
            let items = result.item_loop;
            const style = result.window?.windowStyle || '';
            //=='icon_list'){
            if (filter) {
                items = items.filter(filter);
            }
            if (rootmenu == 'myMusic' && style == 'icon_list') {
                return items.map(item => {
                    return {
                        id: item.commonParams.track_id,
                        type: 'track',
                        title: item.text.replace('\n', ' - '),
                        icon: item.icon,
                        rootmenu: rootmenu,
                    };
                });
            }
            if (rootmenu == 'myMusic' && (style == 'text_list' || style == 'home_menu')) {
                return items.map(item => {
                    if (item.type == 'audio') {
                        return {
                            id: item.params.item_id,
                            type: 'track',
                            title: item.text.replace('\n', ' - '),
                            icon: null,
                            rootmenu: rootmenu,
                        };
                    }
                    if (item.type == 'playlist') {
                        let cmd = {
                            command: ['browselibrary', 'items'],
                            params: ['menu:browselibrary', 'mode:bmf', ...this.object2Array(item.params)],
                        };
                        return {
                            id: item.params.item_id,
                            type: 'playlist',
                            title: `(D) ${item.text.replace('\n', ' - ')}`,
                            param: JSON.stringify(cmd),
                            icon: null,
                            rootmenu: rootmenu,
                        };
                    }
                });
            }
            if (style == '' && rootmenu == 'myMusic') {
                items = items.sort((a, b) => a.weight - b.weight);
                return items.map(item => {
                    return {
                        id: item.id,
                        type: 'menu',
                        title: item.text,
                        param: JSON.stringify(this.translateMyMusicParameters(item.actions.go)),
                        icon: item.icon,
                        rootmenu: rootmenu,
                    };
                });
            }
            if (style == '' && rootmenu == 'radio') {
                items = items.sort((a, b) => a.weight - b.weight);
                return items.map(item => {
                    return {
                        id: item.text,
                        type: 'radio',
                        title: item.text,
                        param: JSON.stringify(this.translateMyMusicParameters(item.actions.go)),
                        icon: item.icon,
                        rootmenu: rootmenu,
                    };
                });
            }
            if (rootmenu == 'radio' && style == 'text_list') {
                return items.map(item => {
                    return {
                        id: item.text,
                        type: 'radio',
                        title: item.text.replace('\n', ' - '),
                        param: JSON.stringify(this.translateMyMusicParameters(item.actions.go)),
                        icon: null,
                        rootmenu: rootmenu,
                    };
                });
            }
            if (rootmenu == 'radio' && style == 'icon_list') {
                return items.map(item => {
                    return {
                        id: item.params.item_id,
                        type: 'track',
                        title: item.text.replace('\n', ' - '),
                        icon: item.icon,
                        rootmenu: rootmenu,
                    };
                });
            }
        }
    },

    object2Array: function (obj) {
        return Object.keys(obj).map(function (key) {
            return `${key}:${obj[key]}`;
        });
    },
};
