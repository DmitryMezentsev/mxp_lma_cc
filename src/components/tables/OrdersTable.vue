<template>
    <el-table v-loading="loading"
              :data="data"
              :empty-text="$t(loading ? 'pleaseWait' : 'noOrders')"
              @selection-change="onSelectionChange">
        <el-table-column
                v-if="mode === 'courier'"
                type="selection"
                width="55"
                key="col-selection" />
        <el-table-column
                :label="$t('orderNumberInCompanyOrShop')"
                key="col-number">
            <template slot-scope="scope">
                <a @click.prevent="open(scope.$index)">
                    {{ scope.row.internalNumber }}<br>
                    {{ scope.row.sender.internalNumber }}
                </a>
            </template>
        </el-table-column>
        <el-table-column
                v-if="width > 719"
                :label="$t('recipient')"
                key="col-contacts">
            <template slot-scope="scope">
                {{ scope.row.recipient.contacts.name }}<br>
                <small>{{ scope.row.recipient.contacts.phone }}</small>
            </template>
        </el-table-column>
        <el-table-column
                v-if="width > 579"
                :label="$t('cod')"
                key="col-price-declared">
            <template slot-scope="scope">
                <Currency :val="scope.row.cashOnDelivery.priceDeclared" />
            </template>
        </el-table-column>
        <el-table-column
                v-if="width > 879"
                prop="sender.brandName"
                :label="$t('shop')"
                key="col-shop" />
        <el-table-column
                v-if="width > 479"
                prop="status.name"
                :label="$t('status')"
                key="col-status" />

        <!-- Только курьерка -->
        <el-table-column
                v-if="mode === 'courier' && width > 1279"
                prop="recipient.address.value"
                :label="$t('deliveryAddress')"
                key="col-delivery-address" />
        <el-table-column
                v-if="mode === 'courier' && width > 379"
                prop=""
                width="155"
                key="col-delivery-date">
            <template slot="header" slot-scope="scope">
                {{ $t('deliveryDate') }}&nbsp;
                <el-tooltip :content="$t('clientTimezoneMsg')" placement="top">
                    <i class="far fa-question-circle"></i>
                </el-tooltip>
            </template>
            <template slot-scope="scope">
                <div v-if="scope.row.deliveryOrder.dateTimeInterval.date">
                    {{ scope.row.deliveryOrder.dateTimeInterval.date }}
                    <div v-show="scope.row.deliveryOrder.dateTimeInterval.timeInterval.from && scope.row.deliveryOrder.dateTimeInterval.timeInterval.to">
                        {{ scope.row.deliveryOrder.dateTimeInterval.timeInterval.from }}&ndash;{{ scope.row.deliveryOrder.dateTimeInterval.timeInterval.to }}
                    </div>
                </div>
                <div v-else>&mdash;</div>
            </template>
        </el-table-column>

        <!-- Только ПВЗ -->
        <el-table-column
                v-if="mode === 'point' && width > 1279"
                prop=""
                :label="$t('issuePoint')"
                key="col-issue-point" />
        <el-table-column
                v-if="mode === 'point' && width > 379"
                prop=""
                :label="$t('buyoutDate')"
                key="col-buyout-date" />

        <!-- Только поиск (совмещенные столбцы) -->
        <el-table-column
                v-if="mode === 'search' && width > 1365"
                :label="$t('type')"
                key="col-type">
            <template slot-scope="scope">
                <div v-if="scope.row.serviceType === ORDER_TYPE_COURIER">
                    {{ $t('courierOrders') }}
                </div>
                <div v-else-if="scope.row.serviceType === ORDER_TYPE_POINT">
                    {{ $t('pointOrders') }}
                </div>
                <div v-else>{{ $t('other') }}</div>
            </template>
        </el-table-column>
        <el-table-column
                v-if="mode === 'search' && width > 1279"
                :label="$t('deliveryAddress') + ' / ' + $t('issuePoint')"
                key="col-delivery-address-or-issue-point">
            <template slot-scope="scope">
                <div v-if="scope.row.serviceType === ORDER_TYPE_COURIER">
                    {{ scope.row.recipient.address.value }}
                </div>
                <div v-else-if="scope.row.serviceType === ORDER_TYPE_POINT">

                </div>
            </template>
        </el-table-column>
        <el-table-column
                v-if="mode === 'search' && width > 379"
                :label="$t('deliveryDate') + ' / ' + $t('buyoutDate')"
                key="col-delivery-date-or-buyout-date">
            <template slot-scope="scope">
                <div v-if="scope.row.serviceType === ORDER_TYPE_COURIER">

                </div>
                <div v-else-if="scope.row.serviceType === ORDER_TYPE_POINT">

                </div>
            </template>
        </el-table-column>

        <el-table-column
                v-if="width > 1365"
                :label="$t('proceeds')"
                key="col-proceeds">
            <template slot-scope="scope">

            </template>
        </el-table-column>
    </el-table>
</template>

<script>
    import {mapActions} from 'vuex';

    import mixins from 'Common/js/mixins';
    import Currency from 'Components/Currency';
    import {ORDER_TYPE_COURIER, ORDER_TYPE_POINT} from 'Constants/data';

    export default {
        name: 'OrdersTable',
        mixins: [mixins],
        components: {Currency},
        props: {
            data: { type: Array },
            mode: { type: String, required: true },
        },
        data () {
            return {
                ORDER_TYPE_COURIER,
                ORDER_TYPE_POINT,
                width: 0,
            }
        },
        computed: {
            loading () { return this.data === null; },
        },
        methods: {
            ...mapActions('orders', [
                'open',
                'select',
                'clearSelect',
            ]),
            onSelectionChange (selection) {
                this.select(selection.map(item => item._id));
            },
        },
        created () {
            this.bindClientWidth('width');
        },
        destroyed () {
            this.unbindClientWidth();
            this.clearSelect();
        },
    }
</script>

<style lang="less" scoped>
    table {
        tbody {
            tr {
                td {
                    a {
                        text-overflow: ellipsis;
                        overflow: hidden;
                        max-width: 100%;
                    }
                }
            }
        }
    }
</style>