<template>
  <div>
    <CodReportsTable :data="codReports.data" />
    <Pagination :total="codReports.totalCount" :max-page="codReports.pageCount" />
  </div>
</template>

<script>
import { mapState, mapActions } from 'vuex';

import { PER_PAGE_DEFAULT } from 'Constants/config';
import CodReportsTable from 'Components/tables/CodReportsTable';
import Pagination from 'Components/Pagination';

export default {
  name: 'CodReportsPage',
  components: { Pagination, CodReportsTable },
  computed: {
    ...mapState('reporting', ['codReports']),
  },
  methods: {
    ...mapActions('reporting', ['loadCodReports']),
    loadList({ query }) {
      this.loadCodReports({
        perPage: PER_PAGE_DEFAULT,
        page: query.page,
      });
    },
  },
  beforeRouteEnter(to, from, next) {
    next(vm => vm.loadList(to));
  },
  beforeRouteUpdate(to, from, next) {
    this.loadList(to);
    next();
  },
};
</script>
