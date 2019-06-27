<template>
  <div>
    <GmapMap ref="map" :center="MAP_CENTER" :zoom="zoom" :options="mapOptions" :style="{ height }">
      <GmapMarker
        v-for="(marker, i) in markers"
        :key="i"
        :title="marker.title"
        :icon="getMarkerIcon(i)"
        :position="{ lat: marker.lat, lng: marker.lng }"
        clickable
        @mouseover="markerHover(i)"
        @mouseout="markerHover(i, true)"
        @click="markerClick(i)"
      />
    </GmapMap>
    <div class="help" v-if="help">{{ help }}</div>
  </div>
</template>

<script>
import { MAP_CENTER } from 'Common/js/env';
import markerIconGreen from 'Common/img/gmap-marker-green.png';
import markerIconHoverGreen from 'Common/img/gmap-marker-hover-green.png';
import markerIconRed from 'Common/img/gmap-marker-red.png';
import markerIconHoverRed from 'Common/img/gmap-marker-hover-red.png';

export default {
  name: 'Map',
  props: {
    height: { type: String, default: '400px' },
    zoom: { type: Number, default: 7 },
    help: { type: String },
    markers: { type: Array, default: () => [] },
  },
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
    };
  },
  methods: {
    markerClick(i) {
      this.$emit('marker-click', i);
    },
    markerHover(i, out = false) {
      this.$set(this.markersColors, i, {
        ...this.markersColors[i],
        hover: !out,
      });
    },
    getMarkerIcon(i) {
      if (this.markersColors[i].color === 'red') {
        return this.markersColors[i].hover ? markerIconHoverRed : markerIconRed;
      }

      return this.markersColors[i].hover ? markerIconHoverGreen : markerIconGreen;
    },
  },
  mounted() {
    this.$refs.map.$mapPromise.then(map => {
      this.$emit('init', map);
    });
  },
  watch: {
    markers: {
      handler(markers) {
        this.markersColors = markers.map(m => {
          return {
            color: m.color || 'green',
            hover: false,
          };
        });
      },
      immediate: true,
    },
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
