<template>
  <div>
    <LMAOrdersFilters v-if="$route.params.type === 'courier' || $route.params.type === 'point'" />
    <br />
    <LMAOrdersTable :data="list.data" :mode="$route.params.type" />
    <div
      v-if="list.totalCount && ($route.params.type === 'courier' || $route.params.type === 'point')"
      class="total"
    >
      {{ $t('totalOrders') }}: {{ list.totalCount | number }}. {{ $t('totalPriceDeclared') }}:
      <!-- eslint-disable-next-line -->
      {{ list.sumPriceDeclared | currency }}.
      {{ $t('totalRevenues') }}:
      {{ 0 | currency }}.</div>
    <br />
    <el-button
      v-if="$route.params.type === 'courier' && list.data && list.data.length"
      size="mini"
      type="primary"
      :disabled="!selected.length"
      @click="selectCourierDialog = true"
    >
      {{ $t('setCourier') }}
    </el-button>
    <Pagination :max-page="list.pages" />

    <LMAOrderDialog @update="loadOrders($route)" />

    <SelectCourierDialog
      :visible="selectCourierDialog"
      @select="setCourier"
      @cancel="selectCourierDialog = false"
    />
  </div>
</template>

<script>
import { mapState, mapActions } from 'vuex';
import get from 'lodash/get';

import { PER_PAGE_DEFAULT } from 'Constants/config';
import LMAOrdersFilters from 'Components/filters/LMA/LMAOrdersFilters';
import LMAOrdersTable from 'Components/tables/LMA/LMAOrdersTable';
import Pagination from 'Components/Pagination';
import LMAOrderDialog from 'Components/dialog/LMA/LMAOrderDialog';
import SelectCourierDialog from 'Components/dialog/SelectCourierDialog';
import api from 'Common/js/api';
import { number, currency } from 'Common/js/filters';
import { value2Array } from 'Common/js/helpers';

export default {
  name: 'LMAOrdersPage',
  components: { LMAOrderDialog, Pagination, LMAOrdersTable, LMAOrdersFilters, SelectCourierDialog },
  filters: { number, currency },
  data() {
    return {
      selectCourierDialog: false,
    };
  },
  computed: {
    ...mapState('orders', ['list', 'selected']),
  },
  methods: {
    ...mapActions('orders', ['loadList']),
    loadOrders({ query, params }) {
      this.loadList({
        perPage: PER_PAGE_DEFAULT,
        page: query.page,
        serviceType: (() => {
          switch (params.type) {
            case 'courier':
              return 0;
            case 'point':
              return 1;
            default:
              return null;
          }
        })(),
        search: params.type === 'search' ? query.q : null,
        deliveryDateFrom: get(query, 'deliveryDate[0]'),
        deliveryDateTo: get(query, 'deliveryDate[1]'),
        statusId: value2Array(query.status),
      });
    },
    setCourier(courierId) {
      api
        .post('/order/setCourierToOrders', {
          courierId,
          orderIds: this.selected,
        })
        .then(() => {
          this.loadOrders(this.$route);

          this.$message({
            message: this.$tc('courierAreSet', this.selected.length > 1 ? 2 : 1),
            type: 'success',
          });
        })
        .finally(() => {
          this.selectCourierDialog = false;
        });
    },
  },
  beforeRouteEnter(to, from, next) {
    next(vm => vm.loadOrders(to));
  },
  beforeRouteUpdate(to, from, next) {
    this.loadOrders(to);
    next();
  },
};
</script>

<style lang="less" scoped>
@import '~Common/colors';

.total {
  margin-top: 1.25em;
  color: @secondary-text-color;
  font-size: 0.85em;
  text-align: center;
}
</style>
