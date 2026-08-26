/*
    ioBroker.vis squeezeboxrpc Widget-Set

    Copyright 2025 oweitman oweitman@gmx.de

*/
/* globals $,vis,window,systemDictionary */
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

fetch('widgets/squeezeboxrpc/myi18n/translations.json').then(async res => {
    const i18n = await res.json();

    $.extend(true, systemDictionary, i18n);
});

vis.binds['squeezeboxrpc'] = {
    version: pkgVersion,
    debug: false,
    fetchResults: false,
    viewIndexMetadata: {},
    showVersion: function () {
        if (vis.binds['squeezeboxrpc'].version) {
            console.log(`Version squeezeboxrpc: ${vis.binds['squeezeboxrpc'].version}`);
            vis.binds['squeezeboxrpc'].version = null;
        }
    },
    svg: {
        stop: '<svg version="1.1" viewBox="0 0 26.458 26.458" xmlns="http://www.w3.org/2000/svg"><g fill="#ffffff" stroke="#ffffff" stroke-linecap="round" stroke-width=".3"><path d="m5.7393 5.4537h14.98c0.44743 0.086371 0.23662 0.63202 0.28562 0.95661v14.309c-0.08637 0.44743-0.63202 0.23662-0.95661 0.28562h-14.309c-0.44743-0.08637-0.23662-0.63202-0.28562-0.95661v-14.309c-0.00412-0.15314 0.13248-0.28973 0.28562-0.28562z"/></g></svg>',
        fwd: '<svg version="1.1" viewBox="0 0 26.458 26.458" xmlns="http://www.w3.org/2000/svg"><g fill="#ffffff" stroke="#ffffff" stroke-width=".3"><path d="m5.3759 18.805c9.23e-5 -3.7545-1.846e-4 -7.509 1.385e-4 -11.263 0.13348-0.79848 1.117-1.0848 1.7334-0.63234 2.8067 1.9183 5.6203 3.8271 8.4226 5.7514 0.52184 0.44634 0.18084 1.2199-0.36377 1.4624-2.7112 1.8495-5.4224 3.6989-8.1336 5.5484-0.68912 0.29151-1.546-0.09983-1.6587-0.86625z"/><path d="m10.668 18.805c8.7e-5 -3.7545-1.73e-4 -7.509 1.3e-4 -11.263 0.13345-0.79849 1.1171-1.0848 1.7334-0.63234 2.8067 1.9183 5.6203 3.8271 8.4226 5.7514 0.52184 0.44634 0.18084 1.2199-0.36377 1.4624-2.7112 1.8495-5.4224 3.6989-8.1336 5.5484-0.68912 0.2915-1.546-0.09982-1.6587-0.86625z"/><path d="m18.876 5.3572c0.68238 0.014305 1.3705-0.02913 2.0492 0.022654 0.31228 0.23669 0.12538 0.69262 0.1764 1.0359v14.396c-0.08733 0.45287-0.63952 0.23962-0.96802 0.28916-0.45618-0.01348-0.91782 0.028-1.3703-0.02265-0.31228-0.23669-0.12538-0.69262-0.1764-1.0359v-14.396c-0.0042-0.15504 0.13412-0.29333 0.28916-0.28916z" stroke-linecap="round"/></g></svg>',
        pause: '<svg version="1.1" viewBox="0 0 26.458 26.458" xmlns="http://www.w3.org/2000/svg"><g fill="#ffffff" stroke="#ffffff" stroke-linecap="round" stroke-width=".3"><path d="m5.6838 5.396h5.8304c0.45073 0.086991 0.23839 0.63664 0.28773 0.96362v14.415c-0.08699 0.45073-0.63664 0.23839-0.96362 0.28773h-5.1545c-0.45073-0.08699-0.23839-0.63664-0.28773-0.96362v-14.415c-0.00415-0.15428 0.13346-0.29188 0.28773-0.28773z"/><path d="m14.944 5.396h5.8304c0.45073 0.086991 0.23839 0.63664 0.28773 0.96362v14.415c-0.08699 0.45073-0.63664 0.23839-0.96362 0.28773h-5.1545c-0.45073-0.08699-0.23839-0.63664-0.28773-0.96362v-14.415c-0.0041-0.15428 0.13346-0.29188 0.28773-0.28773z"/></g></svg>',
        play: '<svg version="1.1" viewBox="0 0 26.458 26.458" xmlns="http://www.w3.org/2000/svg"><g fill="#ffffff" stroke="#ffffff" stroke-width=".3"><g transform="translate(0 -270.54)"><path d="m5.2917 292.21c1.638e-4 -5.7717-3.275e-4 -11.543 2.455e-4 -17.315 0.26319-1.0382 1.4726-1.5611 2.4514-1.1989 0.80816 0.23695 1.4691 0.80297 2.2081 1.194 4.3854 2.6267 8.7811 5.2375 13.16 7.8742 0.79505 0.54047 0.45033 1.7439-0.34988 2.0757-4.8532 2.9006-9.7064 5.8011-14.56 8.7017-1.0328 0.36658-2.332 0.0381-2.8269-1.0022-0.045938-0.10342-0.084738-0.21463-0.083483-0.32941z"/></g></g></svg>',
        shuffle0:
            '<svg version="1.1" viewBox="0 0 26.458 26.458" xmlns="http://www.w3.org/2000/svg"><g fill="#ffffff" stroke="#ffffff" stroke-linecap="round" stroke-width=".3"><path d="m5.6162 5.4125h9.9891c0.35652 0.11121 0.14576 0.59069 0.20276 0.87689-0.01035 0.485 0.02087 0.97413-0.01588 1.4565-0.21946 0.23741-0.60948 0.076434-0.90595 0.12369h-9.27c-0.35652-0.11121-0.14577-0.59069-0.20276-0.87689 0.010353-0.485-0.020872-0.97413 0.015885-1.4565 0.030072-0.073761 0.10708-0.12497 0.18687-0.12369z"/><path d="m10.813 9.8261h9.9891c0.35652 0.11121 0.14576 0.59069 0.20276 0.87689-0.01035 0.485 0.02087 0.97413-0.01589 1.4565-0.21946 0.23741-0.60948 0.07644-0.90595 0.12369h-9.27c-0.35652-0.11121-0.14576-0.59069-0.20276-0.87689 0.01035-0.485-0.02087-0.97413 0.01589-1.4565 0.03007-0.073761 0.10708-0.12497 0.18688-0.12369z"/><path d="m5.6193 14.195h9.9891c0.35652 0.11121 0.14576 0.59069 0.20276 0.87689-0.01035 0.485 0.02087 0.97413-0.01588 1.4565-0.21946 0.23741-0.60948 0.07643-0.90595 0.12369h-9.27c-0.35652-0.11121-0.14576-0.59069-0.20276-0.87689 0.010353-0.485-0.020872-0.97413 0.015885-1.4565 0.030072-0.07376 0.10708-0.12497 0.18687-0.12369z"/><path d="m10.845 18.582h9.9891c0.35652 0.11121 0.14576 0.59069 0.20276 0.87689-0.01035 0.485 0.02087 0.97413-0.01589 1.4565-0.21946 0.23741-0.60948 0.07644-0.90595 0.12369h-9.27c-0.35652-0.11121-0.14576-0.59069-0.20276-0.87689 0.01035-0.485-0.02087-0.97413 0.01589-1.4565 0.03007-0.07376 0.10708-0.12497 0.18688-0.12369z"/></g></svg>',
        shuffle2:
            '<svg version="1.1" viewBox="0 0 26.458 26.458" xmlns="http://www.w3.org/2000/svg"><g fill="#ffffff" stroke="#ffffff" stroke-linecap="round" stroke-width=".3"><path d="m10.813 18.548c-0.35617 0.11095-0.14564 0.58998-0.20257 0.87583 0.01028 0.48528-0.02076 0.97467 0.01586 1.4573 0.21919 0.2371 0.60875 0.07634 0.90486 0.12353h2.8258c-0.05537-0.30204-0.09712-0.61075-0.07338-0.93127v-1.5254h-3.4706z"/><path d="m15.193 15.235c-0.44809 0.08695-0.23653 0.63372-0.28577 0.95902v4.5089c0.08728 0.44757 0.63383 0.23594 0.95902 0.28525h4.836c0.44765-0.08685 0.2359-0.63348 0.28525-0.95851v-4.5089c-0.08652-0.44816-0.63337-0.23649-0.95851-0.28577h-4.836zm0.56741 0.59324c1.4869 0.0118 2.9784-0.0236 4.4623 0.0177 0.25792 0.21902 0.09046 0.62233 0.13842 0.92678-0.01179 1.1608 0.02362 2.3264-0.01778 3.4843-0.21938 0.25783-0.62259 0.09051-0.92722 0.13842-1.2474-0.01185-2.4996 0.0237-3.7441-0.01778-0.25714-0.21976-0.09015-0.6226-0.13798-0.92722 0.01173-1.1608-0.02351-2.3263 0.0177-3.4842 0.03349-0.08241 0.11959-0.13946 0.20864-0.13798z"/><path d="m5.6177 5.386h9.9891c0.35637 0.11098 0.14585 0.59007 0.20276 0.87601-0.0103 0.48529 0.0208 0.97471-0.01588 1.4574-0.21917 0.23733-0.60884 0.076486-0.90501 0.12369h-9.2709c-0.35638-0.11098-0.14586-0.59007-0.20276-0.87601 0.010298-0.48529-0.020796-0.97471 0.015885-1.4574 0.030072-0.073761 0.10708-0.12497 0.18687-0.12369z"/><path d="m10.813 9.7732h9.9891c0.35637 0.11098 0.14585 0.59006 0.20276 0.87601-0.0103 0.4853 0.0208 0.97471-0.01589 1.4574-0.21917 0.23733-0.60884 0.07648-0.90501 0.12369h-9.2709c-0.35637-0.11098-0.14585-0.59006-0.20276-0.87601 0.0103-0.4853-0.0208-0.97471 0.01589-1.4574 0.03007-0.073761 0.10708-0.12497 0.18688-0.12369z"/><path d="m5.6177 14.16c-0.35682 0.11055-0.14617 0.5899-0.20309 0.87583 0.010332 0.48531-0.020862 0.97475 0.015936 1.4574 0.21915 0.23774 0.609 0.07674 0.90529 0.12397h7.9475c0.01599-0.59386-0.03233-1.1941 0.0247-1.7839 0.23585-0.33075 0.70254-0.14135 1.053-0.19167 0.34447 0.08741 0.60141-0.07206 0.38911-0.42246-0.39444-0.12791-0.84703-0.02699-1.2655-0.05916h-8.867z"/></g></svg>',
        repeat0:
            '<svg version="1.1" viewBox="0 0 26.458 26.458" xmlns="http://www.w3.org/2000/svg"><g fill="#ffffff" stroke="#ffffff" stroke-width=".3"><path transform="scale(.26458)" d="m35.473 20.621c-8.2281 0-14.852 6.6235-14.852 14.852v29.055c0 8.2281 6.6235 14.852 14.852 14.852h29.055c8.2281 0 14.852-6.6235 14.852-14.852v-29.055c0-8.2281-6.6235-14.852-14.852-14.852h-4.0195v9.6641c0 0.05754-0.01898 0.1113-0.02344 0.16797 5.108 0.40503 9.1016 4.6456 9.1016 9.8613v19.371c0 5.4854-4.415 9.9004-9.9004 9.9004h-19.371c-5.4854 0-9.9004-4.415-9.9004-9.9004v-19.371c0-5.4854 4.415-9.9004 9.9004-9.9004h0.21094c-0.0026-0.04363-0.01758-0.08477-0.01758-0.12891v-9.6641z" fill="#fff" stroke-linecap="round"/><path d="m10.111 9.4128v-5.3598c-0.0082 0.018122-0.0021-0.17387 0.24672-0.34879 0.24874-0.17491 0.65793 0 0.65793 0l4.6078 2.7541s0.1702 0.098349 0.16971 0.29612c-4.97e-4 0.20056-0.1784 0.32361-0.1784 0.32361l-4.5991 2.7487s-0.39816 0.13052-0.65793-0.063572c-0.25976-0.19409-0.24672-0.35035-0.24672-0.35035z" /></g></svg>',
        repeat1:
            '<svg version="1.1" viewBox="0 0 26.458 26.458" xmlns="http://www.w3.org/2000/svg"><g fill="#ffffff" stroke="#ffffff" stroke-width=".3"><path transform="scale(.26458)" d="m35.471 20.607c-8.2281 0-14.852 6.6235-14.852 14.852v29.055c0 8.2281 6.6235 14.852 14.852 14.852h15.297c-0.099283-0.23342-0.20508-0.4639-0.28516-0.70898-1.0314-3.157-0.36829-6.37 1.3789-9.084h-11.549c-5.4854 0-9.9004-4.415-9.9004-9.9004v-19.371c0-5.4853 4.415-9.9004 9.9004-9.9004h0.21094c-0.0026-0.04362-0.01758-0.08476-0.01758-0.12891v-9.6641zm25.035 0v9.6641c0 0.05752-0.0189 0.11131-0.02344 0.16797 1.6304 0.12928 3.1454 0.65289 4.4551 1.4707v-4.7422h10.172l-0.17773 3.0039v0.0078c0.0017 0.81652 0.51993 2.0016 1.6992 3.5879 0.75387 1.014 1.7283 2.1484 2.7461 3.3945v-1.7031c0-8.2281-6.6235-14.852-14.852-14.852zm14.426 28.418-0.0078 23.127c0.02228 1.1774-0.15778 2.3265-0.49805 3.4277 3.0352-2.7155 4.9512-6.6543 4.9512-11.066v-4.1504c-0.56305 0.11278-1.2016 0.10116-1.877-0.18359-1.5706-0.66221-1.9257-2.0105-2.0215-2.7676-0.09574-0.75705 3e-3 -1.3469 0.18359-1.9414 0.08357-0.27565 0.31768-3.3953-0.38281-5.7285-0.08795-0.29287-0.24795-0.45038-0.34766-0.7168z" fill="#fff" stroke="#fffffb" stroke-linecap="round"/><path d="m10.111 9.4094v-5.3598c-0.0082 0.01812-0.0021-0.17387 0.24672-0.34879 0.24874-0.17491 0.65793 0 0.65793 0l4.6078 2.7541s0.1702 0.09835 0.16971 0.29612c-5.03e-4 0.20056-0.1784 0.32361-0.1784 0.32361l-4.5991 2.7487s-0.39816 0.13052-0.65793-0.06357c-0.25976-0.19409-0.24672-0.35035-0.24672-0.35035z" /><path d="m19.028 7.9826h-1.0564v9.5915c-0.58411-0.2504-1.34-0.25388-2.0856 0.04816-1.3358 0.54165-2.1316 1.8592-1.7778 2.9424 0.35402 1.0835 1.7238 1.5224 3.0594 0.98077 1.1345-0.45993 1.8767-1.4796 1.8585-2.4399l0.0018-7.8441c1.842 0.32346 1.9681 2.9181 1.7475 3.6457-0.08378 0.27574 0.06375 0.48221 0.34217 0 1.9862-3.4426-2.0896-4.9615-2.0896-6.9244z" /></g></svg>',
        rew: '<svg version="1.1" viewBox="0 0 26.458 26.458" xmlns="http://www.w3.org/2000/svg"><g fill="#ffffff" stroke="#ffffff" stroke-miterlimit="4.1" stroke-width=".3"><path d="m21.082 18.805c-9.3e-5 -3.7545 1.87e-4 -7.509-1.4e-4 -11.263-0.13349-0.79848-1.117-1.0848-1.7334-0.63234-2.8067 1.9183-5.6203 3.8271-8.4226 5.7514-0.52184 0.44634-0.18084 1.2199 0.36377 1.4624 2.7112 1.8495 5.4224 3.6989 8.1336 5.5484 0.68912 0.2915 1.546-0.09983 1.6587-0.86625z"/><path d="m15.791 18.805c-8.7e-5 -3.7545 1.73e-4 -7.509-1.3e-4 -11.263-0.13345-0.79849-1.1171-1.0848-1.7334-0.63234-2.8067 1.9183-5.6203 3.8271-8.4226 5.7514-0.52184 0.44634-0.18084 1.2199 0.36377 1.4624 2.7112 1.8495 5.4224 3.6989 8.1336 5.5484 0.68912 0.2915 1.546-0.09982 1.6587-0.86625z"/><path d="m7.5828 5.3572c-0.68239 0.014305-1.3705-0.02913-2.0492 0.022654-0.31228 0.23669-0.12538 0.69262-0.1764 1.0359v14.396c0.087332 0.45287 0.63952 0.23962 0.96802 0.28916 0.45618-0.01348 0.91782 0.028 1.3703-0.02265 0.31228-0.23669 0.12538-0.69262 0.1764-1.0359v-14.396c0.00417-0.15504-0.13412-0.29333-0.28916-0.28916z" stroke-linecap="round"/></g></svg>',
        add: '<svg viewBox="0 0 24 24"><g fill="#ffffff" stroke="#ffffff" stroke-width=".3"><path d="M14 10H3v2h11zm0-4H3v2h11zm4 8v-4h-2v4h-4v2h4v4h2v-4h4v-2zM3 16h7v-2H3z"></path></g></svg>',
        menuback:
            '<svg viewBox="0 0 24 24"><g fill="#ffffff" stroke="#ffffff" stroke-width=".3"><path d="M20 11H7.83l5.59-5.59L12 4l-8 8 8 8 1.41-1.41L7.83 13H20z"></path></g></svg>',
        next: '<svg viewBox="0 0 24 24"><g fill="#ffffff" stroke="#ffffff" stroke-width=".3"><path d="m12 4-1.41 1.41L16.17 11H4v2h12.17l-5.58 5.59L12 20l8-8z"></path></g></svg>',
    },
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
    redrawInspectWidgets: function (view) {
        let $edit, id, start, end, sel;
        if (window.Selection) {
            if (window.getSelection()) {
                sel = window.getSelection();
            }
            if (sel.anchorNode) {
                $edit = $(sel.anchorNode).find('input, textarea').first();
                id = $edit.attr('id');
                start = $edit.prop('selectionStart');
                end = $edit.prop('selectionEnd');
            }
        }
        vis.inspectWidgets(view, view);
        $edit = $(`#${id}`);
        if ($edit) {
            $edit.focus();
            $edit.prop({
                selectionStart: start,
                selectionEnd: end,
            });
        }
    },
    checkViewIndex: function (widgetID, view, viewindex) {
        let $edit;
        const data = vis.views[view].widgets[widgetID].data;
        const metadata = this.viewIndexMetadata[widgetID] || data;
        const viewindexcheck = metadata.viewindexcheck;
        const functionname = metadata.functionname;

        if (!viewindexcheck || !functionname) {
            return false;
        }

        if (!viewindex || viewindex.trim() == '') {
            viewindex = vis.binds['squeezeboxrpc'][functionname].getViewindex(viewindexcheck).join(', ');
        }

        viewindex = viewindex.split(',').map(function (item) {
            return item.trim();
        });

        viewindex = vis.binds['squeezeboxrpc'][functionname].checkViewindexExist(viewindex, viewindexcheck);

        if (viewindex.length > viewindexcheck.length) {
            viewindex = viewindex.slice(0, viewindexcheck.length);
        }
        const normalizedViewindex = viewindex.join(', ');
        $edit = $('#inspect_viewindex');
        let start = $edit.prop('selectionStart');
        let end = $edit.prop('selectionEnd');
        if (start > normalizedViewindex.length) {
            start = normalizedViewindex.length;
        }
        if (end > normalizedViewindex.length) {
            end = normalizedViewindex.length;
        }
        $edit.val(normalizedViewindex);
        $edit = $('#inspect_viewindex');
        if ($edit) {
            $edit.focus();
            $edit.prop({
                selectionStart: start,
                selectionEnd: end,
            });
        }
        return false;
    },
    getPlayerWidgetType: function (view, playerWidgetID) {
        return vis.views[view].widgets[playerWidgetID].data.formattype || '';
    },
    checkAttributes: function ($div, widgetPlayer) {
        if (!widgetPlayer) {
            $div.html('Please select a player widget');
            return false;
        }
        if (!vis.widgets[widgetPlayer].data.ainstance) {
            $div.html('Please select an instance at the playerwidget');
            return false;
        }
        const ainstance = vis.widgets[widgetPlayer].data.ainstance.split('.');
        if (!ainstance || ainstance[0] != 'squeezeboxrpc') {
            $div.html('Please select an instance at the playerwidget');
            return false;
        }
        return ainstance;
    },
    setChanged: function (widgetPlayer, fdata) {
        $('.vis-view')
            .off(`change.${fdata.widgetID}`)
            .on(`change.${fdata.widgetID}`, `#${widgetPlayer}`, fdata, function () {
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

        $('.vis-view')
            .off(`playerschanged.${fdata.widgetID}`)
            .on(`playerschanged.${fdata.widgetID}`, `#${widgetPlayer}`, fdata, () => {
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
            html += `<option value="${options[i]}">${options[i]}</option>`;
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
        const widgets = vis.views[vis.activeView].widgets;
        const keys = Object.keys(widgets);
        const result = [];
        for (let i = 0; i < keys.length; i++) {
            if (widgets[keys[i]].tpl == 'tplSqueezeboxrpcPlayer') {
                result.push(keys[i]);
            }
        }
        return result;
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
        return $(`input[name=${widgetPlayer}], #${widgetPlayer} option`)
            .toArray()
            .reduce(function (acc, cur) {
                if ($(cur).val()) {
                    acc.push($(cur).val());
                }
                return acc;
            }, []);
    },
    getPlayerName: function (widgetPlayer) {
        return $(`input[name=${widgetPlayer}]:checked, #${widgetPlayer} option:checked`).val();
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
