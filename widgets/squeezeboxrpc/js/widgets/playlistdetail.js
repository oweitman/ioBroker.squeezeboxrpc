/* globals $,vis */
'use strict';

/**
 * Normalize the Playlist state value for rendering.
 *
 * @param {unknown} value Playlist state value
 */
export function parsePlaylistDetail(value) {
    let entries = value;
    if (typeof value === 'string') {
        try {
            entries = JSON.parse(value);
        } catch {
            return [];
        }
    }
    if (!Array.isArray(entries)) {
        return [];
    }
    return entries.map((entry, position) => ({
        index: Number.isInteger(Number(entry?.index)) ? Number(entry.index) : position,
        id: String(entry?.id ?? position),
        title: String(entry?.title || ''),
        artworkUrl: String(entry?.ArtworkUrl || ''),
        artist: String(entry?.Artist || ''),
        album: String(entry?.Album || ''),
        duration: Number(entry?.Duration),
    }));
}

/**
 * Format a track duration like the VIS-2 widget.
 *
 * @param {unknown} value Duration in seconds
 */
export function formatPlaylistDuration(value) {
    const seconds = Number(value);
    if (!Number.isFinite(seconds) || seconds < 0) {
        return '--:--';
    }
    const totalSeconds = Math.floor(seconds);
    if (totalSeconds > 99 * 3600 + 59 * 60 + 59) {
        return '>99:59:59';
    }
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const remainingSeconds = totalSeconds % 60;
    const pad = number => String(number).padStart(2, '0');
    return hours
        ? `${pad(hours)}:${pad(minutes)}:${pad(remainingSeconds)}`
        : `${pad(minutes)}:${pad(remainingSeconds)}`;
}

function escapeHtml(value) {
    return String(value)
        .replaceAll('&', '&amp;')
        .replaceAll('<', '&lt;')
        .replaceAll('>', '&gt;')
        .replaceAll('"', '&quot;')
        .replaceAll("'", '&#39;');
}

function cssLength(value, fallback) {
    if (typeof value === 'number' && Number.isFinite(value)) {
        return `${value}px`;
    }
    const text = String(value || fallback).trim();
    if (/^\d+(?:\.\d+)?$/.test(text)) {
        return `${text}px`;
    }
    return /^\d+(?:\.\d+)?(?:px|em|rem|%)$/.test(text) ? text : fallback;
}

export const playlistdetail = {
    createWidget: function (widgetID, view, data, style) {
        const $div = $(`#${widgetID}`);
        if (!$div.length) {
            return setTimeout(
                () => vis.binds.squeezeboxrpc.playlistdetail.createWidget(widgetID, view, data, style),
                100,
            );
        }
        data = vis.views[view].widgets[widgetID].data;
        style = vis.views[view].widgets[widgetID].style;
        const ainstance = (data.ainstance = vis.binds.squeezeboxrpc.checkAttributes($div, data.widgetPlayer));
        if (!ainstance) {
            return;
        }
        const fdata = { self: this, widgetID, view, data, style };
        vis.binds.squeezeboxrpc.setPlayersChanged(
            $div,
            data.widgetPlayer,
            fdata,
            this.onChange.bind(fdata),
            () => {
                const states = [];
                for (const player of vis.binds.squeezeboxrpc.getPlayerValues(data.widgetPlayer)) {
                    states.push(`${ainstance.join('.')}.Players.${player}.Playlist`);
                    states.push(`${ainstance.join('.')}.Players.${player}.PlaylistCurrentIndex`);
                }
                return states;
            },
            this.setState.bind(fdata),
        );
        vis.binds.squeezeboxrpc.setChanged(data.widgetPlayer, fdata, this.setState.bind(fdata));
        this.setState(fdata);
    },
    onChange: function () {
        this.self.setState(this);
    },
    setState: function (fdata) {
        const { data, widgetID } = fdata;
        const previousScrollTop = $(`#${widgetID} .squeezeboxrpc-playlist-detail`).scrollTop() || 0;
        const player = vis.binds.squeezeboxrpc.getPlayerName(data.widgetPlayer);
        if (!player) {
            return setTimeout(() => vis.binds.squeezeboxrpc.playlistdetail.setState(fdata), 100);
        }
        const base = `${data.ainstance.join('.')}.Players.${player}`;
        const entries = parsePlaylistDetail(vis.states[`${base}.Playlist.val`]);
        const currentIndex = Number(vis.states[`${base}.PlaylistCurrentIndex.val`]);
        const showThumbnail = data.showThumbnail !== false && data.showThumbnail !== 'false';
        const showIndex = data.showIndex !== false && data.showIndex !== 'false';
        const rowBackground = data.rowBackground || '#f5f7fa';
        const activeBackground = data.activeRowBackground || '#dbeafe';
        const border = `${cssLength(data.rowBorderWidth, '1px')} ${data.rowBorderStyle || 'solid'} ${data.rowBorderColor || '#cbd5e1'}`;
        const spacing = cssLength(data.rowSpacing, '4px');
        let html = `<div class="squeezeboxrpc-playlist-detail" style="--pl-row-background:${escapeHtml(rowBackground)};--pl-active-background:${escapeHtml(activeBackground)};--pl-row-border:${escapeHtml(border)};--pl-row-spacing:${escapeHtml(spacing)}">`;
        for (const entry of entries) {
            const title = showIndex ? `${entry.index + 1}. ${entry.title}` : entry.title;
            const active = entry.index === currentIndex ? ' active' : '';
            html += `<div class="squeezeboxrpc-playlist-detail-row${active}${showThumbnail ? '' : ' no-thumbnail'}">`;
            if (showThumbnail) {
                html += `<div>${entry.artworkUrl ? `<img class="squeezeboxrpc-playlist-detail-thumbnail" src="${escapeHtml(entry.artworkUrl)}" alt="">` : ''}</div>`;
            }
            html += `<div class="squeezeboxrpc-playlist-detail-text"><div class="squeezeboxrpc-playlist-detail-line squeezeboxrpc-playlist-detail-title" title="${escapeHtml(title)}">${escapeHtml(title)}</div><div class="squeezeboxrpc-playlist-detail-line" title="${escapeHtml(entry.artist)}">${escapeHtml(entry.artist)}</div><div class="squeezeboxrpc-playlist-detail-line" title="${escapeHtml(entry.album)}">${escapeHtml(entry.album)}</div></div>`;
            html += `<div class="squeezeboxrpc-playlist-detail-actions"><span class="squeezeboxrpc-playlist-detail-duration">${formatPlaylistDuration(entry.duration)}</span><div class="squeezeboxrpc-playlist-detail-buttons"><button type="button" class="squeezeboxrpc-playlist-detail-button play" data-index="${entry.index}" title="Play"><svg viewBox="0 0 24 24" aria-hidden="true"><path fill="currentColor" d="M8 5v14l11-7z"/></svg></button><button type="button" class="squeezeboxrpc-playlist-detail-button delete" data-index="${entry.index}" title="Delete"><svg viewBox="0 0 24 24" aria-hidden="true"><path fill="currentColor" d="M6 19c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V7H6v12zM8 9h8v10H8V9zm7.5-5-1-1h-5l-1 1H5v2h14V4z"/></svg></button></div></div></div>`;
        }
        html += '</div>';
        const $widget = $(`#${widgetID}`).html(html);
        $widget.find('.squeezeboxrpc-playlist-detail').scrollTop(previousScrollTop);
        $widget.off('.playlistdetail');
        $widget.on('click.playlistdetail', '.squeezeboxrpc-playlist-detail-button.play', event => {
            vis.setValue(`${base}.PlaylistCurrentIndex`, String(event.currentTarget.dataset.index));
        });
        $widget.on('click.playlistdetail', '.squeezeboxrpc-playlist-detail-button.delete', event => {
            vis.setValue(`${base}.cmdGeneral`, `"playlist","delete","${Number(event.currentTarget.dataset.index)}"`);
        });
        $widget.on('error.playlistdetail', '.squeezeboxrpc-playlist-detail-thumbnail', event => {
            event.currentTarget.style.visibility = 'hidden';
        });
    },
};
