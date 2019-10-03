<template>
  <el-select
    v-model="value"
    :class="className"
    :placeholder="noSelectPlaceholder || $tc('noSelect', 2)"
    :loading="zones === null"
    :remote-method="remoteMethod"
    :clearable="clearable"
    :disabled="disabled"
    :multiple="multiple"
    :style="{ width }"
    :no-data-text="$t('zonesNotFound')"
    filterable
    remote
    @visible-change="onVisibleChange"
    @change="onChange"
  >
    <el-option
      v-for="zone in zones"
      :key="zone.coreSsoId"
      :label="zone.properties.name"
      :value="zone.coreSsoId"
    />
  </el-select>
</template>

<script>
import { parallel } from 'async';

import api from 'Common/js/api';

export default {
  name: 'RoutingZoneSelect',
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
      zonesData: [],
    };
  },
  computed: {
    zones: {
      get() {
        const zones = this.zonesData;

        // Примешивание в список тех зон, которые уже выбраны в селекте
        if (zones && this.value) {
          const value = typeof this.value === 'string' ? [this.value] : this.value;

          value.forEach(id => {
            // Проверка, есть ли уже в списке нужная зона
            let exists = false;
            zones.forEach(({ coreSsoId }) => {
              if (coreSsoId === id) exists = true;
            });
            // Если зоны в списке нет, но она есть в кэше, добавить её в список
            if (!exists && this.cache.has(id)) zones.push(this.cache.get(id));
          });
        }

        return zones;
      },
      set(zones) {
        // Кэширование данных зон
        if (zones) zones.forEach(zone => this.cache.set(zone.coreSsoId, zone));

        this.zonesData = zones;
      },
    },
  },
  methods: {
    remoteMethod(name) {
      if (name) {
        this.zones = null;

        api
          .get('geo', {
            params: {
              perPage: 0,
              fields: ['coreSsoId', 'properties'],
              name,
            },
          })
          .then(({ data }) => {
            this.zones = data;
          })
          .catch(() => {
            this.zones = [];
          });
      }
    },
    onChange() {
      this.$emit('change', { name: this.name, value: this.value });
      this.$emit('update:model', this.value);
    },
    onVisibleChange(visible) {
      if (!visible) this.zones = [];
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
              .get('geo', {
                params: { fields: ['coreSsoId', 'properties'], coreSsoId },
              })
              .then(({ data }) => callback(null, data[0]))
              .catch(() => callback(null, coreSsoId));
          };
        }),
        (err, zones) => {
          if (zones) {
            // Удаление значений с некорректными ID
            // Чтобы в случае, когда зона была перенесена в архив, в селект не вываливался ID этой зоны
            zones.forEach(zone => {
              if (typeof zone === 'string') {
                if (typeof this.model === 'string' && this.model === zone) {
                  this.value = null;
                } else {
                  this.value = this.value.filter(val => val !== zone);
                }
              }
            });

            this.zones = zones.filter(zone => typeof zone === 'object');
          }

          this.$nextTick(() => {
            this.zones = [];
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
