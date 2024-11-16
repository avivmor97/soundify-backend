import http from 'http'
import path from 'path'
import cors from 'cors'
import express from 'express'
import cookieParser from 'cookie-parser'

import { authRoutes } from './api/auth/auth.routes.js'
import { userRoutes } from './api/user/user.routes.js'

import { setupSocketAPI } from './services/socket.service.js'

import { setupAsyncLocalStorage } from './middlewares/setupAls.middleware.js'

import { searchSongs, initializeYTMusic ,parseSearchResult} from './services/ytmusicapi.service.js'


const app = express()
const server = http.createServer(app)
initializeYTMusic();

app.get('/api/ytmusic/search', async (req, res) => {
    const { query } = req.query;
    if (!query) {
        console.error('Missing query parameter');
        return res.status(400).send({ error: 'Query parameter is required' });
    }

    try {
        console.log(`Searching for: ${query}`);
        const rawResults = await searchSongs(query);
        const parsedResults = rawResults.map((item) => parseSearchResult(item));
        res.json(parsedResults);
    } catch (error) {
        console.error('Error handling search request:', error);
        res.status(500).send({ error: 'Failed to search songs' });
    }
});

// Express App Config
app.use(cookieParser())
app.use(express.json())
app.disable('etag');

if (process.env.NODE_ENV === 'production') {
    app.use(express.static(path.resolve('public')))
} else {
    const corsOptions = {
        origin: [   'http://127.0.0.1:3030',
                    'http://localhost:3030',
                    'http://127.0.0.1:5174',
                    'http://localhost:5174',
                    'http://127.0.0.1:5173',
                    'http://localhost:5173',
                ],
        credentials: true
    }
    app.use(cors(corsOptions))
}
app.all('*', setupAsyncLocalStorage)

app.use('/api/auth', authRoutes)
app.use('/api/user', userRoutes)


setupSocketAPI(server)

// Make every unhandled server-side-route match index.html
// so when requesting http://localhost:3030/unhandled-route... 
// it will still serve the index.html file
// and allow vue/react-router to take it from there

// app.get('/**', (req, res) => {
//     res.sendFile(path.resolve('public/index.html'))
// })

import { logger } from './services/logger.service.js'
const port = process.env.PORT || 3030

server.listen(port, () => {
    logger.info('Server is running on port: ' + port)
})