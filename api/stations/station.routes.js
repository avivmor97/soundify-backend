import express from 'express'
import { getStations,getStationById,removeStation,addStation } from './station.controller.js'
const router = express.Router()

router.get('/:stationId', getStationById)
router.get('/', getStations)
// router.put('/:id/', )
router.post('/:station',addStation)
router.delete('/:id/',removeStation )

export const stationRoutes = router