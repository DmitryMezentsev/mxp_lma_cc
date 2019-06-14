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
        <br>
        <el-button v-if="type === 'courier' && list.data && list.data.length"
                   size="mini"
                   type="primary"
                   :disabled="!selected.length"
                   @click="selectCourierDialog = true">
            {{ $t('setCourier') }}
        </el-button>
        <Pagination :total="list.totalCount" :max-page="list.pageCount" />

        <OrderDialog @update="loadList" />

        <SelectCourierDialog :visible="selectCourierDialog"
                             @select="setCourier"
                             @cancel="selectCourierDialog = false" />
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
    import SelectCourierDialog from 'Components/dialog/SelectCourierDialog';
    import api from 'Common/js/api';

    export default {
        name: 'OrdersPage',
        components: {Number, Currency, OrderDialog, Pagination, OrdersTable, OrdersFilters, SelectCourierDialog},
        data () {
            return {
                type: this.$route.params.type,
                removeAfterEach: null,
                selectCourierDialog: false,
            }
        },
        computed: {
            ...mapState('orders', [
                'list',
                'selected',
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
            setCourier (courierId) {
                api.post('/order/setCourierToOrders', {
                    courierId,
                    orderIds: this.selected,
                })
                    .then(() => {
                        this.loadList();

                        this.$message({
                            message: this.$tc('courierAreSet', (this.selected.length > 1) ? 2 : 1),
                            type: 'success',
                        });
                    })
                    .finally(() => this.selectCourierDialog = false);
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
    @import "~Common/colors";

    .total {
        margin-top: 1.25em;
        color: @secondary-text-color;
        font-size: .85em;
        text-align: center;

    }
</style>