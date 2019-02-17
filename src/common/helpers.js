import queryString from 'query-string';
import get from 'lodash/get';


// Возвращает значение GET-параметра из текущего URL
export const getParam = (name, defaultValue) =>
    get(queryString.parse(location.search), name, defaultValue);


