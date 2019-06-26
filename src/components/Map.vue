<template>
  <div>
    <GmapMap ref="map" :center="MAP_CENTER" :zoom="zoom" :options="mapOptions" :style="{ height }">
      <GmapMarker
        v-for="(marker, i) in markers"
        :key="i"
        :title="marker.title"
        :position="{ lat: marker.lat, lng: marker.lng }"
        clickable
        @click="markerClick(i)"
      />
    </GmapMap>
    <div class="help" v-if="help">{{ help }}</div>
  </div>
</template>

<script>
import { MAP_CENTER } from 'Common/js/env';

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
      mapOptions: {
        zoomControl: true,
        mapTypeControl: false,
        scaleControl: false,
        streetViewControl: false,
        rotateControl: false,
        fullscreenControl: false,
        clickableIcons: false,
        gestureHandling: 'cooperative',
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
