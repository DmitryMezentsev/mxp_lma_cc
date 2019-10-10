<template>
  <!-- eslint-disable -->
  <span
    >{{ (fact ? values.widthFact : values.width) || 0 }}&nbsp;{{ $t('cm') }}<span class="x">x</span
    >{{ (fact ? values.heightFact : values.height) || 0 }}&nbsp;{{ $t('cm') }}<span class="x">x</span
    >{{ (fact ? values.lengthFact : values.length) || 0 }}&nbsp;{{ $t('cm') }}</span>
</template>

<script>
export default {
  name: 'Dimensions',
  props: {
    values: { type: Object, required: true },
    fact: { type: Boolean },
  },
};
</script>

<style lang="less">
@import '~Common/colors';

.x {
  color: @secondary-text-color;
  display: inline-block;
  margin: 0 5px;
}
</style>
