import queryString from 'query-string';
import get from 'lodash/get';


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

