<template>
  <div>
    <div v-if="$route.name === 'ccOrdersImport'">
      <div class="top-buttons-right">
        <router-link :to="{ name: 'ccOrdersImportTemplates' }">
          <el-button>{{ $t('templatesManagement') }}</el-button>
        </router-link>
        <el-button type="primary" @click="showImportDialog">
          <fa-icon icon="file-upload" class="btn-margin" />{{ $t('import') }}
        </el-button>
      </div>
      <br />
      <CCImportHistoryTable :data="history.data" />
      <Pagination :max-page="history.pages" />

      <CCImportDialog @upload="loadList($route.query)" />
    </div>

    <router-view />
  </div>
</template>

<script>
import { mapState, mapMutations, mapActions } from 'vuex';

import mixins from 'Common/js/mixins';
import { PER_PAGE_DEFAULT } from 'Constants/config';
import CCImportHistoryTable from 'Components/tables/CC/CCImportHistoryTable';
import Pagination from 'Components/Pagination';
import CCImportDialog from 'Components/dialog/CC/CCImportDialog';

export default {
  name: 'CCOrdersImportPage',
  mixins: [mixins],
  components: { CCImportDialog, CCImportHistoryTable, Pagination },
  computed: {
    ...mapState('import', ['history']),
  },
  methods: {
    ...mapMutations('import', ['showImportDialog']),
    ...mapActions('import', ['loadHistory']),
    loadList(query) {
      this.loadHistory({
        perPage: PER_PAGE_DEFAULT,
        page: query.page,
      });
    },
  },
  beforeRouteEnter(to, from, next) {
    next(vm => {
      if (to.name === 'ccOrdersImport') vm.loadList(to.query);
    });
  },
  beforeRouteUpdate(to, from, next) {
    if (to.name === 'ccOrdersImport') this.loadList(to.query);
    next();
  },
};
</script>
