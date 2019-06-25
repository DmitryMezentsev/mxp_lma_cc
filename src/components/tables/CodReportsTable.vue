<template>
  <el-table v-loading="loading" :data="data" :empty-text="$t(loading ? 'pleaseWait' : 'noReports')">
    <el-table-column :label="$t('reportDate')" key="col-report-date">
      <template slot-scope="scope">{{ scope.row.info.date | formatDate }}</template>
    </el-table-column>
    <el-table-column v-if="clientWidth > 699" :label="$t('creatingDate')" key="col-creating-date">
      <template slot-scope="scope">{{ scope.row.info.created_at | formatDate }}</template>
    </el-table-column>
    <el-table-column v-if="clientWidth > 439" :label="$t('cod')" key="col-cod">
      <template slot-scope="scope">{{ scope.row.info.payAmount | currency }}</template>
    </el-table-column>
    <el-table-column v-if="clientWidth > 539" :label="$t('payDate')" key="col-pay-date">
      <template slot-scope="scope">{{ scope.row.info.payDate | formatDate }}</template>
    </el-table-column>
    <el-table-column key="col-report-actions" align="right">
      <template slot-scope="scope">
        <el-tooltip :content="$t('downloadReport')" placement="left">
          <el-button type="primary" size="mini" @click="download(scope.row)">
            <fa-icon icon="download" />
          </el-button>
        </el-tooltip>
      </template>
    </el-table-column>
  </el-table>
</template>

<script>
import { mapState } from 'vuex';
import downloadjs from 'downloadjs';

import { currency, formatDate } from 'Common/js/filters';
import { getExtensionFromBase64 } from 'Common/js/helpers';
import api from 'Common/js/api';

export default {
  name: 'CodReportsTable',
  filters: { currency, formatDate },
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
    download({ _id, info }) {
      api.get(`/report/load-file/${_id}`).then(({ data }) => {
        const ext = getExtensionFromBase64(data);
        downloadjs(data, `cod_report_${info.date}.${ext}`);
      });
    },
  },
};
</script>
