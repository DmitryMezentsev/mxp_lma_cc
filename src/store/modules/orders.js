import api from 'Common/js/api';
import {
  HEADER_PG_PAGE_COUNT,
  HEADER_PG_TOTAL_COUNT,
  CORE_REQUEST_HEADERS,
} from 'Constants/config';

export default {
  namespaced: true,
  state: {
    // Данные для списка заказов
    list: {
      data: null, // Сам список
      pages: 0, // К-во страниц
      totalCount: 0, // Общее число заказов
      sumPriceDeclared: 0, // Сумма наложенного платежа
    },
    // Открытый заказ из списка
    opened: null,
    // Выбранные в таблице списка заказы
    selected: [],
    // История статусов заказа для всплывающего окна
    statusesHistory: null,
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
    setStatusesHistory(state, payload) {
      state.statusesHistory = payload;
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
    // Назначает курьера на группу заказов
    setCourier(context, { courierId, orderIds, callback }) {
      api
        .patch(
          'orders/serviceInfo/courierId',
          {
            courierId,
            orderIds,
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
