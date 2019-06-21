<template>
  <div>
    <CodReportsTable :loading="loading" :data="reports" />
    <Pagination :total="total" />
  </div>
</template>

<script>
import CodReportsTable from 'Components/tables/CodReportsTable';
import Pagination from 'Components/Pagination';

export default {
  name: 'CodReportsPage',
  components: { Pagination, CodReportsTable },
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
