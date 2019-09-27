import { HEADER_PG_PAGE_COUNT } from 'Constants/config';
import api from 'Common/js/api';
import { value2Array } from 'Common/js/helpers';

export default {
  namespaced: true,
  state: {
    // Данные для списка зон
    zonesList: {
      data: null, // Сам список
      pages: 0, // К-во страниц
    },
    // Список заказов для карты роутинга
    ordersList: [],
    // Открытая зона из списка
    openedZone: null,
    // Информация о зоне для боковой панели страницы "Роутинг / Карта"
    mapZoneDetails: null,
    // Информация о заказе для боковой панели страницы "Роутинг / Карта"
    mapOrderDetails: null,
  },
  mutations: {
    clearZonesList(state) {
      state.zonesList = {
        data: null,
        pages: 0,
      };
    },
    setZonesList(state, payload) {
      state.zonesList = payload;
    },
    setOpenedZone(state, payload) {
      state.openedZone = payload;
    },
    setMapZoneDetails(state, payload) {
      state.mapZoneDetails = payload;
    },
    setMapOrderDetails(state, payload) {
      state.mapOrderDetails = payload;
    },
    setOrdersList(state, payload) {
      state.ordersList = payload;
    },
  },
  actions: {
    loadZonesList({ commit }, params) {
      commit('clearZonesList');

      api.get('geo', { params }).then(({ data, headers }) => {
        commit('setZonesList', {
          data,
          pages: Number(headers[HEADER_PG_PAGE_COUNT]),
        });
      });
    },
    patchZone(context, { id, params, callback }) {
      api
        .patch(`geo/${id}`, { ...params })
        .then(() => callback(true))
        .catch(() => callback());
    },
    saveZone(context, { zone, callback }) {
      // eslint-disable-next-line prettier/prettier
      const req = zone.geoId
        ? api.put(`geo/${zone.geoId}`, zone)
        : api.post('geo', zone);

      req.then(() => callback(true)).catch(() => callback());
    },
    createNewZone({ commit }) {
      commit('setOpenedZone', {
        properties: {
          name: '',
          isOperating: true,
        },
        type: '',
        geometry: null,
      });
    },
    openZone({ commit }, id) {
      commit('setOpenedZone', null);

      api.get(`geo/${id}`).then(({ data }) => commit('setOpenedZone', data));
    },
    closeZone({ commit }) {
      commit('setOpenedZone', null);
    },
    loadOrdersList({ commit }, params) {
      api
        .get('order', {
          params: {
            courierId: value2Array(params.courier),
            statusId: value2Array(params.status),
            deliveryZoneId: value2Array(params.zone),
            deliveryDateFrom: params.date,
            deliveryDateTo: params.date,
            perPage: 0,
            serviceType: 0,
            fields: [
              '_id',
              'internalNumber',
              'sender.internalNumber',
              'recipient.address.latitude',
              'recipient.address.longitude',
              'recipient.address.value',
              'deliveryOrder.dateTimeInterval',
              'serviceInfo.courierId',
              'currentStatus.statusInfo.isEnd',
            ],
          },
        })
        .then(({ data }) => {
          commit('setOrdersList', data);
        });
    },
  },
};
