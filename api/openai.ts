import {VercelRequest, VercelResponse} from "@vercel/node";
import {Configuration, OpenAIApi} from "openai";


async function sendOpenAIMessage(askText: string) {
    const configuration = new Configuration({
        apiKey: process.env.OPENAI_TOKEN,
    });
    const openai = new OpenAIApi(configuration);

    const response = await openai.createCompletion({
        // model: "code-davinci-002",
        model: "text-davinci-003",
        temperature: 0,
        max_tokens: 150,
        top_p: 1.0,
        frequency_penalty: 0.0,
        presence_penalty: 0.0,
        prompt: `\"\"\"${askText}\"\"\"`,
        stop: ["\"\"\""],
    });
    let data = response.data;
    console.log('data', data);
    let ask = data?.choices?.[0].text;
    return {
        ask,
        message: "ok",
        status: 200,
        success: true,
    };
};

export default async function handler(req: VercelRequest, res: VercelResponse) {
    const ask = req.query.ask as string;
    let response = await sendOpenAIMessage(ask);
    res.status(response.status);
    res.json(response);
}