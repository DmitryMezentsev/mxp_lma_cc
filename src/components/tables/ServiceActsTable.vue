<template>
  <el-table v-loading="loading" :data="data" :empty-text="$t('noActs')" class="service-acts-table">
    <el-table-column v-if="clientWidth > 579" prop="" :label="$t('client')" key="col-client" />
    <el-table-column
      v-if="clientWidth > 479"
      prop=""
      :label="$t('actNumber')"
      key="col-act-number"
    />
    <el-table-column v-if="clientWidth > 1099" :label="$t('date')" key="col-date">
      <template slot-scope="scope"> </template>
    </el-table-column>
    <el-table-column v-if="clientWidth > 799" :label="$t('sum')" key="col-sum">
      <template slot-scope="scope"> </template>
    </el-table-column>
    <el-table-column :label="$t('documentReceiptDate')" key="col-receipt-date">
      <template slot-scope="scope">
        <div v-if="false"></div>
        <el-button type="text" @click="setDate(scope.row)" v-else>{{ $t('setDate') }}</el-button>
      </template>
    </el-table-column>
    <el-table-column width="100" key="col-actions">
      <template slot-scope="scope">
        <div class="text-right">
          <el-dropdown>
            <span class="el-dropdown-link">
              {{ $t('open') }}<i class="el-icon-arrow-down el-icon--right"></i>
            </span>
            <el-dropdown-menu slot="dropdown">
              <el-dropdown-item @click="open(scope.row, 'act')">{{ $t('act') }}</el-dropdown-item>
              <el-dropdown-item @click="open(scope.row, 'bill')">{{ $t('bill') }}</el-dropdown-item>
              <el-dropdown-item @click="open(scope.row, 'invoice')">{{
                $t('invoice')
              }}</el-dropdown-item>
            </el-dropdown-menu>
          </el-dropdown>
        </div>
      </template>
    </el-table-column>
  </el-table>
</template>

<script>
import { mapState } from 'vuex';

export default {
  name: 'ServiceActsTable',
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
    setDate(act) {
      this.$emit('setDate', act);
    },
    open() {},
  },
};
</script>

<style lang="less" scoped>
.service-acts-table {
  .el-button {
    &.el-button--text {
      padding-top: 0;
      padding-bottom: 0;
    }
  }
}
</style>
