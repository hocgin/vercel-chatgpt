import {VercelRequest, VercelResponse} from "@vercel/node";
import fetch from 'node-fetch';
import {LangKit} from "../../utils/lang.js";

interface Message {
    role: string;
    content: string;
    sendAt: number;
    type: 'image' | 'content'
}

enum MessageType {
    Image = 'image',
    Content = 'content',
}


export default async function handler(req: VercelRequest, res: VercelResponse) {
    let {messages = [] as Message[]} = req.body ?? {};
    try {
        LangKit.assertTrue(messages.length > 0, `系统繁忙`);
        let token = getRandomToken();
        return res.send((await request(messages, token.token, token.tokenList)));
    } catch (e) {
        console.log('错误', e);
        return res.send({
            success: false,
            message: `系统异常，请联系管理员`
        });
    }
};


async function request(messages: Message[], token = process.env.OPENAI_TOKEN, tokenList = []) {
    let response, bodyStr;
    // 判断是请求文本还是请求图片
    let lastMessage = messages[messages.length - 1];
    let isGetImage = lastMessage.type === MessageType.Image;
    if (isGetImage) {
        bodyStr = JSON.stringify({
            "n": 1,
            "prompt": lastMessage.content,
            "size": '256x256',
            "response_format": "url"
        });
        response = await fetch(`https://api.openai.com/v1/images/generations`, {
            method: 'POST',
            headers: {
                [`Authorization`]: `Bearer ${token}`,
                [`Content-Type`]: `application/json`
            },
            body: bodyStr,
        });

    } else {
        bodyStr = JSON.stringify({
            "model": "gpt-3.5-turbo",
            "messages": messages.filter(e => MessageType.Image !== e?.type).map(({role, content}) => ({
                role,
                content
            })),
        });
        response = await fetch(`https://api.openai.com/v1/chat/completions`, {
            method: 'POST',
            headers: {
                [`Authorization`]: `Bearer ${token}`,
                [`Content-Type`]: `application/json`
            },
            body: bodyStr,
        });
    }

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
    console.log(`状态码: ${response.status}, 请求信息: ${bodyStr}, \n响应信息: ${result}`);
    if (result?.error) {
        return {
            success: false,
            message: `${result.error?.message}`
        };
    }

    // 如果是请求图片
    if (isGetImage) {
        // {"url": ""}
        let content = result?.data ?? [];
        return {
            success: true,
            message: 'ok',
            data: [...messages, {
                content,
                role: `assistant`,
                type: MessageType.Image,
                sendAt: Date.now()
            } as Message]
        };
    }


    return {
        success: true,
        message: 'ok',
        data: [...messages, {
            ...result?.choices?.[0].message,
            type: MessageType.Content,
            sendAt: Date.now()
        } as Message]
    };
}

function getRandomToken() {
    let tokenList = `${process.env.OPENAI_TOKENS}`.split(',')
        .filter(e => e.trim().length).sort(_ => .5 - Math.random());
    return {token: tokenList[0], tokenList: tokenList.splice(1)}
}