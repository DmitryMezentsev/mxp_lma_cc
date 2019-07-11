<template>
  <div>
    <LMAAcceptanceCodFromCourierFilters />

    <LMAAcceptanceCodFromCourierTable
      v-if="$route.query.courier && $route.query.date"
      :data="acceptanceCodFromCourier"
    />
    <div v-else class="page-center-message">{{ $t('selectCourierAndDate') }}</div>
  </div>
</template>

<script>
import { mapState, mapActions } from 'vuex';

import LMAAcceptanceCodFromCourierFilters from 'Components/filters/LMA/LMAAcceptanceCodFromCourierFilters';
import LMAAcceptanceCodFromCourierTable from 'Components/tables/LMA/LMAAcceptanceCodFromCourierTable';
import { number, currency } from 'Common/js/filters';

export default {
  name: 'LMAAcceptanceCodFromCourierPage',
  components: { LMAAcceptanceCodFromCourierFilters, LMAAcceptanceCodFromCourierTable },
  filters: { number, currency },
  computed: {
    ...mapState('reporting', ['acceptanceCodFromCourier']),
  },
  methods: {
    ...mapActions('reporting', ['loadAcceptanceCodFromCourier']),
    loadData({ date, courier }) {
      if (date && courier) this.loadAcceptanceCodFromCourier({ date, courierUID: courier });
    },
  },
  beforeRouteEnter(to, from, next) {
    next(vm => vm.loadData(to.query));
  },
  beforeRouteUpdate(to, from, next) {
    this.loadData(to.query);
    next();
  },
};
</script>
