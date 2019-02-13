<template>
    <div class="sidebar" :class="{ collapsed }">
        <router-link class="logo" :to="{name: 'home'}">
            <img src="../common/logo.png" alt="MXP">
        </router-link>
        <div class="search">
            <el-input :placeholder="$t('orderSearch')"
                      prefix-icon="el-icon-search"
                      size="mini"
                      v-model="searchQuery"
                      @change="searchChange" />
        </div>
        <el-menu :default-openeds="defaultOpened"
                 :router="true"
                 :collapse="collapsed"
                 :collapse-transition="false"
                 background-color="#FFF"
                 active-text-color="#303133"
                 @open="submenuOpen"
                 @close="submenuClose">
            <el-submenu index="0">
                <template slot="title">
                    <i class="fas fa-user"></i>
                    <span slot="title">{{ $t('account') }}</span>
                </template>
                <el-menu-item index="0-1" :route="{name: 'accountSettings'}" v-is-route="'accountSettings'">
                    <span slot="title">{{ $t('settings') }}</span>
                </el-menu-item>
                <el-menu-item index="0-2" @click="clearToken">
                    <span slot="title">{{ $t('logout') }}</span>
                </el-menu-item>
            </el-submenu>
            <el-submenu index="1">
                <template slot="title">
                    <i class="fas fa-file-alt"></i>
                    <span slot="title">{{ $t('orders') }}</span>
                </template>
                <el-menu-item index="1-1" :route="{name: 'ordersList', params: {page: 'courier'}}" v-is-route="{name: 'ordersList', params: {page: 'courier'}}">
                    <span slot="title">{{ $t('courierOrders') }}</span>
                </el-menu-item>
                <el-menu-item index="1-2" :route="{name: 'ordersList', params: {page: 'point'}}" v-is-route="{name: 'ordersList', params: {page: 'point'}}">
                    <span slot="title">{{ $t('pointOrders') }}</span>
                </el-menu-item>
            </el-submenu>
            <el-menu-item index="2" @click="toWarehouse">
                <i class="fas fa-warehouse"></i>
                <span slot="title">{{ $t('warehouse') }}</span>
            </el-menu-item>
            <el-menu-item index="3" :route="{name: 'clients'}" v-is-route="'clients'">
                <i class="fas fa-users"></i>
                <span slot="title">{{ $t('clients') }}</span>
            </el-menu-item>
            <el-menu-item index="4" :route="{name: 'couriers'}" v-is-route="'couriers'">
                <i class="fas fa-user-tie"></i>
                <span slot="title">{{ $t('couriers') }}</span>
            </el-menu-item>
            <el-submenu index="5">
                <template slot="title">
                    <i class="fas fa-book"></i>
                    <span slot="title">{{ $t('reporting') }}</span>
                </template>
                <el-menu-item index="5-1" :route="{name: 'courierCalculation'}" v-is-route="'courierCalculation'">
                    <span slot="title">{{ $t('courierCalculation') }}</span>
                </el-menu-item>
                <el-menu-item index="5-2" :route="{name: 'reportingStatements'}" v-is-route="'reportingStatements'">
                    <span slot="title">{{ $t('reportingStatements') }}</span>
                </el-menu-item>
                <el-menu-item index="5-3" :route="{name: 'serviceActs'}" v-is-route="'serviceActs'">
                    <span slot="title">{{ $t('serviceActs') }}</span>
                </el-menu-item>
            </el-submenu>
        </el-menu>
    </div>
</template>

<script>
    import trim from 'lodash/trim';
    import Cookies from 'js-cookie';
    import {mapActions} from 'vuex';

    import isRoute from '../directives/is-route';
    import {COOKIES_EXP_DAYS} from '../constants/config';

    const SIDEBAR_STATE_COOKIE_NAME = 'sidebarSubmenu';

    const isSearchRoute = route => route.name === 'ordersList' && route.params.page === 'search';

    export default {
        name: 'Sidebar',
        props: {
            collapsed: { type: Boolean, default: false },
        },
        directives: {isRoute},
        data () {
            return {
                searchQuery: '',
            }
        },
        computed: {
            // Открытые изначально подменю
            defaultOpened () {
                const sidebarSubmenu = Cookies.getJSON(SIDEBAR_STATE_COOKIE_NAME);
                return sidebarSubmenu
                    ? Object.keys(sidebarSubmenu).filter(i => sidebarSubmenu[i])
                    : [];
            },
        },
        methods: {
            ...mapActions({
                clearToken: 'clearToken',
            }),
            toWarehouse () {
                // todo: изменить на URL админки склада
                window.open('https://google.com');
            },
            searchChange (q) {
                q = trim(q);
                if (q)
                    this.$router.push({ name: 'ordersList', params: { page: 'search' }, query: { q } });
                else
                    this.$router.push({ name: 'home' });
            },
            submenuStateSave (index, opened) {
                let sidebarSubmenu = Cookies.getJSON(SIDEBAR_STATE_COOKIE_NAME) || {};
                sidebarSubmenu[index] = opened;
                Cookies.set(SIDEBAR_STATE_COOKIE_NAME, sidebarSubmenu, { expires: COOKIES_EXP_DAYS });
            },
            submenuOpen (i) {
                this.submenuStateSave(i, true);
            },
            submenuClose (i) {
                this.submenuStateSave(i, false);
            },
        },
        mounted () {
            this.$router.afterEach(to =>
                this.searchQuery = (isSearchRoute(to)) ? to.query.q : ''
            );

            if (isSearchRoute(this.$router.currentRoute))
                this.searchQuery = this.$router.currentRoute.query.q;
        },
    }
</script>

<style lang="less">
    @import "../common/colors";

    .sidebar {
        &.collapsed {
            .search {
                display: none;
            }

            .el-menu {
                text-align: center;

                i {
                    &.far,
                    &.fas {
                        margin-right: 0;
                    }
                }
            }
        }

        .logo {
            display: block;
            text-align: center;
            margin: .75em 0 .5em;

            img {
                width: 70%;
            }
        }

        .search {
            width: 90%;
            margin: .5em auto;
        }

        .el-menu {
            i {
                &.far,
                &.fas {
                    margin-right: .75em;

                    &.fa-file-alt {
                        font-size: 1.25em;
                    }

                    &.fa-warehouse,
                    &.fa-users {
                        font-size: .96em;
                    }

                    &.fa-user-tie {
                        font-size: 1.17em;
                    }
                }
            }
        }
    }

    .el-menu {
        user-select: none;

        .el-menu-item,
        .el-submenu__title {
            &:hover {
                background-color: @lighter-border-color !important;
            }

            &:not(:hover) {
                background-color: transparent !important;
            }
        }

        .active-route {
            color: @blue-color !important;
        }
    }
</style>