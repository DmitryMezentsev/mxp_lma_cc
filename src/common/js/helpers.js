import queryString from 'query-string';
import get from 'lodash/get';

import {AUTH_SERVER_PATH, CLIENT_ID} from './env';



// Возвращает значение GET-параметра из текущего URL
export const getParam = (name, defaultValue) =>
    get(queryString.parse(location.search), name, defaultValue);


// Преобразует строковое значение 'true' / 'false' в булево
export const str2Bool = str => (str === 'true' || str === true);


// Генерирует случайную строку заданной длины
export const generateRandomString = (len = 8) => {
    let str = '';
    const possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';

    for (let i = 0; i < len; ++i)
        str += possible.charAt(Math.floor(Math.random() * possible.length));

    return str;
};


// Возвращает MIME-type из base64
export const getMimeFromBase64 = (base64) => {
    const mime = base64.match(/data:([a-zA-Z0-9]+\/[a-zA-Z0-9-.+]+).*,.*/);
    return (mime && mime.length) ? mime[1] : null;
};


// Определяет расширение файла по base64
export const getExtensionFromBase64 = (base64) => {
    const mime = getMimeFromBase64(base64);
    const extensions = {
        'image/jpeg': 'jpg',
        'image/png': 'png',
        'image/bmp': 'bmp',
        'image/tiff': 'tiff',
        'application/pdf': 'pdf',
    };

    return extensions[mime];
};


// Редиректит на страницу авторизации
export const redirectToAuth = () => {
    const redirectUri = `${location.protocol}//${location.host}`;
    location.href = `${AUTH_SERVER_PATH}auth?client_id=${CLIENT_ID}&redirect_uri=${redirectUri}`;
};


