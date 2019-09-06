<template>
  <div>
    <div v-if="$route.name === 'ccOrdersImportTemplates'">
      <div class="text-right">
        <router-link :to="{ name: 'ccOrdersAddImportTemplate' }">
          <el-button type="primary">
            {{ $t('addTemplate') }}
          </el-button>
        </router-link>
      </div>
      <br />
      <CCOrdersImportTemplatesTable :data="list.data" @update="loadTemplates($route.query)" />
      <br />
      <Pagination :max-page="list.pages" />
    </div>

    <router-view />
  </div>
</template>

<script>
import { mapState, mapActions } from 'vuex';

import { PER_PAGE_DEFAULT } from 'Constants/config';
import CCOrdersImportTemplatesTable from 'Components/tables/CC/CCOrdersImportTemplatesTable';
import Pagination from 'Components/Pagination';

export default {
  name: 'CCOrdersImportTemplatesPage',
  components: { CCOrdersImportTemplatesTable, Pagination },
  computed: {
    ...mapState('ordersTemplates', ['list']),
  },
  methods: {
    ...mapActions('ordersTemplates', ['loadList']),
    loadTemplates(query) {
      this.loadList({
        fields: ['_id', 'name', 'used'],
        perPage: PER_PAGE_DEFAULT,
        page: query.page,
      });
    },
  },
  beforeRouteEnter(to, from, next) {
    next(vm => {
      if (to.name === 'ccOrdersImportTemplates') vm.loadTemplates(to.query);
    });
  },
  beforeRouteUpdate(to, from, next) {
    if (to.name === 'ccOrdersImportTemplates') this.loadTemplates(to.query);
    next();
  },
};
</script>
