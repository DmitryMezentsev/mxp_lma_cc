<template>
  <el-form class="filters">
    <div class="filter">
      <el-form-item :label="$t('date')">
        <DatePicker width="100%" name="date" :model="filters.date" @change="change" />
      </el-form-item>
    </div>
    <div class="filter">
      <el-form-item :label="$t('status')">
        <StatusSelect
          name="status"
          width="100%"
          :model="filters.status"
          :noSelectPlaceholder="$t('all')"
          clearable
          multiple
          @change="change"
        />
      </el-form-item>
    </div>
    <div class="filter">
      <el-form-item :label="$t('courier')">
        <CourierSelect
          name="courier"
          width="100%"
          :model="filters.courier"
          :noSelectPlaceholder="$t('all')"
          clearable
          multiple
          @change="change"
        />
      </el-form-item>
    </div>
    <div class="filter">
      <el-form-item :label="$t('zone')">
        <RoutingZoneSelect
          name="zone"
          width="100%"
          :model="filters.zone"
          :noSelectPlaceholder="$t('all')"
          clearable
          multiple
          @change="change"
        />
      </el-form-item>
    </div>
    <el-button @click.prevent native-type="submit" class="hidden" />
  </el-form>
</template>

<script>
import mixins from 'Common/js/mixins';
import CourierSelect from 'Components/form-elements/CourierSelect';
import DatePicker from 'Components/form-elements/DatePicker';
import StatusSelect from 'Components/form-elements/StatusSelect';
import RoutingZoneSelect from 'Components/form-elements/RoutingZoneSelect';
import { value2Array } from 'Common/js/helpers';

export default {
  name: 'RoutingMapFilters',
  components: { StatusSelect, DatePicker, CourierSelect, RoutingZoneSelect },
  mixins: [mixins],
  computed: {
    filters() {
      return {
        date: this.$route.query.date,
        courier: value2Array(this.$route.query.courier),
        status: value2Array(this.$route.query.status),
        zone: value2Array(this.$route.query.zone),
      };
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
.filters {
  display: flex;
  flex-wrap: wrap;

  .filter {
    width: 25%;
    box-sizing: border-box;

    @media (max-width: 1599px) {
      width: 33.3333%;
    }

    @media (max-width: 1199px) {
      width: 50%;
    }

    @media (max-width: 719px) {
      width: 100%;
    }
  }
}
</style>
