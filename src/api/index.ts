import axios from './axios';
import type { ApiResponseType } from '../types';

const url = import.meta.env.VITE_AIR_CODE_SEND_MESSAGE_URL;

export const fetchSendMessage = async (
  message: string,
  parentMessageId?: string,
): Promise<ApiResponseType<any>> => {
  return axios.post(url, {
    message,
    parentMessageId,
  });
};
