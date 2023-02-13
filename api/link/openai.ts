import {Configuration, OpenAIApi} from "openai";


export async function sendMessage(askText: string) {
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
        prompt: `\n\"\"\"\n${askText}\n\"\"\"\n`,
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
