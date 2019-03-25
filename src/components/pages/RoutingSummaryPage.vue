<template>
    <div>
        <RoutingSummaryFilters />
        <RoutingSummaryTable v-if="date" />

        <div v-show="!date" class="page-center-message">
            {{ $t('selectDate') }}.
        </div>
    </div>
</template>

<script>
    import RoutingSummaryTable from 'Components/tables/RoutingSummaryTable';
    import RoutingSummaryFilters from 'Components/filters/RoutingSummaryFilters';
    
    export default {
        name: 'RoutingMapPage',
        components: {RoutingSummaryFilters, RoutingSummaryTable},
        data () {
            return {
                date: this.$route.query.date,
                removeAfterEach: null,
            }
        },
        mounted () {
            this.removeAfterEach = this.$router.afterEach(to => {
                this.date = to.query.date;
            });
        },
        destroyed () {
            if (this.removeAfterEach) this.removeAfterEach();
        },
    }
</script>

<style lang="less" scoped>

</style>