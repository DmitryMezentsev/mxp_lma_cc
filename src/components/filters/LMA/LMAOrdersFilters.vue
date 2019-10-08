<template>
  <el-form>
    <div class="filters">
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
      <div class="filter courier-filter" v-if="type === 'courier'">
        <el-form-item :label="$t('courier')">
          <CourierSelect
            width="100%"
            name="courier"
            :model.sync="filters.courier"
            :no-select-placeholder="$t('all')"
            @change="change"
            clearable
            multiple
          />
        </el-form-item>
      </div>
    </div>
    <el-button @click.prevent native-type="submit" class="hidden" />
  </el-form>
</template>

<script>
import mixins from 'Common/js/mixins';
import { value2Array } from 'Common/js/helpers';
import StatusSelect from 'Components/form-elements/StatusSelect';
import DatePicker from 'Components/form-elements/DatePicker';
import CourierSelect from 'Components/form-elements/CourierSelect';

export default {
  name: 'LMAOrdersFilters',
  components: { CourierSelect, DatePicker, StatusSelect },
  mixins: [mixins],
  props: {
    type: { type: String },
  },
  computed: {
    filters() {
      return {
        deliveryDate: this.$route.query.deliveryDate,
        status: value2Array(this.$route.query.status),
        courier: value2Array(this.$route.query.courier),
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
.el-range-editor {
  width: 250px;
}

.delivery-date-filter {
  @media (max-width: 640px) {
    display: none;
  }
}

.courier-filter {
  @media (min-width: 640px) {
    width: 280px;
  }
}
</style>
