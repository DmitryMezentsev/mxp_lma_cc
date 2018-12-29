<template>
    <div>
        <CourierCalculationFilters />
        <CourierSalaryEdit />

        <div v-show="!courier || !date" class="page-center-message">
            {{ $t('selectCourierAndDate') }}.
        </div>
    </div>
</template>

<script>
    import CourierCalculationFilters from '../filters/CourierCalculationFilters';
    import CourierSalaryEdit from '../CourierSalaryEdit';

    export default {
        name: 'CourierCalculationPage',
        components: {CourierSalaryEdit, CourierCalculationFilters},
        data () {
            return {
                courier: this.$router.currentRoute.query.courier,
                date: this.$router.currentRoute.query.date,

                removeAfterEach: null,
            }
        },
        mounted () {
            this.removeAfterEach = this.$router.afterEach(to => {
                this.courier = to.query.courier;
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