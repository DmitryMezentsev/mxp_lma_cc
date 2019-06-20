<template>
  <div></div>
</template>

<script>
import { mapState } from 'vuex';

export default {
  name: 'SelectCourierToOrderDialog',
  computed: {
    ...mapState('geo', ['selectCourierToOrder']),
  },
};
</script>

<style lang="less" scoped></style>
