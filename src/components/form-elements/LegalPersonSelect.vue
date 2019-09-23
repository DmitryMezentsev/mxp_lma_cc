<template>
  <el-select
    v-model="value"
    :no-data-text="$t('noData')"
    :placeholder="$tc('noSelect', 0)"
    :clearable="clearable"
    :disabled="disabled"
    :style="{ width }"
    @change="onChange"
  >
    <el-option v-for="(name, id) in legalPersons" :key="id" :label="name" :value="id" />
  </el-select>
</template>

<script>
import { mapState } from 'vuex';
import { get } from 'lodash';

export default {
  name: 'LegalPersonSelect',
  props: {
    clearable: { type: Boolean },
    disabled: { type: Boolean },
    model: { type: String },
    width: { type: String, default: '220px' },
  },
  data() {
    return {
      value: null,
    };
  },
  computed: {
    ...mapState('auth', ['currentUser']),
    legalPersons() {
      return get(this.currentUser.permissions, 'legalPersonIds', []);
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
