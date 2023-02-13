import {VercelRequest, VercelResponse} from '@vercel/node'
import {ChatGPTAPI} from "chatgpt";


async function sendMessage(message: string) {
    let token = `${process?.env?.SESSION_TOKEN}`;
    if (`${token}`.trim().length <= 1) {
        throw new Error('Env "SESSION_TOKEN" Not Found');
    }
    let api = new ChatGPTAPI({sessionToken: token!});

    // ensure the API is properly authenticated
    await api.ensureAuth()

    // send a message and wait for the response
    return await api.sendMessage(message);
}

export async function sendChatGPTMessage(ask: string) {
    let response: any = {
        ask,
        message: "ok",
        status: 200,
        success: true,
    };
    try {
        response.data = await sendMessage(ask)
    } catch (err: any) {
        console.warn(err)
        response = {ask, status: 400, success: false, message: `${err?.message}`}
    }
    return response;
}

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
