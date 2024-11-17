import express from 'express'
import { getArtist, getPlaylist,search } from './spotify.controller.js'
const router = express.Router()

router.get('/playlist/:playlistId', getPlaylist)
router.get('/music/search',search ) 
router.get('/artists/:artistId',getArtist )

export const spotifyRoutes = router