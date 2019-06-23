<template>
  <el-container v-if="currentUser">
    <el-aside :width="sidebarCollapsed ? '65px' : '240px'" class="aside">
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
import Vue from 'vue';
import { mapState, mapMutations, mapActions } from 'vuex';
import * as VueGoogleMaps from 'vue2-google-maps';

import locale from 'element-ui/lib/locale';
import elementLocaleRU from 'element-ui/lib/locale/lang/ru-RU';
import elementLocaleEN from 'element-ui/lib/locale/lang/en';
import elementLocaleZH from 'element-ui/lib/locale/lang/zh-CN';

import mixins from 'Common/js/mixins';
import Breadcrumbs from 'Components/Breadcrumbs';
import Sidebar from 'Components/Sidebar';
import { GOOGLE_MAPS_API_KEY } from 'Common/js/env';

const elementLocalesMap = {
  RU: elementLocaleRU,
  EN: elementLocaleEN,
  ZH: elementLocaleZH,
};

export default {
  name: 'App',
  mixins: [mixins],
  components: { Breadcrumbs, Sidebar },
  data() {
    return {
      loader: null,
    };
  },
  computed: {
    ...mapState('common', ['clientWidth']),
    ...mapState('auth', ['currentUser']),
    sidebarCollapsed() {
      // Ширина, при которой садбар должен переключаться в адаптивный режим
      const SIDEBAR_TOGGLE_WIDTH = 1000;

      return this.clientWidth && this.clientWidth < SIDEBAR_TOGGLE_WIDTH;
    },
  },
  methods: {
    ...mapMutations('common', ['setClientWidth']),
    ...mapMutations('geo', { setOpenedZone: 'setOpened' }),
    ...mapMutations('orders', { setOpenedOrder: 'setOpened' }),
    ...mapMutations('pickups', { setOpenedPickup: 'setOpened' }),
    ...mapActions('auth', ['getToken', 'loadCurrentUser']),
  },
  mounted() {
    this.getToken();

    // Получение данных текущего юзера
    this.loader = this.$loading();
    this.loadCurrentUser();

    // Смена title страницы при переходах между страницами
    this.$router.afterEach(to => this.setPageTitle(this.getRoutePageName(to)));

    // Отслеживание размеров окна браузера
    window.addEventListener('resize', () => this.setClientWidth(document.body.clientWidth));
    window.dispatchEvent(new Event('resize'));
  },
  watch: {
    currentUser(user) {
      if (user) {
        // Скрытие прелоадера после получения данных пользователя
        if (this.loader) this.loader.close();

        // Установка локали
        this.$i18n.locale = user.locale;
        locale.use(elementLocalesMap[user.locale]);

        // Установка title для текущей страницы
        this.setPageTitle(this.getRoutePageName());

        // Подключение Google Maps
        Vue.use(VueGoogleMaps, {
          load: {
            key: GOOGLE_MAPS_API_KEY,
            language: user.locale.toLowerCase(),
          },
        });
      }
    },
    $route() {
      // Закрытие открытых модальных окон при изменении роута
      this.setOpenedZone(null);
      this.setOpenedOrder(null);
      this.setOpenedPickup(null);
    },
  },
};
</script>

<style lang="less" scoped>
@import '~Common/colors';

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
