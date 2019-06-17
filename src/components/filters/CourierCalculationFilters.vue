<template>
  <el-form class="filters">
    <div class="filter">
      <el-form-item :label="$t('courier')">
        <CourierSelect name="courier" :model="filters.courier" @change="change" />
      </el-form-item>
    </div>
    <div class="filter">
      <el-form-item :label="$t('date')">
        <DatePicker name="date" :model="filters.date" :clearable="false" @change="change" />
      </el-form-item>
    </div>
    <el-button @click.prevent native-type="submit" class="hidden" />
  </el-form>
</template>

<script>
import pick from 'lodash/pick';

import mixins from 'Common/js/mixins';
import CourierSelect from 'Components/form-elements/CourierSelect';
import DatePicker from 'Components/form-elements/DatePicker';

export default {
  name: 'CourierCalculationFilters',
  components: { DatePicker, CourierSelect },
  mixins: [mixins],
  computed: {
    filters() {
      return pick(this.$route.query, ['courier', 'date']);
    },
  },
  methods: {
    change({ name, value }) {
      this.replaceRouteQueryParams({ [name]: value });
    },
  },
};
</script>
