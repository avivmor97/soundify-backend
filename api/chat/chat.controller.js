import {chatService} from './chat.service.js'
import {stationService} from '../stations/station.service.js'



export async function search(req,res){

    try {
        const user = await chatService.sendMessageToChatGPT(req.query.q)
        res.send(user)
    } catch (err) {
       
        res.status(400).send({ err: 'error:' })
    }
}

export async function addStationWTracks(req, res) {
    try {
        const addedStation = await stationService.add(req.body)
        res.send(addedStation)
    } catch (err) {
        res.status(500).send({ err: 'Failed to add station' })
    }
}

