<template>
    <div>
        <OrdersFilters v-if="type === 'courier' || type === 'point'" />
        <br>
        <OrdersTable :data="list.data" :mode="type" />
        <div v-if="list.totalCount && (type === 'courier' || type === 'point')" class="total">
            {{ $t('totalOrders') }}: <Number :val="list.totalCount" />.
            {{ $t('totalPriceDeclared') }}: <Currency :val="list.sumPriceDeclared" />.
            {{ $t('totalRevenues') }}: <Currency :val="0" />.
        </div>
        <Pagination :total="list.totalCount" :max-page="list.pageCount" />

        <OrderDialog @update="loadList" />
    </div>
</template>

<script>
    import {mapState, mapActions} from 'vuex';
    import get from 'lodash/get';

    import {PER_PAGE_DEFAULT} from 'Constants/config';
    import OrdersFilters from 'Components/filters/OrdersFilters';
    import OrdersTable from 'Components/tables/OrdersTable';
    import Pagination from 'Components/Pagination';
    import OrderDialog from 'Components/dialog/OrderDialog';
    import Number from 'Components/Number';
    import Currency from 'Components/Currency';

    export default {
        name: 'OrdersPage',
        components: {Number, Currency, OrderDialog, Pagination, OrdersTable, OrdersFilters},
        data () {
            return {
                type: this.$route.params.type,
                removeAfterEach: null,
            }
        },
        computed: {
            ...mapState('orders', [
                'list',
            ]),
        },
        methods: {
            ...mapActions('orders', [
                'getList',
            ]),
            loadList () {
                this.getList({
                    perPage: PER_PAGE_DEFAULT,
                    page: this.$route.query.page,
                    serviceType: (() => {
                        if (this.type === 'courier') return 0;
                        if (this.type === 'point') return 1;
                    })(),
                    search: (this.type === 'search') ? this.$route.query.q : null,
                    deliveryDateFrom: get(this.$route.query, 'deliveryDate[0]'),
                    deliveryDateTo: get(this.$route.query, 'deliveryDate[1]'),
                    status: this.$route.query.status,
                });
            },
        },
        mounted () {
            this.loadList();

            this.removeAfterEach = this.$router.afterEach(to => {
                if (to.name === 'ordersList') {
                    this.type = to.params.type;
                    this.loadList();
                }
            });
        },
        destroyed () {
            if (this.removeAfterEach) this.removeAfterEach();
        },
    }
</script>

<style lang="less" scoped>
    @import "../../common/colors";

    .total {
        margin-top: 1.25em;
        color: @secondary-text-color;
        font-size: .85em;
        text-align: center;

    }
</style>