<template>
  <el-select
    v-model="value"
    :class="className"
    :placeholder="noSelectPlaceholder || $tc('noSelect', 2)"
    :loading="couriers === null"
    :remote-method="remoteMethod"
    :clearable="clearable"
    :disabled="disabled"
    :multiple="multiple"
    :style="{ width }"
    :no-data-text="$t('couriersNotFound')"
    filterable
    remote
    @visible-change="onVisibleChange"
    @change="onChange"
  >
    <el-option
      v-for="courier in couriers"
      :key="courier.access.coreSsoId"
      :label="courier.fullname"
      :value="courier.access.coreSsoId"
    />
  </el-select>
</template>

<script>
import { parallel } from 'async';

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
      cache: new Map(),
      couriersData: null,
    };
  },
  computed: {
    couriers: {
      get() {
        const couriers = this.couriersData;

        // Примешивание в список тех курьеров, которые уже выбраны в селекте
        if (couriers && this.value) {
          const value = typeof this.value === 'string' ? [this.value] : this.value;

          value.forEach(id => {
            // Проверка, есть ли уже в списке нужный курьер
            let exists = false;
            couriers.forEach(({ access: { coreSsoId } }) => {
              if (coreSsoId === id) exists = true;
            });
            // Если курьера в списке нет, но он есть в кэше, добавить его в список
            if (!exists && this.cache.has(id)) couriers.push(this.cache.get(id));
          });
        }

        return couriers;
      },
      set(couriers) {
        // Кэширование данных курьеров
        if (couriers)
          couriers.forEach(courier => this.cache.set(courier.access.coreSsoId, courier));

        this.couriersData = couriers;
      },
    },
  },
  methods: {
    remoteMethod(fullname) {
      if (fullname) {
        this.couriers = null;

        api
          .get('courier', {
            params: {
              perPage: 0,
              fields: ['fullname', 'access.coreSsoId'],
              fullname,
            },
          })
          .then(({ data }) => {
            this.couriers = data;
          })
          .catch(() => {
            this.couriers = [];
          });
      }
    },
    onChange() {
      this.$emit('change', { name: this.name, value: this.value });
      this.$emit('update:model', this.value);
    },
    onVisibleChange(visible) {
      if (!visible) this.couriers = [];
    },
    // Загрузка названий для выбранных изначально значений
    preloadData() {
      // eslint-disable-next-line no-nested-ternary, prettier/prettier
      const ids = Array.isArray(this.model)
        ? this.model
        : this.model ? [this.model] : [];

      // Загрузка названий для выбранных изначально значений
      parallel(
        ids.map(coreSsoId => {
          return callback => {
            api
              .get('courier', {
                params: { fields: ['fullname', 'access.coreSsoId'], coreSsoId },
              })
              .then(({ data }) => callback(null, data[0]))
              .catch(() => callback(null, coreSsoId));
          };
        }),
        (err, couriers) => {
          if (couriers) {
            // Удаление значений с некорректными ID
            // Чтобы в случае, когда курьер перенесен в архив, в селект не вываливался ID этого курьера
            couriers.forEach(courier => {
              if (typeof courier === 'string') {
                if (typeof this.model === 'string' && this.model === courier) {
                  this.value = null;
                } else {
                  this.value = this.value.filter(val => val !== courier);
                }
              }
            });

            this.couriers = couriers.filter(courier => typeof courier === 'object');
          }

          this.$nextTick(() => {
            this.couriers = [];
          });
        },
      );
    },
  },
  mounted() {
    this.$nextTick(() => {
      this.value = this.model;
      this.preloadData();
    });
  },
  watch: {
    model(model) {
      this.value = model;
      this.preloadData();
    },
  },
};
</script>
