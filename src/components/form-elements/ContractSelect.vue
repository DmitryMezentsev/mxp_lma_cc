<template>
  <el-select
    class="custom-disabled"
    v-model="value"
    :no-data-text="$t('noContracts')"
    :placeholder="noSelectPlaceholder || $tc('noSelect', 1)"
    :clearable="clearable"
    :disabled="disabled"
    :style="{ width }"
    @change="onChange"
  >
    <el-option v-for="(name, id) in contracts" :key="id" :label="name" :value="id" />
  </el-select>
</template>

<script>
import { mapState } from 'vuex';
import { get } from 'lodash';

export default {
  name: 'ContractSelect',
  props: {
    clearable: { type: Boolean },
    disabled: { type: Boolean },
    model: { type: String },
    width: { type: String, default: '220px' },
    name: { type: String },
    noSelectPlaceholder: { type: String },
  },
  data() {
    return {
      value: null,
    };
  },
  computed: {
    ...mapState('auth', ['currentUser']),
    contracts() {
      return get(this.currentUser, 'permissions.contracts', []);
    },
  },
  methods: {
    onChange() {
      this.$emit('change', { name: this.name, value: this.value });
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
