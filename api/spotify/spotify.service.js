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
        const res = spotifyApi.search(query, ['track','artist','playlist'])
        return res
    }
    catch (err) {
        throw err
    }
}

async function getPlaylistById(id) {
    try{ 
        const playlist = await spotifyApi.playlists.getPlaylist(id);
        return playlist
    } catch (err) {
        throw err
    }
}
