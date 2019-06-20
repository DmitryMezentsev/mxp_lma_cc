<template>
  <div></div>
</template>

<script>
import { mapState } from 'vuex';

export default {
  name: 'SelectCourierToZoneDialog',
  computed: {
    ...mapState('geo', ['selectCourierToZone']),
  },
};
</script>

<style lang="less" scoped></style>
