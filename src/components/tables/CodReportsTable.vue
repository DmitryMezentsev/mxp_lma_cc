<template>
  <el-table v-loading="loading" show-summary :data="data" :empty-text="$t('noReports')">
    <el-table-column v-if="clientWidth > 479" :label="$t('reportDate')" key="col-report-date">
      <template slot-scope="scope"> </template>
    </el-table-column>
    <el-table-column :label="$t('creatingDate')" key="col-creating-date">
      <template slot-scope="scope"> </template>
    </el-table-column>
    <el-table-column v-if="clientWidth > 639" :label="$t('cod')" key="col-cod">
      <template slot-scope="scope"> </template>
    </el-table-column>
    <el-table-column :label="$t('payDate')" key="col-pay-date">
      <template slot-scope="scope"> </template>
    </el-table-column>
    <el-table-column :label="$t('report')">
      <template slot-scope="scope"> </template>
    </el-table-column>
  </el-table>
</template>

<script>
import { mapState } from 'vuex';

export default {
  name: 'CodReportsTable',
  props: {
    data: { type: Array },
  },
  computed: {
    ...mapState('common', ['clientWidth']),
    loading() {
      return this.data === null;
    },
  },
};
</script>
