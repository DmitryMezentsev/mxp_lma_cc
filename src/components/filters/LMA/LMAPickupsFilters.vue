<template>
  <el-form>
    <div class="filters">
      <div class="filter">
        <el-form-item :label="$t('courier')">
          <CourierSelect
            name="courier"
            :model.sync="filters.courier"
            :noSelectPlaceholder="$t('all')"
            clearable
            @change="change"
          />
        </el-form-item>
      </div>
      <div class="filter">
        <el-form-item :label="$t('date')">
          <DatePicker name="pickupDate" :model.sync="filters.pickupDate" @change="change" />
        </el-form-item>
      </div>
    </div>
    <el-button @click.prevent native-type="submit" class="hidden" />
  </el-form>
</template>

<script>
import { pick } from 'lodash';

import mixins from 'Common/js/mixins';
import CourierSelect from 'Components/form-elements/CourierSelect';
import DatePicker from 'Components/form-elements/DatePicker';

export default {
  name: 'LMAPickupsFilters',
  components: { DatePicker, CourierSelect },
  mixins: [mixins],
  computed: {
    filters() {
      return pick(this.$route.query, ['courier', 'pickupDate']);
    },
  },
  methods: {
    change({ name, value }) {
      this.replaceRouteQueryParams({ [name]: value });
    },
  },
};
</script>
