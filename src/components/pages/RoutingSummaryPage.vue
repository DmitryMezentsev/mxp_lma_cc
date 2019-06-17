<template>
  <div>
    <RoutingSummaryFilters />
    <RoutingSummaryTable v-if="$route.query.date" />

    <div v-show="!$route.query.date" class="page-center-message">{{ $t('selectDate') }}</div>
  </div>
</template>

<script>
import RoutingSummaryTable from 'Components/tables/RoutingSummaryTable';
import RoutingSummaryFilters from 'Components/filters/RoutingSummaryFilters';

export default {
  name: 'RoutingMapPage',
  components: { RoutingSummaryFilters, RoutingSummaryTable },
};
</script>
