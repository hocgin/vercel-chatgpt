import {VercelRequest, VercelResponse} from '@vercel/node'

require('dotenv').config();

async function sendMessage(message: string) {
    const {ChatGPTAPI} = await import('chatgpt')
    let api = new ChatGPTAPI({sessionToken: process.env.SESSION_TOKEN!});

    // ensure the API is properly authenticated
    await api.ensureAuth()

    // send a message and wait for the response
    return await api.sendMessage(message);
}

async function sendMessageThrow(ask: string) {
    let response: any = {
        ask,
        message: "ok",
        status: 200,
        success: true,
    };
    try {
        response.data = await sendMessage(ask)
    } catch (err: any) {
        response = {ask, status: 400, success: false, message: `${err?.message}`}
    }
    return response;
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
    const ask = req.query.ask as string
    let response: any = sendMessageThrow(ask);
    res.status(response.status);
    res.json(response)
}

// for dev
if (process.env.NODE_ENV === 'development') {
    (async () => {
        const res = await sendMessageThrow(`什么是Java`)
        console.log(res)
    })();
}
