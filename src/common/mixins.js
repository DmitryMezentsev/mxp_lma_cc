import {APP_TITLE} from '../constants/config';


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
            let query = {
                ...this.$router.currentRoute.query
            };

            Object.keys(params).forEach(key => {
                // Чтобы в URL не попадали параметры без значений
                query[key] = (params[key] !== '' && params[key] !== null)
                    ? params[key]
                    : undefined;
            });

            this.$router.push({ query });
        },
        // Возвращает название страницы для переданного или текущего роута
        getRoutePageName (route) {
            if (!route) route = this.$router.currentRoute;

            return this.$t(route.meta.pageName
                ? route.meta.pageName.values[this.$router.currentRoute.params[route.meta.pageName.param]]
                : route.name);
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