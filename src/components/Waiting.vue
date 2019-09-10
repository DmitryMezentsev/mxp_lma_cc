<template>
  <div class="waiting" :class="{ 'min-padding': minPadding }" v-loading="true"></div>
</template>

<script>
export default {
  name: 'Waiting',
  props: {
    minPadding: { type: Boolean },
  },
};
</script>

<style lang="less" scoped>
.waiting {
  padding: 12rem 0;

  &.min-padding {
    padding: 2.3rem 0;
  }
}
</style>
