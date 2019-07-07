<template>
  <el-table
    ref="table"
    v-loading="loading"
    :data="data"
    :empty-text="$t(loading ? 'pleaseWait' : 'noPickups')"
    @selection-change="onSelectionChange"
  >
    <el-table-column type="selection" width="55" key="col-selection" />
    <el-table-column key="col-number" :label="$t('orderNumberInCompanyOrShop')">
      <template slot-scope="scope">
        <el-button type="text" @click="setOpened(scope.$index)">
          {{ scope.row.logist.internalNumber }} /
          {{ scope.row.sender.internalNumber }}
        </el-button>
      </template>
    </el-table-column>
    <el-table-column v-if="clientWidth > 459" key="col-pickup-date" width="150">
      <template slot="header" slot-scope="scope">
        {{ $t('pickupDate') }}&nbsp;
        <el-tooltip :content="$t('clientTimezoneMsg')" placement="top">
          <fa-icon icon="question-circle" />
        </el-tooltip>
      </template>
      <template slot-scope="scope">
        {{ scope.row.pickup.date | formatDate }}
        <div>{{ scope.row.pickup.time.from }} &ndash; {{ scope.row.pickup.time.to }}</div>
      </template>
    </el-table-column>
    <el-table-column
      v-if="clientWidth > 1359"
      property="sender.name"
      key="col-customer"
      :label="$t('customer')"
    />
    <el-table-column
      v-if="clientWidth > 1169"
      property="sender.warehouseName"
      key="col-warehouse"
      :label="$t('warehouse')"
    />
    <el-table-column
      v-if="clientWidth > 767"
      :label="$t('status')"
      key="col-status"
      property="serviceInfo.statusName"
    />
    <el-table-column
      v-if="clientWidth > 639"
      key="col-zone-and-courier"
      :label="$t('zone') + ' / ' + $t('courier')"
    >
      <template slot-scope="scope">
        <div>{{ scope.row.serviceInfo.zoneName }}</div>
        <div>{{ scope.row.serviceInfo.courierName }}</div>
      </template>
    </el-table-column>
  </el-table>
</template>

<script>
import { mapState, mapMutations } from 'vuex';

import { formatDate } from 'Common/js/filters';

export default {
  name: 'LMAPickupsTable',
  filters: { formatDate },
  props: {
    data: { type: Array },
  },
  computed: {
    ...mapState('common', ['clientWidth']),
    ...mapState('pickups', ['selected']),
    loading() {
      return this.data === null;
    },
  },
  methods: {
    ...mapMutations('pickups', ['setOpened', 'setSelected', 'clearSelected']),
    onSelectionChange(selection) {
      this.setSelected(selection.map(item => item.pickupId));
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
