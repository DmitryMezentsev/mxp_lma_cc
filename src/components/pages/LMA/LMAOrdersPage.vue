<template>
  <div>
    <LMAOrdersFilters v-if="$route.params.type === 'courier' || $route.params.type === 'point'" />
    <br />
    <LMAOrdersTable :data="list.data" :mode="$route.params.type" :key="$route.params.type" />
    <div
      v-if="list.totalCount && ($route.params.type === 'courier' || $route.params.type === 'point')"
      class="total"
    >
      {{ $t('totalOrders') }}: {{ list.totalCount | number }}. {{ $t('totalPriceDeclared') }}:
      <!-- eslint-disable-next-line -->
      {{ list.sumPriceDeclared | currency }}.
      {{ $t('totalRevenues') }}:
      {{ 0 | currency }}.</div>
    <Pagination :max-page="list.pages" />

    <LMAOrderDialog @update="loadOrders($route)" />
    <OrderStatusesHistoryDialog />

    <SelectCourierDialog
      :visible="selectCourierDialog"
      @select="setCourier"
      @cancel="selectCourierDialog = false"
    />

    <ActionsPanel :actions="actions" />
  </div>
</template>

<script>
import { mapState, mapMutations, mapActions } from 'vuex';
import { get } from 'lodash';

import api from 'Common/js/api';
import { PER_PAGE_DEFAULT, CORE_REQUEST_HEADERS } from 'Constants/config';
import LMAOrdersFilters from 'Components/filters/LMA/LMAOrdersFilters';
import LMAOrdersTable from 'Components/tables/LMA/LMAOrdersTable';
import Pagination from 'Components/Pagination';
import LMAOrderDialog from 'Components/dialog/LMA/LMAOrderDialog';
import SelectCourierDialog from 'Components/dialog/SelectCourierDialog';
import ActionsPanel from 'Components/ActionsPanel';
import OrderStatusesHistoryDialog from 'Components/dialog/OrderStatusesHistoryDialog';
import { number, currency } from 'Common/js/filters';
import { value2Array } from 'Common/js/helpers';

export default {
  name: 'LMAOrdersPage',
  components: {
    OrderStatusesHistoryDialog,
    ActionsPanel,
    LMAOrderDialog,
    Pagination,
    LMAOrdersTable,
    LMAOrdersFilters,
    SelectCourierDialog,
  },
  filters: { number, currency },
  data() {
    return {
      selectCourierDialog: false,
    };
  },
  computed: {
    ...mapState('orders', ['list', 'selected']),
    actions() {
      if (this.selected.length) {
        return [
          [
            {
              name: this.$t('clearSelection'),
              btnType: 'default',
              callback: this.clearSelected,
              hideWidth: 459,
            },
            {
              name: this.$t('setCourier'),
              callback: () => {
                this.selectCourierDialog = true;
              },
            },
          ],
        ];
      }

      return null;
    },
  },
  methods: {
    ...mapMutations('orders', ['clearSelected']),
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
        .patch(
          'orders/serviceInfo/courierId',
          {
            courierId,
            orderIds: this.selected,
          },
          {
            headers: CORE_REQUEST_HEADERS,
          },
        )
        .then(() => {
          this.loadOrders(this.$route);

          this.$message({
            message: this.$t('courierAreSet'),
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
