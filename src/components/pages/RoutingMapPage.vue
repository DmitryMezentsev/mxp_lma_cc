<template>
  <div>
    <RoutingMapFilters />
    <br />
    <Map v-if="zonesList" @init="mapInit" height="700px" />
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
    ...mapState('routing', ['zonesList', 'ordersList']),
  },
  methods: {
    ...mapMutations('routing', ['setSelectCourierToZone', 'setSelectCourierToOrder']),
    ...mapActions('routing', ['loadZonesList', 'loadOrdersList']),
    mapInit(map) {
      this.map = map;
      this.drawZones();
      this.drawOrders();
    },
    loadZones() {
      this.loadZonesList({
        isOperating: true,
        perPage: 0,
      });
    },
    loadOrders(query) {
      this.loadOrdersList(query);
    },
    // Отрисовка на карте зон
    drawZones() {
      if (!this.zonesList.data) return;

      // Очистка карты от имеющихся зон
      this.map.data.forEach(i => {
        if (i.getProperty('type') === 'zone') this.map.data.remove(i);
      });

      const center = { lat: 0, lng: 0 };

      this.zonesList.data.forEach(({ type, geometry, geoId, properties: { name } }) => {
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

      center.lat /= this.zonesList.data.length;
      center.lng /= this.zonesList.data.length;
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
    next(vm => {
      vm.loadZones(to.query);
      vm.loadOrders(to.query);
    });
  },
  beforeRouteUpdate(to, from, next) {
    this.loadOrders(to.query);
    next();
  },
  watch: {
    zonesList() {
      this.$nextTick(() => {
        this.drawZones();
        this.drawOrders();
      });
    },
  },
};
</script>
