<template>
    <el-table v-loading="loading"
              :data="data"
              :empty-text="$t(loading ? 'pleaseWait' : 'noOrders')"
              :class="`orders-table-${mode}`"
              class="orders-table">
        <el-table-column :label="$t('orderNumberInCompanyOrShop')">
            <template slot-scope="scope">
                <el-button type="text" @click="open(scope.row)">
                    {{ scope.row.sender.providerNumber }} / {{ scope.row.sender.internalNumber }}
                </el-button>
            </template>
        </el-table-column>
        <el-table-column
                v-if="width > 719"
                :label="$t('recipient')">
            <template slot-scope="scope">
                {{ scope.row.recipient.contacts.name }}<br>
                <small>{{ scope.row.recipient.contacts.phone }}</small>
            </template>
        </el-table-column>
        <el-table-column
                v-if="width > 579"
                prop=""
                :label="$t('cod')">
            <template slot-scope="scope">
                <Currency :val="scope.row.cashOnDelivery.priceDeclared" />
            </template>
        </el-table-column>
        <el-table-column
                v-if="width > 879"
                prop="sender.brandName"
                :label="$t('shop')">
        </el-table-column>
        <el-table-column
                v-if="width > 479"
                prop="status.name"
                :label="$t('status')">
        </el-table-column>

        <!-- Только курьерка -->
        <el-table-column
                v-if="mode === 'courier' && width > 1279"
                prop="recipient.address.value"
                :label="$t('deliveryAddress')">
        </el-table-column>
        <el-table-column
                v-if="mode === 'courier' && width > 379"
                prop=""
                :label="$t('deliveryDate')">
        </el-table-column>

        <!-- Только ПВЗ -->
        <el-table-column
                v-if="mode === 'point' && width > 1279"
                prop=""
                :label="$t('issuePoint')">
        </el-table-column>
        <el-table-column
                v-if="mode === 'point' && width > 379"
                prop=""
                :label="$t('buyoutDate')">
        </el-table-column>

        <!-- Только поиск (совмещенные столбцы) -->
        <el-table-column
                v-if="mode === 'search' && width > 1365"
                prop=""
                :label="$t('type')">
        </el-table-column>
        <el-table-column
                v-if="mode === 'search' && width > 1279"
                prop=""
                :label="$t('deliveryAddress') + ' / ' + $t('issuePoint')">
        </el-table-column>
        <el-table-column
                v-if="mode === 'search' && width > 379"
                prop=""
                :label="$t('deliveryDate') + ' / ' + $t('buyoutDate')">
        </el-table-column>

        <el-table-column
                v-if="width > 1365"
                prop=""
                :label="$t('proceeds')">
        </el-table-column>
    </el-table>
</template>

<script>
    import mixins from '../../common/mixins';

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
            open (order) {
                this.$emit('openOrder', order);
            },
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