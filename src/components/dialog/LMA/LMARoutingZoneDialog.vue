<template>
  <el-dialog
    :title="title"
    :visible="!!zone"
    :close-on-press-escape="!waiting"
    :show-close="!waiting"
    :close-on-click-modal="!waiting"
    @open="onOpen"
    @close="closeZone"
    width="95%"
    top="5vh"
  >
    <el-form v-if="zone" ref="zone" :model="zone" :rules="rules">
      <el-row :gutter="10">
        <el-col :md="6" :sm="12">
          <el-form-item :label="$tc('name', 0)" prop="properties.name" required>
            <el-input
              class="custom-readonly"
              name="name"
              v-model="zone.properties.name"
              :readonly="waiting"
            />
          </el-form-item>
        </el-col>
        <el-col :md="5" :sm="12">
          <el-form-item :label="$t('legalPerson')" prop="properties.legalpersonId" required>
            <LegalPersonSelect
              width="100%"
              :model.sync="zone.properties.legalpersonId"
              :disabled="waiting"
            />
          </el-form-item>
        </el-col>
        <el-col :md="5" :sm="12">
          <el-form-item :label="$t('warehouse')" prop="properties.warehouseId" required>
            <WarehouseSelect
              width="100%"
              :model.sync="zone.properties.warehouseId"
              :disabled="waiting"
            />
          </el-form-item>
        </el-col>
        <el-col :md="8" :sm="12">
          <el-form-item prop="properties.isOperating" class="active-switch">
            <el-switch
              v-model="zone.properties.isOperating"
              name="isOperating"
              :disabled="waiting"
              :inactive-color="DANGER_COLOR"
              :active-color="SUCCESS_COLOR"
              :active-text="$tc('active', 0)"
              :inactive-text="$t('inArchive')"
            >
            </el-switch>
          </el-form-item>
        </el-col>
      </el-row>
      <Map class="map" height="600px" :help="$t('markOnMapZoneBoundaries')" @init="mapInit" />
      <el-button @click.prevent="save" native-type="submit" class="hidden" />
    </el-form>
    <span v-if="zone" slot="footer" class="dialog-footer">
      <el-button @click="clearMap" :disabled="waiting" v-autoblur>
        {{ $t('clearMap') }}
      </el-button>
      <el-button @click="closeZone" :disabled="waiting">
        {{ $t('close') }}
      </el-button>
      <el-button type="primary" @click="save" :disabled="waiting" :loading="waiting">
        {{ $t('save') }}
      </el-button>
    </span>
  </el-dialog>
</template>

<script>
import { mapState, mapMutations, mapActions } from 'vuex';
import { get, isEqual, clone } from 'lodash';

import {
  BLUE_COLOR,
  DANGER_COLOR,
  INFO_COLOR,
  PLACEHOLDER_TEXT_COLOR,
  SUCCESS_COLOR,
} from 'Constants/colors';
import { MAP_CENTER } from 'Common/js/env';
import api from 'Common/js/api';
import { centerCoordsFromGeometry } from 'Common/js/helpers';
import mixins from 'Common/js/mixins';
import autoblur from 'Directives/autoblur';
import Waiting from 'Components/Waiting';
import Map from 'Components/Map';
import LegalPersonSelect from 'Components/form-elements/LegalPersonSelect';
import WarehouseSelect from 'Components/form-elements/WarehouseSelect';

export default {
  name: 'LMARoutingZoneDialog',
  directives: { autoblur },
  components: { WarehouseSelect, LegalPersonSelect, Waiting, Map },
  mixins: [mixins],
  data() {
    return {
      waiting: false,
      map: null,
      rules: {
        'properties.name': [this.validationRule('required')],
        'properties.legalpersonId': [this.validationRule('selectRequired')],
        'properties.warehouseId': [this.validationRule('selectRequired')],
      },
      DANGER_COLOR,
      SUCCESS_COLOR,
      otherZones: [],
    };
  },
  computed: {
    ...mapState('routing', {
      zone: 'openedZone',
    }),
    title() {
      // eslint-disable-next-line prettier/prettier
      return this.zone
        ? this.$t(this.zone.geoId ? 'editingZone' : 'newZone')
        : null;
    },
  },
  methods: {
    ...mapMutations('routing', ['setOpenedZone']),
    ...mapActions('routing', ['closeZone', 'saveZone']),
    mapInit(map) {
      const refreshGeoJson = () => {
        map.data.toGeoJson(geo => {
          const zones = [];

          geo.features.forEach(feature => {
            // Пропуск других (серых) зон
            if (!feature.properties.isOther) zones.push(feature);
          });

          // Предупреждение, что полигонов на одну зону не может быть несколько
          if (zones.length > 1) this.warning(this.$t('polygonsCantBeSeveral'));
          // Оставляем лишь 1 полигон, даже если их больше
          this.zone.type = get(zones, '[0].type', '');
          this.zone.geometry = get(zones, '[0].geometry', null);
        });
      };

      map.data.setControls(['Polygon']);
      map.data.addListener('addfeature', refreshGeoJson);
      map.data.addListener('removefeature', refreshGeoJson);
      map.data.addListener('setgeometry', refreshGeoJson);

      this.map = map;
      this.updateMap(true);
    },
    clearMap() {
      this.zone.type = '';
      this.zone.geometry = null;
    },
    updateMap(center) {
      if (!this.zone || !this.map) return;

      // Редактируемые
      const editableGeometry = {
        type: 'FeatureCollection',
        features: this.zone.geometry
          ? [{ type: this.zone.type, geometry: this.zone.geometry, properties: {} }]
          : [],
      };

      // Все отображаемые на карте
      const allGeometry = clone(editableGeometry);
      // Добавление других (серых) зон
      allGeometry.features = allGeometry.features.concat(
        this.otherZones.map(({ type, geometry }) => ({
          type,
          geometry,
          properties: { isOther: true },
        })),
      );

      // Обновление карты
      this.map.data.toGeoJson(currentGeometry => {
        // Защита от бесконечной перерисовки
        if (!isEqual(currentGeometry.features, allGeometry.features)) {
          // Снос прежних полигонов
          this.map.data.forEach(poly => this.map.data.remove(poly));
          // Добавление новых полигонов
          this.map.data.addGeoJson(allGeometry);
          // Центрирование карты
          if (center) {
            if (editableGeometry.features.length) {
              // По координатам редактируемой зоны, если они есть
              this.map.setCenter(centerCoordsFromGeometry(editableGeometry));
            } else {
              // По координатам других зон, либо по умолчанию
              this.map.setCenter(
                centerCoordsFromGeometry(allGeometry.features.length ? allGeometry : MAP_CENTER),
              );
            }
          }
        }
      });

      // Установка стилей для полигонов
      this.map.data.setStyle(feature => {
        return feature.getProperty('isOther')
          ? {
              fillColor: PLACEHOLDER_TEXT_COLOR,
              strokeColor: INFO_COLOR,
              strokeWeight: 1,
              cursor: 'hand',
            }
          : {
              fillColor: BLUE_COLOR,
              strokeWeight: 1,
              cursor: 'hand',
              editable: true,
            };
      });
    },
    // Загружает все остальные зоны, чтобы отобразить их в виде серых полигонов на карте
    loadOtherZones() {
      api
        .get('geo', {
          params: { perPage: 0 },
        })
        .then(({ data }) => {
          // Отфильтровываем текущую зону из загруженного списка
          this.otherZones = data.filter(({ geoId }) => geoId !== this.zone.geoId);
        })
        .catch(() => {});
    },
    save() {
      this.$refs.zone.validate(valid => {
        if (valid) {
          if (this.zone.geometry) {
            this.waiting = true;

            this.saveZone({
              zone: this.zone,
              callback: success => {
                this.waiting = false;

                if (success) {
                  this.$emit('update');
                  this.changesSavedMessage();
                  this.closeZone();
                }
              },
            });
          } else {
            this.warning(this.$t('zoneNotSet'));
          }
        }
      });
    },
    onOpen() {
      this.waiting = false;
      this.loadOtherZones();
    },
  },
  destroyed() {
    this.setOpenedZone(null);
  },
  watch: {
    'zone.geometry': {
      handler() {
        this.updateMap();
      },
      deep: true,
    },
    otherZones() {
      this.updateMap();
    },
    $route() {
      this.setOpenedZone(null);
    },
  },
};
</script>

<style lang="less" scoped>
.active-switch {
  @media (min-width: 768px) {
    text-align: right;
    margin-top: 38px;
  }
}

.map {
  margin-top: 5px;
}
</style>
