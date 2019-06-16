<template>
    <div>
        <OrdersFilters v-if="$route.params.type === 'courier' || $route.params.type === 'point'" />
        <br>
        <OrdersTable :data="list.data" :mode="$route.params.type" />
        <div v-if="list.totalCount && ($route.params.type === 'courier' || $route.params.type === 'point')" class="total">
            {{ $t('totalOrders') }}: {{ list.totalCount | number }}.
            {{ $t('totalPriceDeclared') }}: {{ list.sumPriceDeclared | currency }}.
            {{ $t('totalRevenues') }}: {{ 0 | currency }}.
        </div>
        <br>
        <el-button v-if="$route.params.type === 'courier' && list.data && list.data.length"
                   size="mini"
                   type="primary"
                   :disabled="!selected.length"
                   @click="selectCourierDialog = true">
            {{ $t('setCourier') }}
        </el-button>
        <Pagination :total="list.totalCount" :max-page="list.pageCount" />

        <OrderDialog @update="loadList($route)" />

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
    import SelectCourierDialog from 'Components/dialog/SelectCourierDialog';
    import api from 'Common/js/api';
    import {number, currency} from 'Common/js/filters';

    export default {
        name: 'OrdersPage',
        components: {OrderDialog, Pagination, OrdersTable, OrdersFilters, SelectCourierDialog},
        filters: {number, currency},
        data () {
            return {
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
            loadList ({query, params}) {
                this.getList({
                    perPage: PER_PAGE_DEFAULT,
                    page: query.page,
                    serviceType: (() => {
                        switch (params.type) {
                            case 'courier': return 0;
                            case 'point': return 1;
                        }
                    })(),
                    search: (params.type === 'search') ? query.q : null,
                    deliveryDateFrom: get(query, 'deliveryDate[0]'),
                    deliveryDateTo: get(query, 'deliveryDate[1]'),
                    status: query.status,
                });
            },
            setCourier (courierId) {
                api.post('/order/setCourierToOrders', {
                    courierId,
                    orderIds: this.selected,
                })
                    .then(() => {
                        this.loadList(this.$route);

                        this.$message({
                            message: this.$tc('courierAreSet', (this.selected.length > 1) ? 2 : 1),
                            type: 'success',
                        });
                    })
                    .finally(() => this.selectCourierDialog = false);
            },
        },
        beforeRouteEnter (to, from, next) {
            next(vm => vm.loadList(to));
        },
        beforeRouteUpdate (to, from, next) {
            this.loadList(to);
            next();
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