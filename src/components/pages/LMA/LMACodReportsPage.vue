<template>
  <div>
    <LMACodReportsTable :data="codReports.data" />
    <Pagination :max-page="codReports.pages" />
  </div>
</template>

<script>
import { mapState, mapActions } from 'vuex';

import { PER_PAGE_DEFAULT } from 'Constants/config';
import LMACodReportsTable from 'Components/tables/LMA/LMACodReportsTable';
import Pagination from 'Components/Pagination';

export default {
  name: 'LMACodReportsPage',
  components: { Pagination, LMACodReportsTable },
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
