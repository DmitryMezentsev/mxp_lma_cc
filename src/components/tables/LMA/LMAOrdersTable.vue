<template>
  <el-table
    ref="table"
    v-loading="loading"
    :data="data"
    :empty-text="$t(loading ? 'pleaseWait' : 'noOrders')"
    @selection-change="onSelectionChange"
  >
    <el-table-column v-if="mode === 'courier'" type="selection" width="55" key="col-selection" />
    <el-table-column :label="$t('orderNumberInCompanyOrShop')" key="col-number">
      <template slot-scope="scope">
        <a @click.prevent="setOpened(scope.$index)">
          {{ scope.row.internalNumber }}<br />
          {{ scope.row.sender.internalNumber }}
        </a>
      </template>
    </el-table-column>
    <el-table-column v-if="clientWidth > 719" :label="$t('recipient')" key="col-contacts">
      <template slot-scope="scope">
        <div>{{ scope.row.recipient.contacts.name }}</div>
        <small>{{ scope.row.recipient.contacts.phone }}</small>
      </template>
    </el-table-column>
    <el-table-column v-if="clientWidth > 579" key="col-price-declared-or-proceeds">
      <template slot="header">
        {{ $t('cod') }}&nbsp;/<br />{{ $t('proceeds') }}
      </template>
      <template slot-scope="scope">
        <div>{{ scope.row.cashOnDelivery.priceDeclared | currency }}</div>
        <div>{{ 0 | currency }}</div>
      </template>
    </el-table-column>
    <el-table-column v-if="clientWidth > 1149" :label="$t('shop')" key="col-shop">
      <template slot-scope="scope">
        <div>{{ scope.row.sender.legalPersonName || '&mdash;' }}</div>
        <div>{{ scope.row.sender.brandName || '&mdash;' }}</div>
      </template>
    </el-table-column>
    <el-table-column
      v-if="clientWidth > 559"
      prop="currentStatus.statusInfo.name"
      :label="$t('status')"
      key="col-status"
    />

    <!-- Только курьерские -->
    <el-table-column
      v-if="mode === 'courier' && clientWidth > 1279"
      prop="recipient.address.value"
      :label="$t('deliveryAddress')"
      key="col-delivery-address"
    />
    <el-table-column
      v-if="mode === 'courier' && clientWidth > 1365"
      :label="$t('deliveryAddress')"
      key="col-delivery-courier-or-zone"
    >
      <template slot="header"
        >{{ $t('courier') }}&nbsp;/<br />{{ $t('zone') }}</template
      >
      <template slot-scope="scope">
        <div>{{ scope.row.serviceInfo.courierName || '—' }}</div>
        <div>{{ scope.row.serviceInfo.deliveryZoneName || '—' }}</div>
      </template>
    </el-table-column>
    <el-table-column
      v-if="mode === 'courier' && clientWidth > 419"
      width="155"
      key="col-delivery-date"
    >
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

    <!-- Только ПВЗ -->
    <el-table-column
      v-if="mode === 'point' && clientWidth > 1279"
      prop=""
      :label="$t('issuePoint')"
      key="col-issue-point"
    />
    <el-table-column
      v-if="mode === 'point' && clientWidth > 379"
      prop=""
      :label="$t('buyoutDate')"
      key="col-buyout-date"
    />

    <!-- Только поиск (совмещенные столбцы) -->
    <el-table-column
      v-if="mode === 'search' && clientWidth > 1365"
      :label="$t('type')"
      key="col-type"
    >
      <template slot-scope="scope">
        <div v-if="scope.row.serviceType === COURIER">
          {{ $t('courierOrders') }}
        </div>
        <div v-else-if="scope.row.serviceType === POINT">
          {{ $t('pointOrders') }}
        </div>
        <div v-else>{{ $t('other') }}</div>
      </template>
    </el-table-column>
    <el-table-column
      v-if="mode === 'search' && clientWidth > 1279"
      :label="$t('deliveryAddress') + ' / ' + $t('issuePoint')"
      key="col-delivery-address-or-issue-point"
    >
      <template slot-scope="scope">
        <div v-if="scope.row.serviceType === COURIER">{{ scope.row.recipient.address.value }}</div>
        <div v-else-if="scope.row.serviceType === POINT"></div>
      </template>
    </el-table-column>
    <el-table-column
      v-if="mode === 'search' && clientWidth > 379"
      :label="$t('deliveryDate') + ' / ' + $t('buyoutDate')"
      key="col-delivery-date-or-buyout-date"
    >
      <template slot-scope="scope">
        <OrderDeliveryDate
          v-if="scope.row.serviceType === COURIER"
          :date-time-interval="scope.row.deliveryOrder.dateTimeInterval"
        />
        <div v-else-if="scope.row.serviceType === POINT"></div>
      </template>
    </el-table-column>
  </el-table>
</template>

<script>
import { mapState, mapMutations } from 'vuex';

import { COURIER, POINT } from 'Constants/delivery-types';
import mixins from 'Common/js/mixins';
import { currency } from 'Common/js/filters';
import OrderDeliveryDate from 'Components/OrderDeliveryDate';

export default {
  name: 'LMAOrdersTable',
  mixins: [mixins],
  filters: { currency },
  components: { OrderDeliveryDate },
  props: {
    data: { type: Array },
    mode: { type: String, required: true },
  },
  data() {
    return {
      COURIER,
      POINT,
    };
  },
  computed: {
    ...mapState('common', ['clientWidth']),
    ...mapState('orders', ['selected']),
    loading() {
      return this.data === null;
    },
  },
  methods: {
    ...mapMutations('orders', ['setOpened', 'setSelected', 'clearSelected']),
    onSelectionChange(selection) {
      this.setSelected(selection.map(item => item._id)); // eslint-disable-line no-underscore-dangle
    },
  },
  destroyed() {
    this.clearSelected();
  },
  watch: {
    selected(selected) {
      if (!selected.length) this.$refs.table.clearSelection();
    },
  },
};
</script>
