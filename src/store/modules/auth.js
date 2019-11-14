import Cookies from 'js-cookie';

import api from 'Common/js/api';
import { getParam, redirectToAuth } from 'Common/js/helpers';

export default {
  namespaced: true,
  state: {
    token: null,
    currentUser: null,
  },
  mutations: {
    setToken(state, payload) {
      state.token = payload;
      api.defaults.headers.common.Authorization = `Bearer ${payload}`;

      Cookies.set('mxpSSOToken', payload, {
        expires: 365,
        domain: `.${window.location.hostname}`,
      });
    },
    setCurrentUser(state, payload) {
      state.currentUser = payload;
    },
  },
  actions: {
    getToken({ commit }) {
      const token = getParam('access_token', Cookies.get('mxpSSOToken'));

      // Если токен есть, задействуем его
      if (token) commit('setToken', token);
      // Если нет, кидаем на авторизацию
      else redirectToAuth();
    },
    clearToken() {
      Cookies.remove('mxpSSOToken');
      redirectToAuth();
    },
    loadCurrentUser({ commit }) {
      api
        .post('token/decode')
        .then(({ data: { data: { locale, permissions, roles }, sub } }) => {
          commit('setCurrentUser', {
            locale: locale.language,
            currency: locale.currency,
            timezone: locale.timeZone,
            permissions,
            roles,
            login: sub,
          });
        })
        .catch(() => {});
    },
  },
  getters: {
    getCurrentUser: state => state.currentUser,
    isAdmin: state => state.currentUser && state.currentUser.roles.includes('admin'),
  },
};
