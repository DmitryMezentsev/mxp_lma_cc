<template>
    <el-container v-if="currentUser">
        <el-aside :width="asideWidth" class="aside">
            <Sidebar :collapsed="sidebarCollapsed" />
        </el-aside>
        <el-main class="main">
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
    import mixins from '../common/mixins';
    import Breadcrumbs from './Breadcrumbs';
    import Sidebar from './Sidebar';

    import locale from 'element-ui/lib/locale';
    import elementLocaleRU from 'element-ui/lib/locale/lang/ru-RU';
    import elementLocaleEN from 'element-ui/lib/locale/lang/en';
    import elementLocaleZH from 'element-ui/lib/locale/lang/zh-CN';

    const elementLocalesMap = {
        ru_RU: elementLocaleRU,
        en_US: elementLocaleEN,
        zh_CN: elementLocaleZH,
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
            ...mapActions({
                loadUser: 'loadCurrentUser',
            }),
        },
        computed: {
            ...mapState({
                currentUser: 'currentUser',
            }),
        },
        mounted () {
            this.loader = this.$loading();
            this.loadUser();

            // Установка <title> страницы
            setTimeout(() => {
                this.setPageTitle(this.getRoutePageName());
            }, 250);
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
                    // Установка локали и скрытие прелоадера после получения данных пользователя
                    this.$i18n.locale = user.locale;
                    if (this.loader) this.loader.close();

                    locale.use(elementLocalesMap[user.locale]);
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