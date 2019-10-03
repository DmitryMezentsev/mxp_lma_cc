<template>
  <div>
    <div v-if="data">
      <h4>{{ $t('assignedOrders') }}</h4>
      <el-table
        class="table-max-width"
        :data="data.assigned"
        :empty-text="$t('noOrders')"
        :summary-method="assignedOrdersSummary"
        show-summary
      >
        <el-table-column prop="courierName" :label="$t('courier')" key="col-courier-name" />
        <el-table-column :label="$t('zones')" v-if="clientWidth > 569" key="col-zones">
          <template slot-scope="scope">
            {{ scope.row.deliveryZoneName.join(', ') }}
          </template>
        </el-table-column>
        <el-table-column
          :label="$t('ordersCount')"
          :width="clientWidth > 399 ? 150 : 100"
          align="right"
          key="col-orders-count"
        >
          <template slot-scope="scope">
            {{ scope.row.ordersCount | number }}
          </template>
        </el-table-column>
      </el-table>

      <h4>{{ $t('unassignedOrders') }}</h4>
      <el-table
        class="table-max-width"
        :data="data.notAssigned"
        :empty-text="$t('noOrders')"
        :summary-method="assignedOrdersSummary"
        show-summary
      >
        <el-table-column prop="deliveryZoneName" :label="$t('zone')" key="col-zone" />
        <el-table-column
          :label="$t('ordersCount')"
          :width="clientWidth > 399 ? 150 : 100"
          align="right"
          key="col-orders-count"
        >
          <template slot-scope="scope">
            {{ scope.row.ordersCount | number }}
          </template>
        </el-table-column>
      </el-table>

      <h4>{{ $t('ordersForClarification') }}</h4>
      <el-table
        class="table-max-width"
        :data="data.geoTroubles"
        :empty-text="$t('noOrders')"
        :summary-method="ordersForClarificationSummary"
        :span-method="ordersForClarificationSpanMethod"
        show-summary
      >
        <el-table-column :label="$t('orderNumber')" key="col-number">
          <template slot-scope="scope">
            <router-link
              :to="{
                name: 'lmaOrdersList',
                params: { type: 'search' },
                query: { q: scope.row.internalNumber },
              }"
              >{{ scope.row.internalNumber }}</router-link
            >
          </template>
        </el-table-column>
        <el-table-column width="100" align="right" key="col-orders-count" />
      </el-table>
    </div>
    <Waiting v-else />
  </div>
</template>

<script>
import { mapState } from 'vuex';

import { number } from 'Common/js/filters';
import Waiting from 'Components/Waiting';

export default {
  name: 'LMARoutingSummaryTable',
  props: {
    data: { type: Object },
  },
  filters: { number },
  components: { Waiting },
  computed: {
    ...mapState('common', ['clientWidth']),
  },
  methods: {
    assignedOrdersSummary({ columns, data }) {
      const summary = new Array(columns.length);

      summary[0] = this.$t('totalOrders');
      summary[columns.length - 1] = 0;

      data.forEach(({ ordersCount }) => {
        summary[columns.length - 1] += ordersCount;
      });

      return summary;
    },
    ordersForClarificationSummary({ data }) {
      return [this.$t('totalOrders'), data.length];
    },
    // eslint-disable-next-line consistent-return
    ordersForClarificationSpanMethod({ columnIndex }) {
      if (columnIndex === 0) return [1, 2];
    },
  },
};
</script>

<style lang="less" scoped>
h4 {
  margin-top: 1.85rem;
}

.table-max-width {
  max-width: 1100px;
}
</style>
