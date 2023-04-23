import axios from 'axios';

const instance = axios.create();

instance.interceptors.response.use(
  (res) => {
    if (res.data.code === 0) {
      return res.data;
    } else {
      return Promise.reject(res.data);
    }
  },
  (error) => {
    return Promise.reject(error.response.data.error);
  },
);

export default instance;
