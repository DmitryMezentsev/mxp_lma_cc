<template>
  <el-form>
    <div class="filters" :class="{ 'hide-filters': !showFilters }">
      <el-button
        v-show="!showFilters"
        class="show-filters-btn"
        size="small"
        @click="showFilters = true"
        >{{ $t('showFilters') }}</el-button
      >
      <div class="filter">
        <el-form-item :label="$t('type')">
          <el-radio-group
            v-model="filters.type"
            @change="change({ name: 'type', value: $event })"
            :size="clientWidth < 379 ? 'small' : null"
          >
            <el-radio-button :label="COURIER" @click.native="typeOnClick">{{
              $t('courier')
            }}</el-radio-button>
            <el-radio-button :label="POINT" @click.native="typeOnClick">{{
              $t('pointOrders')
            }}</el-radio-button>
            <el-radio-button :label="POST" @click.native="typeOnClick">{{
              $t('post')
            }}</el-radio-button>
          </el-radio-group>
        </el-form-item>
      </div>
      <div class="filter date-filter">
        <el-form-item :label="$t('deliveryDate')">
          <DatePicker
            name="deliveryDate"
            type="daterange"
            :model.sync="filters.deliveryDate"
            :start-placeholder="$tc('from', 1) + '...'"
            :end-placeholder="$tc('to', 1) + '...'"
            hide-icon
            @change="change"
          />
        </el-form-item>
      </div>
      <div class="filter date-filter">
        <el-form-item :label="$t('dateOfCreation')">
          <DatePicker
            name="creationDate"
            type="daterange"
            :model.sync="filters.creationDate"
            :start-placeholder="$tc('from', 1) + '...'"
            :end-placeholder="$tc('to', 1) + '...'"
            hide-icon
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
      <div class="filter">
        <el-form-item :label="$t('warehouse')">
          <WarehouseSelect
            width="100%"
            name="warehouse"
            :model.sync="filters.warehouse"
            :noSelectPlaceholder="$t('all')"
            @change="change"
            clearable
          />
        </el-form-item>
      </div>
      <div class="filter">
        <el-form-item :label="$t('contract')">
          <ContractSelect
            width="100%"
            name="contract"
            :model.sync="filters.contract"
            :noSelectPlaceholder="$t('all')"
            @change="change"
            clearable
          />
        </el-form-item>
      </div>
      <div class="filter">
        <el-form-item :label="$t('address')">
          <el-input v-model="filters.address" clearable />
        </el-form-item>
      </div>
      <div class="filter clear-button">
        <router-link :to="{ name: 'ccOrders', query: { page: $route.query.page } }">
          <el-button v-autoblur :size="clientWidth < 469 ? 'small' : null">{{
            $t('clearFilters')
          }}</el-button>
        </router-link>
      </div>
    </div>
    <el-button @click.prevent native-type="submit" class="hidden" />
  </el-form>
</template>

<script>
import { mapState } from 'vuex';
import { debounce } from 'lodash';

import { COURIER, POINT, POST } from 'Constants/delivery-types';
import mixins from 'Common/js/mixins';
import { value2Array, getBrowserName } from 'Common/js/helpers';
import autoblur from 'Directives/autoblur';
import StatusSelect from 'Components/form-elements/StatusSelect';
import DatePicker from 'Components/form-elements/DatePicker';
import WarehouseSelect from 'Components/form-elements/WarehouseSelect';
import ContractSelect from 'Components/form-elements/ContractSelect';

export default {
  name: 'CCOrdersFilters',
  components: { ContractSelect, WarehouseSelect, DatePicker, StatusSelect },
  mixins: [mixins],
  directives: { autoblur },
  data() {
    return {
      COURIER,
      POINT,
      POST,
      showFilters: false,
      filters: {
        deliveryDate: null,
        creationDate: null,
        status: null,
        address: null,
        warehouse: null,
        contract: null,
        type: null,
      },
    };
  },
  computed: {
    ...mapState('common', ['clientWidth']),
  },
  methods: {
    change({ name, value }) {
      this.replaceRouteQueryParams({ [name]: value });
    },
    // Клик по переключателю типа
    typeOnClick({ target }) {
      if (
        target.tagName.toLowerCase() === 'input' &&
        String(this.filters.type) === String(target.value) &&
        getBrowserName() !== 'Microsoft Edge'
      ) {
        // Снятие выбора при клике по уже выбранному варианту
        this.replaceRouteQueryParams({ type: null });
      }
    },
  },
  watch: {
    '$route.query': {
      handler(query) {
        this.filters = {
          deliveryDate: query.deliveryDate,
          creationDate: query.creationDate,
          status: value2Array(query.status),
          address: query.address,
          warehouse: query.warehouse,
          contract: query.contract,
          type: query.type,
        };
      },
      immediate: true,
    },
    filters: {
      // eslint-disable-next-line func-names
      handler: debounce(function({ address }) {
        this.replaceRouteQueryParams({ address });
      }, 400),
      deep: true,
    },
  },
};
</script>

<style lang="less" scoped>
.el-range-editor {
  width: 230px;
}

.date-filter {
  @media (max-width: 640px) {
    display: none;
  }
}
</style>
