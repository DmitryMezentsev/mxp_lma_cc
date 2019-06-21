<template>
  <el-table v-loading="data === null" show-summary :data="data" :empty-text="$t('noReports')">
    <el-table-column v-if="clientWidth > 479" :label="$t('reportDate')" key="col-report-date">
      <template slot-scope="scope">{{ scope.row.date | formatDate }}</template>
    </el-table-column>
    <el-table-column :label="$t('creatingDate')" key="col-creating-date">
      <template slot-scope="scope">{{ scope.row.created_at | formatDate }}</template>
    </el-table-column>
    <el-table-column v-if="clientWidth > 639" :label="$t('cod')" key="col-cod">
      <template slot-scope="scope">{{ scope.row.payAmount | currency }}</template>
    </el-table-column>
    <el-table-column :label="$t('payDate')" key="col-pay-date">
      <template slot-scope="scope">{{ scope.row.payDate | formatDate }}</template>
    </el-table-column>
    <el-table-column key="col-report-actions">
      <template slot-scope="scope">
        <a :href="`/CODReportFile/${scope.row.CODReportId}`" target="_blank">Скачать</a>
      </template>
    </el-table-column>
  </el-table>
</template>

<script>
import { mapState } from 'vuex';

import { currency, formatDate } from 'Common/js/filters';

export default {
  name: 'CodReportsTable',
  filters: { currency, formatDate },
  props: {
    data: { type: Array },
  },
  computed: {
    ...mapState('common', ['clientWidth']),
  },
};
</script>
