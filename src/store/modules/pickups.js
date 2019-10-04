import { HEADER_PG_PAGE_COUNT } from 'Constants/config';
import api from 'Common/js/api';

export default {
  namespaced: true,
  state: {
    // Данные для списка заборов
    list: {
      data: null, // Сам список
      pages: 0, // К-во страниц
    },
    // Открытый забор из списка
    opened: null,
    // Выбранные в таблице списка заборы
    selected: [],
  },
  mutations: {
    clearList(state) {
      state.list = {
        data: null,
        pages: 0,
      };
    },
    setList(state, payload) {
      state.list = payload;
    },
    setOpened(state, payload) {
      state.opened = payload;
    },
    setSelected(state, payload) {
      state.selected = payload;
    },
    clearSelected(state) {
      state.selected = [];
    },
  },
  actions: {
    loadList({ commit }, params) {
      commit('clearList');

      api
        .get('pickup', { params })
        .then(({ data, headers }) => {
          commit('setList', {
            data,
            pages: Number(headers[HEADER_PG_PAGE_COUNT]),
          });
        })
        .catch(() => {});
    },
    patchPickup(context, { id, params, callback }) {
      api
        .patch(`pickup/${id}`, { ...params })
        .then(() => callback(true))
        .catch(() => callback());
    },
    updatePickup(context, { pickup, callback }) {
      api
        .put(`pickup/${pickup.pickupId}`, pickup)
        .then(() => callback(true))
        .catch(() => callback());
    },
  },
};
