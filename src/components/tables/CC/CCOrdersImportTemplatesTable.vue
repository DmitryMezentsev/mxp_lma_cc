<template>
  <el-table
    v-loading="loading"
    :data="data"
    :empty-text="$t(loading ? 'pleaseWait' : 'noTemplates')"
  >
    <el-table-column :label="$tc('name', 0)" key="col-name">
      <template slot-scope="scope">
        <router-link :to="{ name: 'ccOrdersEditImportTemplate', params: { id: scope.row._id } }">
          <el-button type="text">{{ scope.row.name }}</el-button>
        </router-link>
      </template>
    </el-table-column>
    <el-table-column :label="$t('numberOfUses')" key="col-used" v-if="clientWidth > 600">
      <template slot-scope="scope">
        {{ scope.row.used | number }}
      </template>
    </el-table-column>
    <el-table-column align="right" width="110" key="col-actions">
      <template slot-scope="scope">
        <el-button-group>
          <el-tooltip :content="$t('applyTemplate')" placement="left">
            <el-button type="primary" size="mini">
              <fa-icon icon="reply" />
            </el-button>
          </el-tooltip>
          <el-tooltip :content="$t('remove')" placement="top">
            <el-button type="danger" size="mini" @click="remove(scope.row._id)">
              <fa-icon icon="trash" />
            </el-button>
          </el-tooltip>
        </el-button-group>
      </template>
    </el-table-column>
  </el-table>
</template>

<script>
import { mapState, mapActions } from 'vuex';

import { number } from 'Common/js/filters';
import mixins from 'Common/js/mixins';

export default {
  name: 'CCOrdersImportTemplatesTable',
  props: {
    data: { type: Array },
  },
  mixins: [mixins],
  filters: { number },
  computed: {
    ...mapState('common', ['clientWidth']),
    ...mapState('auth', ['currentUser']),
    loading() {
      return this.data === null;
    },
  },
  methods: {
    ...mapActions('ordersTemplates', ['removeTemplate']),
    remove(id) {
      this.confirm(this.$t('removeTemplateConfirmation'), ok => {
        if (ok) {
          this.removeTemplate({
            id,
            callback: success => {
              if (success) this.$emit('update');
            },
          });
        }
      });
    },
  },
};
</script>
