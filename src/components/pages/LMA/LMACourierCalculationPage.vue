<template>
  <div>
    <LMACourierCalculationFilters />

    <LMACourierCalculationTable
      v-if="$route.query.courier && $route.query.date"
      :data="courierCalculation"
    />
    <div v-else class="page-center-message">{{ $t('selectCourierAndDate') }}</div>
  </div>
</template>

<script>
import { mapState, mapActions } from 'vuex';

import LMACourierCalculationFilters from 'Components/filters/LMA/LMACourierCalculationFilters';
import LMACourierCalculationTable from 'Components/tables/LMA/LMACourierCalculationTable';
import { number, currency } from 'Common/js/filters';

export default {
  name: 'LMACourierCalculationPage',
  components: { LMACourierCalculationFilters, LMACourierCalculationTable },
  filters: { number, currency },
  computed: {
    ...mapState('reporting', ['courierCalculation']),
  },
  methods: {
    ...mapActions('reporting', ['loadCourierCalculation']),
    loadData({ date, courier }) {
      if (date && courier) this.loadCourierCalculation({ date, courierUID: courier });
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
