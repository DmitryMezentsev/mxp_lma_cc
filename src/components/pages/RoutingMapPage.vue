<template>
  <div>
    <RoutingMapFilters />
    <br />
    <Map v-if="list" @init="mapInit" height="700px" />
    <Waiting v-else />
  </div>
</template>

<script>
import { mapState, mapActions } from 'vuex';

import RoutingMapFilters from 'Components/filters/RoutingMapFilters';
import Map from 'Components/Map';
import Waiting from 'Components/Waiting';
import { centerCoordsFromGeometry } from 'Common/js/helpers';
import { BLUE_COLOR } from 'Constants/colors';

export default {
  name: 'RoutingMapPage',
  components: { Waiting, RoutingMapFilters, Map },
  data() {
    return {
      map: null,
    };
  },
  computed: {
    ...mapState('geo', ['list']),
  },
  methods: {
    ...mapActions('geo', ['loadList']),
    mapInit(map) {
      this.map = map;
      this.drawZones();
    },
    loadZones() {
      this.loadList();
    },
    drawZones() {
      if (!this.list.data) return;

      // Очистка карты от имеющихся зон
      this.map.data.forEach(poly => this.map.data.remove(poly));

      const center = { lat: 0, lng: 0 };

      this.list.data.forEach(({ type, geometry }) => {
        const zone = {
          type: 'FeatureCollection',
          features: [{ type, geometry, properties: {} }],
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
    },
    drawPoints() {},
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
    },
  },
};
</script>

<style lang="less" scoped></style>
