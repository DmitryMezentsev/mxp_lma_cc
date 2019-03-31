<template>
    <div>
        <RoutingMapFilters />
        <br>
        <Map @init="mapInit" height="700px" />
    </div>
</template>

<script>
    import RoutingMapFilters from 'Components/filters/RoutingMapFilters';
    import Map from 'Components/Map';

    export default {
        name: 'RoutingMapPage',
        components: {RoutingMapFilters, Map},
        methods: {
            mapInit (map) {

            },
        },
    }
</script>

<style lang="less" scoped>

</style>