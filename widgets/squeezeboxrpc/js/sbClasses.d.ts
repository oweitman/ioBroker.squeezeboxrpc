/**
 * This function takes a request and returns an appropriate class that can parse the response.
 * The class is determined by the content of the response.
 *
 * @param request - The request object.
 * @returns The class that can parse the response.
 */
export function parseRequestFactory(
    request: any,
): Albums | Artists | Genres | Works | Years | Items | Tracks | PlaylistTracks | Playlists | undefined;
declare class Albums {
    constructor(request: any);
    albums: any;
    parseRequest(request: any): any;
    getMenuItems(): any;
}
declare class Artists {
    constructor(request: any);
    artists: any;
    parseRequest(request: any): any;
    getMenuItems(): any;
}
declare class Genres {
    constructor(request: any);
    genres: any;
    parseRequest(request: any): any;
    getMenuItems(): any;
}
declare class Works {
    constructor(request: any);
    works: any;
    parseRequest(request: any): any;
    getMenuItems(): any;
}
declare class Years {
    constructor(request: any);
    years: any;
    parseRequest(request: any): any;
    getMenuItems(): any;
}
declare class Items {
    constructor(request: any);
    items: any;
    parseRequest(request: any, requestCommand: any): any;
    getMenuItems(): any;
}
declare class Tracks {
    constructor(request: any);
    tracks: any;
    parseRequest(request: any): any;
    getMenuItems(): any;
}
declare class PlaylistTracks {
    constructor(request: any);
    playlisttracks: any;
    parseRequest(request: any): any;
    getMenuItems(): any;
}
declare class Playlists {
    constructor(request: any);
    playlists: any;
    parseRequest(request: any): any;
    getMenuItems(): any;
}
export {};
