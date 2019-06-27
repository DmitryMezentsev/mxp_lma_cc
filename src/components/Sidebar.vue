<template>
  <div class="sidebar" :class="{ collapsed }">
    <div class="wrap">
      <router-link class="logo" :to="{ name: 'home' }">
        <img src="~Common/img/logo.png" alt="MXP" />
      </router-link>
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
        <el-menu-item
          index="0"
          @click="scrollTop"
          :route="{ name: 'settings' }"
          v-is-route="'settings'"
        >
          <fa-icon icon="cogs" />
          <span slot="title">{{ $t('settings') }}</span>
        </el-menu-item>
        <el-submenu index="1">
          <template slot="title">
            <fa-icon icon="file-alt" />
            <span slot="title">{{ $t('orders') }}</span>
          </template>
          <el-menu-item
            index="1-1"
            @click="scrollTop"
            :route="{ name: 'ordersList', params: { type: 'courier' } }"
            v-is-route="{ name: 'ordersList', params: { type: 'courier' } }"
          >
            <span slot="title">{{ $t('courierOrders') }}</span>
          </el-menu-item>
          <el-menu-item
            index="1-2"
            @click="scrollTop"
            :route="{ name: 'ordersList', params: { type: 'point' } }"
            v-is-route="{ name: 'ordersList', params: { type: 'point' } }"
          >
            <span slot="title">{{ $t('pointOrders') }}</span>
          </el-menu-item>
        </el-submenu>
        <el-menu-item
          index="2"
          @click="scrollTop"
          :route="{ name: 'pickups' }"
          v-is-route="'pickups'"
        >
          <fa-icon icon="truck-loading" />
          <span slot="title">{{ $t('pickups') }}</span>
        </el-menu-item>
        <el-menu-item index="3" @click="toWarehouse">
          <fa-icon icon="warehouse" />
          <span slot="title">{{ $t('warehouse') }}</span>
        </el-menu-item>
        <el-menu-item
          index="4"
          @click="scrollTop"
          :route="{ name: 'clients' }"
          v-is-route="{ name: ['clients', 'addClient', 'editClient'] }"
        >
          <fa-icon icon="users" />
          <span slot="title">{{ $t('clients') }}</span>
        </el-menu-item>
        <el-menu-item
          index="5"
          @click="scrollTop"
          :route="{ name: 'couriers' }"
          v-is-route="{ name: ['couriers', 'addCourier', 'editCourier'] }"
        >
          <fa-icon icon="user-tie" />
          <span slot="title">{{ $t('couriers') }}</span>
        </el-menu-item>
        <el-submenu index="6">
          <template slot="title">
            <fa-icon icon="map-marked-alt" />
            <span slot="title">{{ $t('routing') }}</span>
          </template>
          <el-menu-item
            index="6-1"
            @click="scrollTop"
            :route="{ name: 'routingMap' }"
            v-is-route="'routingMap'"
          >
            <span slot="title">{{ $t('map') }}</span>
          </el-menu-item>
          <el-menu-item
            index="6-2"
            @click="scrollTop"
            :route="{ name: 'routingSummary' }"
            v-is-route="'routingSummary'"
          >
            <span slot="title">{{ $t('summary') }}</span>
          </el-menu-item>
          <el-menu-item
            index="6-3"
            @click="scrollTop"
            :route="{ name: 'routingZones' }"
            v-is-route="'routingZones'"
          >
            <span slot="title">{{ $t('zones') }}</span>
          </el-menu-item>
        </el-submenu>
        <el-submenu index="7">
          <template slot="title">
            <fa-icon icon="book" />
            <span slot="title">{{ $t('reporting') }}</span>
          </template>
          <el-menu-item
            index="7-1"
            @click="scrollTop"
            :route="{ name: 'courierCalculation' }"
            v-is-route="'courierCalculation'"
          >
            <span slot="title">{{ $t('courierCalculation') }}</span>
          </el-menu-item>
          <el-menu-item
            index="7-2"
            @click="scrollTop"
            :route="{ name: 'codReports' }"
            v-is-route="'codReports'"
          >
            <span slot="title">{{ $t('codReports') }}</span>
          </el-menu-item>
          <el-menu-item
            index="7-3"
            @click="scrollTop"
            :route="{ name: 'serviceActs' }"
            v-is-route="'serviceActs'"
          >
            <span slot="title">{{ $t('serviceActs') }}</span>
          </el-menu-item>
        </el-submenu>
        <el-menu-item
          index="8"
          @click.native="toggleShowZammadChat"
          class="support-toggle"
          disabled
        >
          <fa-icon icon="headset" />
          <span slot="title">{{ $t('chatWithSupport') }}</span>
        </el-menu-item>
        <el-menu-item index="9" @click="clearToken()">
          <fa-icon icon="sign-out-alt" />
          <span slot="title">{{ $t('logout') }}</span>
        </el-menu-item>
      </el-menu>
    </div>
  </div>
</template>

<script>
import trim from 'lodash/trim';
import Cookies from 'js-cookie';
import { mapMutations, mapActions } from 'vuex';

import isRoute from 'Directives/is-route';
import { COOKIES_EXP_DAYS } from 'Constants/config';
import { WHITE_COLOR } from 'Constants/colors';
import { WAREHOUSE_URL } from 'Common/js/env';

const SIDEBAR_STATE_COOKIE_NAME = 'sidebarSubmenu';

const isSearchRoute = route => route.name === 'ordersList' && route.params.type === 'search';

export default {
  name: 'Sidebar',
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
    // Открытые изначально подменю
    defaultOpened() {
      const sidebarSubmenu = Cookies.getJSON(SIDEBAR_STATE_COOKIE_NAME);
      return sidebarSubmenu ? Object.keys(sidebarSubmenu).filter(i => sidebarSubmenu[i]) : [];
    },
  },
  methods: {
    ...mapMutations('common', ['toggleShowZammadChat']),
    ...mapActions('auth', ['clearToken']),
    toWarehouse: () => window.open(WAREHOUSE_URL),
    searchChange(q) {
      // eslint-disable-next-line
      q = trim(q);

      if (q) {
        this.$router.push({ name: 'ordersList', params: { type: 'search' }, query: { q } });
      } else {
        this.$router.push({ name: 'home' });
      }
    },
    submenuStateSave(index, opened) {
      const sidebarSubmenu = Cookies.getJSON(SIDEBAR_STATE_COOKIE_NAME) || {};

      sidebarSubmenu[index] = opened;
      Cookies.set(SIDEBAR_STATE_COOKIE_NAME, sidebarSubmenu, { expires: COOKIES_EXP_DAYS });
    },
    submenuOpen(i) {
      this.submenuStateSave(i, true);
    },
    submenuClose(i) {
      this.submenuStateSave(i, false);
    },
    scrollTop() {
      window.scrollTo(0, 0);
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

    img {
      width: 70%;
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

    &.support-toggle {
      &.is-disabled {
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
