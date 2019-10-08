<template>
  <div>
    <div v-if="$route.name === 'ccOrders' || $route.name === 'ccOrdersSearch'">
      <div class="top-buttons-right">
        <router-link :to="{ name: 'ccOrdersImport' }">
          <el-button type="primary">
            <fa-icon icon="file-upload" class="btn-margin" />{{ $t('ordersImport') }}
          </el-button>
        </router-link>
        <router-link :to="{ name: 'ccAddOrder' }">
          <el-button type="primary">
            {{ $t('addOrder') }}
          </el-button>
        </router-link>
      </div>

      <CCOrdersFilters v-if="$route.name === 'ccOrders'" />
      <br />
      <CCOrdersTable :data="list.data" />
      <Pagination :max-page="list.pages" />

      <CCOrderDialog />
    </div>

    <router-view />
  </div>
</template>

<script>
import { mapState, mapActions } from 'vuex';
import { get } from 'lodash';

import { PER_PAGE_DEFAULT } from 'Constants/config';
import { value2Array } from 'Common/js/helpers';
import CCOrdersFilters from 'Components/filters/CC/CCOrdersFilters';
import CCOrdersTable from 'Components/tables/CC/CCOrdersTable';
import Pagination from 'Components/Pagination';
import CCOrderDialog from 'Components/dialog/CC/CCOrderDialog';

export default {
  name: 'CCOrdersPage',
  components: { CCOrderDialog, CCOrdersTable, CCOrdersFilters, Pagination },
  computed: {
    ...mapState('orders', ['list']),
  },
  methods: {
    ...mapActions('orders', ['loadList']),
    loadOrders({ query, name }) {
      this.loadList({
        perPage: PER_PAGE_DEFAULT,
        page: query.page,
        // Поиск
        search: name === 'ccOrdersSearch' ? query.q : null,
        // Фильтры
        serviceType: query.type,
        deliveryDateFrom: get(query, 'deliveryDate[0]'),
        deliveryDateTo: get(query, 'deliveryDate[1]'),
        creationDateFrom: get(query, 'creationDate[0]'),
        creationDateTo: get(query, 'creationDate[1]'),
        statusId: value2Array(query.status),
        senderWarehouseId: query.warehouse,
        senderPrincipalContractId: query.contract,
        address: query.address,
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

<style lang="less" scoped></style>
