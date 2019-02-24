import axios from 'axios';
import Cookies from 'js-cookie';
import get from 'lodash/get';

import {getParam} from '../../common/js/helpers';
import {API_PATH, SSO_AUTH_URL, COOKIES_EXP_DAYS} from '../../constants/config';
import {CLIENT_ID} from '../../common/js/env';


// Редиректит на страницу авторизации
function redirectToAuth () {
    let redirect = `${location.protocol}//${location.host}`;
    location.href = `${SSO_AUTH_URL}?client_id=${CLIENT_ID}&redirect_uri=${redirect}`;
}


const TOKEN_COOKIE_NAME = 'token';


axios.defaults.baseURL = API_PATH;
axios.interceptors.response.use(res => {
    // Вывод ошибки с бэка
    if (get(res, 'data.status') === 'error') {
        let message = get(res, 'data.message', window.app.$t('serverError'));
        window.app.$message({ message, type: 'error' });
    }

    return res;
}, err => {
    // Если по API был получен статус 401
    if (get(err, 'response.status') === 401)
        return redirectToAuth();
    // Вывод сообщения об ошибке подключения к серверу
    window.app.$message({
        message: window.app.$t('serverError'),
        type: 'error',
    });

    return Promise.reject(err);
});


export default {
    namespaced: true,
    state: {
        token: null,
        currentUser: null,
    },
    mutations: {
        setToken (state, payload) {
            state.token = payload;
            axios.defaults.headers.common['Authorization'] = `Bearer ${payload}`;
            Cookies.set(TOKEN_COOKIE_NAME, payload, { expires: COOKIES_EXP_DAYS });
        },
        setCurrentUser: (state, payload) => state.currentUser = payload,
    },
    actions: {
        getToken ({commit}) {
            let token = getParam( 'access_token', Cookies.get(TOKEN_COOKIE_NAME));

            if (token) commit('setToken', token); // Если токен есть, задействуем его
            else redirectToAuth(); // Если нет, кидаем на авторизацию
        },
        clearToken () {
            Cookies.remove('token');
            redirectToAuth();
        },
        getCurrentUser ({commit}) {
            axios.post('token/decode')
                .then(({data:{data}}) => {
                    commit('setCurrentUser', {
                        locale: data.locale.language,
                        currency: data.locale.currency,
                        timezone: data.locale.timeZone,
                        role: data.credentials.lma,
                    });
                });
        },
    },
    getters: {
        isAdmin: (state) => state.currentUser && state.currentUser.role === 'admin',
    },
}