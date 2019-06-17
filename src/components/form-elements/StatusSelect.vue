<template>
  <el-select
    v-model="value"
    :class="className"
    :no-data-text="$t('noStatuses')"
    :placeholder="placeholder"
    :loading="!statuses"
    :clearable="clearable"
    :disabled="disabled"
    :multiple="multiple"
    :style="{ width }"
    @change="onChange"
  >
    <el-option v-for="(status, i) in statuses" :key="i" :label="status.name" :value="status.id" />
  </el-select>
</template>

<script>
import api from 'Common/js/api';

export default {
  name: 'StatusSelect',
  props: {
    clearable: { type: Boolean },
    disabled: { type: Boolean },
    multiple: { type: Boolean },
    model: { type: [String, Number, Array] },
    width: { type: String, default: '220px' },
    noSelectPlaceholder: { type: String },
    type: { type: String, default: 'order' },
    className: { type: String },
    name: { type: String },
  },
  data() {
    return {
      value: this.multiple ? [] : null,
      statuses: null,
    };
  },
  computed: {
    placeholder() {
      return this.statuses
        ? this.noSelectPlaceholder || this.$tc('noSelect', 1)
        : this.$t('loading');
    },
  },
  methods: {
    onChange() {
      this.$emit('change', { name: this.name, value: this.value });
      this.$emit('update:model', this.value);
    },
  },
  created() {
    api.get(`statuses/${this.type}`).then(({ data }) => {
      this.statuses = data.map(s =>
        // Перевод всех ID в строки
        ({ id: String(s.id), name: s.name }),
      );
      this.value = this.model;
    });
  },
  watch: {
    model: {
      handler(model) {
        if (this.statuses) this.value = model;
      },
      immediate: true,
    },
  },
};
</script>
