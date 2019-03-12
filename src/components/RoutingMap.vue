<template>
    <div>
        <GmapMap
                ref="mapRef"
                :center="mapCenter"
                :zoom="7"
                :options="mapOptions"
                style="width: 100%; height: 700px">
        </GmapMap>
    </div>
</template>

<script>
    export default {
        name: 'RoutingMap',
        data () {
            return {
                mapCenter: {
                    lat: 10,
                    lng: 10,
                },
                mapOptions: {
                    zoomControl: true,
                    mapTypeControl: false,
                    scaleControl: false,
                    streetViewControl: false,
                    rotateControl: false,
                    fullscreenControl: false,
                    clickableIcons: false,
                    // Выключаем ненужные рекламные точки на карте
                    styles: [{
                        featureType: 'poi',
                        elementType: 'labels',
                        stylers: [{ visibility: 'off' }],
                    }],
                },
            }
        },
        mounted () {
            this.$refs.mapRef.$mapPromise.then(map => {

            });
        },
    }
</script>

<style lang="less" scoped>

</style>