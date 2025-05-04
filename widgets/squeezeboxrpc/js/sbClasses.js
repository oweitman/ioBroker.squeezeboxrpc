'use strict';

/**
 * This function takes a request and returns an appropriate class that can parse the response.
 * The class is determined by the content of the response.
 *
 * @param request - The request object.
 * @returns The class that can parse the response.
 */
export function parseRequestFactory(request) {
    console.log(`parseRequestFactory`);
    let result = request.result;
    if (result.albums_loop) {
        return new Albums(request);
    }
    if (result.artists_loop) {
        return new Artists(request);
    }
    if (result.genres_loop) {
        return new Genres(request);
    }
    if (result.works_loop) {
        return new Works(request);
    }
    if (result.years_loop) {
        return new Years(request);
    }
    if (result.item_loop) {
        return new Items(request);
    }
    if (result.titles_loop) {
        return new Tracks(request);
    }
    if (result.playlisttracks_loop) {
        return new PlaylistTracks(request);
    }
    if (result.playlists_loop) {
        return new Playlists(request);
    }
    //specialHandling
    let requestCommand = request.params[1][0];
    if (requestCommand === 'selectVirtualLibrary' && !result.item_loop) {
        return new Items(request);
    }
}
class Albums {
    constructor(request) {
        console.log(`Albums`);
        this.albums = this.parseRequest(request);
    }
    parseRequest(request) {
        let result = request.result;
        if (result.albums_loop) {
            let albums = result.albums_loop;
            return albums.map(item => {
                return new Album(item, request);
            });
        }
    }
    getMenuItems() {
        return this.albums.map(item => item.getMenu());
    }
}
class Album {
    constructor(request_item, request) {
        this.parseRequest(request_item, request);
    }
    parseRequest(request_item, request) {
        this.id = request_item.id || undefined;
        this.performance = request_item.performance || undefined;
        this.favorites_url = request_item.favorites_url || undefined;
        this.favorites_title = request_item.favorites_title || undefined;
        this.album = request_item.album || undefined;
        this.year = request_item.year || undefined;
        this.artwork_track_id = request_item.artwork_track_id || undefined;
        this.compilation = request_item.compilation || undefined;
        this.artist_id = request_item.artist_id || undefined;
        this.artist = request_item.artist || undefined;
        this.textkey = request_item.textkey || undefined;
        let additionalPlayParams = [getParamsFromCommand(request.params[1], 'role_id:')];
        this.actions = {
            next: {
                command: ['tracks'],
                params: ['tags:distbhz1kyuAACGPSE', 'sort:tracknum', `album_id:${this.id}`],
            },
            play: {
                command: ['playlistcontrol'],
                params: [`cmd:load`, `album_id:${this.id}`, `performance:`, ...additionalPlayParams, `library_id:-1`],
            },
            add: {
                command: ['playlistcontrol'],
                params: [`cmd:add`, `album_id:${this.id}`, `performance:`],
            },
        };
    }
    getMenu() {
        return {
            id: this.id,
            title: `${this.artist} / ${this.album} ${this.year ? `(${this.year})` : ''}`,
            image: `/music/${this.artwork_track_id}/cover_300x300_f`,
            type: 'album',
            item: this,
            param: JSON.stringify(this.actions.next),
            actions: JSON.stringify(this.actions),
        };
    }
}

class Artists {
    constructor(request) {
        console.log(`Artists`);
        this.artists = this.parseRequest(request);
    }
    parseRequest(request) {
        let result = request.result;
        if (result.artists_loop) {
            let artists = result.artists_loop;
            return artists.map(item => {
                return new Artist(item, request);
            });
        }
    }
    getMenuItems() {
        return this.artists.map(item => item.getMenu());
    }
}
class Artist {
    constructor(request_item, request) {
        this.parseRequest(request_item, request);
    }
    parseRequest(request_item, request) {
        this.id = request_item.id || undefined;
        this.artist = request_item.artist || undefined;
        this.textkey = request_item.textkey || undefined;
        this.favorites_url = request_item.favorites_url || undefined;
        let additionalPlayParams = [getParamsFromCommand(request.params[1], 'role_id:')];
        this.actions = {
            next: {
                command: ['albums'],
                params: ['tags:aajlqswyKSSE', 'sort:yearalbum', `artist_id:${this.id}`],
            },
            play: {
                command: ['playlistcontrol'],
                params: [
                    `cmd:load`,
                    `role_id:ALBUMARTIST`,
                    `artist_id:${this.id}`,
                    `sort:yearalbum`,
                    ...additionalPlayParams,
                    `library_id:-1`,
                ],
            },
            add: {
                command: ['playlistcontrol'],
                params: [`cmd:add`, `role_id:ALBUMARTIST`, `artist_id:${this.id}`, `sort:yearalbum`],
            },
        };
    }
    getMenu() {
        return {
            id: this.id,
            title: this.artist,
            image: `/imageproxy/mai/artist/${this.id}/image_300x300_f`,
            type: 'artist',
            item: this,
            param: JSON.stringify(this.actions.next),
            actions: JSON.stringify(this.actions),
        };
    }
}

class Genres {
    constructor(request) {
        console.log(`Genres`);
        this.genres = this.parseRequest(request);
    }
    parseRequest(request) {
        let result = request.result;
        if (result.genres_loop) {
            let genres = result.genres_loop;
            return genres.map(item => {
                return new Genre(item);
            });
        }
    }
    getMenuItems() {
        return this.genres.map(item => item.getMenu());
    }
}
class Genre {
    constructor(request_item) {
        this.parseRequest(request_item);
    }
    parseRequest(request_item) {
        this.id = request_item.id || undefined;
        this.genre = request_item.genre || undefined;
        this.textkey = request_item.textkey || undefined;
        this.favorites_url = request_item.favorites_url || undefined;
        this.actions = {
            next: {
                command: ['tracks'],
                params: [`genre_id:${request_item.id}`, 'tags:distbhz1kyuAACGPScelyE', 'msk-sort:yearalbumtrack:Album'],
            },
            play: {
                command: ['playlistcontrol'],
                params: [`cmd:load`, `genre_id:${this.id}`, `sort:album`, `library_id:-1`],
            },
            add: {
                command: ['playlistcontrol'],
                params: [`cmd:add`, `genre_id:${this.id}`, `sort:album`],
            },
        };
    }
    getMenu() {
        return {
            id: this.id,
            title: `${this.genre}`,
            image: null,
            type: 'genre',
            item: this,
            param: JSON.stringify(this.actions.next),
            actions: JSON.stringify(this.actions),
        };
    }
}
class Playlists {
    constructor(request) {
        console.log(`Playlists`);
        this.playlists = this.parseRequest(request);
    }
    parseRequest(request) {
        let result = request.result;
        if (result.playlists_loop) {
            let playlists = result.playlists_loop;
            return playlists.map(item => {
                return new Playlist(item);
            });
        }
    }
    getMenuItems() {
        return this.playlists.map(item => item.getMenu());
    }
}
class Playlist {
    constructor(request_item) {
        this.parseRequest(request_item);
    }
    parseRequest(request_item) {
        this.id = request_item.id || undefined;
        this.playlist = request_item.playlist || undefined;
        this.url = request_item.url || undefined;
        this.favorites_url = request_item.favorites_url || undefined;
        this.textkey = request_item.textkey || undefined;
        this.extid = request_item.extid || undefined;
        this.remote = request_item.remote || undefined;
        this.actions = {
            next: {
                command: ['playlists', 'tracks'],
                params: [`playlist_id:${request_item.id}`, 'tags:distbhz1acelyAGKPS'],
            },
            play: {
                command: ['playlistcontrol'],
                params: [`cmd:load`, `playlist_id:${this.id}`, `performance:`],
            },
            add: {
                command: ['playlistcontrol'],
                params: [`cmd:add`, `playlist_id:${this.id}`, `performance:`],
            },
        };
    }
    getMenu() {
        return {
            id: this.id,
            title: `${this.playlist}`,
            image: null,
            type: 'playlist',
            item: this,
            param: JSON.stringify(this.actions.next),
            actions: JSON.stringify(this.actions),
        };
    }
}
class Works {
    constructor(request) {
        console.log(`Works`);
        this.works = this.parseRequest(request);
    }
    parseRequest(request) {
        let result = request.result;
        if (result.works_loop) {
            let works = result.works_loop;
            return works.map(item => {
                return new Work(item);
            });
        }
    }
    getMenuItems() {
        return this.works.map(item => item.getMenu());
    }
}
class Work {
    constructor(request_item) {
        this.parseRequest(request_item);
    }
    parseRequest(request_item) {
        this.id = request_item.work_id || undefined;
        this.composer = request_item.composer || undefined;
        this.work = request_item.work || undefined;
        this.composer_id = request_item.composer_id || undefined;
        this.album_id = request_item.album_id || undefined;
        this.textkey = request_item.textkey || undefined;
        this.favorites_url = request_item.favorites_url || undefined;
        this.favorites_title = request_item.favorites_title || undefined;
        this.actions = {
            next: {
                command: ['albums'],
                params: [
                    'tags:aajlqswyKSSE',
                    `work_id:${this.id}`,
                    `composer_id:${this.composer_id}`,
                    `album_id:${this.album_id}`,
                ],
            },
            play: {
                command: ['playlistcontrol'],
                params: [`cmd:load`, `work_id:${this.id}`, `album_id:${this.album_id}`, `performance:`],
            },
            add: {
                command: ['playlistcontrol'],
                params: [`cmd:add`, `work_id:${this.id}`, `album_id:${this.album_id}`, `performance:`],
            },
        };
    }
    getMenu() {
        return {
            id: `work_id:${this.id}`,
            title: `${this.favorites_title}`,
            image: null,
            type: 'work',
            item: this,
            param: JSON.stringify(this.actions.next),
            actions: JSON.stringify(this.actions),
        };
    }
}

class Years {
    constructor(request) {
        console.log(`Years`);
        this.years = this.parseRequest(request);
    }
    parseRequest(request) {
        let result = request.result;
        if (result.years_loop) {
            let years = result.years_loop;
            return years.map(item => {
                return new Year(item);
            });
        }
    }
    getMenuItems() {
        return this.years.map(item => item.getMenu());
    }
}
class Year {
    constructor(request_item) {
        this.parseRequest(request_item);
    }
    parseRequest(request_item) {
        this.id = request_item.year || undefined;
        this.year = request_item.year || undefined;
        this.favorites_url = request_item.favorites_url || undefined;
        this.actions = {
            next: {
                command: ['albums'],
                params: [
                    'release_type:Album',
                    'tags:aajlqswyKSSE',
                    'sort:album',
                    'menu:1',
                    `year:${request_item.year}`,
                ],
            },
            play: {
                command: ['playlistcontrol'],
                params: [`cmd:load`, `year:${this.id}`, `library_id:-1`],
            },
            add: {
                command: ['playlistcontrol'],
                params: [`cmd:add`, `year:${this.id}`],
            },
        };
    }
    getMenu() {
        return {
            id: `year_id:${this.id}`,
            title: `${this.year}`,
            image: null,
            type: 'year',
            item: this,
            param: JSON.stringify(this.actions.next),
            actions: JSON.stringify(this.actions),
        };
    }
}
class Tracks {
    constructor(request) {
        console.log(`Tracks`);
        this.tracks = this.parseRequest(request);
    }
    parseRequest(request) {
        let result = request.result;
        if (result.titles_loop) {
            let tracks = result.titles_loop;
            return tracks.map(item => {
                return new Track(item);
            });
        }
    }
    getMenuItems() {
        return this.tracks.map(item => item.getMenu());
    }
}
class Track {
    constructor(request_item) {
        this.parseRequest(request_item);
    }
    parseRequest(request_item) {
        this.id = request_item.id || undefined;
        this.title = request_item.title || undefined;
        this.duration = request_item.duration || undefined;
        this.artist_id = request_item.artist_id || undefined;
        this.tracknum = request_item.tracknum || undefined;
        this.year = request_item.year || undefined;
        this.albumartist = request_item.albumartist || undefined;
        this.trackartist = request_item.trackartist || undefined;
        this.compilation = request_item.compilation || undefined;
        this.genres = request_item.genres || undefined;
        this.genre_ids = request_item.genre_ids || undefined;
        this.albumartist_ids = request_item.albumartist_ids || undefined;
        this.trackartist_ids = request_item.trackartist_ids || undefined;
        this.actions = {
            play: {
                command: ['playlistcontrol'],
                params: [`cmd:load`, `track_id:${this.id}`],
            },
            add: {
                command: ['playlistcontrol'],
                params: [`cmd:add`, `track_id:${this.id}`],
            },
        };
    }
    getMenu() {
        return {
            id: `track_id:${this.id}`,
            title: `${this.title}`,
            image: null,
            type: 'track',
            item: this,
            actions: JSON.stringify(this.actions),
        };
    }
}
class PlaylistTracks {
    constructor(request) {
        console.log(`PlaylistTracks`);
        this.playlisttracks = this.parseRequest(request);
    }
    parseRequest(request) {
        let result = request.result;
        if (result.playlisttracks_loop) {
            let playlisttracks = result.playlisttracks_loop;
            return playlisttracks.map(item => {
                return new PlaylistTrack(item);
            });
        }
    }
    getMenuItems() {
        return this.playlisttracks.map(item => item.getMenu());
    }
}
class PlaylistTrack {
    constructor(request_item) {
        this.parseRequest(request_item);
    }
    parseRequest(request_item) {
        this.id = request_item.id || undefined;
        this.title = request_item.title || undefined;
        this['playlist index'] = request_item['playlist index'] || undefined;
        this.title = request_item.title || undefined;
        this.duration = request_item.duration || undefined;
        this.artist_ids = request_item.artist_ids || undefined;
        this.tracknum = request_item.tracknum || undefined;
        this.artist = request_item.artist || undefined;
        this.coverid = request_item.coverid || undefined;
        this.album_id = request_item.album_id || undefined;
        this.album = request_item.album || undefined;
        this.year = request_item.year || undefined;
        this.genres = request_item.genres || undefined;
        this.genre_ids = request_item.genre_ids || undefined;
        this.artist_ids = request_item.artist_ids || undefined;
        this.actions = {
            next: {
                command: ['playlist', 'tracks'],
                params: ['tags:distbhz1acelyAGKPS', 'playlist_id:${this.id}'],
            },
            play: {
                command: ['playlistcontrol'],
                params: [`menu:1`, `cmd:load`, `folder_id:${this.id}`],
            },
            add: {
                command: ['playlistcontrol'],
                params: [`menu:1`, `cmd:add`, `folder_id:${this.id}`],
            },
        };
    }
    getMenu() {
        return {
            id: `track_id:${this.id}`,
            title: `${this.title}`,
            image: null,
            type: 'playlisttrack',
            item: this,
        };
    }
}
class Items {
    constructor(request) {
        console.log(`Items`);
        let filesystem = request.params[1].includes('mode:filesystem');
        let requestCommand = request.params[1][0] + (filesystem ? 'FS' : '');
        this.items = this.parseRequest(request, requestCommand);
    }
    parseRequest(request, requestCommand) {
        let result = request.result;
        if (result.item_loop) {
            let items = result.item_loop;
            return items.map(item => {
                return Item.create(item, requestCommand, request);
            });
        }
        if (!result.titles_loop && requestCommand === 'selectVirtualLibrary') {
            return [
                Item.create(
                    {
                        type: 'virtualLibraryAnswer',
                        text: request.result.title,
                    },
                    requestCommand,
                ),
            ];
        }
    }
    getMenuItems() {
        return this.items.map(item => item.getMenu());
    }
}
class Item {
    // item types
    // search|text|textarea|audio|playlist|link|opml|replace|redirect|radio
    static create(request_item, requestCommand, request) {
        console.log(`Item switch: ${requestCommand}_${request_item.type || ''}`);
        switch (`${requestCommand}_${request_item.type || ''}`) {
            case 'radios_':
            case 'local_':
            case 'music_':
            case 'sports_':
            case 'news_':
            case 'talk_':
            case 'location_':
            case 'language_':
            case 'podcast_':
            case 'local_link':
            case 'music_link':
            case 'sports_link':
            case 'news_link':
            case 'talk_link':
            case 'location_link':
            case 'language_link':
            case 'podcast_link':
                return new ItemRadio(request_item, requestCommand);
            case 'local_text':
            case 'music_text':
            case 'sports_text':
            case 'news_text':
            case 'talk_text':
            case 'location_text':
            case 'language_text':
            case 'podcast_text':
            case 'browselibrary_text':
            case 'browselibraryFS_text':
                return new ItemText(request_item, requestCommand);
            case 'menu_':
                return new ItemMenu(request_item, request);
            case 'browselibrary_playlist':
            case 'favorites_playlist':
                return new ItemPlaylist(request_item, false);
            case 'browselibraryFS_playlist':
                return new ItemPlaylist(request_item, true);
            case 'browselibraryFS_':
                return new ItemFilesystem(request_item);
            case 'browselibrary_audio': //ok
            case 'browselibraryFS_audio': //ok
            case 'local_audio': //ok
            case 'music_audio': //ok
            case 'sports_audio': //ok
            case 'news_audio': //ok
            case 'talk_audio': //ok
            case 'location_audio': //ok
            case 'language_audio': //ok
            case 'podcast_audio': //ok
            case 'favorites_audio': //ok
                return new ItemAudio(request_item, requestCommand);
            case 'selectVirtualLibrary_virtualLibraryAnswer':
                return new ItemVirtualLibraryAnswer(request_item);
            case 'selectVirtualLibrary_':
            case 'selectVirtualLibrary_outline':
                return new ItemVirtualLibrary(request_item);
            case 'myapps_redirect':
                return new ItemApplication(request_item);
            default:
                return new ItemMenu(request_item, request);
            // debugger;
            // throw new Error(`Unknown item type: ${requestCommand}_${request_item.type || ''}`);
        }
    }
}
class ItemApplication extends Item {
    constructor(request_item) {
        super(request_item);
        this.parseRequest(request_item);
    }
    parseRequest(request_item) {
        this.id = request_item.actions.go.params.menu || undefined;
        this.text = request_item.text.trim() || undefined;
        this.iconid = request_item['icon-id'] || undefined;
        this.actions = {};
        if (request_item.actions['go']) {
            this.actions = {
                ...this.actions,
                ...{ next: translateMyMusicParameters(request_item.actions.go) },
            };
        }
        if (request_item.actions['play']) {
            this.actions = {
                ...this.actions,
                ...{ play: translateMyMusicParameters(request_item.actions.play) },
            };
        }
        if (request_item.actions['add']) {
            this.actions = {
                ...this.actions,
                ...{ add: translateMyMusicParameters(request_item.actions.add) },
            };
        }
    }
    getMenu() {
        return {
            id: this.id,
            title: this.text,
            image: this.icon,
            type: 'itemapplication',
            item: this,
            param: JSON.stringify(this.actions.next),
            actions: JSON.stringify(this.actions),
        };
    }
}
class ItemRadio extends Item {
    constructor(request_item, requestCommand) {
        super(request_item);
        this.parseRequest(request_item, requestCommand);
    }
    parseRequest(request_item, requestCommand) {
        let cmd;
        if (request_item.actions?.go) {
            cmd = translateMyMusicParameters(request_item.actions?.go);
        } else {
            cmd = {
                command: [requestCommand, 'items'],
                params: [`menu:${requestCommand}`, `item_id:${request_item.actions.go.params.item_id}`],
            };
        }
        this.id = request_item.actions.go.params.item_id || request_item.actions.go.params.menu || undefined;
        this.text = request_item.text || undefined;
        this.actions = {
            next: cmd,
        };
    }
    getMenu() {
        return {
            id: `item_id:${this.id}`,
            title: this.text,
            image: null,
            type: 'radiolocal',
            param: JSON.stringify(this.actions.next),
            item: this,
            actions: JSON.stringify(this.actions),
        };
    }
}
class ItemMenu extends Item {
    constructor(request_item, request) {
        super(request_item);
        this.parseRequest(request_item, request);
    }
    parseRequest(request_item, request) {
        this.id = request_item.text || undefined;
        this.text = request_item.text || 'Empty';
        this.node = request_item.node || undefined;
        this.weight = request_item.weight || undefined;
        if (request_item.actions) {
            if (request_item.actions['go']) {
                this.actions = {
                    ...this.actions,
                    ...{ next: translateMyMusicParameters(request_item.actions.go) },
                };
            }
            if (request_item.actions['play']) {
                this.actions = {
                    ...this.actions,
                    ...{ play: translateMyMusicParameters(request_item.actions.play) },
                };
            }
            if (request_item.actions['add']) {
                this.actions = {
                    ...this.actions,
                    ...{ add: translateMyMusicParameters(request_item.actions.add) },
                };
            }
            if (request_item.actions['do']) {
                this.actions = {
                    ...this.actions,
                    ...{ add: translateMyMusicParameters(request_item.actions.do) },
                };
            }
        }
        if (request_item.goAction) {
            if (request_item.goAction == 'play') {
                const filteredParams = Object.keys(request_item.params)
                    .filter(key => !key.includes('touchToPlay'))
                    .reduce((obj, key) => {
                        obj[key] = request_item.params[key];
                        return obj;
                    }, {});
                this.actions = {
                    play: {
                        command: request.result.base.actions[request_item.goAction].cmd,
                        params: [
                            ...object2Array({
                                ...request.result.base.actions[request_item.goAction].params,
                                ...filteredParams,
                            }),
                        ],
                    },
                };
            }
        }
        // if (request_item.actions) {
        //     const priorityKeys = ['go', 'do'];
        //     const goAction = priorityKeys.find(key => Object.prototype.hasOwnProperty.call(request_item.actions, key));
        //     if (goAction) {
        //         cmd = {
        //             ...{ cmd: request_item.actions[goAction].cmd },
        //             ...{ param: request_item.actions[goAction].param },
        //         };
        //     } else {
        //         console.log('Please check: no valid action');
        //     }

        //     // cmd = {
        //     //     ...{ cmd: request.result.base.actions[goAction].cmd },
        //     //     ...{ param: request.result.base.actions[goAction].param },
        //     // };
        //     this.actions = {
        //         next: cmd,
        //     };
        // }
    }
    getMenu() {
        return {
            id: this.id,
            title: this.text,
            image: null,
            type: 'menu',
            actions: JSON.stringify(this.actions),
            item: this,
        };
    }
}
class ItemFilesystem extends Item {
    constructor(request_item) {
        super(request_item);
        this.parseRequest(request_item);
    }
    parseRequest(request_item) {
        let cmd;
        if (request_item.actions?.go) {
            cmd = translateMyMusicParameters(request_item.actions?.go);
        }

        this.id = request_item.actions?.go.params.item_id || undefined;
        this.text = request_item.text || undefined;
        this.actions = {
            next: cmd,
        };
    }
    getMenu() {
        return {
            id: this.id,
            title: this.text,
            image: null,
            type: 'menu',
            param: JSON.stringify(this.actions.next),
            item: this,
            actions: JSON.stringify(this.actions),
        };
    }
}
class ItemPlaylist extends Item {
    constructor(request_item, filesystem) {
        super(request_item);
        this.parseRequest(request_item, filesystem);
    }
    parseRequest(request_item, filesystem) {
        this.id = request_item.actions?.more.params.folder_id || undefined;
        this.text = request_item.text || undefined;
        this.textkey = request_item.textkey || undefined;
        this.actions = {
            next: {
                command: ['browselibrary', 'items'],
                params: [
                    'menu:browselibrary',
                    filesystem ? 'mode:filesystem' : 'mode:bmf',
                    ...object2Array(request_item.params),
                ],
            },
            play: {
                command: ['playlistcontrol'],
                params: [`menu:1`, `cmd:load`, `folder_id:${this.id}`],
            },
            add: {
                command: ['playlistcontrol'],
                params: [`menu:1`, `cmd:add`, `folder_id:${this.id}`],
            },
        };
    }
    getMenu() {
        return {
            id: `item_id:${this.id}`,
            title: `(D) ${this.text}`,
            image: null,
            type: 'itemplaylist',
            param: JSON.stringify(this.actions.next),
            item: this,
            actions: JSON.stringify(this.actions),
        };
    }
}
class ItemText extends Item {
    constructor(request_item) {
        super(request_item);
        this.parseRequest(request_item);
    }
    parseRequest(request_item) {
        this.id = request_item.text || undefined;
        this.text = request_item.text || undefined;
    }
    getMenu() {
        return {
            id: `item_id:${this.id}`,
            title: this.text,
            image: null,
            type: 'itemtext',
            param: null,
            item: this,
        };
    }
}
class ItemAudio extends Item {
    constructor(request_item, requestCommand) {
        super(request_item);
        this.parseRequest(request_item, requestCommand);
    }
    parseRequest(request_item, requestCommand) {
        this.id = request_item.commonParams?.track_id || request_item.params?.item_id || undefined;
        this.text = request_item.text || undefined;
        this.textkey = request_item.textkey || undefined;
        this.icon = request_item.icon || undefined;
        this.iconid = request_item['icon-id'] || undefined;
        this.favorites_type = request_item.presetParams.favorites_type || undefined;
        this.favorites_url = request_item.presetParams.favorites_url || undefined;
        this.favorites_title = request_item.presetParams.favorites_title || undefined;
        this.icon = request_item.presetParams.icon || undefined;
        this.actions = {
            play: {
                command: [...(requestCommand === 'browselibraryFS' ? ['browselibrary'] : [requestCommand])],
                params: [
                    'playlist',
                    'play',
                    ...(requestCommand === 'browselibrary' ? ['mode:bmf'] : []),
                    ...(requestCommand === 'browselibraryFS' ? ['mode:filesystem'] : []),
                    ...(requestCommand === 'browselibraryFS' ? ['menu:browselibrary'] : [requestCommand]),
                    `item_id:${this.id}`,
                    `isContextMenu:1`,
                ],
            },
            add: {
                command: [...(requestCommand === 'browselibraryFS' ? ['browselibrary'] : [requestCommand])],
                params: [
                    'playlist',
                    'add',
                    ...(requestCommand === 'browselibrary' ? ['mode:bmf'] : []),
                    ...(requestCommand === 'browselibraryFS' ? ['mode:filesystem'] : []),
                    ...(requestCommand === 'browselibraryFS' ? ['menu:browselibrary'] : [requestCommand]),
                    `item_id:${this.id}`,
                    `isContextMenu:1`,
                ],
            },
        };
    }
    getMenu() {
        return {
            id: `item_id:${this.id}`,
            title: `${this.text}`,
            image: this.icon,
            type: 'itemaudio',
            item: this,
            actions: JSON.stringify(this.actions),
        };
    }
}
class ItemVirtualLibrary extends Item {
    constructor(request_item) {
        super(request_item);
        this.parseRequest(request_item);
    }
    parseRequest(request_item) {
        this.id = request_item.actions?.go.params.item_id || undefined;
        this.text = request_item.text || undefined;
        let cmd = {
            command: ['selectVirtualLibrary', 'items'],
            params: [`item_id:${request_item.actions.go.params.item_id}`, 'menu:selectVirtualLibrary'],
        };
        this.actions = {
            next: cmd,
        };

        /* 
        {
            "addAction": "go",
            "text": "All Library (Default)",
            "actions": {
                "go": {
                    "cmd": [
                        "selectVirtualLibrary",
                        "items"
                    ],
                    "params": {
                        "item_id": "0",
                        "menu": "selectVirtualLibrary"
                    },
                    "nextWindow": "myMusic"
                }
            }
        } */
    }

    getMenu() {
        return {
            id: `item_id:${this.id}`,
            title: this.text,
            image: null,
            type: 'itemvirtuallibrary',
            item: this,
            param: JSON.stringify(this.actions.next),
            actions: JSON.stringify(this.actions),
        };
    }
}

class ItemVirtualLibraryAnswer extends Item {
    constructor(request_item) {
        super(request_item);
        this.parseRequest(request_item);
    }
    parseRequest(request_item) {
        this.id = request_item.actions?.go.params.item_id || undefined;
        this.text = request_item.text || undefined;
    }

    getMenu() {
        return {
            id: `item_id:${this.id}`,
            title: this.text,
            image: null,
            type: 'itemvirtuallibraryanswer',
            item: this,
            param: null,
        };
    }
}
function object2Array(obj) {
    return Object.keys(obj).map(function (key) {
        return `${key}:${obj[key]}`;
    });
}
function getParamsFromCommand(params, key) {
    return params.find(item => item.toString().startsWith(key));
}
function translateMyMusicParameters(command /* , request */) {
    console.log(command);
    if (command.cmd == undefined) {
        return undefined;
    }
    var cmd = { command: [...command.cmd], params: [] };
    for (var key in command.params) {
        let p = command.params[key];
        if (p != undefined && p != null && p.length > 0) {
            cmd.params.push(`${key}:${p}`);
        }
    }

    let c = [];
    let p = [];
    var mode = undefined;
    var canReplace = true;
    var hasSort = false;
    var hasTags = false;
    var hasArtistId = false;
    var hasLibraryId = false;
    var hasNonArtistRole = false;
    for (let i = 0, params = cmd.params; i < cmd.params.length; i++) {
        if (params[i].startsWith('mode:')) {
            mode = params[i].split(':')[1];
            if (mode.startsWith('myMusicArtists')) {
                mode = 'artists';
            } else if (
                mode.startsWith('myMusicAlbums') ||
                mode == 'randomalbums' ||
                mode == 'vaalbums' ||
                mode == 'recentlychanged'
            ) {
                mode = 'albums';
            } else if (mode == 'years') {
                p.push('hasAlbums:1');
            } else if (mode.startsWith('myMusicWorks')) {
                mode = 'works';
            } else if (
                mode != 'artists' &&
                mode != 'albums' &&
                mode != 'genres' &&
                mode != 'tracks' &&
                mode != 'playlists' &&
                mode != 'works'
            ) {
                canReplace = false;
                break;
            }
            c.push(mode);
        }
        if (!params[i].startsWith('menu:')) {
            if (params[i].startsWith('tags:')) {
                if (params[i].split(':')[1].indexOf('s') < 0) {
                    i += 's';
                }
                p.push(params[i]);
                hasTags = true;
            } else {
                p.push(params[i]);
                if (params[i].startsWith('sort:')) {
                    hasSort = true;
                } else if (params[i].startsWith('artist_id:')) {
                    hasArtistId = true;
                } else if (params[i].startsWith('library_id:')) {
                    hasLibraryId = true;
                } else if (params[i].startsWith('role_id:')) {
                    var role = params[i].split(':')[1].toLowerCase();
                    if ('albumartist' != role && '5' != role) {
                        hasNonArtistRole = true;
                    }
                }
            }
        }
    }

    if (canReplace && c.length == 1 && mode) {
        if (mode == 'tracks') {
            if (!hasTags) {
                // If view.current.id starts with "track_id:" then we are in a 'More' menu, therefore
                // want cover id of tracks...
                // tags:distbhz1kyuAACGPSc
                p.push('tags:distbhz1kyuAACGPSc');
            }
            if (!hasSort) {
                p.push('sort:tracknum');
            }
        } else if (mode == 'albums') {
            if (!hasTags) {
                p.push(hasArtistId ? 'ArAlTP' : 'AlTP');
            }
            if (!hasSort) {
                p.push(`sort:album`);
            }
        } else if (mode == 'playlists') {
            if (!hasTags) {
                p.push('PlTP');
            }
        } else if (!hasTags) {
            if (mode == 'artists' || mode == 'vaalbums') {
                p.push('ArTP');
                if (!hasLibraryId && !hasNonArtistRole) {
                    p.push('include_online_only_artists:1');
                }
            } else if (mode == 'years' || mode == 'genres') {
                p.push('tags:s');
            }
        }
        cmd = { command: c, params: p };
    }
    if (cmd.params.length > 0) {
        for (var i = 0, len = cmd.params.length; i < len; ++i) {
            cmd.params[i] = cmd.params[i]
                .replace('ArAlTP', 'tags:aajlqswyKRSSW2')
                .replace('ArTP', 'tags:s')
                .replace('PlTP', 'tags:suxE')
                .replace('AlTP', 'tags:ajlqswyKS2');
        }
    }
    cmd.params.push('menu:1');
    cmd.params.push('library_id:-1');
    return { ...cmd };
}
