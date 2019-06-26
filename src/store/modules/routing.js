import api from 'Common/js/api';
import { HEADER_PG_PAGE_COUNT } from 'Constants/config';

export default {
  namespaced: true,
  state: {
    zonesList: {
      data: null,
      pages: 0,
    },
    ordersList: [],
    openedZone: null,
    mapZoneDetails: null,
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
            courierId: params.courier,
            statusId: params.status,
            deliveryZoneId: params.zone,
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
            ],
          },
        })
        .then(({ data }) => {
          commit('setOrdersList', data);
        });
    },
  },
};
