<template>
  <el-form class="filters">
    <div class="filter delivery-date-filter">
      <el-form-item :label="$t('deliveryDate')">
        <DatePicker
          name="deliveryDate"
          type="daterange"
          :model.sync="filters.deliveryDate"
          :start-placeholder="$tc('from', 1) + '...'"
          :end-placeholder="$tc('to', 1) + '...'"
          @change="change"
        />
      </el-form-item>
    </div>
    <div class="filter">
      <el-form-item :label="$t('status')">
        <StatusSelect
          width="100%"
          name="status"
          :model.sync="filters.status"
          :noSelectPlaceholder="$t('all')"
          @change="change"
          clearable
          multiple
        />
      </el-form-item>
    </div>
    <el-button @click.prevent native-type="submit" class="hidden" />
  </el-form>
</template>

<script>
import { pick } from 'lodash';

import mixins from 'Common/js/mixins';
import StatusSelect from 'Components/form-elements/StatusSelect';
import DatePicker from 'Components/form-elements/DatePicker';

export default {
  name: 'LMAOrdersFilters',
  components: { DatePicker, StatusSelect },
  mixins: [mixins],
  computed: {
    filters() {
      return pick(this.$route.query, ['deliveryDate', 'status']);
    },
  },
  methods: {
    change({ name, value }) {
      this.replaceRouteQueryParams({ [name]: value });
    },
  },
};
</script>

<style lang="less" scoped>
.el-range-editor {
  width: 250px;
}

.delivery-date-filter {
  @media (max-width: 640px) {
    display: none;
  }
}
</style>
