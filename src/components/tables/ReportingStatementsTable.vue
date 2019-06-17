<template>
  <el-table
    v-loading="loading"
    show-summary
    :summary-method="summaryMethod"
    :data="data"
    :empty-text="$t('noReports')"
  >
    <el-table-column v-if="clientWidth > 399" prop="" :label="$t('client')" key="col-client" />
    <el-table-column v-if="clientWidth > 479" :label="$t('reportDate')" key="col-report-date">
      <template slot-scope="scope"> </template>
    </el-table-column>
    <el-table-column v-if="clientWidth > 1199" :label="$t('creatingDate')" key="col-creating-date">
      <template slot-scope="scope"> </template>
    </el-table-column>
    <el-table-column v-if="clientWidth > 639" :label="$t('cod')" key="col-cod">
      <template slot-scope="scope"> </template>
    </el-table-column>
    <el-table-column
      v-if="clientWidth > 679"
      :label="$t('sumForServices')"
      key="col-sum-for-services"
    >
      <template slot-scope="scope"> </template>
    </el-table-column>
    <el-table-column v-if="clientWidth > 799" :label="$t('deduction')" key="col-deduction">
      <template slot-scope="scope"> </template>
    </el-table-column>
    <el-table-column v-if="clientWidth > 1099" :label="$t('payDate')" key="col-pay-date">
      <template slot-scope="scope"> </template>
    </el-table-column>
    <el-table-column :label="$t('report')">
      <template slot-scope="scope">
        <el-button type="text" @click="openReport(scope.row)">
          ---
        </el-button>
      </template>
    </el-table-column>
  </el-table>
</template>

<script>
import { mapState } from 'vuex';

export default {
  name: 'ReportingStatementsTable',
  props: {
    data: { type: Array },
  },
  computed: {
    ...mapState('common', ['clientWidth']),
    loading() {
      return this.data === null;
    },
  },
  methods: {
    summaryMethod() {
      return [this.$t('paySum'), null, null, 0, 0, 0];
    },
    openReport() {},
  },
};
</script>
