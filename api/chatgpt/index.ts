import {VercelRequest, VercelResponse} from "@vercel/node";
import fetch from 'node-fetch';


export default async function handler(req: VercelRequest, res: VercelResponse) {
    let {messages = []} = req.body ?? {};

    let response = await fetch(`https://api.openai.com/v1/chat/completions`, {
        method: 'POST',
        headers: {
            [`Authorization`]: `Bearer ${process.env.OPENAI_TOKEN}`,
            [`Content-Type`]: `application/json`
        },
        body: JSON.stringify({
            "model": "gpt-3.5-turbo",
            "messages": messages
        }),
    });
    let result = await response.json();
    if (result?.error) {
        return res.send({
            success: false,
            message: `${result.error?.message}`
        });
    }
    console.log('响应的JSON.result', result);
    return res.send({
        success: true,
        message: 'ok',
        data: [...messages, result?.choices?.[0].message]
    });
};