import {Configuration, OpenAIApi} from "openai";


export async function sendMessage(askText: string) {
    const configuration = new Configuration({
        apiKey: process.env.OPENAI_TOKEN,
    });
    const openai = new OpenAIApi(configuration);

    const response = await openai.createCompletion({
        model: "code-davinci-002",
        prompt: `${askText}`,
    });
    let ask = response.data?.choices?.[0].text;
    return {
        ask,
        message: "ok",
        status: 200,
        success: true,
    };
};
