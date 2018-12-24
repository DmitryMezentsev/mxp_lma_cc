<template>
    <div>
        <OrdersFilters v-if="page === 'courier' || page === 'point'" />
        <OrdersTable :loading="loading"
                     :data="orders"
                     :mode="page"
                     @openOrder="openOrder" />
        <Pagination :total="total" />

        <OrderDialog v-if="openedOrder"
                     :data="openedOrder"
                     @close="openedOrder = null" />
    </div>
</template>

<script>
    import OrdersFilters from '../filters/OrdersFilters';
    import OrdersTable from '../tables/OrdersTable';
    import Pagination from '../Pagination';
    import OrderDialog from '../dialog/OrderDialog';

    export default {
        name: 'OrdersPage',
        components: {OrderDialog, Pagination, OrdersTable, OrdersFilters},
        data () {
            return {
                page: this.$router.currentRoute.params.page,
                loading: false,
                orders: [],
                total: 0,
                removeAfterEach: null,
                openedOrder: null,
            }
        },
        methods: {
            openOrder (order) {
                this.openedOrder = order;
            },
        },
        mounted () {
            this.removeAfterEach = this.$router.afterEach(to => {
                this.page = to.params.page;
            });
        },
        destroyed () {
            if (this.removeAfterEach) this.removeAfterEach();
        },
    }
</script>

<style lang="less" scoped>

</style>