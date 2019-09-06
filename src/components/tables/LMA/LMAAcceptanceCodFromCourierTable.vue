<template>
  <div class="acceptance-cod-from-courier-table">
    <div class="sum">
      <div class="total-orders">
        {{ $t('orders2') }}: {{ get(data, 'orders.length', 0) | number }}</div><!-- eslint-disable-line -->
      <el-progress :stroke-width="20" :percentage="acquiringPercent" :show-text="false" />
      <div class="labels">
        <div class="acquiring-sum">
          {{ $t('acquiringSum') }}: {{ get(data, 'totalCardCOD') | currency }}</div><!-- eslint-disable-line -->
        <div class="cash-sum">{{ $t('cashSum') }}: {{ get(data, 'totalCashCOD') | currency }}</div>
      </div>
    </div>

    <el-table
      v-loading="loading"
      :data="loading ? [] : data.orders"
      :empty-text="$t(loading ? 'pleaseWait' : 'noOrders')"
    >
      <el-table-column v-if="clientWidth > 519" type="index" label="#" width="40" key="col-index" />
      <el-table-column :label="$t('orderNumber')" key="col-order-number">
        <template slot-scope="scope">
          <div class="ellipsis">{{ scope.row.internalnumber }}</div>
        </template>
      </el-table-column>
      <el-table-column
        v-if="clientWidth > 799"
        prop="address"
        :label="$t('address')"
        key="col-address"
      />
      <el-table-column
        v-if="clientWidth > 479"
        prop="statusName"
        :label="$t('status')"
        key="col-status"
      />
      <el-table-column v-if="clientWidth > 719" :label="$t('paymentType')" key="col-payment-type">
        <template slot-scope="scope">
          <PaymentType :type="scope.row.paymentType" />
        </template>
      </el-table-column>
      <el-table-column align="right" :label="$t('sum')" key="col-sum">
        <template slot-scope="scope">{{ scope.row.cod | currency }}</template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script>
import { mapState } from 'vuex';
import { get } from 'lodash';

import { currency, number } from 'Common/js/filters';
import PaymentType from 'Components/PaymentType';

export default {
  name: 'LMAAcceptanceCodFromCourierTable',
  components: { PaymentType },
  filters: { currency, number },
  props: {
    data: { type: Object },
  },
  computed: {
    ...mapState('common', ['clientWidth']),
    acquiringPercent() {
      if (!this.data) return 0;

      // eslint-disable-next-line prettier/prettier
      const percent = this.data.totalCardCOD / ((this.data.totalCardCOD + this.data.totalCashCOD) / 100);
      return Number.isNaN(percent) ? 0 : percent;
    },
    loading() {
      return this.data === null;
    },
  },
  methods: {
    get,
  },
};
</script>

<style lang="less">
.acceptance-cod-from-courier-table {
  .sum {
    margin: 1.35em auto;
    max-width: 800px;
    font-size: 0.75em;

    .total-orders {
      text-align: center;
    }

    .el-progress-bar {
      margin: 0.4em 0;
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
