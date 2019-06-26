import api from 'Common/js/api';
import { HEADER_PG_PAGE_COUNT } from 'Constants/config';

export default {
  namespaced: true,
  state: {
    courierCalculation: null,
    codReports: {
      data: null,
      pages: 0,
    },
  },
  mutations: {
    setCourierCalculation(state, payload) {
      state.courierCalculation = payload;
    },
    setCodReports(state, payload) {
      state.codReports = payload;
    },
    clearCodReports(state) {
      state.codReports = {
        data: null,
        pages: 0,
      };
    },
  },
  actions: {
    loadCourierCalculation({ commit }, params) {
      commit('setCourierCalculation', null);

      api
        .get('courier/closeBillingDay', { params })
        .then(({ data: { _meta: { totalCardCOD, totalCashCOD }, data } }) => {
          commit('setCourierCalculation', {
            totalCardCOD,
            totalCashCOD,
            orders: data,
          });
        });
    },
    loadCodReports({ commit }, params) {
      commit('clearCodReports', null);

      api.get('/report', { params }).then(({ data, headers }) => {
        commit('setCodReports', {
          data,
          pages: Number(headers[HEADER_PG_PAGE_COUNT]),
        });
      });
    },
  },
};
