module.exports = async function (params) {
  // 由于*chatgpt*这个库里面用的是18+版本的node，而云函数目前只支持16.8版本的，需要引入fetch库
  const fetch = await import('node-fetch');
  const { Headers, Request, Response } = fetch;
  if (!globalThis.fetch) {
    globalThis.fetch = fetch.default;
    globalThis.Headers = Headers;
    globalThis.Request = Request;
    globalThis.Response = Response;
  }
  const { ChatGPTAPI } = await import('chatgpt');

  const { message, parentMessageId } = params;

  const api = new ChatGPTAPI({ apiKey: process.env.CHAT_GPT_API_KEY });
  let result;

  if (parentMessageId) {
    result = await api.sendMessage(message, {
      parentMessageId,
    });
  } else {
    result = await api.sendMessage(message);
  }
  console.log('message:', message);
  console.log('data:', result);
  return {
    message: 'success',
    code: 0,
    data: result,
  };
};
