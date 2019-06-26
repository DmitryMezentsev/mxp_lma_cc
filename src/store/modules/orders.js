import api from 'Common/js/api';
import { HEADER_PG_PAGE_COUNT, HEADER_PG_TOTAL_COUNT } from 'Constants/config';

export default {
  namespaced: true,
  state: {
    list: {
      data: null,
      pages: 0,
      totalCount: 0,
      sumPriceDeclared: 0,
    },
    opened: null,
    selected: [],
  },
  mutations: {
    clearList(state) {
      state.list = {
        data: null,
        pages: 0,
        totalCount: 0,
        sumPriceDeclared: 0,
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

      api.get('order', { params }).then(({ data, headers }) => {
        commit('setList', {
          data,
          pages: Number(headers[HEADER_PG_PAGE_COUNT]),
          totalCount: Number(headers[HEADER_PG_TOTAL_COUNT]),
          sumPriceDeclared: parseFloat(headers['x-sum-price-declared']),
        });
      });
    },
  },
};
