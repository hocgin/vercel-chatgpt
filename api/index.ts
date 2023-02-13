import {VercelRequest, VercelResponse} from '@vercel/node'
import {sendMessage as sendOpenAIMessage} from "./openai";
import {sendMessageThrow as sendChatGPTMessage} from "./chatgpt";

// require('dotenv').config();

export default async function handler(req: VercelRequest, res: VercelResponse) {
    let url = req.url;
    const ask = req.query.ask as string;
    if (url?.startsWith('/api/openai')) {
        let response = await sendOpenAIMessage(ask);
        res.status(response.status);
        res.json(response);
    } else {
        let response: any = await sendChatGPTMessage(ask);
        res.status(response.status);
        res.json(response);
    }
}

// for dev
if (process.env.NODE_ENV === 'development') {
    (async () => {
        const res = await sendChatGPTMessage(`什么是Java`)
        console.log(res)
    })();
}
