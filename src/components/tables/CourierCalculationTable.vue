<template>
    <div class="courier-calculation-table">
        <div class="sum" v-if="!loading">
            <div class="total-orders">{{ $tc('orders', 2) }}: {{ data.orders.length | number }}</div>
            <el-progress :stroke-width="20" :percentage="acquiringPercent" :show-text="false" />
            <div class="labels">
                <div class="acquiring-sum">{{ $t('acquiringSum') }}: {{ data.totalCardCOD | currency }}</div>
                <div class="cash-sum">{{ $t('cashSum') }}: {{ data.totalCashCOD | currency }}</div>
            </div>
        </div>

        <el-table v-loading="loading"
                  :data="loading ? [] : data.orders"
                  :empty-text="$t(loading ? 'pleaseWait' : 'noOrders')">
            <el-table-column
                    v-if="clientWidth > 519"
                    type="index"
                    label="#"
                    width="40"
                    key="col-index" />
            <el-table-column
                    :label="$t('orderNumber')"
                    key="col-order-number">
                <template slot-scope="scope">
                    <div class="ellipsis">{{ scope.row.internalnumber }}</div>
                </template>
            </el-table-column>
            <el-table-column
                    v-if="clientWidth > 799"
                    prop="address"
                    :label="$t('address')"
                    key="col-address" />
            <el-table-column
                    v-if="clientWidth > 479"
                    prop="statusName"
                    :label="$t('status')"
                    key="col-status" />
            <el-table-column
                    v-if="clientWidth > 719"
                    :label="$t('paymentType')"
                    key="col-payment-type">
                <template slot-scope="scope">
                    <PaymentType :type="scope.row.paymentType" />
                </template>
            </el-table-column>
            <el-table-column
                    align="right"
                    :label="$t('sum')"
                    key="col-sum">
                <template slot-scope="scope">{{ scope.row.cod | currency }}</template>
            </el-table-column>
        </el-table>
    </div>
</template>

<script>
    import {mapState} from 'vuex';

    import {currency, number} from 'Common/js/filters';
    import PaymentType from 'Components/PaymentType';

    export default {
        name: 'CourierCalculationTable',
        components: {PaymentType},
        filters: {currency, number},
        props: {
            data: { type: Object },
        },
        computed: {
            ...mapState('common', [
                'clientWidth',
            ]),
            acquiringPercent () {
                const percent = this.data.totalCardCOD / ((this.data.totalCardCOD + this.data.totalCashCOD) / 100);
                return isNaN(percent) ? 0 : percent;
            },
            loading () { return this.data === null; },
        },
    }
</script>

<style lang="less">
    .courier-calculation-table {
        .sum {
            margin: 1.35em auto;
            max-width: 800px;
            font-size: .75em;

            .total-orders {
                text-align: center;
            }

            .el-progress-bar {
                margin: .4em 0;
            }

            .labels {
                display: flex;
                justify-content: space-between;

                .acquiring-sum {
                    padding-right: 7px;
                }

                .cash-sum {
                    padding-left: 7px;
                    text-align: right;
                }
            }
        }
    }
</style>