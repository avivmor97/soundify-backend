import { SpotifyApi } from "@spotify/web-api-ts-sdk";
import 'dotenv/config'


const spotifyApi = SpotifyApi.withClientCredentials(
    process.env.SPOTIFY_CLIENT_ID,
    process.env.SPOTIFY_SECRET_ID

);

export const spotifyService = {
    getArtistById,
    search,
    getPlaylistById
}

async function getArtistById(id) {
    try {
        const artist = spotifyApi.artists.get(id)
        return artist
    } catch (err) {
        throw err
    }
}

async function search(query) {

    try {
        const market = 'IL';
        const limit = 10;
        const searchFilter = ['track', 'artist', 'playlist'];
        const trackFields = `items(id,name,type,album(images,release_date),artists(id,name,type),duration_ms,track_number,external_urls(spotify))`;
        
        const res = await spotifyApi.search(query, searchFilter,  market, limit );
        const tracks = res.tracks.items.map((item) => ({
            id: item.id,
            name: item.name,
            type: item.type,
            album: {
                images: item.album.images,
                release_date: item.album.release_date,
            },
            artists: item.artists.map((artist) => ({
                id: artist.id,
                name: artist.name,
                type: artist.type,
            })),
            duration_ms: item.duration_ms,
            track_number: item.track_number,
            external_url: item.external_urls.spotify,
        }));

        return {
            tracks,
            artists: res.artists?.items || [],
            playlists: res.playlists?.items || [],
        };

    } catch (err) {
        console.error('Error in search:', err);
        throw err;
    }
}

async function getPlaylistById(id) {
    try {
        const trackFields = `items(added_at,type,id,track(id,name,type,album(images,release_date,name),artists(id,name,type),duration_ms,track_number,external_urls(spotify)))`;
        const fields = `description,collaborative,followers(href,total),images,name,owner(display_name,external_urls(spotify))`;
        const market = 'IL';
        const limit = 50;

        const playlist = await spotifyApi.playlists.getPlaylist(id, market, fields);
        const tracks = await spotifyApi.playlists.getPlaylistItems(id, market, trackFields, limit);
        playlist.tracks = tracks.items;
        return playlist
    } catch (err) {
        throw err
    }
}


// async function getPlaylistById(id) {
//     try {
//         const tracks = await spotifyApi.playlists.getPlaylistItems(id);;
//         return tracks
//     } catch (err) {
//         throw err
//     }
// }


