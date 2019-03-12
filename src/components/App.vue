<template>
    <el-container v-if="currentUser">
        <el-aside :width="asideWidth" class="aside">
            <Sidebar :collapsed="sidebarCollapsed" />
        </el-aside>
        <el-main class="main" :class="{ 'sidebar-collapsed': sidebarCollapsed }">
            <Breadcrumbs />
            <div class="wrap">
                <router-view />
            </div>
        </el-main>
    </el-container>
</template>

<script>
    import {mapState, mapActions} from 'vuex';

    import {SIDEBAR_TOGGLE_WIDTH} from '../constants/config';
    import mixins from '../common/js/mixins';
    import Breadcrumbs from './Breadcrumbs';
    import Sidebar from './Sidebar';

    import locale from 'element-ui/lib/locale';
    import elementLocaleRU from 'element-ui/lib/locale/lang/ru-RU';
    import elementLocaleEN from 'element-ui/lib/locale/lang/en';
    import elementLocaleZH from 'element-ui/lib/locale/lang/zh-CN';

    const elementLocalesMap = {
        RU: elementLocaleRU,
        EN: elementLocaleEN,
        ZH: elementLocaleZH,
    };

    export default {
        name: 'App',
        mixins: [mixins],
        components: {Breadcrumbs, Sidebar},
        data () {
            return {
                loader: null,
                asideWidth: null,
                sidebarCollapsed: false,
            }
        },
        methods: {
            ...mapActions('auth', [
                'getToken',
                'getCurrentUser',
            ]),
        },
        computed: {
            ...mapState('auth', [
                'currentUser',
            ]),
        },
        mounted () {
            this.getToken();

            // Получение данных текущего юзера
            this.loader = this.$loading();
            this.getCurrentUser();

            // Смена title страницы при переходах между страницами
            this.$router.afterEach(to => this.setPageTitle(this.getRoutePageName(to)));

            // Изменение состояния сайдбара при изменении размеров окна браузера
            window.addEventListener('resize', () => {
                this.sidebarCollapsed = document.body.clientWidth < SIDEBAR_TOGGLE_WIDTH;
                this.asideWidth = this.sidebarCollapsed ? '65px' : '240px';
            });
            window.dispatchEvent(new Event('resize'));
        },
        watch: {
            currentUser (user) {
                if (user) {
                    // Скрытие прелоадера после получения данных пользователя
                    if (this.loader) this.loader.close();
                    
                    // Установка локали
                    this.$i18n.locale = user.locale;
                    locale.use(elementLocalesMap[user.locale]);

                    // Установка title для текущей страницы
                    this.setPageTitle(this.getRoutePageName());

                    // Подключение Google Maps
                    window.app.includeGoogleMaps(user.locale.toLowerCase());
                }
            },
        }
    }
</script>

<style lang="less" scoped>
    @import "../common/colors";

    .aside {
        overflow: visible;
    }

    .main {
        .wrap {
            margin-top: 1em;
            padding-top: 1em;
            border-top: 1px solid @base-border-color;
        }
    }
</style>