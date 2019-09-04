import api from 'Common/js/api';
import { HEADER_PG_PAGE_COUNT, HEADER_PG_TOTAL_COUNT } from 'Constants/config';

export default {
  namespaced: true,
  state: {
    // Данные для списка шаблонов
    list: {
      data: null, // Сам список
      pages: 0, // К-во страниц
      totalCount: 0, // Общее число шаблонов
    },
    // Данные для страницы создания/редактирования шаблона
    template: null,
  },
  mutations: {
    clearList(state) {
      state.list = {
        data: null,
        pages: 0,
        totalCount: 0,
      };
    },
    setList(state, payload) {
      state.list = payload;
    },
    setTemplate(state, payload) {
      state.template = payload;
    },
  },
  actions: {
    loadList({ commit }, params) {
      commit('clearList');

      api.get('/order-template', { params }).then(({ data, headers }) => {
        commit('setList', {
          data,
          pages: Number(headers[HEADER_PG_PAGE_COUNT]),
          totalCount: Number(headers[HEADER_PG_TOTAL_COUNT]),
        });
      });
    },
    removeTemplate(context, { id, callback }) {
      // eslint-disable-next-line prettier/prettier
      api
        .delete(`order-template/${id}`)
        .then(({ data }) => callback(data.status === 'ok'));
    },
  },
};
