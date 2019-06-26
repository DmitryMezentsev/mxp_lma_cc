<template>
  <div>
    <RoutingMapFilters />
    <br />
    <Map v-if="list" @init="mapInit" height="700px" />
    <Waiting v-else />

    <SelectCourierToZoneDialog />
    <SelectCourierToOrderDialog />
  </div>
</template>

<script>
import { mapState, mapMutations, mapActions } from 'vuex';

import RoutingMapFilters from 'Components/filters/RoutingMapFilters';
import Map from 'Components/Map';
import Waiting from 'Components/Waiting';
import SelectCourierToZoneDialog from 'Components/dialog/SelectCourierToZoneDialog';
import SelectCourierToOrderDialog from 'Components/dialog/SelectCourierToOrderDialog';
import { centerCoordsFromGeometry } from 'Common/js/helpers';
import { BLUE_COLOR, SUCCESS_COLOR } from 'Constants/colors';

export default {
  name: 'RoutingMapPage',
  components: {
    SelectCourierToZoneDialog,
    SelectCourierToOrderDialog,
    Waiting,
    RoutingMapFilters,
    Map,
  },
  data() {
    return {
      map: null,
    };
  },
  computed: {
    ...mapState('routing', ['zonesList']),
  },
  methods: {
    ...mapMutations('routing', ['setSelectCourierToZone', 'setSelectCourierToOrder']),
    ...mapActions('routing', ['loadZonesList']),
    mapInit(map) {
      this.map = map;
      this.drawZones();
      this.drawOrders();
    },
    loadZones() {
      this.loadList({
        isOperating: true,
        perPage: 0,
      });
    },
    // Отрисовка на карте зон
    drawZones() {
      if (!this.list.data) return;

      // Очистка карты от имеющихся зон
      this.map.data.forEach(i => {
        if (i.getProperty('type') === 'zone') this.map.data.remove(i);
      });

      const center = { lat: 0, lng: 0 };

      this.list.data.forEach(({ type, geometry, geoId, properties: { name } }) => {
        const zone = {
          type: 'FeatureCollection',
          features: [
            {
              type,
              geometry,
              properties: { type: 'zone', geoId, name },
            },
          ],
        };

        this.map.data.addGeoJson(zone);

        const zoneCenter = centerCoordsFromGeometry(zone);
        center.lat += zoneCenter.lat;
        center.lng += zoneCenter.lng;
      });

      center.lat /= this.list.data.length;
      center.lng /= this.list.data.length;
      this.map.setCenter(center);

      this.map.data.setStyle({ fillColor: BLUE_COLOR, strokeWeight: 1 });

      // Открытие окна назначения курьера по клику по зоне
      this.map.data.addListener('click', e => {
        this.setSelectCourierToZone({
          id: e.feature.getProperty('geoId'),
          name: e.feature.getProperty('name'),
        });
      });

      // Изменение цвета зоны при наведении курсора
      this.map.data.addListener('mouseover', e => {
        this.map.data.overrideStyle(e.feature, {
          fillColor: SUCCESS_COLOR,
          strokeColor: SUCCESS_COLOR,
        });
      });
      this.map.data.addListener('mouseout', () => {
        this.map.data.revertStyle();
      });
    },
    // Отрисовка на карте заказов
    drawOrders() {},
  },
  beforeRouteEnter(to, from, next) {
    next(vm => vm.loadZones(to.query));
  },
  beforeRouteUpdate(to, from, next) {
    next();
  },
  watch: {
    list() {
      this.drawZones();
      this.drawOrders();
    },
  },
};
</script>
