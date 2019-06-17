<template>
  <div>
    <ServiceActsTable :loading="loading" :data="acts" @setDate="selectDate" />
    <Pagination :total="total" />

    <SelectDateDialog
      v-if="reportForSelectDate"
      title="selectDocumentReceiptDate"
      @select="saveDate"
      @close="reportForSelectDate = null"
    />
  </div>
</template>

<script>
import ServiceActsTable from 'Components/tables/ServiceActsTable';
import Pagination from 'Components/Pagination';
import SelectDateDialog from 'Components/dialog/SelectDateDialog';

export default {
  name: 'ServiceActsPage',
  components: { Pagination, ServiceActsTable, SelectDateDialog },
  data() {
    return {
      loading: false,
      acts: [],
      total: 0,
      reportForSelectDate: null,
    };
  },
  methods: {
    selectDate(report) {
      this.reportForSelectDate = report;
    },
    saveDate(date) {
      this.reportForSelectDate = null;

      console.log(date);
    },
  },
};
</script>

<style lang="less" scoped></style>
