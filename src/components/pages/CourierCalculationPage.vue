<template>
    <div>
        <CourierCalculationFilters />

        <div v-show="!$route.query.courier || !$route.query.date" class="page-center-message">
            {{ $t('selectCourierAndDate') }}.
        </div>
    </div>
</template>

<script>
    import CourierCalculationFilters from 'Components/filters/CourierCalculationFilters';

    export default {
        name: 'CourierCalculationPage',
        components: {CourierCalculationFilters},
    }
</script>

<style lang="less" scoped>

</style>