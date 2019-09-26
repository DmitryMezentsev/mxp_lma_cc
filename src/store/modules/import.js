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
    // История импортов
    history: {
      data: null, // Сам список
      pages: 0, // К-во страниц
    },
    // Флаг отображения окна импорта / ID выбранного по умолчанию шаблона импорта
    importDialog: false,
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
    clearHistory(state) {
      state.history = {
        data: null,
        pages: 0,
      };
    },
    setHistory(state, payload) {
      state.history = payload;
    },
    showImportDialog(state, payload) {
      state.importDialog = payload || true;
    },
    closeImportDialog(state) {
      state.importDialog = false;
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
        .then(() => callback(true))
        .catch(() => callback());
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

      req.then(({ data }) => callback(data.orderTemplateId)).catch(() => callback());
    },
    loadHistory({ commit }, params) {
      commit('clearHistory');

      api.get('import/history', { params }).then(({ data, headers }) => {
        commit('setHistory', {
          data,
          pages: Number(headers[HEADER_PG_PAGE_COUNT]),
        });
      });
    },
    import(context, { data, callback }) {
      api
        .post('import/upload', data)
        .then(() => callback(true))
        .catch(() => callback());
    },
  },
};
