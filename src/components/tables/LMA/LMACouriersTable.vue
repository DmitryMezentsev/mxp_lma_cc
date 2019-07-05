<template>
  <el-table
    v-loading="loading"
    :data="data"
    :empty-text="$t(loading ? 'pleaseWait' : 'noCouriers')"
  >
    <el-table-column :label="$t('fullName')" key="col-fullname">
      <template slot-scope="scope">
        <router-link :to="{ name: 'lmaEditCourier', params: { id: scope.row.courierId } }">
          <el-button type="text">{{ scope.row.fullname }}</el-button>
        </router-link>
      </template>
    </el-table-column>
    <el-table-column :label="$t('phones')" v-if="clientWidth > 767" key="col-phones">
      <template slot-scope="scope">
        {{ scope.row.phone1 }}<span v-if="scope.row.phone2">, {{ scope.row.phone2 }}</span>
      </template>
    </el-table-column>
    <el-table-column
      prop="livingArea"
      :label="$t('livingArea')"
      v-if="clientWidth > 539"
      key="col-living-area"
    />
    <el-table-column align="right" width="110" key="col-actions">
      <template slot-scope="scope">
        <el-button-group>
          <el-tooltip :content="$t('sendToArchive')" placement="left" v-if="scope.row.isActive">
            <el-button
              type="danger"
              size="mini"
              @click="setCourierActive(scope.row.courierId, false)"
            >
              <fa-icon icon="archive" />
            </el-button>
          </el-tooltip>
          <el-tooltip :content="$t('restore')" placement="left" v-else>
            <el-button
              type="primary"
              size="mini"
              @click="setCourierActive(scope.row.courierId, true)"
            >
              <fa-icon icon="redo-alt" />
            </el-button>
          </el-tooltip>
          <el-tooltip :content="$t('printBadge')" placement="top" v-if="scope.row.isActive">
            <el-button type="primary" size="mini" @click="printBadge(scope.row.courierId)">
              <fa-icon icon="id-badge" />
            </el-button>
          </el-tooltip>
        </el-button-group>
      </template>
    </el-table-column>
  </el-table>
</template>

<script>
import { mapState, mapActions } from 'vuex';

import mixins from 'Common/js/mixins';
import { OTH_SERVER_PATH } from 'Common/js/env';
import { getBrowserName } from 'Common/js/helpers';

export default {
  name: 'LMACouriersTable',
  mixins: [mixins],
  props: {
    data: { type: Array },
  },
  computed: {
    ...mapState('common', ['clientWidth']),
    ...mapState('auth', ['token']),
    loading() {
      return this.data === null;
    },
  },
  methods: {
    ...mapActions('couriers', ['patchCourier']),
    setCourierActive(id, active) {
      this.confirm(
        this.$t(active ? 'restoreCourierConfirmation' : 'toArchiveCourierConfirmation'),
        ok => {
          if (ok) {
            this.patchCourier({
              id,
              params: { isActive: active },
              callback: success => {
                if (success) this.$emit('update');
              },
            });
          }
        },
      );
    },
    printBadge(id) {
      const params =
        'width=360,height=280,resizable=no,scrollbars=no,toolbar=no,location=no,menubar=no,status=no';
      const badge = window.open(
        `${OTH_SERVER_PATH}courier/badge/${id}?token=${this.token}`,
        'courier-badge',
        params,
      );

      // Потому что в Edge печать не срабатывает, в а Chrome от этого ещё и валится страница
      if (getBrowserName() === 'Firefox') badge.print();
    },
  },
};
</script>
