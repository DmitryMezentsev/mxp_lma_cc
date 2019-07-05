<template>
  <div>
    <LMARoutingSummaryFilters />
    <LMARoutingSummaryTable v-if="$route.query.date" />

    <div v-show="!$route.query.date" class="page-center-message">{{ $t('selectDate') }}</div>
  </div>
</template>

<script>
import LMARoutingSummaryTable from 'Components/tables/LMA/LMARoutingSummaryTable';
import LMARoutingSummaryFilters from 'Components/filters/LMA/LMARoutingSummaryFilters';

export default {
  name: 'LMARoutingMapPage',
  components: { LMARoutingSummaryFilters, LMARoutingSummaryTable },
};
</script>
