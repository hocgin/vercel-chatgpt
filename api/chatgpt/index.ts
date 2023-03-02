import {VercelRequest, VercelResponse} from "@vercel/node";
import fetch from 'node-fetch';


export default async function handler(req: VercelRequest, res: VercelResponse) {
    let {messages = []} = req.body ?? {};
    try {
        let tokenList = `${process.env.OPENAI_TOKENS}`.split(',').filter(e => e.trim().length);
        return res.send((await request(messages, process.env.OPENAI_TOKEN, tokenList)));
    } catch (e) {
        console.log('错误', e);
        return res.send({
            success: false,
            message: `系统异常，请联系管理员`
        });
    }
};


async function request(messages, token = process.env.OPENAI_TOKEN, tokenList = []) {
    let bodyStr = JSON.stringify({
        "model": "gpt-3.5-turbo",
        "messages": messages
    });
    let response = await fetch(`https://api.openai.com/v1/chat/completions`, {
        method: 'POST',
        headers: {
            [`Authorization`]: `Bearer ${token}`,
            [`Content-Type`]: `application/json`
        },
        body: bodyStr,
    });
    console.log(`状态码: ${response.status}, 请求信息: ${bodyStr}, \n响应信息: ${result}`);

    // 如果超额了
    if ([429, 401].indexOf(response.status) > 0) {
        // 账号额度都不够了
        if (tokenList.length <= 0) {
            console.warn('所有账号额度都不够了')
            return {
                success: false,
                message: `额度不够，请联系管理员`,
            };
        } else {
            let newToken = tokenList[0];
            return request(messages, newToken, tokenList.splice(1))
        }
    }
    // openai 系统错误
    else if ([500, 429].indexOf(response.status) > 0) {
        return {
            success: false,
            message: `系统繁忙，请稍后`,
        };
    }
    let result = await response.json();
    if (result?.error) {
        return {
            success: false,
            message: `${result.error?.message}`
        };
    }
    return {
        success: true,
        message: 'ok',
        data: [...messages, result?.choices?.[0].message]
    };
}
