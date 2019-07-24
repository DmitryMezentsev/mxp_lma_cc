<template>
  <div>
    <GmapMap ref="map" :center="MAP_CENTER" :zoom="zoom" :options="mapOptions" :style="{ height }">
      <GmapCluster :minimum-cluster-size="5" zoom-on-click>
        <GmapMarker
          v-for="(marker, i) in markers"
          :key="i"
          :title="marker.title"
          :icon="marker.color === 'red' ? markerIconRed : markerIconGreen"
          :position="{ lat: marker.lat, lng: marker.lng }"
          clickable
          @click="markerClick(i)"
        />
      </GmapCluster>
    </GmapMap>
    <div class="help" v-if="help">{{ help }}</div>
  </div>
</template>

<script>
import GmapCluster from 'vue2-google-maps/dist/components/cluster';

import { MAP_CENTER } from 'Common/js/env';
import markerIconGreen from 'Common/img/gmap-marker-green.png';
import markerIconRed from 'Common/img/gmap-marker-red.png';

export default {
  name: 'Map',
  props: {
    height: { type: String, default: '400px' },
    zoom: { type: Number, default: 7 },
    help: { type: String },
    markers: { type: Array, default: () => [] },
  },
  components: { GmapCluster },
  data() {
    return {
      MAP_CENTER,
      markersColors: [],
      mapOptions: {
        zoomControl: true,
        mapTypeControl: false,
        scaleControl: false,
        streetViewControl: false,
        rotateControl: false,
        fullscreenControl: false,
        clickableIcons: false,
        gestureHandling: 'cooperative',
        maxZoom: 18,
        minZoom: 5,
        // Выключаем ненужные рекламные точки на карте
        styles: [
          {
            featureType: 'poi',
            elementType: 'labels',
            stylers: [{ visibility: 'off' }],
          },
        ],
      },
      markerIconGreen,
      markerIconRed,
    };
  },
  methods: {
    markerClick(i) {
      this.$emit('marker-click', i);
    },
  },
  mounted() {
    this.$refs.map.$mapPromise.then(map => {
      this.$emit('init', map);
    });
  },
};
</script>

<style lang="less" scoped>
@import '~Common/colors';

.map {
  width: 100%;
}

.help {
  margin-top: 5px;
  font-size: 12px;
  color: @secondary-text-color;
  line-height: 16px;
}
</style>
