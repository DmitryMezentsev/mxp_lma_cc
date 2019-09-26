<template>
  <el-table
    v-loading="loading"
    :data="data"
    :empty-text="$t(loading ? 'pleaseWait' : 'noImportHistory')"
  >
    <el-table-column v-if="clientWidth > 719" :label="$t('importDate')" key="col-date">
      <template slot-scope="scope">
        {{ scope.row.time | formatDate(true) }}
      </template>
    </el-table-column>
    <el-table-column
      v-if="clientWidth > 519"
      :label="$t('filename')"
      prop="filename"
      key="col-filename"
    />
    <el-table-column :label="$t('results')" key="col-results">
      <template slot-scope="scope">
        <span :class="{ 'text-success': scope.row.success === scope.row.total }">{{
          $tc('importResult', 1, { success: scope.row.success, total: scope.row.total })
        }}</span>
        <div v-if="scope.row.errorReport">
          <small class="link" @click="downloadReport(scope.row)">{{ $t('downloadReport') }}</small>
        </div>
      </template>
    </el-table-column>
  </el-table>
</template>

<script>
import { mapState } from 'vuex';
import downloadjs from 'downloadjs';

import { formatDate } from 'Common/js/filters';

export default {
  name: 'CCImportHistoryTable',
  props: {
    data: { type: Array },
  },
  filters: { formatDate },
  computed: {
    ...mapState('common', ['clientWidth']),
    loading() {
      return this.data === null;
    },
  },
  methods: {
    downloadReport({ errorReport, time }) {
      downloadjs(errorReport, `import_error_report_${time}.xls`);
    },
  },
};
</script>
