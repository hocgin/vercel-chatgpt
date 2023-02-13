import {VercelRequest, VercelResponse} from "@vercel/node";
import {sendMessage as sendOpenAIMessage} from "./link/openai";

export default async function handler(req: VercelRequest, res: VercelResponse) {
    const ask = req.query.ask as string;
    let response = await sendOpenAIMessage(ask);
    res.status(response.status);
    res.json(response);
}