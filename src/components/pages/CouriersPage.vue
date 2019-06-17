<template>
  <div>
    <div v-if="$route.name === 'couriers'">
      <el-row type="flex" align="bottom">
        <el-col :span="12" :xs="9">
          <CouriersFilters />
        </el-col>
        <el-col :span="12" :xs="15">
          <div class="text-right">
            <router-link :to="{ name: 'addCourier' }">
              <el-button type="primary">{{ $t('addCourier') }}</el-button>
            </router-link>
          </div>
        </el-col>
      </el-row>
      <br />
      <CouriersTable :data="list.data" @update="loadCouriers($route.query)" />
      <Pagination :total="list.totalCount" :max-page="list.pageCount" />
    </div>

    <router-view />
  </div>
</template>

<script>
import { mapState, mapActions } from 'vuex';

import { PER_PAGE_DEFAULT } from 'Constants/config';
import CouriersFilters from 'Components/filters/CouriersFilters';
import CouriersTable from 'Components/tables/CouriersTable';
import Pagination from 'Components/Pagination';

export default {
  name: 'CouriersPage',
  components: { CouriersFilters, CouriersTable, Pagination },
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
    next(vm => vm.loadCouriers(to.query));
  },
  beforeRouteUpdate(to, from, next) {
    if (to.name === 'couriers') this.loadCouriers(to.query);
    next();
  },
};
</script>
