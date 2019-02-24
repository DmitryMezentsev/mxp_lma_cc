<template>
    <el-table v-loading="loading"
              :data="data"
              :empty-text="$t(loading ? 'pleaseWait' : 'noOrders')">
        <el-table-column
                :label="$t('orderNumberInCompanyOrShop')"
                key="col-number">
            <template slot-scope="scope">
                <el-button type="text" @click="open(scope.$index)">
                    {{ scope.row.sender.providerNumber }} / {{ scope.row.sender.internalNumber }}
                </el-button>
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
                key="col-shop">
        </el-table-column>
        <el-table-column
                v-if="width > 479"
                prop="status.name"
                :label="$t('status')"
                key="col-status">
        </el-table-column>

        <!-- Только курьерка -->
        <el-table-column
                v-if="mode === 'courier' && width > 1279"
                prop="recipient.address.value"
                :label="$t('deliveryAddress')"
                key="col-delivery-address">
        </el-table-column>
        <el-table-column
                v-if="mode === 'courier' && width > 379"
                prop=""
                :label="$t('deliveryDate')"
                key="col-delivery-date">
        </el-table-column>

        <!-- Только ПВЗ -->
        <el-table-column
                v-if="mode === 'point' && width > 1279"
                prop=""
                :label="$t('issuePoint')"
                key="col-issue-point">
        </el-table-column>
        <el-table-column
                v-if="mode === 'point' && width > 379"
                prop=""
                :label="$t('buyoutDate')"
                key="col-buyout-date">
        </el-table-column>

        <!-- Только поиск (совмещенные столбцы) -->
        <el-table-column
                v-if="mode === 'search' && width > 1365"
                :label="$t('type')"
                key="col-type">
            <template slot-scope="scope">
                <div v-if="scope.row.serviceType === 0">
                    {{ $t('courierOrders') }}
                </div>
                <div v-else-if="scope.row.serviceType === 1">
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
                <div v-if="scope.row.serviceType === 0">
                    {{ scope.row.recipient.address.value }}
                </div>
                <div v-else-if="scope.row.serviceType === 1">

                </div>
            </template>
        </el-table-column>
        <el-table-column
                v-if="mode === 'search' && width > 379"
                :label="$t('deliveryDate') + ' / ' + $t('buyoutDate')"
                key="col-delivery-date-or-buyout-date">
            <template slot-scope="scope">
                <div v-if="scope.row.serviceType === 0">

                </div>
                <div v-else-if="scope.row.serviceType === 1">

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

    import mixins from '../../common/js/mixins';
    import Currency from '../Currency';

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
                width: 0,
            }
        },
        computed: {
            loading () { return this.data === null; },
        },
        methods: {
            ...mapActions('orders', [
                'open',
            ]),
        },
        created () {
            this.bindClientWidth('width');
        },
        destroyed () {
            this.unbindClientWidth();
        },
    }
</script>

<style lang="less" scoped>

</style>