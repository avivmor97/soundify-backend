import {chatService} from './chat.service.js'




export async function search(req,res){

    try {
        const user = await chatService.sendMessageToChatGPT(req.query.q)
        res.send(user)
    } catch (err) {
       
        res.status(400).send({ err: 'error:' })
    }
}
