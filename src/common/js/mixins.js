import { get } from 'lodash';

import api from 'Common/js/api';
import { APP_TITLE } from 'Constants/config';

export default {
  methods: {
    isLMA() {
      return this.$route.matched[0].name === 'lma';
    },
    isCC() {
      return this.$route.matched[0].name === 'cc';
    },
    // Устанавливает название страницы в <title> вместе с названием текущего раздела
    setPageTitle(title) {
      let section = '';

      if (this.$route.matched.length > 1) {
        if (this.isLMA()) {
          section = `${this.$t('lma')} /`;
        } else if (this.isCC()) {
          section = `${this.$t('cc')} /`;
        }
      }

      document.title = `${APP_TITLE} :: ${section} ${title}`;
    },
    // Добавляет к текущим GET-параметрам в URL новые
    replaceRouteQueryParams(params) {
      const query = { ...this.$route.query };

      Object.keys(params).forEach(key => {
        // prettier-ignore
        // Чтобы в URL не попадали параметры без значений
        const val = (params[key] !== '' && params[key] !== null)
          ? params[key]
          : undefined;

        // Чтобы не присваивались undefined-значения тем параметрам, которых в URL и так нет
        if (typeof val !== 'undefined' || typeof this.$route.query[key] !== 'undefined')
          query[key] = val;
      });

      this.$router.push({ query });
    },
    // Возвращает название страницы для переданного или текущего роута
    getRoutePageName(route) {
      // eslint-disable-next-line
      if (!route) route = this.$route;

      if (typeof route.meta.pageName === 'object')
        return this.$t(route.meta.pageName.values[this.$route.params[route.meta.pageName.param]]);

      return this.$t(route.meta.pageName || route.name);
    },
    // Отображение окна подтверждения действия
    confirm(message, callback, confirmButtonText) {
      this.$confirm(message, this.$t('needConfirmation'), {
        confirmButtonText,
      })
        .then(() => callback(true))
        .catch(() => callback());
    },
    // Отображение окна с ворнингом
    warning(message, title) {
      this.$alert(message, title || this.$t('warning'), {
        type: 'warning',
      }).catch(() => {});
    },
    // Отображение уведомления об успешном сохранении изменений
    changesSavedMessage() {
      this.$message({
        message: this.$t('changesSaved'),
        type: 'success',
      });
    },
    // Возвращает правило валидации
    validationRule(rule, param) {
      switch (rule) {
        case 'required':
          return { required: true, message: this.$t('validation.required') };
        case 'fileRequired':
          return {
            required: true,
            message: this.$t('validation.fileRequired'),
          };
        case 'selectRequired':
          return {
            required: true,
            message: this.$t('validation.selectRequired'),
          };
        case 'phone':
          return {
            required: false,
            message: this.$t('validation.invalidPhoneNumber'),
            pattern: /^\d{11}$/,
          };
        case 'email':
          return { type: 'email', message: this.$t('validation.email') };
        case 'numberMin':
          return {
            type: 'number',
            min: param[0],
            message: this.$t('validation.min', { val: param[1] }),
          };
        case 'numberMax':
          return {
            type: 'number',
            max: param[0],
            message: this.$t('validation.max', { val: param[1] }),
          };
        default:
          return {};
      }
    },
    // Приводит в порядок вводимый в input адрес с помощью сервиса dadata.ru
    dadataCleanAddress(address, callback) {
      // eslint-disable-next-line
      address = address.trim();

      if (address.length) {
        api.post('dadata/clean-address', { address }).then(({ data }) => {
          const value = get(data, '[0].result');
          if (value) callback([{ value }]);
        });
      }

      // Чтобы скрыть процесс загрузки результатов, callback вызываем сразу
      callback([]);
    },
  },
};
