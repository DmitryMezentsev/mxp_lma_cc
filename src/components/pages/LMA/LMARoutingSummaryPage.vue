<template>
  <div>
    <LMARoutingSummaryFilters />

    <LMARoutingSummaryTable v-if="$route.query.date" :data="summary" />
    <div v-else class="page-center-message">{{ $t('selectDate') }}</div>
  </div>
</template>

<script>
import { mapState, mapActions } from 'vuex';

import LMARoutingSummaryTable from 'Components/tables/LMA/LMARoutingSummaryTable';
import LMARoutingSummaryFilters from 'Components/filters/LMA/LMARoutingSummaryFilters';

export default {
  name: 'LMARoutingMapPage',
  components: { LMARoutingSummaryFilters, LMARoutingSummaryTable },
  computed: {
    ...mapState('routing', ['summary']),
  },
  methods: {
    ...mapActions('routing', ['loadSummary']),
  },
  beforeRouteEnter(to, from, next) {
    next(vm => {
      if (to.query.date) vm.loadSummary(to.query);
    });
  },
  beforeRouteUpdate(to, from, next) {
    if (to.query.date) this.loadSummary(to.query);
    next();
  },
};
</script>
