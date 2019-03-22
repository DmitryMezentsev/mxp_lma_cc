import get from 'lodash/get';

import api from 'Common/js/api';
import {APP_TITLE} from 'Constants/config';



export default {
    data () {
        return {
            mixinEventListeners: {
                bindClientWidthListener: null,
            },
        }
    },

    methods: {
        // Устанавливает название страницы в <title>
        setPageTitle: title => {
            document.title = `${APP_TITLE} :: ${title}`;
        },
        // Добавляет к текущим GET-параметрам в URL новые
        replaceRouteQueryParams (params) {
            let query = { ...this.$route.query };

            Object.keys(params).forEach(key => {
                // Чтобы в URL не попадали параметры без значений
                let val = (params[key] !== '' && params[key] !== null)
                    ? params[key]
                    : undefined;

                // Чтобы не присваивались undefined-значения тем параметрам, которых в URL и так нет
                if (typeof val !== 'undefined' || typeof this.$route.query[key] !== 'undefined')
                    query[key] = val;
            });

            this.$router.push({ query });
        },
        // Возвращает название страницы для переданного или текущего роута
        getRoutePageName (route) {
            if (!route) route = this.$route;

            return this.$t(route.meta.pageName
                ? route.meta.pageName.values[this.$route.params[route.meta.pageName.param]]
                : route.name);
        },
        // Отображение окна подтверждения действия
        confirm (message, callback, confirmButtonText) {
            this.$confirm(message, this.$t('needConfirmation'), {
                confirmButtonText,
            })
                .then(() => callback(true))
                .catch(() => callback());
        },
        // Отображение окна с ворнингом
        warning (message) {
            this.$alert(message, this.$t('warning'), {
                type: 'warning',
            }).catch(() => {});
        },
        // Возвращает правило валидации
        validationRule (rule) {
            switch (rule) {
                case 'required':
                    return { required: true, message: this.$t('validation.required') };
                case 'fileRequired':
                    return { required: true, message: this.$t('validation.fileRequired') };
                case 'selectRequired':
                    return { required: true, message: this.$t('validation.selectRequired') };
                case 'phone':
                    return { required: false, message: this.$t('validation.invalidPhoneNumber'), pattern: /^\d{11}$/ };
                case 'email':
                    return { type: 'email', message: this.$t('validation.email') };
            }
        },
        // Приводит в порядок вводимый в input адрес с помощью сервиса dadata.ru
        dadataCleanAddress (address, callback) {
            address = address.trim();

            if (address.length) {
                api.post('dadata/clean-address', { address })
                    .then(({data}) => {
                        const value = get(data, '[0].result');
                        if (value) callback([{ value }]);
                    });
            }

            // Чтобы скрыть процесс загрузки результатов, callback вызываем сразу
            callback([]);
        },

        // Методы биндинга и анбиндинга ширины страницы к указанному свойству компонента
        bindClientWidth (propName) {
            this[propName] = document.body.clientWidth;

            this.mixinEventListeners.bindClientWidthListener = () => this[propName] = document.body.clientWidth;
            window.addEventListener('resize', this.mixinEventListeners.bindClientWidthListener);
        },
        unbindClientWidth () {
            if (this.mixinEventListeners.bindClientWidthListener)
                window.removeEventListener('resize', this.mixinEventListeners.bindClientWidthListener);
        },
    },
}