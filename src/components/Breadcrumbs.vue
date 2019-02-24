<template>
    <el-breadcrumb separator-class="el-icon-arrow-right">
        <el-breadcrumb-item :to="{ name: homeRoute.name }">
            {{ getRoutePageName(homeRoute) }}
        </el-breadcrumb-item>
        <el-breadcrumb-item v-for="(route, i) in path"
                            v-if="!route.meta.isHome"
                            :to="!route.redirect ? { name: route.name } : null"
                            :key="i">
            {{ getRoutePageName(route) }}
        </el-breadcrumb-item>
    </el-breadcrumb>
</template>

<script>
    import mixins from '../common/js/mixins';

    export default {
        name: 'Breadcrumbs',
        mixins: [mixins],
        data () {
            return {
                path: [],
            }
        },
        computed: {
            homeRoute () {
                return this.$router.options.routes.find(r => r.meta.isHome);
            },
        },
        mounted () {
            this.path = this.$router.history.current.matched;
            this.$router.afterEach(to => this.path = to.matched);
        },
    }
</script>

<style lang="less" scoped>
    .el-breadcrumb__item {
        line-height: 1.5em;
    }
</style>