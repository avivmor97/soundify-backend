import { stationService } from './station.service.js'
import { logger } from '../../services/logger.service.js'

export async function getStations(req, res) {
    try {

        // const filterBy = {
        //     txt: req.query.txt || '',
        // }

        const stations = await stationService.query()
        res.send(stations)
    } catch (err) {
        // logger.error('Failed to get stations', err)
        res.status(500).send({ err: 'Failed to get stations' })
    }
}

export async function getStationById(req, res) {
    try {

        const stationId = req.params.stationId
        const station = await stationService.getById(stationId)
        res.send(station)
    } catch (err) {
        // logger.error('Failed to get station', err)
        res.status(500).send({ err: 'Failed to get station' })
    }
}

export async function addStation(req, res) {
    // const { loggedinUser } = req
    try {

        const stationName = req.params.name
        const station = req.body
        station.name = stationName
        // toy.owner = loggedinUser
        const addedStation = await stationService.add(station)
        res.send(addedStation)
    } catch (err) {
        // logger.error('Failed to add station', err)
        res.status(500).send({ err: 'Failed to add station' })
    }
}

// export async function updateToy(req, res) {
//     try {
//         const toy = req.body
//         const updatedToy = await toyService.update(toy)
//         res.send(updatedToy)
//     } catch (err) {
// logger.error('Failed to update toy', err)
//         res.status(500).send({ err: 'Failed to update toy' })
//     }
// }

export async function removeStation(req, res) {
    try {
        const stationId = req.params.id
        const deletedStation = await stationService.remove(stationId)
        res.send(`${deletedStation} station removed`)
    } catch (err) {
        // logger.error('Failed to remove station', err)
        res.status(500).send({ err: 'Failed to remove station' })
    }
}
