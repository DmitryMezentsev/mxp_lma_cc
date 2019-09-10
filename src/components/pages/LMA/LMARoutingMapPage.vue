<template>
  <div>
    <LMARoutingMapFilters />
    <div v-if="zonesList && ordersList" class="map-wrap">
      <Map height="700px" :markers="ordersMarkers" @init="mapInit" @marker-click="openOrder" />
    </div>
    <Waiting v-else />

    <RoutingMapOrderDetails @update="onOrdersUpdate" />
    <RoutingMapZoneDetails @update="onOrdersUpdate" />
  </div>
</template>

<script>
import { mapState, mapMutations, mapActions } from 'vuex';
import moment from 'moment';

import LMARoutingMapFilters from 'Components/filters/LMA/LMARoutingMapFilters';
import Map from 'Components/Map';
import Waiting from 'Components/Waiting';
import RoutingMapOrderDetails from 'Components/RoutingMapOrderDetails';
import RoutingMapZoneDetails from 'Components/RoutingMapZoneDetails';
import { centerCoordsFromGeometry } from 'Common/js/helpers';
import { BLUE_COLOR, SUCCESS_COLOR } from 'Constants/colors';
import { MAP_CENTER } from 'Common/js/env';

const today = moment().format('YYYY-MM-DD');

export default {
  name: 'LMARoutingMapPage',
  components: {
    RoutingMapZoneDetails,
    RoutingMapOrderDetails,
    Waiting,
    LMARoutingMapFilters,
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
      return this.ordersList
        .filter(order => !order.currentStatus.statusInfo.isEnd)
        .map(order => {
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
      if (!this.zonesList.data || !this.map) return;

      // Очистка карты от имеющихся зон
      this.map.data.forEach(i => {
        if (i.getProperty('type') === 'zone') this.map.data.remove(i);
      });

      if (this.zonesList.data.length) {
        const center = { lat: 0, lng: 0 };

        this.zonesList.data.forEach(({ type, geometry, geoId, properties: { name } }, index) => {
          const zone = {
            type: 'FeatureCollection',
            features: [
              {
                type,
                geometry,
                properties: { type: 'zone', geoId, name, index },
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
      } else {
        this.map.setCenter(MAP_CENTER);
      }

      this.map.data.setStyle({ fillColor: BLUE_COLOR, strokeWeight: 1 });

      // Открытие панели назначения курьера по клику по зоне
      this.map.data.addListener('click', ({ feature }) => {
        this.setMapZoneDetails({
          id: feature.getProperty('geoId'),
          name: feature.getProperty('name'),
          index: feature.getProperty('index'),
        });
        this.setMapOrderDetails(null);
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
      this.setMapZoneDetails(null);
    },
    onOrdersUpdate() {
      this.loadOrdersList(this.$route.query);
    },
  },
  beforeRouteEnter(to, from, next) {
    if (!to.query.date) {
      to.query.date = today; // eslint-disable-line no-param-reassign
      next(to);
    } else {
      next(vm => {
        vm.loadZones(to.query);
        vm.loadOrdersList(to.query);
      });
    }
  },
  beforeRouteUpdate(to, from, next) {
    if (!to.query.date) {
      to.query.date = today; // eslint-disable-line no-param-reassign
      next(to);
    } else {
      this.loadOrdersList(to.query);
      this.setMapZoneDetails(null);
      this.setMapOrderDetails(null);
      next();
    }
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
