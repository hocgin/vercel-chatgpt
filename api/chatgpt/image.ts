import {VercelRequest, VercelResponse} from "@vercel/node";
import fetch from 'node-fetch';
import {LangKit} from "../../utils/lang.js";

export default async function handler(req: VercelRequest, res: VercelResponse) {
    let {message} = req.body ?? {};
    try {
        let tokenList = `${process.env.OPENAI_TOKENS}`.split(',')
            .filter(e => e.trim().length).sort(_ => .5 - Math.random());
        return res.send((await request(message, process.env.OPENAI_TOKEN, tokenList)));
    } catch (e) {
        console.log('错误', e);
        return res.send({
            success: false,
            message: `系统异常，请联系管理员`
        });
    }
}


async function request(message, token = process.env.OPENAI_TOKEN, tokenList = []) {
    message = `${message}`.trim();
    LangKit.assertTrue(message.length > 0 && message.length < 1000, '描述信息长度不符合');

    let bodyStr = JSON.stringify({
        "n": 1,
        "prompt": message,
        "size": '256x256',
        "response_format": "url"
    });
    let response = await fetch(`https://api.openai.com/v1/images/generations`, {
        method: 'POST',
        headers: {
            [`Authorization`]: `Bearer ${token}`,
            [`Content-Type`]: `application/json`
        },
        body: bodyStr,
    });
    let result = await response.json();
    return {
        success: true,
        data: result?.data ?? []
    }
}