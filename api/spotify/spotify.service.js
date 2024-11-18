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
    console.log(id);

    try {
        const artist = spotifyApi.artists.get(id)
        return artist
    } catch (err) {
        throw err
    }
}

async function search(query) {
    try {
        const res = spotifyApi.search(query, ['track', 'artist', 'playlist'])
        return res
    }
    catch (err) {
        throw err
    }
}

async function getPlaylistById(id) {
    try {
        const trackFields = `items(added_at,type,id,track(id,type,album(images,release_date),artists(id,name,type),duration_ms,track_number,external_urls(spotify)))`
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
