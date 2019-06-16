<template>
    <div>
        <CourierCalculationFilters />
        <CourierSalaryEdit />

        <div v-show="!$route.query.courier || !$route.query.date" class="page-center-message">
            {{ $t('selectCourierAndDate') }}.
        </div>
    </div>
</template>

<script>
    import CourierCalculationFilters from 'Components/filters/CourierCalculationFilters';
    import CourierSalaryEdit from 'Components/CourierSalaryEdit';

    export default {
        name: 'CourierCalculationPage',
        components: {CourierSalaryEdit, CourierCalculationFilters},
    }
</script>

<style lang="less" scoped>

</style>