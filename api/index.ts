import {VercelRequest, VercelResponse} from '@vercel/node'
import {sendMessageThrow as sendChatGPTMessage} from "./link/chatgpt";

// require('dotenv').config();

export default async function handler(req: VercelRequest, res: VercelResponse) {
    const ask = req.query.ask as string;
    let response: any = await sendChatGPTMessage(ask);
    res.status(response.status);
    res.json(response);
}

// for dev
if (process.env.NODE_ENV === 'development') {
    (async () => {
        const res = await sendChatGPTMessage(`什么是Java`)
        console.log(res)
    })();
}
