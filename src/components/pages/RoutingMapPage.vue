<template>
    <div>
        <RoutingMapFilters />
        <br>
        <RoutingMap />
    </div>
</template>

<script>
    import RoutingMap from 'Components/RoutingMap';
    import RoutingMapFilters from 'Components/filters/RoutingMapFilters';

    export default {
        name: 'RoutingMapPage',
        components: {RoutingMapFilters, RoutingMap},
    }
</script>

<style lang="less" scoped>

</style>