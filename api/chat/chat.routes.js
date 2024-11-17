import express from 'express'
import { search } from './chat.controller.js'

const router = express.Router()

router.get('/send',search ) 

export const chatRoutes = router