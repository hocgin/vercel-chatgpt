import {VercelRequest, VercelResponse} from '@vercel/node'
import {ChatGPTAPI} from 'chatgpt'

async function sendMessage(message: string) {
    let api = new ChatGPTAPI({sessionToken: process.env.SESSION_TOKEN!});

    // ensure the API is properly authenticated
    await api.ensureAuth()

    // send a message and wait for the response
    return await api.sendMessage(message);
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
    const ask = req.query.ask as string
    let response: any = {
        message: "ok",
        status: 200,
        success: true,
    };
    try {
        response.data = await sendMessage(ask)
    } catch (err) {
        res.status(400)
        res.json({status: 400, success: false, message: 'Invalid URL'})
        return
    }
    res.json(response)
}

// for dev
if (process.env.NODE_ENV === 'development') {
    require('dotenv').config();
    (async () => {
        const res = await sendMessage(`什么是Java`)
        console.log(res)
    })();
}
