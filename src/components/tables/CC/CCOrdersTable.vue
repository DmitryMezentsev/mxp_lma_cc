<template>
  <el-table v-loading="loading" :data="data" :empty-text="$t(loading ? 'pleaseWait' : 'noOrders')">
    <el-table-column :label="$t('orderNumberInCompanyOrShop')" key="col-number">
      <template slot-scope="scope">
        <a @click.prevent="setOpened(scope.$index)">
          {{ scope.row.internalNumber }}<br />
          {{ scope.row.sender.internalNumber }}
        </a>
      </template>
    </el-table-column>
    <el-table-column :label="$t('type')" width="100" key="col-type" v-if="clientWidth > 639">
      <template slot-scope="scope">{{ scope.row.serviceType | deliveryType }}</template>
    </el-table-column>
    <el-table-column
      :label="$t('address')"
      prop="recipient.address.value"
      key="col-address"
      v-if="clientWidth > 719"
    />
    <el-table-column width="155" key="col-delivery-date" v-if="clientWidth > 419">
      <template slot="header" slot-scope="scope">
        {{ $t('deliveryDate') }}&nbsp;
        <el-tooltip :content="$t('clientTimezoneMsg')" placement="top">
          <fa-icon icon="question-circle" />
        </el-tooltip>
      </template>
      <template slot-scope="scope">
        <OrderDeliveryDate :date-time-interval="scope.row.deliveryOrder.dateTimeInterval" />
      </template>
    </el-table-column>
    <el-table-column :label="$t('warehouse')" key="col-warehouse" v-if="clientWidth > 1159">
      <template slot-scope="scope">{{ scope.row.sender.warehouseId | warehouseName }}</template>
    </el-table-column>
    <el-table-column :label="$t('contract')" key="col-contract" v-if="clientWidth > 1359">
      <template slot-scope="scope">{{
        scope.row.contracts.senderPrincipalContractId | contractName
      }}</template>
    </el-table-column>
    <el-table-column
      :label="$t('status')"
      prop="currentStatus.statusInfo.name"
      key="col-status"
      v-if="clientWidth > 479"
    />
    <el-table-column
      :label="$t('creatingDate')"
      width="100"
      key="col-creation-date"
      v-if="clientWidth > 799"
    >
      <template slot-scope="scope">{{
        scope.row.serviceInfo.createdAt | formatDate(true)
      }}</template>
    </el-table-column>
  </el-table>
</template>

<script>
import { mapState, mapMutations } from 'vuex';

import mixins from 'Common/js/mixins';
import { deliveryType, formatDate, warehouseName, contractName } from 'Common/js/filters';
import OrderDeliveryDate from 'Components/OrderDeliveryDate';

export default {
  name: 'CCOrdersTable',
  mixins: [mixins],
  filters: { deliveryType, formatDate, warehouseName, contractName },
  components: { OrderDeliveryDate },
  props: {
    data: { type: Array },
  },
  computed: {
    ...mapState('common', ['clientWidth']),
    loading() {
      return this.data === null;
    },
  },
  methods: {
    ...mapMutations('orders', ['setOpened']),
  },
};
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
