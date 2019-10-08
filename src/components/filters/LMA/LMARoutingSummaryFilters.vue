<template>
  <el-form>
    <div class="filters">
      <div class="filter">
        <el-form-item :label="$t('date')">
          <DatePicker
            name="date"
            width="100%"
            :model="filters.date"
            :clearable="false"
            @change="change"
          />
        </el-form-item>
      </div>
    </div>
    <el-button @click.prevent native-type="submit" class="hidden" />
  </el-form>
</template>

<script>
import { pick } from 'lodash';

import mixins from 'Common/js/mixins';
import DatePicker from 'Components/form-elements/DatePicker';

export default {
  name: 'LMARoutingSummaryFilters',
  components: { DatePicker },
  mixins: [mixins],
  computed: {
    filters() {
      return pick(this.$route.query, ['date']);
    },
  },
  methods: {
    change({ name, value }) {
      this.replaceRouteQueryParams({ [name]: value });
    },
  },
};
</script>
