<template>
  <div>
    <div v-if="dateTimeInterval.date">
      {{ dateTimeInterval.date }}
      <div v-show="dateTimeInterval.timeInterval.from && dateTimeInterval.timeInterval.to">
        {{ dateTimeInterval.timeInterval.from }}&ndash;{{ dateTimeInterval.timeInterval.to }}
      </div>
    </div>
    <div v-else>&mdash;</div>
  </div>
</template>

<script>
export default {
  name: 'OrderDeliveryDate',
  props: {
    dateTimeInterval: { type: Object, required: true },
  },
};
</script>
