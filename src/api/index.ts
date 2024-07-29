import axios from './axios';
import type { ApiResponseType } from '../types';

const baseUrl = import.meta.env.VITE_GPT_BASE_URL;
const apiKey = import.meta.env.VITE_GPT_API_KEY;

export type SendMessage = {
  role: string;
  content: string;
};

export const fetchSendMessage = async (
  messages: SendMessage[],
): Promise<ApiResponseType<any>> => {
  return axios.post(
    '/api/sendMessage',
    {
      model: 'qwen-max',
      input: {
        messages,
      },
    },
    {
      baseURL: baseUrl,
      headers: {
        Authorization: `Bearer ${apiKey}`,
      },
    },
  );
};
