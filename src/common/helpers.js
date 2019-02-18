import queryString from 'query-string';
import get from 'lodash/get';


// Возвращает значение GET-параметра из текущего URL
export const getParam = (name, defaultValue) =>
    get(queryString.parse(location.search), name, defaultValue);


// Преобразует строковое значение 'true' / 'false' в булево
export const str2Bool = str => (str === 'true' || str === true);


