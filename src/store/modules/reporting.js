import { CORE_REQUEST_HEADERS, HEADER_PG_PAGE_COUNT } from 'Constants/config';
import api from 'Common/js/api';

export default {
  namespaced: true,
  state: {
    // Данные для страницы "Прием НП от курьера"
    acceptanceCodFromCourier: null,
    // Отчеты о перечислении НП
    codReports: {
      data: null, // Сам список
      pages: 0, // К-во страниц
    },
  },
  mutations: {
    setAcceptanceCodFromCourier(state, payload) {
      state.acceptanceCodFromCourier = payload;
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
    loadAcceptanceCodFromCourier({ commit }, params) {
      commit('setAcceptanceCodFromCourier', null);

      api
        .get('courier/closeBillingDay', { params })
        .then(({ data: { _meta: { totalCardCOD, totalCashCOD }, data } }) => {
          commit('setAcceptanceCodFromCourier', {
            totalCardCOD,
            totalCashCOD,
            orders: data,
          });
        })
        .catch(() => {});
    },
    loadCodReports({ commit }, params) {
      commit('clearCodReports', null);

      api
        .get('report', { params })
        .then(({ data, headers }) => {
          commit('setCodReports', {
            data,
            pages: Number(headers[HEADER_PG_PAGE_COUNT]),
          });
        })
        .catch(() => {});
    },
    // Закрытие курьера на странице "Прием НП от курьера"
    closeCourier(context, { orders, callback }) {
      api
        .patch(
          'orders/2/cashOnDeliveryStatus',
          {
            values: orders,
          },
          {
            headers: CORE_REQUEST_HEADERS,
          },
        )
        .then(() => callback(true))
        .catch(() => callback());
    },
  },
};
