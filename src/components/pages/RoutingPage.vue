<template>
    <el-tabs v-model="tab">
        <el-tab-pane :label="$t('map')" name="map">
            <RoutingMap />
        </el-tab-pane>
        <el-tab-pane :label="$t('summary')" name="summary">
            <RoutingSummary />
        </el-tab-pane>
    </el-tabs>
</template>

<script>
    import RoutingMap from '../RoutingMap';
    import RoutingSummary from '../RoutingSummary';

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