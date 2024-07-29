import axios from 'axios';

const instance = axios.create();

instance.interceptors.response.use(
  (res) => {
    if (res.data.success) {
      return res;
    } else {
      return Promise.reject(res);
    }
  },
  (error) => {
    return Promise.reject(error.response?.data?.error);
  },
);

export default instance;
