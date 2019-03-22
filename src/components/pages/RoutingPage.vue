<template>
    <el-tabs v-model="tab">
        <el-tab-pane :label="$t('map')" name="map" lazy>
            <RoutingMap />
        </el-tab-pane>
        <el-tab-pane :label="$t('summary')" name="summary" lazy>
            <RoutingSummary />
        </el-tab-pane>
    </el-tabs>
</template>

<script>
    import RoutingMap from 'Components/RoutingMap';
    import RoutingSummary from 'Components/RoutingSummary';

    export default {
        name: 'RoutingPage',
        components: {RoutingSummary, RoutingMap},
        data () {
            return {
                tab: 'map',
            }
        },
    }
</script>