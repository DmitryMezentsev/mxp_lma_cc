import api from 'Common/js/api';
import { HEADER_PG_PAGE_COUNT, HEADER_PG_TOTAL_COUNT } from 'Constants/config';

export default {
  namespaced: true,
  state: {
    list: {
      data: null,
      totalCount: 0,
      pageCount: 0,
    },
    opened: null,
  },
  mutations: {
    clearList(state) {
      state.list = {
        data: null,
        totalCount: 0,
        pageCount: 0,
      };
    },
    setList(state, payload) {
      state.list = payload;
    },
    setOpened(state, payload) {
      state.opened = payload;
    },
  },
  actions: {
    loadList({ commit }, params) {
      commit('clearList');

      api.get('geo', { params }).then(({ data, headers }) => {
        commit('setList', {
          data,
          totalCount: Number(headers[HEADER_PG_TOTAL_COUNT]),
          pageCount: Number(headers[HEADER_PG_PAGE_COUNT]),
        });
      });
    },
    patchZone(context, { id, params, callback }) {
      // eslint-disable-next-line
      api
        .patch(`geo/${id}`, { ...params })
        .then(({ data }) => callback(data.status === 'ok'));
    },
    saveZone(context, { zone, callback }) {
      // eslint-disable-next-line
      const req = zone.geoId
        ? api.put(`geo/${zone.geoId}`, zone)
        : api.post('geo', zone);

      // eslint-disable-next-line
      req
        .then(({ data }) => callback(data.status === 'ok'))
        .catch(() => callback());
    },
    createNewZone({ commit }) {
      commit('setOpened', {
        properties: {
          name: '',
          isOperating: true,
        },
        type: '',
        geometry: null,
      });
    },
    openZone({ commit }, id) {
      commit('setOpened', null);

      api.get(`geo/${id}`).then(({ data }) => commit('setOpened', data));
    },
    closeZone({ commit }) {
      commit('setOpened', null);
    },
  },
};
