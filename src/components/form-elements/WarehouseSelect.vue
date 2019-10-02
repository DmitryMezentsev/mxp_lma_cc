<template>
  <el-select
    class="custom-disabled"
    v-model="value"
    :no-data-text="$t('noData')"
    :placeholder="$tc('noSelect', 1)"
    :clearable="clearable"
    :multiple="multiple"
    :disabled="disabled"
    :style="{ width }"
    @change="onChange"
  >
    <el-option v-for="(name, id) in warehouses" :key="id" :label="name" :value="id" />
  </el-select>
</template>

<script>
import { mapState } from 'vuex';
import { get } from 'lodash';

export default {
  name: 'WarehouseSelect',
  props: {
    clearable: { type: Boolean },
    disabled: { type: Boolean },
    model: { type: [String, Array] },
    width: { type: String, default: '220px' },
    multiple: { type: Boolean },
  },
  data() {
    return {
      value: this.multiple ? [] : null,
    };
  },
  computed: {
    ...mapState('auth', ['currentUser']),
    warehouses() {
      return get(this.currentUser.permissions, 'warehouseIds', []);
    },
  },
  methods: {
    onChange() {
      this.$emit('update:model', this.value);
    },
  },
  watch: {
    model: {
      handler(model) {
        this.value = model;
      },
      immediate: true,
    },
  },
};
</script>
