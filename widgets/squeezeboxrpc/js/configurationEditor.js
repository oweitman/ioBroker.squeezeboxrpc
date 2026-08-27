/* globals $,vis,document */
'use strict';

import {
    legacyFavoriteConfiguration,
    legacyPlayerConfiguration,
    mergeConfiguredItems,
    moveConfiguredItem,
    parseItemConfiguration,
    serializeItemConfiguration,
} from './itemConfiguration.js';

function editorContext(input) {
    const wdata = $(input).data('wdata');
    const widgetID = wdata?.widgets?.[0];
    const data = widgetID && vis.views[wdata.view]?.widgets?.[widgetID]?.data;
    return data ? { data, widgetID } : null;
}

function playerWidgetData(widgetID) {
    if (vis.widgets?.[widgetID]?.data) {
        return vis.widgets[widgetID].data;
    }
    for (const view of Object.values(vis.views || {})) {
        if (view.widgets?.[widgetID]?.data) {
            return view.widgets[widgetID].data;
        }
    }
    return null;
}

function playerInstance(data) {
    const value = String(data?.ainstance || '');
    const match = value.match(/(?:system\.adapter\.)?(squeezeboxrpc\.\d+)/);
    return match ? match[1] : '';
}

function getStates(pattern) {
    return new Promise((resolve, reject) => {
        vis.conn.getStates(pattern, (error, states) => (error ? reject(error) : resolve(states || {})));
    });
}

async function discover(mode, data) {
    if (mode == 'players') {
        const instance = playerInstance(data);
        if (!instance) {
            throw new Error('Please select an instance first');
        }
        const names = await vis.binds['squeezeboxrpc'].sendToAsync(instance, 'getPlayerNames', {});
        if (!Array.isArray(names)) {
            throw new TypeError('Invalid getPlayerNames response');
        }
        return names.map(id => ({ id }));
    }

    const referencedPlayer = playerWidgetData(data.widgetPlayer);
    const instance = playerInstance(referencedPlayer);
    if (!instance) {
        throw new Error('Please select a Players widget first');
    }
    const states = await getStates(`${instance}.Favorites.*`);
    return vis.binds['squeezeboxrpc'].favorites
        .filterFavorites(vis.binds['squeezeboxrpc'].favorites.getFavorites(states, instance.split('.')))
        .map(favorite => ({
            id: favorite.id,
            name: favorite.Name || favorite.name || '',
            image: favorite.image || '',
        }));
}

function makeButton(text, title, action, disabled) {
    return $('<button type="button"></button>')
        .text(text)
        .attr('title', title)
        .attr('data-action', action)
        .prop('disabled', disabled);
}

function selectImage(state, index) {
    const item = state.items[index];
    if (!item || !$.fm) {
        return;
    }
    const defaultPath = `/${vis.conn.namespace ? `${vis.conn.namespace}/` : ''}${vis.projectPrefix}img/`;
    $.fm(
        {
            lang: vis.language,
            defaultPath,
            path: item.image || defaultPath,
            uploadDir: `/${vis.conn.namespace ? `${vis.conn.namespace}/` : ''}`,
            fileFilter: ['gif', 'png', 'bmp', 'jpg', 'jpeg', 'tif', 'svg'],
            folderFilter: false,
            mode: 'open',
            view: 'prev',
            conn: vis.conn,
            zindex: 1001,
        },
        selected => {
            item.image = selected.path + selected.file;
            renderEditor(state);
        },
    );
}

function renderEditor(state) {
    const $editor = state.editor.empty();
    const $toolbar = $('<div style="display:flex;gap:4px;margin-bottom:6px"></div>');
    $toolbar.append(makeButton('Refresh', 'Reload available entries', 'refresh', false));
    $toolbar.append(makeButton('Apply', 'Save this configuration', 'apply', false));
    $editor.append($toolbar);

    if (state.message) {
        $editor.append($('<div style="margin:4px 0;color:#b26a00"></div>').text(state.message));
    }

    const $list = $('<div style="display:flex;flex-direction:column;gap:4px"></div>');
    state.items.forEach((item, index) => {
        const $row = $(
            '<div style="display:grid;grid-template-columns:auto minmax(90px,1fr) auto auto;gap:4px;align-items:center;border:1px solid #aaa;padding:4px"></div>',
        );
        const $enabled = $('<input type="checkbox" data-action="enabled">').prop('checked', item.enabled !== false);
        const label = item.name ? `${item.id} - ${item.name}` : item.id;
        const $name = $('<span style="overflow:hidden;text-overflow:ellipsis;white-space:nowrap"></span>')
            .text(item.available === false ? `${label} (unavailable)` : label)
            .attr('title', label);
        $row.attr('data-index', index).append($enabled, $name);
        $row.append(makeButton('Up', 'Move up', 'up', index == 0));
        $row.append(makeButton('Down', 'Move down', 'down', index == state.items.length - 1));

        if (state.mode == 'players') {
            const $default = $('<label style="grid-column:1 / -1"></label>');
            $default.append(
                $('<input type="radio" name="squeezeboxrpc-default-player" data-action="default">').prop(
                    'checked',
                    state.defaultId == item.id,
                ),
                document.createTextNode(' Default player'),
            );
            $row.append($default);
        }
        $row.append(
            $(
                '<input type="text" data-action="text" placeholder="Optional button text" style="grid-column:1 / -1;width:100%;box-sizing:border-box">',
            ).val(item.text),
        );
        $row.append(
            $(
                '<input type="text" data-action="image" placeholder="Optional image URL" style="grid-column:1 / -2;width:100%;box-sizing:border-box">',
            ).val(item.image),
        );
        $row.append(makeButton('Select', 'Select image', 'image-select', false));
        $list.append($row);
    });
    $editor.append($list);
}

async function refreshEditor(state) {
    state.message = 'Loading...';
    renderEditor(state);
    try {
        const discovered = await discover(state.mode, state.data);
        const saved = parseItemConfiguration(state.input.value);
        const legacy =
            state.mode == 'players'
                ? legacyPlayerConfiguration(
                      state.data,
                      discovered.map(item => item.id),
                  )
                : legacyFavoriteConfiguration(state.data, discovered);
        const configuration = saved || legacy;
        state.items = mergeConfiguredItems(configuration, discovered);
        state.defaultId = configuration.defaultId;
        if (!state.items.some(item => item.id == state.defaultId && item.enabled !== false && item.available)) {
            state.defaultId = state.items.find(item => item.enabled !== false && item.available)?.id || '';
        }
        state.message = '';
    } catch (error) {
        state.message = error.message || String(error);
    }
    renderEditor(state);
}

function initializeEditor(input, mode, widAttr, value) {
    input.value = typeof value == 'string' ? value : '';
    const context = editorContext(input);
    const editor = $(`#inspect_${widAttr}_editor`);
    if (!context || !editor.length) {
        return;
    }
    const state = {
        ...context,
        input,
        editor,
        mode,
        items: [],
        defaultId: '',
        message: '',
    };
    editor.off('.squeezeboxrpcConfig').on('click.squeezeboxrpcConfig', '[data-action]', event => {
        const action = $(event.currentTarget).attr('data-action');
        const index = Number($(event.currentTarget).closest('[data-index]').attr('data-index'));
        if (action == 'refresh') {
            void refreshEditor(state);
            return;
        }
        if (action == 'apply') {
            input.value = serializeItemConfiguration({ version: 1, defaultId: state.defaultId, items: state.items });
            $(input).trigger('change');
            state.message = 'Configuration saved';
            renderEditor(state);
            return;
        }
        if (action == 'up' || action == 'down') {
            state.items = moveConfiguredItem(state.items, index, action == 'up' ? -1 : 1);
            renderEditor(state);
        } else if (action == 'image-select') {
            selectImage(state, index);
        }
    });
    editor.on('change.squeezeboxrpcConfig input.squeezeboxrpcConfig', '[data-index] [data-action]', event => {
        const $target = $(event.currentTarget);
        const action = $target.attr('data-action');
        const index = Number($target.closest('[data-index]').attr('data-index'));
        const item = state.items[index];
        if (!item) {
            return;
        }
        if (action == 'enabled') {
            item.enabled = $target.prop('checked');
            if (!item.enabled && state.defaultId == item.id) {
                state.defaultId = state.items.find(entry => entry.enabled !== false && entry.available)?.id || '';
                renderEditor(state);
            }
        } else if (action == 'default') {
            state.defaultId = item.id;
        } else if (action == 'text' || action == 'image') {
            item[action] = String($target.val() || '');
        }
    });
    void refreshEditor(state);
}

/**
 * Create a VIS-1 custom editor for stable item selection and ordering.
 *
 * @param mode editor mode
 * @param widAttr widget attribute name
 */
export function configurationEditor(mode, widAttr) {
    return {
        input: `<input type="hidden" id="inspect_${widAttr}"><div id="inspect_${widAttr}_editor"></div>`,
        init: function (attribute, value) {
            initializeEditor(this, mode, attribute, value);
        },
    };
}
