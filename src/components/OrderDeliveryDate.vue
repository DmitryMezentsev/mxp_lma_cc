<template>
  <div>
    <!-- eslint-disable -->
    <div v-if="dateTimeInterval.date">
      {{ dateTimeInterval.date | formatDate }}<div
        v-show="dateTimeInterval.timeInterval.from && dateTimeInterval.timeInterval.to">
        {{ dateTimeInterval.timeInterval.from }}&ndash;{{ dateTimeInterval.timeInterval.to }}</div
      >
    </div>
    <!-- eslint-enable -->
    <div v-else>&mdash;</div>
  </div>
</template>

<script>
import { formatDate } from 'Common/js/filters';

export default {
  name: 'OrderDeliveryDate',
  filters: { formatDate },
  props: {
    dateTimeInterval: { type: Object, required: true },
  },
};
</script>
