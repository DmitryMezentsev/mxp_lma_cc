<template>
  <div :class="{ inline }">
    <!-- eslint-disable -->
    <div v-if="dateTimeInterval.date">
      {{ dateTimeInterval.date | formatDate }}<div
        v-show="dateTimeInterval.timeInterval.from && dateTimeInterval.timeInterval.to"
        class="time-interval">
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
    inline: { type: Boolean },
  },
};
</script>

<style lang="less" scoped>
.inline {
  div {
    display: inline-block;
  }

  .time-interval {
    margin-left: 6px;
  }
}
</style>
