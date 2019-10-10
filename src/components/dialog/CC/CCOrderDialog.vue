<template>
  <el-dialog
    :title="$t('viewOrder')"
    :visible.sync="visible"
    :width="clientWidth > 919 ? '900px' : '100%'"
    top="5vh"
  >
    <div v-if="order">
      <el-row :gutter="10">
        <el-col :span="12" :xs="24">
          <div class="values-section">
            <Value :name="$t('deliveryServiceNumber')" :value="order.principal.internalNumber" />
            <Value :name="$t('shopNumber')" :value="order.sender.internalNumber" />
          </div>
          <div class="values-section">
            <Value :name="$t('trackNumber')" :value="order.deliverer.internalNumber" />
          </div>
          <div class="values-section">
            <Value
              :name="$t('status')"
              :value="order.currentStatus.statusInfo.name"
              :active="order.statuses && order.statuses.length > 1"
              @click="setStatusesHistory(order.statuses)"
            />
          </div>
          <div class="values-section">
            <Value
              :name="$t('estimatedCost')"
              :value="order.cashOnDelivery.estimatedCost | currency"
            />
          </div>
        </el-col>
        <el-col :span="12" :xs="24">
          <div class="values-section">
            <Value :name="$t('type')" :value="order.serviceType | deliveryType" />
          </div>
          <div class="values-section">
            <Value
              :name="$t('weight')"
              :value="order.dimensions.weightFact / 1000"
              :suffix="$t('kg')"
            />
            <Value :name="$t('dimensions')" inner>
              <Dimensions :values="order.dimensions" fact />
            </Value>
          </div>
          <div class="values-section">
            <Value :name="$t('orderPlaces')" :value="order.places.length" />
          </div>
        </el-col>
      </el-row>
      <hr class="margin-top margin-bottom" />
      <el-row :gutter="10">
        <el-col :span="12" :xs="24">
          <div class="values-section">
            <Value :name="$t('shop')" :value="order.sender.corporationName" />
            <Value :name="$tc('brand', 2)" :value="order.sender.brandName" />
            <Value :name="$t('warehouse')" :value="order.sender.warehouseId | warehouseName" />
          </div>
        </el-col>
        <el-col :span="12" :xs="24">
          <div class="values-section">
            <Value :name="$t('recipient')" :value="order.recipient.contacts.name" />
          </div>
          <div class="values-section">
            <Value :name="$t('phone')" :value="order.recipient.contacts.phone" />
            <Value :name="$t('email')" :value="order.recipient.contacts.email" />
          </div>
          <div
            class="values-section"
            v-if="
              order.serviceType === COURIER ||
                order.serviceType === POST ||
                order.serviceType === DRON
            "
          >
            <Value :name="$t('address')" :value="order.recipient.contacts.address" />
          </div>
        </el-col>
      </el-row>
      <hr class="margin-top margin-bottom-x2" />
      <h4>{{ $t('services') }}:</h4>
      <OrderServices :order="order" />
      <div v-show="order.recipient.notes">
        <hr class="margin-top-x2 margin-bottom-x2" />
        <h4>{{ $t('comment') }}:</h4>
        <div>{{ order.recipient.notes }}</div>
      </div>
      <hr class="margin-top-x2 margin-bottom-x2" />
      <h4>{{ $t('goods') }}:</h4>
      <el-table :data="order.goods" :empty-text="$t('noGoods')">
        <el-table-column :label="$tc('name', 3)" prop="name" key="col-name" />
        <el-table-column :label="$t('vat')" key="col-vat" width="65" v-if="clientWidth > 599">
          <template slot-scope="scope">
            <span v-if="scope.row.tax || scope.row.tax === 0">{{ scope.row.tax }}%</span>
            <span v-else>&mdash;</span>
          </template>
        </el-table-column>
        <el-table-column key="col-vendor-code" v-if="clientWidth > 799">
          <template slot="header">
            {{ $t('vendorCode') }}&nbsp;/<br />{{ $t('barcode') }}
          </template>
          <template slot-scope="scope">
            <div>{{ scope.row.vendorCode || '&mdash;' }}</div>
            <div>{{ scope.row.barcode || '&mdash;' }}</div>
          </template>
        </el-table-column>
        <el-table-column
          :label="$tc('quantity', 2)"
          width="90"
          key="col-quantity"
          v-if="clientWidth > 699"
        >
          <template slot-scope="scope"
            >{{ scope.row.counting.count }} {{ $t('pc') }}</template
          >
        </el-table-column>
        <el-table-column
          :label="$t('estimatedCost')"
          width="110"
          key="col-estimated-cost"
          v-if="clientWidth > 539"
        >
          <template slot-scope="scope">{{ scope.row.estimatedCost | currency }}</template>
        </el-table-column>
        <el-table-column
          :label="$t('price')"
          width="110"
          key="col-estimated-price"
          v-if="clientWidth > 429"
        >
          <template slot-scope="scope">{{ scope.row.price | currency }}</template>
        </el-table-column>
        <el-table-column :label="$t('sum')" width="110" key="col-sum">
          <template slot-scope="scope">{{
            (scope.row.price * scope.row.counting.count) | currency
          }}</template>
        </el-table-column>
      </el-table>
      <div class="values-section">
        <Value :name="$t('totalGoodsPrice')" :value="goodsSum | currency" />
      </div>
      <div class="values-section">
        <Value :name="$t('paySum')" :value="order.cashOnDelivery.priceFact | currency" />
      </div>
    </div>
    <span slot="footer" class="dialog-footer">
      <el-button @click="setOpened(null)" key="close-btn">{{ $t('close') }}</el-button>
    </span>
  </el-dialog>
</template>

<script>
import { mapState, mapMutations } from 'vuex';
import { cloneDeep } from 'lodash';

import { COURIER, POST, DRON } from 'Constants/delivery-types';
import { deliveryType, warehouseName, currency } from 'Common/js/filters';
import Value from 'Components/Value';
import Dimensions from 'Components/Dimensions';
import OrderServices from 'Components/OrderServices';

export default {
  name: 'CCOrderDialog',
  filters: { deliveryType, warehouseName, currency },
  components: { OrderServices, Value, Dimensions },
  data() {
    return {
      COURIER,
      POST,
      DRON,
      order: null,
    };
  },
  computed: {
    ...mapState('auth', ['currentUser']),
    ...mapState('common', ['clientWidth']),
    ...mapState('orders', {
      orders: 'list',
      opened: 'opened',
    }),
    visible: {
      get() {
        return !!this.order;
      },
      set() {
        this.setOpened(null);
      },
    },
    // Сумма товаров
    goodsSum() {
      let sum = 0;
      this.order.goods.forEach(item => {
        sum += item.price * item.counting.count;
      });
      return sum;
    },
  },
  methods: {
    ...mapMutations('orders', ['setOpened', 'setStatusesHistory']),
  },
  destroyed() {
    this.setOpened(null);
  },
  watch: {
    opened: {
      handler(opened) {
        // eslint-disable-next-line prettier/prettier
        this.order = opened !== null
          ? cloneDeep(this.orders.data[opened])
          : null;
      },
      immediate: true,
    },
    $route() {
      this.setOpened(null);
    },
  },
};
</script>

<style lang="less" scoped>
@import '~Common/colors';

h4 {
  font-size: 13px;
  font-weight: normal;
  color: @secondary-text-color;
  margin: 0 0 0.3em 0;
}
</style>
