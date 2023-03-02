import {VercelRequest, VercelResponse} from "@vercel/node";
import fetch from 'node-fetch';


export default async function handler(req: VercelRequest, res: VercelResponse) {
    let {messages = []} = req.body ?? {};

    let response = await fetch(`https://api.openai.com/v1/chat/completions`, {
        headers: {
            [`Authorization`]: `Bearer `${process.env.OPENAI_TOKEN},
            [`Content-Type`]: `application/json`
        },
        body: JSON.stringify({
            "model": "gpt-3.5-turbo",
            "messages": messages
        }),
    });
    let result = await response.json();
    return result?.choices?.[0].message
};