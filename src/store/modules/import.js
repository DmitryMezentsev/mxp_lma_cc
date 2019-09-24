import api from 'Common/js/api';
import { HEADER_PG_PAGE_COUNT } from 'Constants/config';

export default {
  namespaced: true,
  state: {
    // Данные для списка шаблонов
    templates: {
      data: null, // Сам список
      pages: 0, // К-во страниц
    },
    // Данные для страницы создания/редактирования шаблона
    template: null,
  },
  mutations: {
    clearTemplates(state) {
      state.templates = {
        data: null,
        pages: 0,
      };
    },
    setTemplates(state, payload) {
      state.templates = payload;
    },
    setTemplate(state, payload) {
      state.template = payload;
    },
  },
  actions: {
    loadTemplates({ commit }, params) {
      commit('clearTemplates');

      api.get('import/template', { params }).then(({ data, headers }) => {
        commit('setTemplates', {
          data,
          pages: Number(headers[HEADER_PG_PAGE_COUNT]),
        });
      });
    },
    removeTemplate(context, { id, callback }) {
      // eslint-disable-next-line prettier/prettier
      api
        .delete(`import/template/${id}`)
        .then(({ data }) => callback(data.status === 'ok'));
    },
    createNewTemplate({ commit }) {
      commit('setTemplate', {
        name: '',
        template: {},
        file: '',
        filename: '',
      });
    },
    openTemplate({ commit }, id) {
      commit('setTemplate', null);

      api
        .get(`import/template/${id}`)
        .then(({ data }) => commit('setTemplate', data))
        .catch(({ response }) => {
          if (response.status === 404) window.app.$router.push({ name: 'ccOrdersImportTemplates' });
        });
    },
    saveTemplate(context, { template, callback }) {
      const req = template._id // eslint-disable-line no-underscore-dangle
        ? api.put(`import/template/${template._id}`, template) // eslint-disable-line
        : api.post('import/template', template);

      req.then(({ data }) => callback(data.status === 'ok')).catch(() => callback());
    },
  },
};
