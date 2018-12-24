<template>
    <div class="pagination-wrap" v-if="total > pageSize">
        <el-pagination
                background
                layout="prev, pager, next"
                :pager-count="5"
                :current-page="page"
                :page-size="pageSize"
                :total="total"
                @current-change="change">
        </el-pagination>
    </div>
</template>

<script>
    import mixins from '../common/mixins';

    const QUERY_PARAM_NAME = 'page';

    export default {
        name: 'Pagination',
        mixins: [mixins],
        props: {
            pageSize: { type: Number, default: 10 },
            total: { type: Number, required: true },
        },
        data () {
            return {
                page: Number(this.$router.currentRoute.query[QUERY_PARAM_NAME]) || 1,
                removeAfterEach: null,
            }
        },
        methods: {
            change (page) {
                this.replaceRouteQueryParams({
                    [QUERY_PARAM_NAME]: page
                });
            },
        },
        mounted () {
            this.removeAfterEach = this.$router.afterEach(to => {
                this.page = Number(to.query[QUERY_PARAM_NAME]) || 1;
            });
        },
        destroyed () {
            if (this.removeAfterEach) this.removeAfterEach();
        },
    }
</script>

<style lang="less" scoped>
    .pagination-wrap {
        text-align: center;
        margin: 1em 0;
    }
</style>