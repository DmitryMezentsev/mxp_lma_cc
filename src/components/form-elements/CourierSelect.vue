<template>
  <el-select
    v-model="value"
    :class="className"
    :no-data-text="$t('noCouriers')"
    :placeholder="placeholder"
    :loading="!couriers"
    :clearable="clearable"
    :disabled="disabled"
    :multiple="multiple"
    :style="{ width }"
    filterable
    @change="onChange"
  >
    <el-option
      v-for="(courier, i) in couriers"
      :key="i"
      :label="courier.fullname"
      :value="courier.access.coreSsoId"
    />
  </el-select>
</template>

<script>
import api from 'Common/js/api';

export default {
  name: 'CourierSelect',
  props: {
    clearable: { type: Boolean },
    disabled: { type: Boolean },
    multiple: { type: Boolean },
    model: { type: [String, Array] },
    width: { type: String, default: '220px' },
    noSelectPlaceholder: { type: String },
    className: { type: String },
    name: { type: String },
  },
  data() {
    return {
      value: this.multiple ? [] : null,
      couriers: null,
    };
  },
  computed: {
    placeholder() {
      return this.couriers
        ? this.noSelectPlaceholder || this.$tc('noSelect', 1)
        : this.$t('loading');
    },
  },
  methods: {
    onChange() {
      this.$emit('change', { name: this.name, value: this.value });
      this.$emit('update:model', this.value);
    },
    setValue(value) {
      this.value = this.multiple ? [] : null;

      this.couriers.forEach(({ access: { coreSsoId } }) => {
        // Проверка, есть ли курьер с переданным в селект ID в загруженном списке
        // Чтобы в случае, когда курьер был перенесен в архив, в селект не вываливался ID этого курьера
        if (this.multiple) {
          if ((Array.isArray(value) && value.includes(coreSsoId)) || coreSsoId === value) {
            this.value.push(coreSsoId);
          }
        } else if (coreSsoId === value) {
          this.value = value;
        }
      });
    },
  },
  created() {
    api
      .get('courier', {
        params: {
          perPage: 0,
          fields: ['fullname', 'access.coreSsoId'],
        },
      })
      .then(({ data }) => {
        this.couriers = data;
        this.setValue(this.model);
      });
  },
  watch: {
    model: {
      handler(model) {
        if (this.couriers) this.setValue(model);
      },
      immediate: true,
    },
  },
};
</script>
