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
      localStorage.mxpSSOToken = payload;
    },
    setCurrentUser(state, payload) {
      state.currentUser = payload;
    },
  },
  actions: {
    getToken({ commit }) {
      const token = getParam('access_token', localStorage.mxpSSOToken);

      // Если токен есть, задействуем его
      if (token) commit('setToken', token);
      // Если нет, кидаем на авторизацию
      else redirectToAuth();
    },
    clearToken() {
      localStorage.removeItem('mxpSSOToken');
      redirectToAuth();
    },
    loadCurrentUser({ commit }) {
      api.post('token/decode').then(({ data: { data } }) => {
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
    getCurrentUser: state => state.currentUser,
    isAdmin: state => state.currentUser && state.currentUser.role === 'admin',
  },
};
