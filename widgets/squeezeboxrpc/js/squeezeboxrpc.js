/*
    ioBroker.vis squeezeboxrpc Widget-Set

    Copyright 2019 oweitman oweitman@gmx.de


    Todo
    margin/padding bei player und favorites

*/
/* globals $,vis,Font,window,createTextImage */
"use strict";

// add translations for edit mode
if (vis.editMode) {
    $.extend(true, systemDictionary, {
        "ainstance": { "en": "SqueezeboxRPC instance", "de": "SqueezeboxRPC Instanz", "ru": "SqueezeboxRPC экземпляр" },
        "viewindex": { "en": "Viewindex", "de": "Anzeige Index", "ru": "Посмотреть индекс" },
        "wrapcamelcase": { "en": "Wrap Camelcase", "de": "Umbruch von Camelcase", "ru": "завернуть верблюжий чехол" },
        "buttonbkcolor": { "en": "Button background color", "de": "Bild Hintergrundfarbe", "ru": "Цвет фона кнопки" },
        "widgetPlayer": { "en": "Player widget", "de": "Player widget", "ru": "Виджет игрока" },
        "widgetFavorites": { "en": "Favorite widget", "de": "Favorite widget", "ru": "Любимый виджет" },
        "picHeight": { "en": "Button height", "de": "Bildhöhe", "ru": "Высота кнопки" },
        "picWidth": { "en": "Button width", "de": "Bildbreite", "ru": "Ширина кнопки" },
        "opacity": { "en": "Opacity", "de": "Durchsichtigkeit", "ru": "Прозрачность" },
        "editmodehelper": { "en": "Edit Mode Helper", "de": "Edit Mode Hilfe", "ru": "Помощник режима редактирования" },
        "group_buttonsettings": { "en": "Button options", "de": "Knopfeinstellungen", "ru": "Опции кнопки" },
        "borderwidth": { "en": "Border width", "de": "Rahmenbreite", "ru": "Ширина рамы" },
        "borderstyle": { "en": "Border-style", "de": "border-style", "ru": "border-style" },
        "bordercolornormal": { "en": "Border width normal", "de": "Rand farbe normal", "ru": "Рэнд цвет нормальный" },
        "bordercoloractive": { "en": "Border width aktiv", "de": "Rand farbe aktiv", "ru": "Цвет края активен" },
        "borderradius": { "en": "border-radius", "de": "border-radius", "ru": "border-radius" },
        "imagefwd": { "en": "Picture", "de": "Bild", "ru": "Картина" },
        "group_svgsettings": { "en": "SVG Settings", "de": "SVG Einstellungen", "ru": "Настройки SVG" },
        "fillcolor": { "en": "fillcolor", "de": "fillcolor", "ru": "fillcolor" },
        "strokecolor": { "en": "strokecolor", "de": "strokecolor", "ru": "strokecolor" },
        "strokewidth": { "en": "strokewidth", "de": "strokewidth", "ru": "strokewidth" },
        "imagerew": { "en": "Picture", "de": "Bild", "ru": "Картина" },
        "imagepause": { "en": "Picture pause", "de": "Bild pause", "ru": "Пауза изображения" },
        "imageplay": { "en": "Picture play", "de": "Bild play", "ru": "Картинная игра" },
        "imagestop": { "en": "Picture stop", "de": "Bild stop", "ru": "Остановка изображения" },
        "calctype": { "en": "CalcType", "de": "CalcType", "ru": "CalcType" },
        "segments": { "en": "Segments", "de": "Segmente", "ru": "сегменты" },
        "fillcolornormal": { "en": "fillcolornormal", "de": "fillcolornormal", "ru": "fillcolornormal" },
        "fillcoloractive": { "en": "fillcoloractive", "de": "fillcoloractive", "ru": "fillcoloractive" },
        "position": { "en": "Format", "de": "Format", "ru": "формат" },
        "group_segmentsettings": { "en": "Segments", "de": "Segmente", "ru": "сегменты" },
        "margin": { "en": "margin", "de": "margin", "ru": "margin" },
        "imagerepeat0": { "en": "Picture without", "de": "Bild ohne", "ru": "Картинка без" },
        "imagerepeat1": { "en": "Picture Title", "de": "Bild Titel", "ru": "Название картинки" },
        "imagerepeat2": { "en": "Picture Playlist", "de": "Bild Playlist", "ru": "Плейлист изображений" },

        "imageshuffle0": { "en": "Picture without", "de": "Bild ohne", "ru": "Картинка без" },
        "imageshuffle1": { "en": "Picture Title", "de": "Bild Titel", "ru": "Название картинки" },
        "imageshuffle2": { "en": "Picture Album", "de": "Bild Album", "ru": "картинки Альбом" },

        "bordercolornogroup": { "en": "Border color - No group", "de": "Randfarbe - ohne Gruppe", "ru": "Цвет границы - нет группы" },
        "bordercolorowngroup": { "en": "Border color - Own group", "de": "Randfarbe - Eigene Gruppe", "ru": "Цвет границы - Собственная группа" },
        "bordercolorothergroup": { "en": "Border color - Other group", "de": "Randfarbe - Andere Gruppe", "ru": "Цвет бордюра - Другая группа" },

    });
}


vis.binds["squeezeboxrpc"] = {
    version: "0.6.0",
    showVersion: function () {
        if (vis.binds["squeezeboxrpc"].version) {
            console.log("Version squeezeboxrpc: " + vis.binds["squeezeboxrpc"].version);
            vis.binds["squeezeboxrpc"].version = null;
        }
    },
    svg: {
        stop: '<svg version="1.1" viewBox="0 0 26.458 26.458" xmlns="http://www.w3.org/2000/svg"><g fill="#ffffff" stroke="#ffffff" stroke-linecap="round" stroke-width=".3"><path d="m5.7393 5.4537h14.98c0.44743 0.086371 0.23662 0.63202 0.28562 0.95661v14.309c-0.08637 0.44743-0.63202 0.23662-0.95661 0.28562h-14.309c-0.44743-0.08637-0.23662-0.63202-0.28562-0.95661v-14.309c-0.00412-0.15314 0.13248-0.28973 0.28562-0.28562z"/></g></svg>',
        fwd: '<svg version="1.1" viewBox="0 0 26.458 26.458" xmlns="http://www.w3.org/2000/svg"><g fill="#ffffff" stroke="#ffffff" stroke-width=".3"><path d="m5.3759 18.805c9.23e-5 -3.7545-1.846e-4 -7.509 1.385e-4 -11.263 0.13348-0.79848 1.117-1.0848 1.7334-0.63234 2.8067 1.9183 5.6203 3.8271 8.4226 5.7514 0.52184 0.44634 0.18084 1.2199-0.36377 1.4624-2.7112 1.8495-5.4224 3.6989-8.1336 5.5484-0.68912 0.29151-1.546-0.09983-1.6587-0.86625z"/><path d="m10.668 18.805c8.7e-5 -3.7545-1.73e-4 -7.509 1.3e-4 -11.263 0.13345-0.79849 1.1171-1.0848 1.7334-0.63234 2.8067 1.9183 5.6203 3.8271 8.4226 5.7514 0.52184 0.44634 0.18084 1.2199-0.36377 1.4624-2.7112 1.8495-5.4224 3.6989-8.1336 5.5484-0.68912 0.2915-1.546-0.09982-1.6587-0.86625z"/><path d="m18.876 5.3572c0.68238 0.014305 1.3705-0.02913 2.0492 0.022654 0.31228 0.23669 0.12538 0.69262 0.1764 1.0359v14.396c-0.08733 0.45287-0.63952 0.23962-0.96802 0.28916-0.45618-0.01348-0.91782 0.028-1.3703-0.02265-0.31228-0.23669-0.12538-0.69262-0.1764-1.0359v-14.396c-0.0042-0.15504 0.13412-0.29333 0.28916-0.28916z" stroke-linecap="round"/></g></svg>',
        pause: '<svg version="1.1" viewBox="0 0 26.458 26.458" xmlns="http://www.w3.org/2000/svg"><g fill="#ffffff" stroke="#ffffff" stroke-linecap="round" stroke-width=".3"><path d="m5.6838 5.396h5.8304c0.45073 0.086991 0.23839 0.63664 0.28773 0.96362v14.415c-0.08699 0.45073-0.63664 0.23839-0.96362 0.28773h-5.1545c-0.45073-0.08699-0.23839-0.63664-0.28773-0.96362v-14.415c-0.00415-0.15428 0.13346-0.29188 0.28773-0.28773z"/><path d="m14.944 5.396h5.8304c0.45073 0.086991 0.23839 0.63664 0.28773 0.96362v14.415c-0.08699 0.45073-0.63664 0.23839-0.96362 0.28773h-5.1545c-0.45073-0.08699-0.23839-0.63664-0.28773-0.96362v-14.415c-0.0041-0.15428 0.13346-0.29188 0.28773-0.28773z"/></g></svg>',
        play: '<svg version="1.1" viewBox="0 0 26.458 26.458" xmlns="http://www.w3.org/2000/svg"><g fill="#ffffff" stroke="#ffffff" stroke-width=".3"><g transform="translate(0 -270.54)"><path d="m5.2917 292.21c1.638e-4 -5.7717-3.275e-4 -11.543 2.455e-4 -17.315 0.26319-1.0382 1.4726-1.5611 2.4514-1.1989 0.80816 0.23695 1.4691 0.80297 2.2081 1.194 4.3854 2.6267 8.7811 5.2375 13.16 7.8742 0.79505 0.54047 0.45033 1.7439-0.34988 2.0757-4.8532 2.9006-9.7064 5.8011-14.56 8.7017-1.0328 0.36658-2.332 0.0381-2.8269-1.0022-0.045938-0.10342-0.084738-0.21463-0.083483-0.32941z"/></g></g></svg>',
        shuffle0: '<svg version="1.1" viewBox="0 0 26.458 26.458" xmlns="http://www.w3.org/2000/svg"><g fill="#ffffff" stroke="#ffffff" stroke-linecap="round" stroke-width=".3"><path d="m5.6162 5.4125h9.9891c0.35652 0.11121 0.14576 0.59069 0.20276 0.87689-0.01035 0.485 0.02087 0.97413-0.01588 1.4565-0.21946 0.23741-0.60948 0.076434-0.90595 0.12369h-9.27c-0.35652-0.11121-0.14577-0.59069-0.20276-0.87689 0.010353-0.485-0.020872-0.97413 0.015885-1.4565 0.030072-0.073761 0.10708-0.12497 0.18687-0.12369z"/><path d="m10.813 9.8261h9.9891c0.35652 0.11121 0.14576 0.59069 0.20276 0.87689-0.01035 0.485 0.02087 0.97413-0.01589 1.4565-0.21946 0.23741-0.60948 0.07644-0.90595 0.12369h-9.27c-0.35652-0.11121-0.14576-0.59069-0.20276-0.87689 0.01035-0.485-0.02087-0.97413 0.01589-1.4565 0.03007-0.073761 0.10708-0.12497 0.18688-0.12369z"/><path d="m5.6193 14.195h9.9891c0.35652 0.11121 0.14576 0.59069 0.20276 0.87689-0.01035 0.485 0.02087 0.97413-0.01588 1.4565-0.21946 0.23741-0.60948 0.07643-0.90595 0.12369h-9.27c-0.35652-0.11121-0.14576-0.59069-0.20276-0.87689 0.010353-0.485-0.020872-0.97413 0.015885-1.4565 0.030072-0.07376 0.10708-0.12497 0.18687-0.12369z"/><path d="m10.845 18.582h9.9891c0.35652 0.11121 0.14576 0.59069 0.20276 0.87689-0.01035 0.485 0.02087 0.97413-0.01589 1.4565-0.21946 0.23741-0.60948 0.07644-0.90595 0.12369h-9.27c-0.35652-0.11121-0.14576-0.59069-0.20276-0.87689 0.01035-0.485-0.02087-0.97413 0.01589-1.4565 0.03007-0.07376 0.10708-0.12497 0.18688-0.12369z"/></g></svg>',
        shuffle2: '<svg version="1.1" viewBox="0 0 26.458 26.458" xmlns="http://www.w3.org/2000/svg"><g fill="#ffffff" stroke="#ffffff" stroke-linecap="round" stroke-width=".3"><path d="m10.813 18.548c-0.35617 0.11095-0.14564 0.58998-0.20257 0.87583 0.01028 0.48528-0.02076 0.97467 0.01586 1.4573 0.21919 0.2371 0.60875 0.07634 0.90486 0.12353h2.8258c-0.05537-0.30204-0.09712-0.61075-0.07338-0.93127v-1.5254h-3.4706z"/><path d="m15.193 15.235c-0.44809 0.08695-0.23653 0.63372-0.28577 0.95902v4.5089c0.08728 0.44757 0.63383 0.23594 0.95902 0.28525h4.836c0.44765-0.08685 0.2359-0.63348 0.28525-0.95851v-4.5089c-0.08652-0.44816-0.63337-0.23649-0.95851-0.28577h-4.836zm0.56741 0.59324c1.4869 0.0118 2.9784-0.0236 4.4623 0.0177 0.25792 0.21902 0.09046 0.62233 0.13842 0.92678-0.01179 1.1608 0.02362 2.3264-0.01778 3.4843-0.21938 0.25783-0.62259 0.09051-0.92722 0.13842-1.2474-0.01185-2.4996 0.0237-3.7441-0.01778-0.25714-0.21976-0.09015-0.6226-0.13798-0.92722 0.01173-1.1608-0.02351-2.3263 0.0177-3.4842 0.03349-0.08241 0.11959-0.13946 0.20864-0.13798z"/><path d="m5.6177 5.386h9.9891c0.35637 0.11098 0.14585 0.59007 0.20276 0.87601-0.0103 0.48529 0.0208 0.97471-0.01588 1.4574-0.21917 0.23733-0.60884 0.076486-0.90501 0.12369h-9.2709c-0.35638-0.11098-0.14586-0.59007-0.20276-0.87601 0.010298-0.48529-0.020796-0.97471 0.015885-1.4574 0.030072-0.073761 0.10708-0.12497 0.18687-0.12369z"/><path d="m10.813 9.7732h9.9891c0.35637 0.11098 0.14585 0.59006 0.20276 0.87601-0.0103 0.4853 0.0208 0.97471-0.01589 1.4574-0.21917 0.23733-0.60884 0.07648-0.90501 0.12369h-9.2709c-0.35637-0.11098-0.14585-0.59006-0.20276-0.87601 0.0103-0.4853-0.0208-0.97471 0.01589-1.4574 0.03007-0.073761 0.10708-0.12497 0.18688-0.12369z"/><path d="m5.6177 14.16c-0.35682 0.11055-0.14617 0.5899-0.20309 0.87583 0.010332 0.48531-0.020862 0.97475 0.015936 1.4574 0.21915 0.23774 0.609 0.07674 0.90529 0.12397h7.9475c0.01599-0.59386-0.03233-1.1941 0.0247-1.7839 0.23585-0.33075 0.70254-0.14135 1.053-0.19167 0.34447 0.08741 0.60141-0.07206 0.38911-0.42246-0.39444-0.12791-0.84703-0.02699-1.2655-0.05916h-8.867z"/></g></svg>',
        repeat0: '<svg version="1.1" viewBox="0 0 26.458 26.458" xmlns="http://www.w3.org/2000/svg"><g fill="#ffffff" stroke="#ffffff" stroke-width=".3"><path transform="scale(.26458)" d="m35.473 20.621c-8.2281 0-14.852 6.6235-14.852 14.852v29.055c0 8.2281 6.6235 14.852 14.852 14.852h29.055c8.2281 0 14.852-6.6235 14.852-14.852v-29.055c0-8.2281-6.6235-14.852-14.852-14.852h-4.0195v9.6641c0 0.05754-0.01898 0.1113-0.02344 0.16797 5.108 0.40503 9.1016 4.6456 9.1016 9.8613v19.371c0 5.4854-4.415 9.9004-9.9004 9.9004h-19.371c-5.4854 0-9.9004-4.415-9.9004-9.9004v-19.371c0-5.4854 4.415-9.9004 9.9004-9.9004h0.21094c-0.0026-0.04363-0.01758-0.08477-0.01758-0.12891v-9.6641z" fill="#fff" stroke-linecap="round"/><path d="m10.111 9.4128v-5.3598c-0.0082 0.018122-0.0021-0.17387 0.24672-0.34879 0.24874-0.17491 0.65793 0 0.65793 0l4.6078 2.7541s0.1702 0.098349 0.16971 0.29612c-4.97e-4 0.20056-0.1784 0.32361-0.1784 0.32361l-4.5991 2.7487s-0.39816 0.13052-0.65793-0.063572c-0.25976-0.19409-0.24672-0.35035-0.24672-0.35035z" /></g></svg>',
        repeat1: '<svg version="1.1" viewBox="0 0 26.458 26.458" xmlns="http://www.w3.org/2000/svg"><g fill="#ffffff" stroke="#ffffff" stroke-width=".3"><path transform="scale(.26458)" d="m35.471 20.607c-8.2281 0-14.852 6.6235-14.852 14.852v29.055c0 8.2281 6.6235 14.852 14.852 14.852h15.297c-0.099283-0.23342-0.20508-0.4639-0.28516-0.70898-1.0314-3.157-0.36829-6.37 1.3789-9.084h-11.549c-5.4854 0-9.9004-4.415-9.9004-9.9004v-19.371c0-5.4853 4.415-9.9004 9.9004-9.9004h0.21094c-0.0026-0.04362-0.01758-0.08476-0.01758-0.12891v-9.6641zm25.035 0v9.6641c0 0.05752-0.0189 0.11131-0.02344 0.16797 1.6304 0.12928 3.1454 0.65289 4.4551 1.4707v-4.7422h10.172l-0.17773 3.0039v0.0078c0.0017 0.81652 0.51993 2.0016 1.6992 3.5879 0.75387 1.014 1.7283 2.1484 2.7461 3.3945v-1.7031c0-8.2281-6.6235-14.852-14.852-14.852zm14.426 28.418-0.0078 23.127c0.02228 1.1774-0.15778 2.3265-0.49805 3.4277 3.0352-2.7155 4.9512-6.6543 4.9512-11.066v-4.1504c-0.56305 0.11278-1.2016 0.10116-1.877-0.18359-1.5706-0.66221-1.9257-2.0105-2.0215-2.7676-0.09574-0.75705 3e-3 -1.3469 0.18359-1.9414 0.08357-0.27565 0.31768-3.3953-0.38281-5.7285-0.08795-0.29287-0.24795-0.45038-0.34766-0.7168z" fill="#fff" stroke="#fffffb" stroke-linecap="round"/><path d="m10.111 9.4094v-5.3598c-0.0082 0.01812-0.0021-0.17387 0.24672-0.34879 0.24874-0.17491 0.65793 0 0.65793 0l4.6078 2.7541s0.1702 0.09835 0.16971 0.29612c-5.03e-4 0.20056-0.1784 0.32361-0.1784 0.32361l-4.5991 2.7487s-0.39816 0.13052-0.65793-0.06357c-0.25976-0.19409-0.24672-0.35035-0.24672-0.35035z" /><path d="m19.028 7.9826h-1.0564v9.5915c-0.58411-0.2504-1.34-0.25388-2.0856 0.04816-1.3358 0.54165-2.1316 1.8592-1.7778 2.9424 0.35402 1.0835 1.7238 1.5224 3.0594 0.98077 1.1345-0.45993 1.8767-1.4796 1.8585-2.4399l0.0018-7.8441c1.842 0.32346 1.9681 2.9181 1.7475 3.6457-0.08378 0.27574 0.06375 0.48221 0.34217 0 1.9862-3.4426-2.0896-4.9615-2.0896-6.9244z" /></g></svg>',
        rew: '<svg version="1.1" viewBox="0 0 26.458 26.458" xmlns="http://www.w3.org/2000/svg"><g fill="#ffffff" stroke="#ffffff" stroke-miterlimit="4.1" stroke-width=".3"><path d="m21.082 18.805c-9.3e-5 -3.7545 1.87e-4 -7.509-1.4e-4 -11.263-0.13349-0.79848-1.117-1.0848-1.7334-0.63234-2.8067 1.9183-5.6203 3.8271-8.4226 5.7514-0.52184 0.44634-0.18084 1.2199 0.36377 1.4624 2.7112 1.8495 5.4224 3.6989 8.1336 5.5484 0.68912 0.2915 1.546-0.09983 1.6587-0.86625z"/><path d="m15.791 18.805c-8.7e-5 -3.7545 1.73e-4 -7.509-1.3e-4 -11.263-0.13345-0.79849-1.1171-1.0848-1.7334-0.63234-2.8067 1.9183-5.6203 3.8271-8.4226 5.7514-0.52184 0.44634-0.18084 1.2199 0.36377 1.4624 2.7112 1.8495 5.4224 3.6989 8.1336 5.5484 0.68912 0.2915 1.546-0.09982 1.6587-0.86625z"/><path d="m7.5828 5.3572c-0.68239 0.014305-1.3705-0.02913-2.0492 0.022654-0.31228 0.23669-0.12538 0.69262-0.1764 1.0359v14.396c0.087332 0.45287 0.63952 0.23962 0.96802 0.28916 0.45618-0.01348 0.91782 0.028 1.3703-0.02265 0.31228-0.23669 0.12538-0.69262 0.1764-1.0359v-14.396c0.00417-0.15504-0.13412-0.29333-0.28916-0.28916z" stroke-linecap="round"/></g></svg>'
    },
    playerattributes: ["Playername", "PlayerID", "Connected", "IP", "Power", "Mode", "Time", "Rate", "SyncSlaves", "SyncMaster", "Volume", "PlaylistRepeat", "PlaylistShuffle", "Remote", "Playlist", "PlaylistCurrentIndex", "state", "Duration", "Bitrate", "Album", "ArtworkUrl", "Genre", "Type", "Title", "Artist", "Albumartist", "Trackartist", "Band", "Url", "RadioName"],
    favorites: {

        createWidget: function (widgetID, view, data, style) {

            const $div = $("#" + widgetID);
            // if nothing found => wait
            if (!$div.length) {
                return setTimeout(function () {
                    vis.binds["squeezeboxrpc"].favorites.createWidget(widgetID, view, data, style);
                }, 100);
            }

            data = vis.views[view].widgets[widgetID].data;
            style = vis.views[view].widgets[widgetID].style;
            data.functionname = "favorites";

            let redrawinspectwidgets = false;

            const ainstance = data.ainstance = vis.binds["squeezeboxrpc"].checkAttributes($div, data.widgetPlayer);
            if (!ainstance) return;

            const fdata = { self: this, widgetID: widgetID, view: view, data: data, style: style };

            const key = ainstance[0] + "." + ainstance[1] + "." + "Favorites.*";
            vis.conn.gettingStates = 0;
            vis.conn.getStates(key, function (err, obj) {

                let favorites = this.getFavorites(obj, ainstance);
                favorites = data.viewindexcheck = this.filterFavorites(favorites);

                const editmodehelper = data.editmodehelper;
                const picWidth = data.picWidth;
                const picHeight = data.picHeight;
                const opacity = (vis.editMode && editmodehelper) ? 1 : data.opacity;
                const borderwidth = data.borderwidth;
                const borderstyle = data.borderstyle;
                const bordercolornormal = data.bordercolornormal;
                const bordercoloractive = data.bordercoloractive;
                const borderradius = data.borderradius;
                const buttonmargin = data.buttonmargin || "0px";

                if (!data.viewindex || data.viewindex.trim() == "") {
                    data.viewindex = this.getViewindex(favorites).join(", ");
                }

                if (vis.editMode && data.bCount != Math.min(favorites.length, data.viewindex.split(",").length)) {
                    data.bCount = Math.min(favorites.length, data.viewindex.split(",").length);
                    redrawinspectwidgets = true;
                }

                let text = "";

                text += "<style>\n";
                text += "#" + widgetID + " div {\n";
                text += "     display: inline-block; \n";
                text += "}\n";
                text += "#" + widgetID + " div div {\n";
                text += "     position: relative; \n";
                text += "     margin: 0px " + buttonmargin + " " + buttonmargin + " 0px; \n";
                text += "}\n";
                text += "#" + widgetID + ' input[type="radio"] {\n';
                text += "    display: none;\n";
                text += "}\n";
                text += "#" + widgetID + " img {\n";
                text += "    opacity: " + opacity + ";\n";
                text += "    width: " + picWidth + "px;\n";
                text += "    height: " + picHeight + "px;\n";
                text += "    border: " + borderwidth + " " + borderstyle + " " + bordercolornormal + ";\n";
                text += "    border-radius: " + borderradius + ";\n";
                text += "}\n";
                text += "#" + widgetID + " canvas {\n";
                text += "    opacity: " + opacity + ";\n";
                text += "    width: " + picWidth + "px;\n";
                text += "    height: " + picHeight + "px;\n";
                text += "    border: " + borderwidth + " " + borderstyle + " " + bordercolornormal + ";\n";
                text += "    border-radius: " + borderradius + ";\n";
                text += "}\n";
                text += "#" + widgetID + " img:active {\n";
                text += "    transform: scale(0.9, 0.9);\n";
                text += "    opacity: 1;\n";
                text += "    border: " + borderwidth + " " + borderstyle + " " + bordercoloractive + ";\n";
                text += "    border-radius: " + borderradius + ";\n";
                text += "}\n";
                text += "#" + widgetID + " canvas:active {\n";
                text += "    transform: scale(0.9, 0.9);\n";
                text += "    opacity: 1;\n";
                text += "    border: " + borderwidth + " " + borderstyle + " " + bordercoloractive + ";\n";
                text += "    border-radius: " + borderradius + ";\n";
                text += "}\n";
                text += "#" + widgetID + ' input[type="radio"]:checked + label img {\n';
                text += "    opacity: 1;\n";
                text += "    border: " + borderwidth + " " + borderstyle + " " + bordercoloractive + ";\n";
                text += "    border-radius: " + borderradius + ";\n";
                text += "}\n";
                text += "#" + widgetID + ' input[type="radio"]:checked + label canvas {\n';
                text += "    opacity: 1;\n";
                text += "    border: " + borderwidth + " " + borderstyle + " " + bordercoloractive + ";\n";
                text += "    border-radius: " + borderradius + ";\n";
                text += "}\n";
                text += "</style>\n";

                text += '<div id="' + widgetID + 'container">';
                const viewindex = data.viewindex.split(", ");
                for (let i = 0; i < viewindex.length; i++) {
                    const favorite = this.findById(favorites, viewindex[i]);
                    text += "  <div>";
                    text += '    <input type="radio" id="' + widgetID + favorite.id + '" name="' + widgetID + '" value="' + favorite.id + '" >';
                    text += '    <label for="' + widgetID + favorite.id + '">';
                    text += "      <span>";
                    let favimage = favorite.image || "";
                    let favtext = favorite.id || "";
                    let attrimage = data["buttonsImage" + (i + 1)] || "";
                    let attrtext = data["buttonsText" + (i + 1)] || "";

                    favimage = favimage.trim();
                    favtext = favtext.trim();
                    attrimage = attrimage.trim();
                    attrtext = attrtext.trim();

                    const buttonsImage = attrimage || favimage;

                    if (!(attrtext) && (buttonsImage)) {
                        text += '        <img src="' + buttonsImage + '">';
                    }
                    text += "      </span>";
                    text += "    </label>";
                    if (vis.editMode && editmodehelper) {
                        text += '<div style="position: absolute;top: 0;right: 0;background-color: black;color: white;border-width: 1px;border-color: white;border-style: solid;font-size: xx-small;padding: 1px;">' + viewindex[i] + "</div>";
                    }
                    text += "  </div>";
                }
                text += "</div>";

                $("#" + widgetID).html(text);

                const spans = $("#" + widgetID + " span");
                const font = new Font($("#" + widgetID));
                const opt = {};

                opt.style = window.getComputedStyle($("#" + widgetID)[0], null);
                opt.backgroundcolor = data.buttonbkcolor;
                for (let i = 0; i < viewindex.length; i++) {
                    const favorite = this.findById(favorites, viewindex[i]);

                    let favimage = favorite.image || "";
                    let favtext = favorite.id + "(" + i + ")" || "";
                    let attrimage = data["buttonsImage" + (i + 1)] || "";
                    let attrtext = data["buttonsText" + (i + 1)] || "";

                    favimage = favimage.trim();
                    favtext = favtext.trim();
                    attrimage = attrimage.trim();
                    attrtext = attrtext.trim();

                    const buttonsImage = attrimage || favimage;

                    const buttonsText = attrtext || favtext;
                    if ((attrtext) || !(buttonsImage)) {
                        $(spans[i]).append(createTextImage(buttonsText, font, picWidth, picHeight, opt));
                    }
                }
                const favbtns = $("input[name=" + widgetID + "]");
                favbtns.off("change.favorite").on("change.favorite", fdata, function (event) {
                    const fdata = event.data;
                    const data = fdata.data;
                    const favorite = this.value;
                    const playername = vis.binds["squeezeboxrpc"].getPlayerName(data.widgetPlayer);
                    const state = ainstance[0] + "." + ainstance[1] + ".Players" + "." + playername + ".cmdPlayFavorite";
                    //vis.conn._socket.emit('setState', state, favorite);
                    vis.setValue(state, favorite);
                });
                if (vis.editMode && redrawinspectwidgets) vis.binds["squeezeboxrpc"].redrawInspectWidgets(view);
            }.bind(this));
        },
        getFavorites: function (datapoints, ainstance) {
            const regex = new RegExp("^" + ainstance[0] + "\\." + ainstance[1] + "\\.Favorites", "");
            return Object.keys(datapoints).reduce(function (acc, cur) {
                if (regex.test(cur)) {
                    const key = cur.split(".")[3];
                    const name = cur.split(".")[4];
                    if (!acc[key]) acc[key] = {};
                    acc[key][name] = this[cur].val;
                }
                return acc;
            }.bind(datapoints), []);
        },
        filterFavorites: function (favorites) {
            favorites = Object.values(favorites);
            return favorites.filter(function (cur) {
                return (cur.isaudio === 1);
            });
        },
        findById: function (favorites, id) {
            return favorites.find(function (cur) {
                return (cur.id.trim() == this.trim());
            }.bind(id));
        },
        getViewindex: function (favorites) {
            return favorites.map(cur => cur.id);
        },
        checkViewindexExist: function (viewindex, favorites) {
            return viewindex.map(function (item) {
                return (favorites.find(el => el.id == item)) ? item : "0";
            });
        },
    },
    players: {
        createWidget: function (widgetID, view, data, style) {

            const $div = $("#" + widgetID);
            // if nothing found => wait
            if (!$div.length) {
                return setTimeout(function () {
                    vis.binds["squeezeboxrpc"].players.createWidget(widgetID, view, data, style);
                }, 100);
            }
            data = vis.views[view].widgets[widgetID].data;
            style = vis.views[view].widgets[widgetID].style;
            data.functionname = "players";
            vis.conn._socket.emit("getObjects", function (err, obj) {
                //socket.emit('getObjects', function (err, obj) {
                let redrawinspectwidgets = false;
                if (data.ainstance) {
                    data.ainstance = data.ainstance.split(".").slice(0, 2).join(".");
                } else {
                    data.ainstance = "";
                }

                const ainstance = data.ainstance.split(".");
                if (!ainstance || ainstance[0] != "squeezeboxrpc") {
                    $("#" + widgetID).html("Please select an instance");
                    return;
                }
                const players = data.viewindexcheck = this.getPlayers(obj, ainstance);

                const editmodehelper = data.editmodehelper;
                const picWidth = data.picWidth;
                const picHeight = data.picHeight;
                const opacity = (vis.editMode && editmodehelper) ? 1 : data.opacity;
                const borderwidth = data.borderwidth;
                const borderstyle = data.borderstyle;
                const bordercolornormal = data.bordercolornormal;
                const bordercoloractive = data.bordercoloractive;
                const borderradius = data.borderradius;
                const buttonmargin = data.buttonmargin || "0px";

                if (!data.viewindex || data.viewindex.trim() == "") {
                    data.viewindex = this.getViewindex(players).join(", ");
                }

                data.defaultPlayer = data.defaultPlayer || Object.keys(players)[0] || "0";

                if (vis.editMode && data.bCount != Math.min(players.length, data.viewindex.split(",").length)) {
                    data.bCount = Math.min(players.length, data.viewindex.split(",").length);
                    redrawinspectwidgets = true;
                }

                const viewindex = data.viewindex.split(", ");
                if (data.formattype == "formatselect") {

                    let text = "";
                    let option = "";
                    option += '<option value=""></option>';
                    for (let i = 0; i < viewindex.length; i++) {
                        let buttonsText = (data["buttonsText" + (viewindex[i] + 1)]) || "";
                        buttonsText = (buttonsText.trim() != "") ? buttonsText : players[viewindex[i]];
                        if (vis.editMode && editmodehelper) buttonsText += " [" + viewindex[i] + "]";

                        option += '<option value="' + players[viewindex[i]] + '">' + buttonsText + "</option>";
                    }
                    text += '<select type="text" id="' + widgetID + 'select">' + option + "</select>";
                    $("#" + widgetID).html(text);

                }
                if (data.formattype == "formatbutton") {

                    let text = "";

                    text += "<style>\n";
                    text += "#" + widgetID + " div {\n";
                    text += "     display: inline-block; \n";
                    text += "}\n";
                    text += "#" + widgetID + " div div {\n";
                    text += "     position: relative; \n";
                    text += "     margin: 0px " + buttonmargin + " " + buttonmargin + " 0px; \n";
                    text += "}\n";
                    text += "#" + widgetID + ' input[type="radio"] {\n';
                    text += "    display: none;\n";
                    text += "}\n";
                    text += "#" + widgetID + " img {\n";
                    text += "    opacity: " + opacity + ";\n";
                    text += "    width: " + picWidth + "px;\n";
                    text += "    height: " + picHeight + "px;\n";
                    text += "    border: " + borderwidth + " " + borderstyle + " " + bordercolornormal + ";\n";
                    text += "    border-radius: " + borderradius + ";\n";
                    text += "}\n";
                    text += "#" + widgetID + " canvas {\n";
                    text += "    opacity: " + opacity + ";\n";
                    text += "    width: " + picWidth + "px;\n";
                    text += "    height: " + picHeight + "px;\n";
                    text += "    border: " + borderwidth + " " + borderstyle + " " + bordercolornormal + ";\n";
                    text += "    border-radius: " + borderradius + ";\n";
                    text += "}\n";
                    text += "#" + widgetID + " img:active {\n";
                    text += "    transform: scale(0.9, 0.9);\n";
                    text += "    opacity: 1;\n";
                    text += "    border: " + borderwidth + " " + borderstyle + " " + bordercoloractive + ";\n";
                    text += "    border-radius: " + borderradius + ";\n";
                    text += "}\n";
                    text += "#" + widgetID + " canvas:active {\n";
                    text += "    transform: scale(0.9, 0.9);\n";
                    text += "    opacity: 1;\n";
                    text += "    border: " + borderwidth + " " + borderstyle + " " + bordercoloractive + ";\n";
                    text += "    border-radius: " + borderradius + ";\n";
                    text += "}\n";
                    text += "#" + widgetID + ' input[type="radio"]:checked + label img {\n';
                    text += "    opacity: 1;\n";
                    text += "    border: " + borderwidth + " " + borderstyle + " " + bordercoloractive + ";\n";
                    text += "    border-radius: " + borderradius + ";\n";
                    text += "}\n";
                    text += "#" + widgetID + ' input[type="radio"]:checked + label canvas {\n';
                    text += "    opacity: 1;\n";
                    text += "    border: " + borderwidth + " " + borderstyle + " " + bordercoloractive + ";\n";
                    text += "    border-radius: " + borderradius + ";\n";
                    text += "}\n";
                    text += "</style>\n";

                    text += '<div id="' + widgetID + 'container" >';

                    for (let i = 0; i < viewindex.length; i++) {
                        text += "  <div >";
                        text += '    <input type="radio" id="' + widgetID + players[viewindex[i]] + '" name="' + widgetID + '" value="' + players[viewindex[i]] + '" ' + (viewindex[i] == data.defaultPlayer ? "checked" : "") + ">";
                        text += '    <label for="' + widgetID + players[viewindex[i]] + '">';
                        text += "      <span>";
                        const buttonsImage = (data["buttonsImage" + (parseInt(viewindex[i]) + 1)]) || "";
                        if (buttonsImage.trim() != "") {
                            text += '        <img src="' + data["buttonsImage" + (parseInt(viewindex[i]) + 1)] + '">';
                        }
                        text += "      </span>";
                        text += "    </label>";
                        if (vis.editMode && editmodehelper) {
                            text += '<div style="position: absolute;top: 0;right: 0;background-color: black;color: white;border-width: 1px;border-color: white;border-style: solid;font-size: xx-small;padding: 1px;margin:0px;">' + viewindex[i] + "</div>";
                        }
                        text += "  </div>";
                    }
                    text += "</div>";

                    $("#" + widgetID).html(text);

                    const spans = $("#" + widgetID + " span");
                    const font = new Font($("#" + widgetID));
                    const opt = {};
                    opt.wrapCamelCase = data.wrapcamelcase;
                    opt.style = window.getComputedStyle($("#" + widgetID)[0], null);
                    opt.backgroundcolor = data.buttonbkcolor;
                    for (let i = 0; i < viewindex.length; i++) {
                        const buttonsImage = (data["buttonsImage" + (parseInt(viewindex[i]) + 1)]) || "";
                        let buttonsText = (data["buttonsText" + (parseInt(viewindex[i]) + 1)]) || "";
                        buttonsText = (buttonsText.trim() != "") ? buttonsText : players[viewindex[i]];
                        if (buttonsImage.trim() == "") {
                            $(spans[i]).append(createTextImage(buttonsText, font, picWidth, picHeight, opt));
                        }
                    }
                }
                if (vis.editMode && redrawinspectwidgets) vis.binds["squeezeboxrpc"].redrawInspectWidgets(view);
                $("#" + widgetID).trigger("playerschanged");
            }.bind(this));
        },
        getViewindex: function (players) {
            return Object.keys(players);
        },
        checkViewindexExist: function (viewindex, players) {
            return viewindex.map(function (item) {
                return (item < players.length) ? item : 0;
            });
        },
        getPlayers: function (datapoints, ainstance) {
            const regex = new RegExp("^" + ainstance[0] + "\\." + ainstance[1] + "\\.Players", "gm");
            return Object.keys(datapoints).reduce(function (acc, cur) {
                if (regex.test(cur)) {
                    const key = cur.split(".")[3]; //getPlayers
                    if (acc.indexOf(key) === -1) acc.push(key);
                }
                return acc;
            }, []);
        },
    },
    buttonplay: {
        createWidget: function (widgetID, view, data, style) {
            const $div = $("#" + widgetID);
            if (!$div.length) {
                return setTimeout(function () {
                    vis.binds["squeezeboxrpc"].buttonplay.createWidget(widgetID, view, data, style);
                }, 100);
            }

            data = vis.views[view].widgets[widgetID].data;
            style = vis.views[view].widgets[widgetID].style;

            const ainstance = data.ainstance = vis.binds["squeezeboxrpc"].checkAttributes($div, data.widgetPlayer);
            if (!ainstance) return;

            const fdata = { self: this, widgetID: widgetID, view: view, data: data, style: style };

            vis.binds["squeezeboxrpc"].setPlayersChanged($div, data.widgetPlayer, fdata, this.onChange.bind(fdata), function () {
                const boundstates = [];
                const players = vis.binds["squeezeboxrpc"].getPlayerValues(data.widgetPlayer);
                for (let i = 0; i < players.length; i++) {
                    boundstates.push(ainstance[0] + "." + ainstance[1] + ".Players." + players[i] + ".state");
                }
                return boundstates;
            });
            vis.binds["squeezeboxrpc"].setChanged(data.widgetPlayer, fdata, this.setState.bind(fdata));

            let text = "";
            text += "<style> \n";
            text += "#" + widgetID + " div {\n";
            text += "   display: inline-block; \n";
            text += "   width:  100%; \n";

            text += "} \n";
            text += "#" + widgetID + ' input[type="submit"] { \n';
            text += "  display: none; \n";
            text += "} \n";
            text += "#" + widgetID + " img { \n";
            text += "  width:  100%; \n";

            text += "} \n";
            text += "#" + widgetID + " img:active { \n";
            text += "  transform: scale(0.9, 0.9); \n";
            text += "} \n";
            text += "#" + widgetID + " svg { \n";
            text += "  width:  100%; \n";
            text += "} \n";
            text += "#" + widgetID + " svg:active { \n";
            text += "  transform: scale(0.9, 0.9); \n";
            text += "  transform-origin: 50% 50%; \n";
            text += "} \n";
            text += "</style> \n";

            text += '<div class="btn"> \n';
            text += "  <div> \n";
            text += '    <input type="submit" id="' + widgetID + 'button" name="' + widgetID + '" value="" >';
            text += "    <span> \n";
            text += '      <img src=""> \n';
            text += "    </span> \n";
            text += "  </div> \n";
            text += "</div> \n";

            $("#" + widgetID).html(text);
            this.setState(fdata);
        },
        onClick: function (event) {
            const data = event.data.data;
            const widgetID = event.data.widgetID;
            const playername = vis.binds["squeezeboxrpc"].getPlayerName(data.widgetPlayer);
            const stateid = data.ainstance.join(".") + ".Players" + "." + playername + ".state";
            let state = $("input[name=" + widgetID + "]").val();
            state = (state == 1) ? 0 : 1;
            vis.setValue(stateid, state);
        },
        onChange: function () {
            this.self.setState(this);
        },
        setState: function (fdata) {
            const data = fdata.data;
            const widgetID = fdata.widgetID;
            const svg = vis.binds["squeezeboxrpc"].svg;
            const playername = vis.binds["squeezeboxrpc"].getPlayerName(data.widgetPlayer);
            const stateid = data.ainstance.join(".") + ".Players" + "." + playername + ".state";

            const state = (vis.states[stateid + ".val"] || vis.states[stateid + ".val"] === 0) ? parseInt(vis.states[stateid + ".val"]) : 2;
            const imagepause = data.imagepause || "";
            const imageplay = data.imageplay || "";
            const imagestop = data.imagepause || "";

            const svgfill = data.fillcolor || "#ffffff";
            const svgstroke = data.strokecolor || "#ffffff";
            const svgstrokeWidth = data.strokewidth || "0.3";

            let image = "";
            //0=pause
            //1=play
            //2=stop
            if (state == 0) image = imageplay || svg.play;
            if (state == 1) image = imagepause || svg.pause;
            if (state == 2) image = imagestop || svg.play;
            $("#" + widgetID + " input").val(state);
            $("#" + widgetID + " img").off("click.play", this.onClick);
            $("#" + widgetID + " svg").off("click.play", this.onClick);
            if (image.startsWith("<svg")) {
                $("#" + widgetID + " span").html(image);
                const $g = $("#" + widgetID + " svg > g");
                if ($g.length) {
                    $g.attr("fill", svgfill);
                    $g.attr("stroke", svgstroke);
                    $g.attr("stroke-width", svgstrokeWidth);
                }
            } else {
                $("#" + widgetID + " img").attr("src", image);
            }
            $("#" + widgetID + " img").on("click.play", fdata, this.onClick);
            $("#" + widgetID + " svg").on("click.play", fdata, this.onClick);

        },
    },
    buttonfwd: {
        createWidget: function (widgetID, view, data, style) {
            const $div = $("#" + widgetID);
            if (!$div.length) {
                return setTimeout(function () {
                    vis.binds["squeezeboxrpc"].buttonfwd.createWidget(widgetID, view, data, style);
                }, 100);
            }

            data = vis.views[view].widgets[widgetID].data;
            style = vis.views[view].widgets[widgetID].style;

            const ainstance = data.ainstance = vis.binds["squeezeboxrpc"].checkAttributes($div, data.widgetPlayer);
            if (!ainstance) return;

            const svgfill = data.fillcolor || "#ffffff";
            const svgstroke = data.strokecolor || "#ffffff";
            const svgstrokeWidth = data.strokewidth || "0.3";

            const svg = vis.binds["squeezeboxrpc"].svg;

            let text = "";
            text += "<style> \n";
            text += "#" + widgetID + " div {\n";
            text += "   display: inline-block; \n";
            text += "   width:  100%; \n";

            text += "} \n";
            text += "#" + widgetID + ' input[type="submit"] { \n';
            text += "  display: none; \n";
            text += "} \n";
            text += "#" + widgetID + " img { \n";
            text += "  width:  100%; \n";

            text += "} \n";
            text += "#" + widgetID + " img:active { \n";
            text += "  transform: scale(0.9, 0.9); \n";
            text += "} \n";
            text += "#" + widgetID + " svg { \n";
            text += "  width:  100%; \n";
            text += "} \n";
            text += "#" + widgetID + " svg:active { \n";
            text += "  transform: scale(0.9, 0.9); \n";
            text += "  transform-origin: 50% 50%; \n";
            text += "} \n";
            text += "</style> \n";
            text += '<div class="btn"> \n';
            text += "  <div> \n";
            text += '    <input type="submit" id="' + widgetID + 'button" name="' + widgetID + '" value="fwd" >';
            text += "    <span> \n";
            text += '      <img src="widgets/squeezeboxrpc/img/fwd.png"> \n';
            text += "    </span> \n";
            text += "  </div> \n";
            text += "</div> \n";

            $("#" + widgetID).html(text);

            const image = data.imagefwd || svg.fwd;

            if (image.startsWith("<svg")) {
                $("#" + widgetID + " span").html(image);
                const $g = $("#" + widgetID + " svg > g");
                if ($g.length) {
                    $g.attr("fill", svgfill);
                    $g.attr("stroke", svgstroke);
                    $g.attr("stroke-width", svgstrokeWidth);
                }
            } else {
                $("#" + widgetID + " img").attr("src", image);
            }

            //one onclick on span?
            $("#" + widgetID + " img").on("click", { self: this, widgetID: widgetID, view: view, data: data, style: style }, this.onClick);
            $("#" + widgetID + " svg").on("click", { self: this, widgetID: widgetID, view: view, data: data, style: style }, this.onClick);
        },
        onClick: function (event) {
            const data = event.data.data;
            const playername = vis.binds["squeezeboxrpc"].getPlayerName(data.widgetPlayer);
            const stateid = data.ainstance.join(".") + ".Players" + "." + playername + ".btnForward";
            const state = true;
            vis.setValue(stateid, state);
        },
    },
    buttonrew: {
        createWidget: function (widgetID, view, data, style) {
            const $div = $("#" + widgetID);
            if (!$div.length) {
                return setTimeout(function () {
                    vis.binds["squeezeboxrpc"].buttonrew.createWidget(widgetID, view, data, style);
                }, 100);
            }

            data = vis.views[view].widgets[widgetID].data;
            style = vis.views[view].widgets[widgetID].style;

            const ainstance = data.ainstance = vis.binds["squeezeboxrpc"].checkAttributes($div, data.widgetPlayer);
            if (!ainstance) return;

            const svgfill = data.fillcolor || "#ffffff";
            const svgstroke = data.strokecolor || "#ffffff";
            const svgstrokeWidth = data.strokewidth || "0.3";

            const svg = vis.binds["squeezeboxrpc"].svg;

            let text = "";
            text += "<style> \n";
            text += "#" + widgetID + " div {\n";
            text += "   display: inline-block; \n";
            text += "   width:  100%; \n";

            text += "} \n";
            text += "#" + widgetID + ' input[type="submit"] { \n';
            text += "  display: none; \n";
            text += "} \n";
            text += "#" + widgetID + " img { \n";
            text += "  width:  100%; \n";

            text += "} \n";
            text += "#" + widgetID + " img:active { \n";
            text += "  transform: scale(0.9, 0.9); \n";
            text += "} \n";
            text += "#" + widgetID + " svg { \n";
            text += "  width:  100%; \n";
            text += "} \n";
            text += "#" + widgetID + " svg:active { \n";
            text += "  transform: scale(0.9, 0.9); \n";
            text += "  transform-origin: 50% 50%; \n";
            text += "} \n";
            text += "</style> \n";
            text += '<div class="btn"> \n';
            text += "  <div> \n";
            text += '    <input type="submit" id="' + widgetID + 'button" name="' + widgetID + '" value="rew" >';
            text += "    <span> \n";
            text += '      <img src="widgets/squeezeboxrpc/img/rew.svg"> \n';
            text += "    </span> \n";
            text += "  </div> \n";
            text += "</div> \n";

            $("#" + widgetID).html(text);

            const image = data.imagerew || svg.rew;

            if (image.startsWith("<svg")) {
                $("#" + widgetID + " span").html(image);
                const $g = $("#" + widgetID + " svg > g");
                if ($g.length) {
                    $g.attr("fill", svgfill);
                    $g.attr("stroke", svgstroke);
                    $g.attr("stroke-width", svgstrokeWidth);
                }
            } else {
                $("#" + widgetID + " img").attr("src", image);
            }

            //one onclick on span?
            $("#" + widgetID + " img").on("click", { self: this, widgetID: widgetID, view: view, data: data, style: style }, this.onClick);
            $("#" + widgetID + " svg").on("click", { self: this, widgetID: widgetID, view: view, data: data, style: style }, this.onClick);
        },
        onClick: function (event) {
            const data = event.data.data;
            const playername = vis.binds["squeezeboxrpc"].getPlayerName(data.widgetPlayer);
            const stateid = data.ainstance.join(".") + ".Players" + "." + playername + ".btnRewind";
            const state = true;
            vis.setValue(stateid, state);
        },
    },
    buttonrepeat: {
        createWidget: function (widgetID, view, data, style) {
            const $div = $("#" + widgetID);
            if (!$div.length) {
                return setTimeout(function () {
                    vis.binds["squeezeboxrpc"].buttonrepeat.createWidget(widgetID, view, data, style);
                }, 100);
            }

            data = vis.views[view].widgets[widgetID].data;
            style = vis.views[view].widgets[widgetID].style;


            const ainstance = data.ainstance = vis.binds["squeezeboxrpc"].checkAttributes($div, data.widgetPlayer);
            if (!ainstance) return;

            const fdata = { self: this, widgetID: widgetID, view: view, data: data, style: style };

            vis.binds["squeezeboxrpc"].setPlayersChanged($div, data.widgetPlayer, fdata, this.onChange.bind(fdata), function () {
                const boundstates = [];
                const players = vis.binds["squeezeboxrpc"].getPlayerValues(data.widgetPlayer);
                for (let i = 0; i < players.length; i++) {
                    boundstates.push(ainstance[0] + "." + ainstance[1] + ".Players." + players[i] + ".PlaylistRepeat");
                }
                return boundstates;
            });
            vis.binds["squeezeboxrpc"].setChanged(data.widgetPlayer, fdata, this.setState.bind(fdata));

            let text = "";
            text += "<style> \n";
            text += "#" + widgetID + " div {\n";
            text += "   display: inline-block; \n";
            text += "   width:  100%; \n";

            text += "} \n";
            text += "#" + widgetID + ' input[type="submit"] { \n';
            text += "  display: none; \n";
            text += "} \n";
            text += "#" + widgetID + " img { \n";
            text += "  width:  100%; \n";

            text += "} \n";
            text += "#" + widgetID + " img:active { \n";
            text += "  transform: scale(0.9, 0.9); \n";
            text += "} \n";
            text += "#" + widgetID + " svg { \n";
            text += "  width:  100%; \n";
            text += "} \n";
            text += "#" + widgetID + " svg:active { \n";
            text += "  transform: scale(0.9, 0.9); \n";
            text += "  transform-origin: 50% 50%; \n";
            text += "} \n";
            text += "</style> \n";

            text += '<div class="btn"> \n';
            text += "  <div> \n";
            text += '    <input type="submit" id="' + widgetID + 'button" name="' + widgetID + '" value="" >';
            text += "    <span> \n";
            text += '      <img src=""> \n';
            text += "    </span> \n";
            text += "  </div> \n";
            text += "</div> \n";

            $("#" + widgetID).html(text);
            this.setState({ self: this, widgetID: widgetID, view: view, data: data, style: style });
        },
        onClick: function (event) {
            const data = event.data.data;
            const widgetID = event.data.widgetID;
            const playername = vis.binds["squeezeboxrpc"].getPlayerName(data.widgetPlayer);
            const stateid = data.ainstance.join(".") + ".Players" + "." + playername + ".PlaylistRepeat";
            let state = $("input[name=" + widgetID + "]").val();
            state = (state > 1) ? 0 : parseInt(state) + 1;
            vis.setValue(stateid, state);
        },
        onChange: function () {
            this.self.setState(this);
        },
        setState: function (fdata) {
            const data = fdata.data;
            const widgetID = fdata.widgetID;
            const svg = vis.binds["squeezeboxrpc"].svg;
            const playername = vis.binds["squeezeboxrpc"].getPlayerName(data.widgetPlayer);
            const stateid = data.ainstance.join(".") + ".Players" + "." + playername + ".PlaylistRepeat";

            const state = (vis.states[stateid + ".val"] || vis.states[stateid + ".val"] === 0) ? parseInt(vis.states[stateid + ".val"]) : 0;
            const imagerepeat0 = data.imagerepeat0 || "";
            const imagerepeat1 = data.imagerepeat1 || "";
            const imagerepeat2 = data.imagerepeat2 || "";

            const svgfill = data.fillcolor || "#ffffff";
            const svgstroke = data.strokecolor || "#ffffff";
            const svgstrokeWidth = data.strokewidth || "0.3";

            let image = "";
            //0=pause
            //1=play
            //2=stop
            if (state == 0) image = imagerepeat0 || svg.repeat0;
            if (state == 1) image = imagerepeat1 || svg.repeat1;
            if (state == 2) image = imagerepeat2 || svg.repeat0;
            $("#" + widgetID + " input").val(state);
            $("#" + widgetID + " img").off("click.repeat", this.onClick);
            $("#" + widgetID + " svg").off("click.repeat", this.onClick);
            if (image.startsWith("<svg")) {
                $("#" + widgetID + " span").html(image);
                const $g = $("#" + widgetID + " svg > g");
                if ($g.length) {
                    $g.attr("fill", svgfill);
                    $g.attr("stroke", svgstroke);
                    $g.attr("stroke-width", svgstrokeWidth);
                    if (state === 0) {
                        $g.attr("opacity", ".5");
                    } else {
                        $g.attr("opacity", "1");
                    }
                }
            } else {
                $("#" + widgetID + " img").attr("src", image);
            }
            $("#" + widgetID + " img").on("click.repeat", fdata, this.onClick);
            $("#" + widgetID + " svg").on("click.repeat", fdata, this.onClick);
        },
    },
    buttonshuffle: {
        createWidget: function (widgetID, view, data, style) {
            const $div = $("#" + widgetID);
            if (!$div.length) {
                return setTimeout(function () {
                    vis.binds["squeezeboxrpc"].buttonshuffle.createWidget(widgetID, view, data, style);
                }, 100);
            }

            data = vis.views[view].widgets[widgetID].data;
            style = vis.views[view].widgets[widgetID].style;

            let text = "";

            const ainstance = data.ainstance = vis.binds["squeezeboxrpc"].checkAttributes($div, data.widgetPlayer);
            if (!ainstance) return;

            const fdata = { self: this, widgetID: widgetID, view: view, data: data, style: style };

            vis.binds["squeezeboxrpc"].setPlayersChanged($div, data.widgetPlayer, fdata, this.onChange.bind(fdata), function () {
                const boundstates = [];
                const players = vis.binds["squeezeboxrpc"].getPlayerValues(data.widgetPlayer);
                for (let i = 0; i < players.length; i++) {
                    boundstates.push(ainstance[0] + "." + ainstance[1] + ".Players." + players[i] + ".PlaylistShuffle");
                }
                return boundstates;
            });
            vis.binds["squeezeboxrpc"].setChanged(data.widgetPlayer, fdata, this.setState.bind(fdata));

            text += "<style> \n";
            text += "#" + widgetID + " div {\n";
            text += "   display: inline-block; \n";
            text += "   width:  100%; \n";

            text += "} \n";
            text += "#" + widgetID + ' input[type="submit"] { \n';
            text += "  display: none; \n";
            text += "} \n";
            text += "#" + widgetID + " img { \n";
            text += "  width:  100%; \n";

            text += "} \n";
            text += "#" + widgetID + " img:active { \n";
            text += "  transform: scale(0.9, 0.9); \n";
            text += "} \n";
            text += "#" + widgetID + " svg { \n";
            text += "  width:  100%; \n";
            text += "} \n";
            text += "#" + widgetID + " svg:active { \n";
            text += "  transform: scale(0.9, 0.9); \n";
            text += "  transform-origin: 50% 50%; \n";
            text += "} \n";
            text += "</style> \n";

            text += '<div class="btn"> \n';
            text += "  <div> \n";
            text += '    <input type="submit" id="' + widgetID + 'button" name="' + widgetID + '" value="" >';
            text += "    <span> \n";
            text += '      <img src=""> \n';
            text += "    </span> \n";
            text += "  </div> \n";
            text += "</div> \n";

            $("#" + widgetID).html(text);
            this.setState({ self: this, widgetID: widgetID, view: view, data: data, style: style });
        },
        onClick: function (event) {
            const data = event.data.data;
            const widgetID = event.data.widgetID;
            const playername = vis.binds["squeezeboxrpc"].getPlayerName(data.widgetPlayer);
            const stateid = data.ainstance.join(".") + ".Players" + "." + playername + ".PlaylistShuffle";
            let state = $("input[name=" + widgetID + "]").val();
            state = (state > 1) ? 0 : parseInt(state) + 1;
            vis.setValue(stateid, state);
        },
        onChange: function () {
            this.self.setState(this);
        },
        setState: function (fdata) {
            const data = fdata.data;
            const widgetID = fdata.widgetID;
            const svg = vis.binds["squeezeboxrpc"].svg;
            const playername = vis.binds["squeezeboxrpc"].getPlayerName(data.widgetPlayer);
            const stateid = data.ainstance.join(".") + ".Players" + "." + playername + ".PlaylistShuffle";

            const state = (vis.states[stateid + ".val"] || vis.states[stateid + ".val"] === 0) ? parseInt(vis.states[stateid + ".val"]) : 0;
            const imageshuffle0 = data.imageshuffle0 || "";
            const imageshuffle1 = data.imageshuffle1 || "";
            const imageshuffle2 = data.imageshuffle2 || "";

            const svgfill = data.fillcolor || "#ffffff";
            const svgstroke = data.strokecolor || "#ffffff";
            const svgstrokeWidth = data.strokewidth || "0.3";

            let image = "";
            //0=pause
            //1=play
            //2=stop
            if (state == 0) image = imageshuffle0 || svg.shuffle0;
            if (state == 1) image = imageshuffle1 || svg.shuffle0;
            if (state == 2) image = imageshuffle2 || svg.shuffle2;
            $("#" + widgetID + " input").val(state);
            $("#" + widgetID + " img").off("click.shuffle", this.onClick);
            $("#" + widgetID + " svg").off("click.shuffle", this.onClick);
            if (image.startsWith("<svg")) {
                $("#" + widgetID + " span").html(image);
                const $g = $("#" + widgetID + " svg > g");
                if ($g.length) {
                    $g.attr("fill", svgfill);
                    $g.attr("stroke", svgstroke);
                    $g.attr("stroke-width", svgstrokeWidth);
                    if (state === 0) {
                        $g.attr("opacity", ".5");
                    } else {
                        $g.attr("opacity", "1");
                    }
                }
            } else {
                $("#" + widgetID + " img").attr("src", image);
            }
            $("#" + widgetID + " img").on("click.shuffle", fdata, this.onClick);
            $("#" + widgetID + " svg").on("click.shuffle", fdata, this.onClick);

        },
    },
    volumebar: {
        createWidget: function (widgetID, view, data, style) {
            const $div = $("#" + widgetID);
            if (!$div.length) {
                return setTimeout(function () {
                    vis.binds["squeezeboxrpc"].volumebar.createWidget(widgetID, view, data, style);
                }, 100);
            }

            data = vis.views[view].widgets[widgetID].data;
            style = vis.views[view].widgets[widgetID].style;

            const ainstance = data.ainstance = vis.binds["squeezeboxrpc"].checkAttributes($div, data.widgetPlayer);
            if (!ainstance) return;

            const fdata = { self: this, widgetID: widgetID, view: view, data: data, style: style, ainstance: ainstance };
            //if ($('#' + data.widgetPlayer).length>0) this.playersChanged({data:fdata});

            vis.binds["squeezeboxrpc"].setPlayersChanged($div, data.widgetPlayer, fdata, this.onChange.bind(fdata), function () {
                const boundstates = [];
                const players = vis.binds["squeezeboxrpc"].getPlayerValues(data.widgetPlayer);
                for (let i = 0; i < players.length; i++) {
                    boundstates.push(ainstance[0] + "." + ainstance[1] + ".Players." + players[i] + ".Volume");
                }
                return boundstates;
            });
            vis.binds["squeezeboxrpc"].setChanged(data.widgetPlayer, fdata, this.setState.bind(fdata));

            const calctype = data.calctype || "segstep";
            const segments = data.segments || 11;
            const position = data.position || "vertical";
            let segheight, segwidth;
            if (position == "vertical") {
                segheight = data.segheight || "100%";
                segwidth = data.segwidth || "100%";
            } else {
                segheight = data.segheight || "100%";
                segwidth = data.segwidth || "20px";
            }
            const borderwidth = data.borderwidth || "1px";
            const bordercolornormal = data.bordercolornormal || "#909090";
            const bordercoloractive = data.bordercoloractive || "#87ceeb";
            const fillcolornormal = data.fillcolornormal || "#005000";
            const fillcoloractive = data.fillcoloractive || "#00ff00";
            const reverse = data.reverse || false;
            const margin = data.margin || "1px";


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

            let text = "";
            text += "<style> \n";
            text += "    #" + widgetID + " .volume { \n";
            text += "        box-sizing: border-box; \n";
            text += "        display: inline-block; \n";
            text += "        font-size:0px; \n";
            text += "        width: 100%; \n";
            text += "        height: 100%; \n";
            text += "        overflow: visible; \n";
            if (position == "horizontal") {
                text += "        white-space: nowrap; \n";
            }
            text += "    } \n";
            text += "    #" + widgetID + " .level { \n";
            text += "        box-sizing: border-box; \n";
            text += "        display: inline-block; \n";
            text += "        outline: " + borderwidth + " solid " + bordercolornormal + "; \n";
            if (position == "horizontal") {
                text += "        height: calc(100% - ( 2 * " + margin + " )); \n";
                text += "        width: calc((100% / " + segments + ") - ( 2 * " + margin + " )); \n";
            }
            if (position == "vertical") {
                text += "        height: calc((100% / " + segments + ") - ( 2 * " + margin + " )); \n";
                text += "        width: calc(100% - ( 2 * " + margin + " )); \n";
            }
            text += "        background-color: " + fillcolornormal + "; \n";
            text += "        margin: " + margin + ";         \n";
            text += "    } \n";
            text += "    #" + widgetID + " .active { \n";
            text += "        border-color: " + bordercoloractive + "; \n";
            text += "        background-color: " + fillcoloractive + "; \n";
            text += "    } \n";
            text += "</style> \n";

            text += '<div class="volume"> \n';
            for (let i = 0; i < segments; i++) {
                text += '    <div class="level" value="' + i + '"></div> \n';
            }
            text += "</div> \n";
            $("#" + widgetID).html(text);
            $("#" + widgetID + " div.volume").on("click.volume", fdata, this.onClick);
            if (vis.editMode) this.setState(fdata);
            if (vis.editMode) vis.inspectWidgets(view, view);
        },
        onClick: function (event) {
            const offset = $(this).offset();
            const x = event.pageX - offset.left;
            const y = event.pageY - offset.top;

            const data = event.data.data;
            const playername = vis.binds["squeezeboxrpc"].getPlayerName(data.widgetPlayer);
            const stateid = data.ainstance.join(".") + ".Players" + "." + playername + ".Volume";

            let pos;
            let high;
            let segstep;
            let state;
            (data.position == "horizontal") ? pos = x : pos = y;
            (data.position == "horizontal") ? high = this.scrollWidth : high = this.scrollHeight;
            if (data.reverse) pos = high - pos;

            if (data.calctype == "exact") {
                segstep = high / data.segments;
                pos = (pos - segstep < 0) ? 0 : pos - segstep;
                state = (pos * 100) / (high - segstep);
            }
            if (data.calctype == "segstep") {
                const level = Math.floor(pos / (high / data.segments));
                state = Math.floor(100 / (data.segments - 1) * level);
            }

            vis.setValue(stateid, state);
        },
        onChange: function () {
            this.self.setState(this);
        },
        setState: function (fdata) {

            const data = fdata.data;
            const widgetID = fdata.widgetID;
            const reverse = data.reverse;
            let level;
            const playername = vis.binds["squeezeboxrpc"].getPlayerName(data.widgetPlayer);
            const stateid = data.ainstance.join(".") + ".Players" + "." + playername + ".Volume";
            let state = (vis.states[stateid + ".val"] || vis.states[stateid + ".val"] === 0) ? vis.states[stateid + ".val"] : 0;
            if (vis.editMode) state = 50;

            if (data.calctype == "exact") {
                level = Math.ceil(state / (100 / (data.segments - 1))) + 1;
            }
            if (data.calctype == "segstep") {
                level = Math.round(state / (100 / (data.segments - 1))) + 1;
            }
            const selector = (reverse) ? "#" + widgetID + " div.volume > div.level:nth-last-child(-n+" + level + ")" : "#" + widgetID + " div.volume > div.level:nth-child(-n+" + level + ")";
            $("#" + widgetID + " div.volume > div.level").removeClass("active");
            $(selector).addClass("active");

        },
    },

    syncgroup: {
        createWidget: function (widgetID, view, data, style) {

            const $div = $("#" + widgetID);
            // if nothing found => wait
            if (!$div.length) {
                return setTimeout(function () {
                    vis.binds["squeezeboxrpc"].syncgroup.createWidget(widgetID, view, data, style);
                }, 100);
            }

            data = vis.views[view].widgets[widgetID].data;
            style = vis.views[view].widgets[widgetID].style;

            const ainstance = data.ainstance = vis.binds["squeezeboxrpc"].checkAttributes($div, data.widgetPlayer);
            if (!ainstance) return;

            const fdata = { self: this, widgetID: widgetID, view: view, data: data, style: style };

            vis.binds["squeezeboxrpc"].setPlayersChanged($div, data.widgetPlayer, fdata, this.onChange.bind(fdata), function (fdata) {
                const widgetID = fdata.widgetID;
                const view = fdata.view;
                const data = fdata.data;
                const style = fdata.style;
                const boundstates = [];
                const players = vis.binds["squeezeboxrpc"].getPlayerValues(data.widgetPlayer);
                for (let i = 0; i < players.length; i++) {
                    boundstates.push(ainstance[0] + "." + ainstance[1] + ".Players." + players[i] + ".PlayerID");
                    boundstates.push(ainstance[0] + "." + ainstance[1] + ".Players." + players[i] + ".SyncMaster");
                    boundstates.push(ainstance[0] + "." + ainstance[1] + ".Players." + players[i] + ".SyncSlaves");
                }
                setTimeout(function () {
                    vis.binds["squeezeboxrpc"].syncgroup.createWidget(widgetID, view, data, style);
                }, 100);
                return boundstates;
            });
            vis.binds["squeezeboxrpc"].setChanged(data.widgetPlayer, fdata, this.setState.bind(fdata));

            if (vis.binds["squeezeboxrpc"].getPlayerWidgetType(view, data.widgetPlayer) == "formatselect") {
                $div.html("Only Player formattype button is supported");
                return false;
            }

            const players = vis.binds["squeezeboxrpc"].getPlayerValues(data.widgetPlayer);

            const dataplayer = vis.views[view].widgets[data.widgetPlayer].data;

            const picWidth = dataplayer.picWidth;
            const picHeight = dataplayer.picHeight;
            const borderwidth = data.borderwidth;
            const borderstyle = data.borderstyle;
            const bordercolornogroup = data.bordercolornogroup;
            const bordercolorowngroup = data.bordercolorowngroup;
            const bordercolorothergroup = data.bordercolorothergroup;
            const borderradius = data.borderradius;
            const buttonmargin = data.buttonmargin || "0px";

            let text = "";
            text += "<style>\n";
            text += "#" + widgetID + " div {\n";
            text += "     display: inline-block; \n";
            text += "}\n";
            text += "#" + widgetID + " div div {\n";
            text += "     position: relative; \n";
            text += "     margin: 0px " + buttonmargin + " " + buttonmargin + " 0px; \n";
            text += "}\n";
            text += "#" + widgetID + ' input[type="checkbox"] {\n';
            text += "    display: none;\n";
            text += "}\n";
            text += "#" + widgetID + " canvas {\n";
            text += "    opacity: 1;\n";
            text += "    width: " + picWidth + "px;\n";
            text += "    height: " + picHeight + "px;\n";
            text += "    border: " + borderwidth + " " + borderstyle + " " + bordercolornogroup + ";\n";
            text += "    border-radius: " + borderradius + ";\n";
            text += "}\n";
            text += "#" + widgetID + " canvas:active {\n";
            text += "    transform: scale(0.9, 0.9);\n";
            text += "    opacity: 1;\n";
            text += "    border: " + borderwidth + " " + borderstyle + " " + bordercolorowngroup + ";\n";
            text += "    border-radius: " + borderradius + ";\n";
            text += "}\n";
            text += "#" + widgetID + ' input[type="checkbox"]:checked + label img {\n';
            text += "    opacity: 1;\n";
            text += "    border: " + borderwidth + " " + borderstyle + " " + bordercolorowngroup + ";\n";
            text += "    border-radius: " + borderradius + ";\n";
            text += "}\n";
            text += "#" + widgetID + ' input[type="checkbox"]:checked + label canvas {\n';
            text += "    opacity: 1;\n";
            text += "    border: " + borderwidth + " " + borderstyle + " " + bordercolorowngroup + ";\n";
            text += "    border-radius: " + borderradius + ";\n";
            text += "}\n";
            text += "#" + widgetID + ' input[type="checkbox"][othergroup="true"] + label img {\n';
            text += "    opacity: 1;\n";
            text += "    border: " + borderwidth + " " + borderstyle + " " + bordercolorothergroup + ";\n";
            text += "    border-radius: " + borderradius + ";\n";
            text += "}\n";
            text += "#" + widgetID + ' input[type="checkbox"][othergroup="true"] + label canvas {\n';
            text += "    opacity: 1;\n";
            text += "    border: " + borderwidth + " " + borderstyle + " " + bordercolorothergroup + ";\n";
            text += "    border-radius: " + borderradius + ";\n";
            text += "}\n";
            text += "</style>\n";

            text += '<div id="' + widgetID + 'container" >';
            let valid = false;
            for (let i = 0; i < players.length; i++) {
                const stateid = data.ainstance.join(".") + ".Players" + "." + players[i] + ".PlayerID";
                const playerid = (vis.states[stateid + ".val"] || vis.states[stateid + ".val"] === 0) ? vis.states[stateid + ".val"] : "";
                valid = valid || playerid;
                text += "  <div>";
                text += '    <input type="checkbox" id="' + widgetID + players[i] + '" name="' + widgetID + '" playername="' + players[i] + '" value="' + playerid + '" disabled>';
                text += '    <label for="' + widgetID + players[i] + '">';
                text += "      <span>";
                text += "      <canvas></canvas>";
                text += "      </span>";
                text += "    </label>";
                text += "  </div>";
            }
            if (!valid) return setTimeout(function () {
                vis.binds["squeezeboxrpc"].syncgroup.createWidget(widgetID, view, data, style);
            }, 100);
            text += "</div>";
            $("#" + widgetID).html(text);

            for (let i = 0; i < players.length; i++) {
                const elemp = $("#" + data.widgetPlayer + ' input[value="' + players[i] + '"]  + label span :first-child');
                const elems = $("#" + widgetID + players[i] + " + label span canvas");
                elems[0].height = elemp.height();
                elems[0].width = elemp.width();

                const destCtx = elems[0].getContext("2d");
                destCtx.drawImage(elemp[0], 0, 0, elemp.width(), elemp.height());
            }

            const syncgroupbtns = $("input[name=" + widgetID + "]");
            syncgroupbtns.off("change.syncgroup").on("change.syncgroup", fdata, function (event) {
                const fdata = event.data;
                const data = fdata.data;
                const self = fdata.self;
                const syncplayer = this.value;
                const playername = vis.binds["squeezeboxrpc"].getPlayerName(data.widgetPlayer);
                const syncplayername = $(this).attr("playername");
                let stateid;
                if (syncplayer) {
                    if (!$(this).prop("checked")) {
                        stateid = ainstance[0] + "." + ainstance[1] + ".Players" + "." + syncplayername + ".cmdGeneral";
                        vis.setValue(stateid, '"sync","-"');
                    } else {
                        stateid = ainstance[0] + "." + ainstance[1] + ".Players" + "." + playername + ".cmdGeneral";
                        vis.setValue(stateid, '"sync","' + syncplayer + '"');
                    }
                }
                self.setState(fdata);
            });
        },
        onChange: function (e, newVal, oldVal) {
            console.log(e.type + ": " + newVal + ", " + oldVal);
            this.self.setState(this);
        },
        setState: function (fdata) {

            const data = fdata.data;
            const widgetID = fdata.widgetID;

            const players = vis.binds["squeezeboxrpc"].getPlayerValues(data.widgetPlayer);
            const syncgroups = [];
            for (let ip = 0; ip < players.length; ip++) {
                const playername = players[ip];
                const stateid1 = data.ainstance.join(".") + ".Players" + "." + playername + ".SyncMaster";
                const stateid2 = data.ainstance.join(".") + ".Players" + "." + playername + ".SyncSlaves";
                const state1 = (vis.states[stateid1 + ".val"] || vis.states[stateid1 + ".val"] === 0) ? vis.states[stateid1 + ".val"] : "";
                const state2 = (vis.states[stateid2 + ".val"] || vis.states[stateid2 + ".val"] === 0) ? vis.states[stateid2 + ".val"] : "";
                let state = state1.split(",").concat(state2.split(","));
                state = state.filter(item => item != "");
                if (Array.isArray(state)) {
                    if (!syncgroups.reduce(function (acc, val) {
                        return state[0] == "" || state.length == 0 || acc || val.includes(state[0]);
                    }, false)) syncgroups.push(state);
                }
            }
            const playername = vis.binds["squeezeboxrpc"].getPlayerName(data.widgetPlayer);
            const stateid1 = data.ainstance.join(".") + ".Players" + "." + playername + ".SyncMaster";
            const stateid2 = data.ainstance.join(".") + ".Players" + "." + playername + ".SyncSlaves";
            const stateid3 = data.ainstance.join(".") + ".Players" + "." + playername + ".PlayerID";
            const state1 = (vis.states[stateid1 + ".val"] || vis.states[stateid1 + ".val"] === 0) ? vis.states[stateid1 + ".val"] : "";
            const state2 = (vis.states[stateid2 + ".val"] || vis.states[stateid2 + ".val"] === 0) ? vis.states[stateid2 + ".val"] : "";
            const state3 = (vis.states[stateid3 + ".val"] || vis.states[stateid3 + ".val"] === 0) ? vis.states[stateid3 + ".val"] : "";
            let owngroup = null;
            for (let i = 0; i < syncgroups.length; i++) {
                if (syncgroups[i].includes(state3)) {
                    owngroup = i;
                    break;
                }
            }
            let state = state1.split(",").concat(state2.split(","));
            state = state.filter(item => item != "");
            for (let ip = 0; ip < players.length; ip++) {
                const playerbutton = players[ip];
                const playerstateid = data.ainstance.join(".") + ".Players" + "." + playerbutton + ".PlayerID";
                const playerid = (vis.states[playerstateid + ".val"] || vis.states[playerstateid + ".val"] === 0) ? vis.states[playerstateid + ".val"] : "";
                let playergroup = null;
                for (let is = 0; is < syncgroups.length; is++) {
                    if (syncgroups[is].includes(playerid)) {
                        playergroup = is;
                        break;
                    }
                }

                const $btn = $("input[id=" + widgetID + playerbutton + "]");
                if (state.includes(playerid) && playerid !== state3) {
                    $btn.prop("checked", true);
                } else {
                    $btn.prop("checked", false);
                }
                if (playerid == state3) {
                    $btn.prop("disabled", true);
                } else {
                    $btn.prop("disabled", false);
                }
                if (playergroup != null && playergroup != owngroup) {
                    $btn.attr("othergroup", true);
                } else {
                    $btn.attr("othergroup", false);
                }
            }
        },
    },
    playtime: {
        createWidget: function (widgetID, view, data, style) {
            const $div = $("#" + widgetID);
            if (!$div.length) {
                return setTimeout(function () {
                    vis.binds["squeezeboxrpc"].playtime.createWidget(widgetID, view, data, style);
                }, 100);
            }

            data = vis.views[view].widgets[widgetID].data;
            style = vis.views[view].widgets[widgetID].style;

            const ainstance = data.ainstance = vis.binds["squeezeboxrpc"].checkAttributes($div, data.widgetPlayer);
            if (!ainstance) return;

            const fdata = { self: this, widgetID: widgetID, view: view, data: data, style: style };

            vis.binds["squeezeboxrpc"].setPlayersChanged($div, data.widgetPlayer, fdata, this.onChange.bind(fdata), function () {
                const boundstates = [];
                const players = vis.binds["squeezeboxrpc"].getPlayerValues(data.widgetPlayer);
                for (let i = 0; i < players.length; i++) {
                    boundstates.push(ainstance[0] + "." + ainstance[1] + ".Players." + players[i] + ".Duration");
                    boundstates.push(ainstance[0] + "." + ainstance[1] + ".Players." + players[i] + ".Time");
                    boundstates.push(ainstance[0] + "." + ainstance[1] + ".Players." + players[i] + ".state");
                    boundstates.push(ainstance[0] + "." + ainstance[1] + ".Players." + players[i] + ".cmdGoTime");
                }
                return boundstates;
            });
            vis.binds["squeezeboxrpc"].setChanged(data.widgetPlayer, fdata, this.setState.bind(fdata));

            const mainbarcolor = data.mainbarcolor;
            const playtimebarcolor = data.playtimebarcolor;
            const borderwidth = data.borderwidth;
            const borderstyle = data.borderstyle;
            const bordercolor = data.bordercolor;
            const borderradius = data.borderradius;

            let text = "";
            text += "<style> \n";
            text += "#" + widgetID + " .playtimemain {\n";
            text += "    width: 100%;\n";
            text += "    height: 100%;\n";
            text += "    background-color: " + mainbarcolor + ";\n";
            text += "    border: " + bordercolor + " " + borderwidth + " " + borderstyle + ";\n";
            text += "    border-radius: " + borderradius + ";\n";
            text += "    overflow: hidden;\n";
            text += "}";

            text += "#" + widgetID + " .playtimebar {\n";
            text += "  height: 100%;\n";
            text += "  background-color: " + playtimebarcolor + ";\n";
            text += "}\n";
            text += "</style> \n";

            text += '<div class="playtimemain">\n';
            text += '    <div class="playtimebar"></div>\n';
            text += "</div>\n";

            $("#" + widgetID).html(text);
            $("#" + widgetID + " div.playtimemain").on("click.playtime", fdata, this.onClick);

            this.setState(fdata);
        },
        onClick: function (event) {
            const data = event.data.data;
            const playername = vis.binds["squeezeboxrpc"].getPlayerName(data.widgetPlayer);
            const stateid_duration = data.ainstance.join(".") + ".Players" + "." + playername + ".Duration";
            const stateid_gotime = data.ainstance.join(".") + ".Players" + "." + playername + ".cmdGoTime";

            const state_duration = (vis.states[stateid_duration + ".val"] || vis.states[stateid_duration + ".val"] === 0) ? parseInt(vis.states[stateid_duration + ".val"]) : 0;
            const clickx = event.offsetX;
            const width = $(this).width();

            const time = clickx / width * state_duration;
            if (time > state_duration) return;
            vis.setValue(stateid_gotime, time.toString());
        },
        onChange: function () {
            this.self.setState(this);
        },
        setState: function (fdata) {
            const data = fdata.data;
            const widgetID = fdata.widgetID;
            const playername = vis.binds["squeezeboxrpc"].getPlayerName(data.widgetPlayer);
            const stateid_duration = data.ainstance.join(".") + ".Players" + "." + playername + ".Duration";
            const stateid_state = data.ainstance.join(".") + ".Players" + "." + playername + ".state";

            const state_duration = (vis.states[stateid_duration + ".val"] || vis.states[stateid_duration + ".val"] === 0) ? parseInt(vis.states[stateid_duration + ".val"]) : 0;
            const state_state = (vis.states[stateid_state + ".val"] || vis.states[stateid_state + ".val"] === 0) ? parseInt(vis.states[stateid_state + ".val"]) : 0;
            let width = state_duration == 0 ? 0 : width;
            if (state_state == 2) width = 0; //0 if player stop
            if (vis.editMode) width = 50;
            $("#" + widgetID + " div.playtimebar").width(width + "%");
        },
    },
    string: {
        createWidget: function (widgetID, view, data, style) {
            const $div = $("#" + widgetID);
            if (!$div.length) {
                return setTimeout(function () {
                    vis.binds["squeezeboxrpc"].string.createWidget(widgetID, view, data, style);
                }, 100);
            }

            data = vis.views[view].widgets[widgetID].data;
            style = vis.views[view].widgets[widgetID].style;

            const ainstance = data.ainstance = vis.binds["squeezeboxrpc"].checkAttributes($div, data.widgetPlayer);
            if (!ainstance) return;

            const fdata = { self: this, widgetID: widgetID, view: view, data: data, style: style };

            vis.binds["squeezeboxrpc"].setPlayersChanged($div, data.widgetPlayer, fdata, this.onChange.bind(fdata), function () {
                const boundstates = [];
                const players = vis.binds["squeezeboxrpc"].getPlayerValues(data.widgetPlayer);
                for (let i = 0; i < players.length; i++) {
                    boundstates.push(ainstance[0] + "." + ainstance[1] + ".Players." + players[i] + "." + data.playerattribute);
                }
                return boundstates;
            });
            vis.binds["squeezeboxrpc"].setChanged(data.widgetPlayer, fdata, this.setState.bind(fdata));

            this.setState(fdata);
        },
        onChange: function () {
            this.self.setState(this);
        },
        setState: function (fdata) {
            const data = fdata.data;
            const widgetID = fdata.widgetID;
            const playername = vis.binds["squeezeboxrpc"].getPlayerName(data.widgetPlayer);
            if (!playername) return setTimeout(function () {
                vis.binds["squeezeboxrpc"].string.setState(fdata);
            }, 100);
            const stateid = data.ainstance.join(".") + ".Players" + "." + playername + "." + data.playerattribute;

            const state = (vis.states[stateid + ".val"]) ? vis.states[stateid + ".val"] : "";
            //if (vis.editMode) state = data.test_html || "";
            const html_prepend = data.html_prepend || "";
            const html_append = data.html_append || "";
            $("#" + widgetID).html(html_prepend + state + html_append);
        },
    },
    number: {
        createWidget: function (widgetID, view, data, style) {
            const $div = $("#" + widgetID);
            if (!$div.length) {
                return setTimeout(function () {
                    vis.binds["squeezeboxrpc"].number.createWidget(widgetID, view, data, style);
                }, 100);
            }

            data = vis.views[view].widgets[widgetID].data;
            style = vis.views[view].widgets[widgetID].style;

            const ainstance = data.ainstance = vis.binds["squeezeboxrpc"].checkAttributes($div, data.widgetPlayer);
            if (!ainstance) return;

            const fdata = { self: this, widgetID: widgetID, view: view, data: data, style: style };

            vis.binds["squeezeboxrpc"].setPlayersChanged($div, data.widgetPlayer, fdata, this.onChange.bind(fdata), function () {
                const boundstates = [];
                const players = vis.binds["squeezeboxrpc"].getPlayerValues(data.widgetPlayer);
                for (let i = 0; i < players.length; i++) {
                    boundstates.push(ainstance[0] + "." + ainstance[1] + ".Players." + players[i] + "." + data.playerattribute);
                }
                return boundstates;
            });
            vis.binds["squeezeboxrpc"].setChanged(data.widgetPlayer, fdata, this.setState.bind(fdata));

            this.setState(fdata);
        },
        onChange: function () {
            this.self.setState(this);
        },
        setState: function (fdata) {
            const data = fdata.data;
            const widgetID = fdata.widgetID;
            const playername = vis.binds["squeezeboxrpc"].getPlayerName(data.widgetPlayer);
            if (!playername) return setTimeout(function () {
                vis.binds["squeezeboxrpc"].number.setState(fdata);
            }, 100);
            const stateid = data.ainstance.join(".") + ".Players" + "." + playername + "." + data.playerattribute;

            let state = (vis.states[stateid + ".val"]) ? vis.states[stateid + ".val"] : "";
            // if (vis.editMode) state = data.test_html || "";
            state = parseFloat(state);
            if (state === undefined || state === null || isNaN(state)) state = 0;
            if (data.digits || data.digits !== "") state = state.toFixed(parseFloat(data.digits, 10));
            if (data.is_tdp && data.is_tdp !== "") {
                state = state.toString().split(".");
                state[0] = state[0].replace(/\d{1,3}(?=(\d{3})+(?!\d))/g, "$&,");
                state = state.join(".");
            }
            if (data.is_comma && data.is_comma !== "") state = state.split(".").map(e => e.replace(/,/g, ".")).join(",");

            const html_prepend = data.html_prepend || "";
            const html_append = data.html_append || "";
            $("#" + widgetID).html(html_prepend + state + html_append);
        },
    },
    datetime: {
        createWidget: function (widgetID, view, data, style) {
            const $div = $("#" + widgetID);
            if (!$div.length) {
                return setTimeout(function () {
                    vis.binds["squeezeboxrpc"].datetime.createWidget(widgetID, view, data, style);
                }, 100);
            }

            data = vis.views[view].widgets[widgetID].data;
            style = vis.views[view].widgets[widgetID].style;

            const ainstance = data.ainstance = vis.binds["squeezeboxrpc"].checkAttributes($div, data.widgetPlayer);
            if (!ainstance) return;

            const fdata = { self: this, widgetID: widgetID, view: view, data: data, style: style };

            vis.binds["squeezeboxrpc"].setPlayersChanged($div, data.widgetPlayer, fdata, this.onChange.bind(fdata), function () {
                const boundstates = [];
                const players = vis.binds["squeezeboxrpc"].getPlayerValues(data.widgetPlayer);
                for (let i = 0; i < players.length; i++) {
                    boundstates.push(ainstance[0] + "." + ainstance[1] + ".Players." + players[i] + "." + data.playerattribute);
                }
                return boundstates;
            });
            vis.binds["squeezeboxrpc"].setChanged(data.widgetPlayer, fdata, this.setState.bind(fdata));

            this.setState(fdata);
        },
        onChange: function () {
            this.self.setState(this);
        },
        setState: function (fdata) {
            const data = fdata.data;
            const widgetID = fdata.widgetID;
            const playername = vis.binds["squeezeboxrpc"].getPlayerName(data.widgetPlayer);
            if (!playername) return setTimeout(function () {
                vis.binds["squeezeboxrpc"].number.setState(fdata);
            }, 100);
            const stateid = data.ainstance.join(".") + ".Players" + "." + playername + "." + data.playerattribute;

            let state = (vis.states[stateid + ".val"]) ? vis.states[stateid + ".val"] : "";
            //if (vis.editMode) state = data.test_html || "";
            if (data.factor && data.factor !== "") state = state * data.factor;
            const offset = 1000 * 60 * new Date(0).getTimezoneOffset();
            state = new Date(offset + state);
            if (isNaN(state)) state = "";
            if (state instanceof Date) state = state.format(data.format);
            const html_prepend = data.html_prepend || "";
            const html_append = data.html_append || "";
            $("#" + widgetID).html(html_prepend + state + html_append);
        },
    },
    image: {
        createWidget: function (widgetID, view, data, style) {
            const $div = $("#" + widgetID);
            if (!$div.length) {
                return setTimeout(function () {
                    vis.binds["squeezeboxrpc"].image.createWidget(widgetID, view, data, style);
                }, 100);
            }

            data = vis.views[view].widgets[widgetID].data;
            style = vis.views[view].widgets[widgetID].style;

            const ainstance = data.ainstance = vis.binds["squeezeboxrpc"].checkAttributes($div, data.widgetPlayer);
            if (!ainstance) return;

            const fdata = { self: this, widgetID: widgetID, view: view, data: data, style: style };

            vis.binds["squeezeboxrpc"].setPlayersChanged($div, data.widgetPlayer, fdata, this.onChange.bind(fdata), function () {
                const boundstates = [];
                const players = vis.binds["squeezeboxrpc"].getPlayerValues(data.widgetPlayer);
                for (let i = 0; i < players.length; i++) {
                    boundstates.push(ainstance[0] + "." + ainstance[1] + ".Players." + players[i] + "." + data.playerattribute);
                }
                return boundstates;
            });
            vis.binds["squeezeboxrpc"].setChanged(data.widgetPlayer, fdata, this.setState.bind(fdata));
            let imgstyle = "width:100%;";
            if (data.stretch) imgstyle += "height:100%;";
            let text = "";
            text += data.html_prepend || "";
            text += '<img style="' + imgstyle + '"></img> \n';
            text += data.html_append || "";
            $("#" + widgetID).html(text);
            this.setState(fdata);

        },
        onChange: function () {
            this.self.setState(this);
        },
        setState: function (fdata) {
            const data = fdata.data;
            const widgetID = fdata.widgetID;
            const playername = vis.binds["squeezeboxrpc"].getPlayerName(data.widgetPlayer);
            const stateid = data.ainstance.join(".") + ".Players" + "." + playername + "." + data.playerattribute;

            let state = (vis.states[stateid + ".val"]) ? vis.states[stateid + ".val"] : "";
            if (vis.editMode) state = data.test_html || "";

            $("#" + widgetID + " img").attr("src", state);
        },
    },
    redrawInspectWidgets: function (view) {
        let $edit, id, start, end, sel;
        if (window.Selection) {
            if (window.getSelection()) sel = window.getSelection();
            if (sel.anchorNode) {
                $edit = $(sel.anchorNode).find("input, textarea").first();
                id = $edit.attr("id");
                start = $edit.prop("selectionStart");
                end = $edit.prop("selectionEnd");
            }
        }
        vis.inspectWidgets(view, view);
        $edit = $("#" + id);
        if ($edit) {
            $edit.focus();
            $edit.prop({
                "selectionStart": start,
                "selectionEnd": end
            });
        }

    },
    checkViewIndex: function (widgetID, view, viewindex) {
        let $edit;
        const data = vis.views[view].widgets[widgetID].data;
        const viewindexcheck = data.viewindexcheck;

        if (!viewindex || viewindex.trim() == "") {
            viewindex = vis.binds["squeezeboxrpc"][data.functionname].getViewindex(viewindexcheck).join(", ");
        }

        viewindex = viewindex.split(",").map(function (item) {
            return item.trim();
        });

        viewindex = vis.binds["squeezeboxrpc"][data.functionname].checkViewindexExist(viewindex, viewindexcheck);

        if (viewindex.length > viewindexcheck.length) viewindex = viewindex.slice(0, viewindexcheck.length);
        data.viewindex = viewindex.join(", ");
        $edit = $("#inspect_viewindex");
        let start = $edit.prop("selectionStart");
        let end = $edit.prop("selectionEnd");
        if (start > data.viewindex.length) start = data.viewindex.length;
        if (end > data.viewindex.length) end = data.viewindex.length;
        $edit.val(data.viewindex);
        $edit = $("#inspect_viewindex");
        if ($edit) {
            $edit.focus();
            $edit.prop({
                "selectionStart": start,
                "selectionEnd": end
            });
        }
        return false;

    },
    getPlayerWidgetType: function (view, playerWidgetID) {
        return vis.views[view].widgets[playerWidgetID].data.formattype || "";
    },
    checkAttributes: function ($div, widgetPlayer) {
        if (!widgetPlayer) {
            $div.html("Please select a player widget");
            return false;
        }
        if (!vis.widgets[widgetPlayer].data.ainstance) {
            $div.html("Please select an instance at the playerwidget");
            return false;
        }
        const ainstance = vis.widgets[widgetPlayer].data.ainstance.split(".");
        if (!ainstance || ainstance[0] != "squeezeboxrpc") {
            $div.html("Please select an instance at the playerwidget");
            return false;
        }
        return ainstance;
    },
    setChanged: function (widgetPlayer, fdata) {
        $(".vis-view").off("change." + fdata.widgetID).on("change." + fdata.widgetID, "#" + widgetPlayer, fdata, function () {
            const self = fdata.self;
            self.setState(fdata);
        });
    },
    setPlayersChanged: function ($div, widgetPlayer, fdata, onChange_callback, boundstates_callback) {

        $(".vis-view").off("playerschanged." + fdata.widgetID).on("playerschanged." + fdata.widgetID, "#" + widgetPlayer, fdata, function (event) {
            const fdata = event.data;
            const boundstates = boundstates_callback.apply(this, [fdata]);
            if (boundstates) vis.binds["squeezeboxrpc"].bindStates($div, boundstates, onChange_callback, fdata);
        }.bind(this));
    },
    bindStates: function (elem, bound, change_callback, fdata) {
        const $div = $(elem);
        const boundstates = $div.data("bound");
        if (boundstates) {
            for (let i = 0; i < boundstates.length; i++) {
                vis.states.unbind(boundstates[i], change_callback);
            }
        }
        $div.data("bound", null);
        $div.data("bindHandler", null);

        vis.conn.gettingStates = 0;
        vis.conn.getStates(bound, function (error, states) {
            vis.updateStates(states);
            vis.conn.subscribe(bound);
            for (let i = 0; i < bound.length; i++) {
                bound[i] = bound[i] + ".val";
                vis.states.bind(bound[i], change_callback);
            }
            $div.data("bound", bound);
            $div.data("bindHandler", change_callback);
        }.bind({ fdata, change_callback }));
    },
    attrSelect: function (wid_attr, options) {
        if (wid_attr === "widgetPlayer") options = this.findPlayerWidgets();
        if (wid_attr === "widgetFavorites") options = this.findFavoritesWidgets();
        let html = "";
        for (let i = 0; i < options.length; i++) {
            html += '<option value="' + options[i] + '">' + options[i] + "</option>";
        }
        const line = {
            input: '<select type="text" id="inspect_' + wid_attr + '">' + html + "</select>"
        };
        return line;
    },
    playerAttrSelect: function (wid_attr) {
        let html = "";
        const playerattributes = vis.binds["squeezeboxrpc"].playerattributes.sort();
        for (let i = 0; i < playerattributes.length; i++) {
            html += '<option value="' + playerattributes[i] + '">' + playerattributes[i] + "</option>";
        }
        const line = {
            input: '<select type="text" id="inspect_' + wid_attr + '">' + html + "</select>"
        };
        return line;
    },
    findPlayerWidgets: function () {
        const widgets = vis.views[vis.activeView].widgets;
        const keys = Object.keys(widgets);
        const result = [];
        for (let i = 0; i < keys.length; i++) {
            if (widgets[keys[i]].tpl == "tplSqueezeboxrpcPlayer") result.push(keys[i]);
        }
        return result;
    },
    findFavoritesWidgets: function () {
        const widgets = vis.views[vis.activeView].widgets;
        const keys = Object.keys(widgets);
        const result = [];
        for (let i = 0; i < keys.length; i++) {
            if (widgets[keys[i]].tpl == "tplSqueezeboxrpcFavorites") result.push(keys[i]);
        }
        return result;
    },
    getPlayerValues: function (widgetPlayer) {
        return $("input[name=" + widgetPlayer + "], #" + widgetPlayer + " option").toArray().reduce(function (acc, cur) {
            if ($(cur).val()) acc.push($(cur).val());
            return acc;
        }, []);
    },
    getPlayerName: function (widgetPlayer) {
        return $("input[name=" + widgetPlayer + "]:checked, #" + widgetPlayer + " option:checked").val();
    },
    onHorizChange: function (widgetID, view, newId) {
        const data = vis.views[view].widgets[widgetID].data;
        if (newId == "vertical") {
            data.segheight = "100%";
            data.segwidth = "100%";
        } else {
            data.segheight = "20px";
            data.segwidth = "20px";
        }
        return true;
    },
    editDimension: function (widgetID, view, newId, attr) {
        if (newId && typeof newId !== "object") {
            const e = newId.substring(newId.length - 2);
            if (e !== "px" && e !== "em" && newId[newId.length - 1] !== "%") {
                vis.views[view].widgets[widgetID].data[attr] = newId + "px";
            }
        }
    },
};
vis.binds["squeezeboxrpc"].showVersion();
