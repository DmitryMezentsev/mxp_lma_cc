<template>
  <div>
    <div v-if="$route.name === 'ccOrdersImportTemplates'">
      <div class="top-buttons-right">
        <router-link :to="{ name: 'ccOrdersAddImportTemplate' }">
          <el-button type="primary">
            {{ $t('addTemplate') }}
          </el-button>
        </router-link>
      </div>
      <br />
      <CCOrdersImportTemplatesTable :data="templates.data" @update="loadList($route.query)" />
      <Pagination :max-page="templates.pages" />
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
    ...mapState('import', ['templates']),
  },
  methods: {
    ...mapActions('import', ['loadTemplates']),
    loadList(query) {
      this.loadTemplates({
        fields: ['_id', 'name', 'used'],
        perPage: PER_PAGE_DEFAULT,
        page: query.page,
      });
    },
  },
  beforeRouteEnter(to, from, next) {
    next(vm => {
      if (to.name === 'ccOrdersImportTemplates') vm.loadList(to.query);
    });
  },
  beforeRouteUpdate(to, from, next) {
    if (to.name === 'ccOrdersImportTemplates') this.loadList(to.query);
    next();
  },
};
</script>
