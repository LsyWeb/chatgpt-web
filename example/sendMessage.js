const aircode = require('aircode');

module.exports = async function (params) {
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
  console.log(process.env.CHAT_GPT_API_KEY, 'env');

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
