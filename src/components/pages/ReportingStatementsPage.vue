<template>
  <div>
    <ReportingStatementsTable :loading="loading" :data="reports" />
    <Pagination :total="total" />
  </div>
</template>

<script>
import ReportingStatementsTable from 'Components/tables/ReportingStatementsTable';
import Pagination from 'Components/Pagination';

export default {
  name: 'ReportingStatementsPage',
  components: { Pagination, ReportingStatementsTable },
  data() {
    return {
      loading: false,
      reports: [],
      total: 0,
    };
  },
};
</script>

<style lang="less" scoped></style>
