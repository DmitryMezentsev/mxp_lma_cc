<template>
    <div>
        <ReportingStatementsTable :loading="loading" :data="reports" />
        <Pagination :total="total" />
    </div>
</template>

<script>
    import ReportingStatementsTable from '../tables/ReportingStatementsTable';
    import Pagination from '../Pagination';

    export default {
        name: 'ReportingStatementsPage',
        components: {Pagination, ReportingStatementsTable},
        data () {
            return {
                loading: false,
                reports: [],
                total: 0,
            }
        },
    }
</script>

<style lang="less" scoped>

</style>