import queryString from 'query-string';
import { get } from 'lodash';
import Bowser from 'bowser';

import { AUTH_SERVER_PATH, CLIENT_ID } from 'Common/js/env';

// Возвращает значение GET-параметра из текущего URL
export const getParam = (name, defaultValue) =>
  get(queryString.parse(window.location.search), name, defaultValue);

// Преобразует строковое значение 'true' / 'false' в булево
export const str2Bool = str => str === 'true' || str === true;

// Генерирует случайную строку заданной длины
export const generateRandomString = (len = 8) => {
  let str = '';
  const possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';

  for (let i = 0; i < len; ++i) {
    str += possible.charAt(Math.floor(Math.random() * possible.length));
  }

  return str;
};

// Возвращает MIME-type из base64
export const getMimeFromBase64 = base64 => {
  const mime = base64.match(/data:([a-zA-Z0-9]+\/[a-zA-Z0-9-.+]+).*,.*/);
  return get(mime, '[1]', null);
};

// Определяет расширение файла по base64
export const getExtensionFromBase64 = base64 => {
  const mime = getMimeFromBase64(base64);
  const extensions = {
    'image/jpeg': 'jpg',
    'image/png': 'png',
    'image/bmp': 'bmp',
    'image/tiff': 'tiff',
    'application/pdf': 'pdf',
    'application/vnd.ms-excel': 'xls',
  };

  return extensions[mime];
};

// Редиректит на страницу авторизации
export const redirectToAuth = () => {
  const redirectUri = `${window.location.protocol}//${window.location.host}`;
  window.location.href = `${AUTH_SERVER_PATH}auth?client_id=${CLIENT_ID}&redirect_uri=${redirectUri}`;
};

// Возвращает название браузера пользователя
export const getBrowserName = () => Bowser.getParser(window.navigator.userAgent).getBrowserName();

// Анимированно скроллит страницу до указанной позиции
export const scrollToPos = top => {
  if (getBrowserName().name === 'Microsoft Edge') {
    window.scrollTo(0, top);
  } else {
    window.scrollTo({ top, behavior: 'smooth' });
  }
};

// Находит координаты средней точки для установки центра карты
export const centerCoordsFromGeometry = geometry => {
  const center = { lng: 0, lat: 0 };
  let count = 0;

  geometry.features.forEach(({ geometry: { coordinates } }) => {
    coordinates.forEach(i => {
      i.forEach(j => {
        center.lng += parseFloat(j[0]);
        center.lat += parseFloat(j[1]);

        ++count;
      });
    });
  });

  center.lng /= count;
  center.lat /= count;

  return center;
};

// Подключает JS к странице
export const addScript = (src, onload) => {
  const script = document.createElement('script');

  script.setAttribute('src', src);
  document.body.appendChild(script);

  if (onload) script.onload = onload;
};

// Помещает значение в массив в случае, если оно не является массивом
export const value2Array = val => {
  if (!val) return [];

  return Array.isArray(val) ? val : [val];
};
