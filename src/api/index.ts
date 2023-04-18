import type { ApiResponseType } from '@/types';
import axios from 'axios';

const url = import.meta.env.VITE_AIR_CODE_SEND_MESSAGE_URL;
export const fetchSendMessage = async (
  message: string,
  parentMessageId?: string,
): Promise<ApiResponseType<any>> => {
  const response = await axios.post(url, {
    message,
    parentMessageId,
  });
  return response.data;
};
