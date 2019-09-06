<template>
  <div class="sidebar" :class="{ collapsed }">
    <div class="wrap">
      <router-link class="logo" :to="{ name: homeName }">
        <img src="~Common/img/logo.png" alt="MXP" />
      </router-link>
      <div class="mode-toggle">
        <router-link :to="{ name: 'cc' }" :class="{ active: isCC() }">{{ $t('cc') }}</router-link>
        <router-link :to="{ name: 'lma' }" :class="{ active: isLMA() }">{{
          $t('lma')
        }}</router-link>
      </div>
      <div class="search">
        <el-input
          :placeholder="$t('orderSearch')"
          prefix-icon="el-icon-search"
          size="mini"
          v-model="searchQuery"
          @change="searchChange"
        />
      </div>
      <el-menu
        :default-openeds="defaultOpened"
        :router="true"
        :collapse="collapsed"
        :collapse-transition="false"
        :active-text-color="WHITE_COLOR"
        background-color="transparent"
        @open="submenuOpen"
        @close="submenuClose"
      >
        <div v-for="(item, i) in menu" :key="`${i}_${homeName}`">
          <el-submenu v-if="item.submenu" :index="i.toString()">
            <template slot="title">
              <fa-icon :icon="item.icon" />
              <span slot="title">{{ $t(item.title) }}</span>
            </template>
            <el-menu-item
              v-for="(subitem, j) in item.submenu"
              v-is-route="subitem.isRoute || subitem.route"
              :key="j"
              :index="`${i.toString()}-${j.toString()}`"
              :route="subitem.route"
              @click="scrollTop"
            >
              <span slot="title">{{ $t(subitem.title) }}</span>
            </el-menu-item>
          </el-submenu>
          <el-menu-item
            v-else-if="item.route"
            v-is-route="item.isRoute || item.route"
            :index="i.toString()"
            :route="item.route"
            @click="scrollTop"
          >
            <fa-icon :icon="item.icon" />
            <span slot="title">{{ $t(item.title) }}</span>
          </el-menu-item>
          <el-menu-item
            v-else
            :index="i.toString()"
            @click.native="item.click()"
            class="clickable"
            disabled
          >
            <fa-icon :icon="item.icon" />
            <span slot="title">{{ $t(item.title) }}</span>
          </el-menu-item>
        </div>
      </el-menu>
    </div>
  </div>
</template>

<script>
import { mapMutations, mapActions } from 'vuex';
import { trim } from 'lodash';

import isRoute from 'Directives/is-route';
import mixins from 'Common/js/mixins';
import { WHITE_COLOR } from 'Constants/colors';
import { WAREHOUSE_URL } from 'Common/js/env';
import { scrollToPos } from 'Common/js/helpers';

const isSearchRoute = route => route.name === 'lmaOrdersList' && route.params.type === 'search';

export default {
  name: 'Sidebar',
  mixins: [mixins],
  props: {
    collapsed: { type: Boolean, default: false },
  },
  directives: { isRoute },
  data() {
    return {
      searchQuery: '',
      WHITE_COLOR,
    };
  },
  computed: {
    // Пункты меню
    menu() {
      const commonItems = {
        support: {
          icon: 'headset',
          title: 'chatWithSupport',
          click: this.toggleShowZammadChat,
        },
        logout: {
          icon: 'sign-out-alt',
          title: 'logout',
          click: this.clearToken,
        },
      };

      if (this.isCC()) {
        return [
          {
            route: { name: 'ccOrders' },
            isRoute: {
              name: [
                'ccOrders',
                'ccAddOrder',
                'ccEditOrder',
                'ccOrdersImport',
                'ccOrdersImportTemplates',
                'ccOrdersAddImportTemplate',
                'ccOrdersEditImportTemplate',
              ],
            },
            icon: 'file-alt',
            title: 'orders',
          },
          commonItems.support,
          {
            route: { name: 'ccSettings' },
            isRoute: 'ccSettings',
            icon: 'cogs',
            title: 'settings',
          },
          commonItems.logout,
        ];
      }

      return [
        {
          icon: 'file-alt',
          title: 'orders',
          submenu: [
            {
              route: { name: 'lmaOrdersList', params: { type: 'courier' } },
              title: 'courierOrders',
            },
            {
              route: { name: 'lmaOrdersList', params: { type: 'point' } },
              title: 'pointOrders',
            },
          ],
        },
        {
          route: { name: 'lmaPickups' },
          isRoute: 'lmaPickups',
          icon: 'truck-loading',
          title: 'pickups',
        },
        {
          icon: 'warehouse',
          title: 'warehouse',
          click: this.toWarehouse,
        },
        {
          route: { name: 'lmaClients' },
          isRoute: { name: ['lmaClients', 'lmaAddClient', 'lmaEditClient'] },
          icon: 'users',
          title: 'clients',
        },
        {
          route: { name: 'lmaCouriers' },
          isRoute: { name: ['lmaCouriers', 'lmaAddCourier', 'lmaEditCourier'] },
          icon: 'user-tie',
          title: 'couriers',
        },

        {
          icon: 'map-marked-alt',
          title: 'routing',
          submenu: [
            {
              route: { name: 'lmaRoutingMap' },
              isRoute: 'lmaRoutingMap',
              title: 'map',
            },
            {
              route: { name: 'lmaRoutingSummary' },
              isRoute: 'lmaRoutingSummary',
              title: 'summary',
            },
            {
              route: { name: 'lmaRoutingZones' },
              isRoute: 'lmaRoutingZones',
              title: 'zones',
            },
          ],
        },
        {
          icon: 'book',
          title: 'reporting',
          submenu: [
            {
              route: { name: 'lmaAcceptanceCodFromCourier' },
              isRoute: 'lmaAcceptanceCodFromCourier',
              title: 'acceptanceCodFromCourier',
            },
            {
              route: { name: 'lmaCodReports' },
              isRoute: 'lmaCodReports',
              title: 'codReports',
            },
            {
              route: { name: 'lmaServiceActs' },
              isRoute: 'lmaServiceActs',
              title: 'serviceActs',
            },
          ],
        },
        commonItems.support,
        {
          route: { name: 'lmaSettings' },
          isRoute: 'lmaSettings',
          icon: 'cogs',
          title: 'settings',
        },
        commonItems.logout,
      ];
    },
    // Открытые изначально подменю
    defaultOpened() {
      const state = this.getSavedSidebarState();
      return Object.keys(state).filter(i => state[i]);
    },
    // Название роута главной страницы текущего раздела кабинета
    homeName() {
      return this.isCC() ? 'cc' : 'lma';
    },
  },
  methods: {
    ...mapMutations('common', ['toggleShowZammadChat']),
    ...mapActions('auth', ['clearToken']),
    // Открывает в новой вкладке панель WMS
    toWarehouse() {
      window.open(WAREHOUSE_URL);
    },
    searchChange(q) {
      q = trim(q); // eslint-disable-line no-param-reassign

      if (q) {
        this.$router.push({
          name: this.isLMA() ? 'lmaOrdersList' : 'ccOrders',
          params: { type: 'search' },
          query: { q },
        });
      } else {
        this.$router.push({ name: this.homeName });
      }
    },
    // Возвращает текущее состояние сайдбара, сохраненное в браузере
    getSavedSidebarState() {
      return JSON.parse(
        (this.isCC() ? localStorage.sidebarStateCC : localStorage.sidebarStateLMA) || '{}',
      );
    },
    // Сохраняет состояние сайдбара в браузере
    sidebarStateSave(index, opened) {
      const state = this.getSavedSidebarState();
      state[index] = opened;
      localStorage[this.isCC() ? 'sidebarStateCC' : 'sidebarStateLMA'] = JSON.stringify(state);
    },
    submenuOpen(i) {
      this.sidebarStateSave(i, true);
    },
    submenuClose(i) {
      this.sidebarStateSave(i, false);
    },
    scrollTop() {
      setTimeout(() => {
        scrollToPos(0);
      }, 100);
    },
  },
  mounted() {
    this.$router.afterEach(to => {
      this.searchQuery = isSearchRoute(to) ? to.query.q : '';
    });

    if (isSearchRoute(this.$route)) this.searchQuery = this.$route.query.q;
  },
};
</script>

<style lang="less">
@import '~Common/colors';

.sidebar {
  &:before {
    content: '';
    display: block;
    background-color: @blue-color;
    position: fixed;
    left: 0;
    top: 0;
    bottom: 0;
    width: 240px;
    z-index: 1;
  }

  &.collapsed {
    &:before {
      width: 64px;
    }

    .mode-toggle {
      margin: 8px 0 12px;
    }

    .search {
      display: none;
    }

    .el-menu {
      text-align: center;
    }

    .el-menu-item,
    .el-submenu {
      svg {
        margin-right: 0 !important;
      }

      .el-submenu__title {
        span[slot='title'],
        .el-submenu__icon-arrow {
          display: none;
        }
      }
    }
  }

  .wrap {
    position: relative;
    z-index: 2;
  }

  .logo {
    display: block;
    text-align: center;
    margin: 0.75em 0 0.5em;
    user-select: none;

    img {
      width: 70%;
    }
  }

  .mode-toggle {
    font-size: 0.85rem;
    text-align: center;
    display: flex;
    justify-content: space-around;
    margin: 0 15px 12px;

    a {
      text-decoration: none;
      color: @white-color;
      flex-grow: 1;
      flex-shrink: 0;
      position: relative;
      padding-bottom: 3px;

      &:before {
        content: '';
        display: block;
        position: absolute;
        background-color: @white-color;
        height: 2px;
        bottom: 0;
        opacity: 0.6;
        width: 0;
        transition: width 0.2s ease;
      }

      &:first-child {
        &:before {
          left: 0;
        }
      }

      &:last-child {
        &:before {
          right: 0;
        }
      }

      &:hover {
        &:before {
          width: 100%;
        }
      }

      &.active {
        &:before {
          width: 100%;
        }
      }
    }
  }

  .search {
    width: 90%;
    margin: 0.5em auto;

    .el-input__inner {
      border: none;
    }
  }

  .el-menu {
    border-right: none;

    svg {
      &.svg-inline--fa {
        margin-right: 0.75em;

        &.fa-cogs {
          margin-right: 0.5em;
        }

        &.fa-truck-loading {
          margin-right: 0.6em;
        }

        &.fa-file-alt {
          font-size: 1.25em;
          margin-right: 0.7em;
        }

        &.fa-warehouse {
          font-size: 0.96em;
          margin-right: 0.625em;
        }

        &.fa-users {
          margin-right: 0.55em;
        }

        &.fa-user-tie {
          font-size: 1.17em;
          margin-right: 0.65em;
        }

        &.fa-map-marked-alt {
          margin-right: 0.65em;
        }

        &.fa-book {
          margin-right: 0.82em;
          font-size: 1.06em;
        }

        &.fa-sign-out-alt {
          margin-right: 0.61em;
          font-size: 1.12em;
        }
      }
    }
  }

  .el-submenu__title,
  .el-menu-item {
    height: 40px;
    line-height: 37px;
  }

  .el-submenu {
    .el-menu {
      .el-menu-item {
        padding-left: 35px !important;
      }
    }
  }
}

.el-menu {
  user-select: none;

  .el-menu-item,
  .el-submenu__title {
    color: @white-color;

    &:not(.active-route) {
      background-color: transparent !important;

      &:hover {
        background-color: rgba(255, 255, 255, 0.25) !important;
      }
    }

    svg,
    i {
      color: @white-color;
    }

    &.is-disabled {
      &.clickable {
        opacity: 1;
        cursor: pointer;
      }
    }
  }

  .active-route {
    color: @blue-color !important;
    transition-property: background-color;
    background-color: @white-color !important;

    svg {
      &.svg-inline--fa {
        color: @blue-color !important;
      }
    }
  }
}

.el-menu--vertical {
  .el-menu--popup {
    background-color: @white-color !important;

    .el-menu-item {
      color: @primary-text-color;
      height: 40px;
      line-height: 37px;

      &:hover {
        color: @blue-color;
      }
    }
  }
}
</style>
