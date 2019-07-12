<template>
  <el-select
    v-model="value"
    :class="className"
    :no-data-text="$t('noStatuses')"
    :placeholder="placeholder"
    :loading="!stages"
    :clearable="clearable"
    :disabled="disabled"
    :multiple="multiple"
    :style="{ width }"
    @change="onChange"
  >
    <el-option-group v-for="(stage, i) in stages" :key="i" :label="stage.name">
      <el-option
        v-for="(status, j) in stage.statuses"
        :key="j"
        :label="status.name"
        :value="status.id"
      />
    </el-option-group>
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
      stages: null,
    };
  },
  computed: {
    placeholder() {
      return this.stages ? this.noSelectPlaceholder || this.$tc('noSelect', 1) : this.$t('loading');
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
      const stages = [];

      // eslint-disable-next-line no-param-reassign
      data = data.map(status => ({
        ...status,
        id: String(status.id),
      }));

      if (this.type === 'order') {
        data.forEach(status => {
          let i = null;

          stages.forEach((stage, j) => {
            if (stage.name === status.stage) i = j;
          });

          if (i) {
            stages[i].statuses.push(status);
          } else {
            stages.push({
              name: status.stage,
              statuses: [status],
            });
          }
        });
      } else {
        stages.push({ statuses: data });
      }

      this.stages = stages;
      this.value = this.model;
    });
  },
  watch: {
    model: {
      handler(model) {
        if (this.stages) this.value = model;
      },
      immediate: true,
    },
  },
};
</script>
