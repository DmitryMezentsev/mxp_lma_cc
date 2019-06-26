import api from 'Common/js/api';
import { HEADER_PG_PAGE_COUNT } from 'Constants/config';

export default {
  namespaced: true,
  state: {
    list: {
      data: null,
      pages: 0,
    },
    opened: null,
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

      api.get('pickup', { params }).then(({ data, headers }) => {
        commit('setList', {
          data,
          pages: Number(headers[HEADER_PG_PAGE_COUNT]),
        });
      });
    },
    patchPickup(context, { id, params, callback }) {
      api
        .patch(`pickup/${id}`, { ...params })
        .then(({ data }) => callback(data.status === 'ok'))
        .catch(() => callback());
    },
    updatePickup(context, { pickup, callback }) {
      api
        .put(`pickup/${pickup.pickupId}`, pickup)
        .then(({ data }) => callback(data.status === 'ok'))
        .catch(() => callback());
    },
  },
};
