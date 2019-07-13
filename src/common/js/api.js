import axios from 'axios';
import { get } from 'lodash';

import { redirectToAuth } from 'Common/js/helpers';
import { API_PATH } from 'Common/js/env';

const api = axios.create({
  baseURL: API_PATH,
});

api.interceptors.response.use(
  res => {
    // Вывод ошибки с бэка
    if (get(res, 'data.status') === 'error') {
      const message = get(res, 'data.message', window.app.$t('serverError'));
      window.app.$message({ message, type: 'error' });
    }

    return res;
  },
  err => {
    const status = get(err, 'response.status');

    // Ошибка авторизации
    if (status === 401) return redirectToAuth();

    if (status !== 404) {
      // Вывод сообщения об ошибке подключения к серверу
      window.app.$message({
        message: window.app.$t('serverError'),
        type: 'error',
      });
    }

    return Promise.reject(err);
  },
);

export default api;
