import { HEADER_PG_PAGE_COUNT } from 'Constants/config';
import api from 'Common/js/api';

export default {
  namespaced: true,
  state: {
    // Данные для списка курьеров
    list: {
      data: null, // Сам список
      pages: 0, // К-во страниц
    },
    // Данные для страницы создания/редактирования курьера
    courier: null,
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
    setCourier(state, payload) {
      state.courier = payload;
    },
  },
  actions: {
    loadList({ commit }, params) {
      commit('clearList');

      api
        .get('courier', { params })
        .then(({ data, headers }) => {
          commit('setList', {
            data,
            pages: Number(headers[HEADER_PG_PAGE_COUNT]),
          });
        })
        .catch(() => {});
    },
    patchCourier(context, { id, params, callback }) {
      // eslint-disable-next-line prettier/prettier
      api
        .patch(`courier/${id}`, { ...params })
        .then(() => callback(true))
        .catch(() => callback());
    },
    createNewCourier({ commit }) {
      commit('setCourier', {
        isActive: true,
        fullname: '',
        shortname: '',
        phone1: '',
        phone2: '',
        livingArea: '',
        permissions: {
          legalpersonId: '',
          warehouseIds: [],
        },
        passport: {
          photo: '',
          series: '',
          address: '',
          issueInfo: '',
          birthday: '',
        },
        transport: {
          brand: '',
          model: '',
          registrationNumber: '',
        },
        documents: [],
        access: {
          login: '',
          password: '',
        },
      });
    },
    openCourier({ commit }, id) {
      commit('setCourier', null);

      api
        .get(`courier/${id}`)
        .then(({ data }) => commit('setCourier', data))
        .catch(({ response }) => {
          if (response.status === 404) window.app.$router.push({ name: 'lmaCouriers' });
        });
    },
    saveCourier({ commit }, { courier, callback }) {
      commit('setCourier', courier);

      const req = courier.courierId
        ? api.put(`courier/${courier.courierId}`, courier)
        : api.post('courier', courier);

      req.then(() => callback(true)).catch(() => callback());
    },
  },
};
