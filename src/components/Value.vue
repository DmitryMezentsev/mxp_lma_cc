<template>
  <div>
    <span class="value-label">{{ name }}: </span>
    <span v-if="!inner">
      <span v-if="isEmpty">&mdash;</span
      ><span v-else :class="{ active }" @click="click">{{ value }}</span
      ><span v-show="suffix" :class="{ active }" @click="click">&nbsp;{{ suffix }}</span
      ><span v-show="dot">.</span>
    </span>
    <span v-else> <slot /><span v-show="dot">.</span> </span>
  </div>
</template>

<script>
export default {
  name: 'Value',
  props: {
    name: { type: String, required: true },
    value: { type: [String, Number] },
    suffix: { type: String, default: '' },
    inner: { type: Boolean },
    dot: { type: Boolean, default: true },
    active: { type: Boolean },
  },
  computed: {
    isEmpty() {
      return this.value === null || this.value === '' || typeof this.value === 'undefined';
    },
  },
  methods: {
    click() {
      if (this.active) this.$emit('click');
    },
  },
};
</script>

<style lang="less" scoped>
@import '~Common/colors';

.value-label {
  color: @regular-text-color;
  font-weight: 600;
}

.active {
  cursor: pointer;
  border-bottom: 1px dotted @regular-text-color;
  transition: border-bottom-color 0.15s linear;

  &:hover {
    border-bottom-color: transparent;
  }
}
</style>
