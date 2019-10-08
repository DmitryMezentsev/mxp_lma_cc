<template>
  <el-date-picker
    v-model="value"
    :type="type"
    :format="displayFormat"
    :class="className"
    :name="name"
    :clearable="clearable"
    :readonly="readonly"
    :value-format="DATE_API_FORMAT"
    :start-placeholder="startPlaceholder"
    :end-placeholder="endPlaceholder"
    :placeholder="placeholder"
    :range-separator="rangeSeparator"
    :picker-options="{ ...options, firstDayOfWeek: 1 }"
    :style="{ width }"
    :prefix-icon="hideIcon ? 'none' : null"
  />
</template>

<script>
import { mapState } from 'vuex';

import { DATE_API_FORMAT } from 'Constants/config';

export default {
  name: 'DatePicker',
  props: {
    type: { type: String, default: 'date' },
    model: { type: [String, Array] },
    className: { type: String },
    name: { type: String },
    width: { type: String },
    clearable: { type: Boolean, default: true },
    readonly: { type: Boolean },
    startPlaceholder: { type: String },
    endPlaceholder: { type: String },
    placeholder: { type: String },
    rangeSeparator: { type: String, default: '—' },
    options: { type: Object },
    hideIcon: { type: Boolean },
  },
  data() {
    return {
      DATE_API_FORMAT,
    };
  },
  computed: {
    ...mapState('auth', ['currentUser']),
    value: {
      get() {
        return this.model;
      },
      set(value) {
        this.$emit('change', { name: this.name, value });
        this.$emit('update:model', value);
      },
    },
    displayFormat() {
      switch (this.currentUser.locale) {
        case 'RU':
          return 'dd.MM.yyyy';
        case 'ZH':
          return null;
        default:
          return null;
      }
    },
  },
};
</script>
