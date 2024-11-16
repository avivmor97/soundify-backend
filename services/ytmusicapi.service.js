import { createRequire } from 'module';
const require = createRequire(import.meta.url);
const YTMusic = require('ytmusic-api');

const ytmusic = new YTMusic();

export async function initializeYTMusic() {
    try {
        await ytmusic.initialize();
        console.log('YTMusic API initialized successfully');
    } catch (error) {
        console.error('Error initializing YTMusic API:', error);
    }
}


export function parseSearchResult(item) {
    return {
        title: item.name || '',
        artist: item.artist?.name || '',
        videoId: item.videoId || '',
        album: item.album?.name || '',
        albumId: item.album?.albumId || '',
        duration: item.duration || 0,
        thumbnails: item.thumbnails || [],
    };
}

export async function searchSongs(query) {
    try {
        console.log(`Calling YTMusic API with query: ${query}`);
        const results = await ytmusic.search(query, 'songs');
        console.log('Results from YTMusic API:', results);
        return results;
    } catch (error) {
        console.error('Error during song search in YTMusic API:', error);
        throw error;
    }
}