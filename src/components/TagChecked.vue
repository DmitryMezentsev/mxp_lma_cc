<template>
  <el-tag :disable-transitions="true" :type="checked ? 'success' : 'info'">
    <fa-icon icon="check" v-show="checked" />{{ $t(label) }}
  </el-tag>
</template>

<script>
export default {
  name: 'TagChecked',
  props: {
    label: { type: String, required: true },
    checked: { type: Boolean },
  },
};
</script>

<style lang="less" scoped>
.el-tag {
  margin: 0 0.5em 0.5em 0;

  svg {
    margin-right: 0.5em;
  }
}
</style>
