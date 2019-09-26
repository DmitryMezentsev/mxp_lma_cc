<template>
  <el-select
    v-model="value"
    :no-data-text="$t('noTemplates')"
    :placeholder="placeholder"
    :loading="!templates"
    :clearable="clearable"
    :disabled="disabled"
    :style="{ width }"
    @change="onChange"
  >
    <el-option
      v-for="template in templates"
      :key="template._id"
      :label="template.name"
      :value="template._id"
    />
  </el-select>
</template>

<script>
import api from 'Common/js/api';

export default {
  name: 'ImportTemplateSelect',
  props: {
    clearable: { type: Boolean },
    disabled: { type: Boolean },
    model: { type: String },
    width: { type: String, default: '100%' },
  },
  data() {
    return {
      value: null,
      templates: null,
    };
  },
  computed: {
    placeholder() {
      return this.templates ? this.$tc('noSelect', 1) : this.$t('loading');
    },
  },
  methods: {
    onChange() {
      this.$emit('update:model', this.value);
    },
  },
  created() {
    api
      .get(`import/template`, {
        params: {
          fields: ['_id', 'name'],
          perPage: 0,
        },
      })
      .then(({ data }) => {
        this.templates = data;
        this.value = this.model;
      });
  },
  watch: {
    model: {
      handler(model) {
        if (this.templates) this.value = model;
      },
      immediate: true,
    },
  },
};
</script>
