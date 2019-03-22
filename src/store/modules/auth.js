import Cookies from 'js-cookie';

import api from 'Common/js/api';
import {getParam, redirectToAuth} from 'Common/js/helpers';
import {COOKIES_EXP_DAYS} from 'Constants/config';


const TOKEN_COOKIE_NAME = 'token';


export default {
    namespaced: true,
    state: {
        token: null,
        currentUser: null,
    },
    mutations: {
        setToken (state, payload) {
            state.token = payload;
            api.defaults.headers.common['Authorization'] = `Bearer ${payload}`;
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
            api.post('token/decode')
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
        isAdmin: state => state.currentUser && state.currentUser.role === 'admin',
    },
}