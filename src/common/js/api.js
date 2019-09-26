import axios from 'axios';
import { get } from 'lodash';

import { API_PATH } from 'Common/js/env';
import { redirectToAuth } from 'Common/js/helpers';

const api = axios.create({
  baseURL: API_PATH,
});

api.interceptors.response.use(null, err => {
  // Ошибка авторизации
  if (err.response.status === 401) return redirectToAuth();

  if (err.response.status !== 404) {
    // Код ошибки
    const code = get(err, 'response.data.code');
    // Получение текста сообщения об ошибке по коду
    let message = code ? window.app.$t(`serverErrors.${code}`) : null;

    // Если текст сообщения для данного кода ошибки не найден
    if (!message || message === `serverErrors.${code}`)
      // Вывести сообщение по умолчанию
      message = window.app.$t('serverError');

    window.app.$message({ message, type: 'error' });
  }

  return Promise.reject(err);
});

export default api;
