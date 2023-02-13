import {Configuration, OpenAIApi} from "openai";


export let sendMessage = async (askText: string) => {
    const configuration = new Configuration({
        apiKey: process.env.OPENAI_TOKEN,
    });
    const openai = new OpenAIApi(configuration);

    const ask = await openai.createCompletion({
        model: "code-davinci-002",
        prompt: `\"\"\"${askText}\"\"\"`,
        temperature: 0,
        max_tokens: 64,
        top_p: 1.0,
        frequency_penalty: 0.0,
        presence_penalty: 0.0,
        stop: ["\"\"\""],
    });
    return {
        ask,
        message: "ok",
        status: 200,
        success: true,
    };
};
