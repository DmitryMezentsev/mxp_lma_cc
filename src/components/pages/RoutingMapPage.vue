<template>
  <div>
    <RoutingMapFilters />
    <div v-if="zonesList && ordersList" class="map-wrap">
      <Map height="700px" :markers="ordersMarkers" @init="mapInit" @marker-click="openOrder" />
    </div>
    <Waiting v-else />

    <RoutingMapOrderDetails @update="onOrderUpdate" />
  </div>
</template>

<script>
import { mapState, mapMutations, mapActions } from 'vuex';

import RoutingMapFilters from 'Components/filters/RoutingMapFilters';
import Map from 'Components/Map';
import Waiting from 'Components/Waiting';
import RoutingMapOrderDetails from 'Components/RoutingMapOrderDetails';
import { centerCoordsFromGeometry } from 'Common/js/helpers';
import { BLUE_COLOR, SUCCESS_COLOR } from 'Constants/colors';

export default {
  name: 'RoutingMapPage',
  components: {
    RoutingMapOrderDetails,
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
    ordersMarkers() {
      return this.ordersList.map(order => {
        return {
          title: order.internalNumber,
          lat: parseFloat(order.recipient.address.latitude),
          lng: parseFloat(order.recipient.address.longitude),
          color: order.serviceInfo.courierId ? 'green' : 'red',
        };
      });
    },
  },
  methods: {
    ...mapMutations('routing', ['setMapZoneDetails', 'setMapOrderDetails']),
    ...mapActions('routing', ['loadZonesList', 'loadOrdersList']),
    mapInit(map) {
      this.map = map;
      this.drawZones();
    },
    loadZones() {
      this.loadZonesList({
        isOperating: true,
        perPage: 0,
      });
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
        this.setMapZoneDetails({
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
    openOrder(i) {
      this.setMapOrderDetails(this.ordersList[i]);
    },
    onOrderUpdate() {
      this.loadOrdersList(this.$route.query);
    },
  },
  beforeRouteEnter(to, from, next) {
    next(vm => {
      vm.loadZones(to.query);
      vm.loadOrdersList(to.query);
    });
  },
  beforeRouteUpdate(to, from, next) {
    this.loadOrdersList(to.query);
    this.setMapZoneDetails(null);
    this.setMapOrderDetails(null);
    next();
  },
  beforeRouteLeave(to, from, next) {
    this.setMapZoneDetails(null);
    this.setMapOrderDetails(null);
    next();
  },
  watch: {
    zonesList() {
      this.$nextTick(this.drawZones);
    },
  },
};
</script>

<style lang="less" scoped>
.map-wrap {
  margin-top: 20px;
}
</style>
