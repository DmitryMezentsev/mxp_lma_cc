<template>
  <div>
    <div v-if="$route.name === 'lmaCouriers'">
      <el-row type="flex" align="bottom">
        <el-col :span="12" :xs="9">
          <LMACouriersFilters />
        </el-col>
        <el-col :span="12" :xs="15">
          <div class="top-buttons-right">
            <router-link :to="{ name: 'lmaAddCourier' }">
              <el-button type="primary">{{ $t('addCourier') }}</el-button>
            </router-link>
          </div>
        </el-col>
      </el-row>
      <br />
      <LMACouriersTable :data="list.data" @update="loadCouriers($route.query)" />
      <Pagination :max-page="list.pages" />
    </div>

    <router-view />
  </div>
</template>

<script>
import { mapState, mapActions } from 'vuex';

import { PER_PAGE_DEFAULT } from 'Constants/config';
import LMACouriersFilters from 'Components/filters/LMA/LMACouriersFilters';
import LMACouriersTable from 'Components/tables/LMA/LMACouriersTable';
import Pagination from 'Components/Pagination';

export default {
  name: 'LMACouriersPage',
  components: { LMACouriersFilters, LMACouriersTable, Pagination },
  computed: {
    ...mapState('couriers', ['list']),
  },
  methods: {
    ...mapActions('couriers', ['loadList']),
    loadCouriers(query) {
      this.loadList({
        perPage: PER_PAGE_DEFAULT,
        fields: ['courierId', 'fullname', 'phone1', 'phone2', 'livingArea', 'isActive'],
        page: query.page,
        fullname: query.fullname,
        isActive: !query.inArchive,
      });
    },
  },
  beforeRouteEnter(to, from, next) {
    next(vm => {
      if (to.name === 'lmaCouriers') vm.loadCouriers(to.query);
    });
  },
  beforeRouteUpdate(to, from, next) {
    if (to.name === 'lmaCouriers') this.loadCouriers(to.query);
    next();
  },
};
</script>
