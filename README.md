# Chatgpt on Vercel

![vercel-chatgpt](https://vercelbadge.vercel.app/api/hocgin/vercel-chatgpt)

> Easily chatgpt api as a service. [![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/hocgin/vercel-chatgpt)

## Usage

```bash
curl https://${your_vercel_chatgpt}.vercel.app/api?ask=${your_ask}
```

## Example

### Input

```bash
curl https://vercel-chatgpt.vercel.app/api?ask=什么是Java
```

### Output

```json
{
  "status": 200,
  "success": true,
  "message": "ok",
  "data": "Java 是一种广泛使用的编程语言，它可以用于开发各种各样的应用程序，包括移动应用、企业级应用和 Web 应用程序。Java 是一种面向对象的语言，它拥有丰富的类库和工具，可以帮助开发人员更快速地开发应用程序。Java 是跨平台的，这意味着可以在多种操作系统上运行，包括 Windows、macOS 和 Linux 等。Java 程序通常使用一个独立的 Java 虚拟机来执行，这样就可以保证程序在不同平台上的一致性"
}
```

## Deploy your own instance

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/hocgin/vercel-chatgpt)

Vercel ENV:

```env
SESSION_TOKEN=${your_session_token}
```

## License

MIT 