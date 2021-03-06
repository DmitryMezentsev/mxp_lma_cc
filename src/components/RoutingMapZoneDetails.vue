<template>
  <div>
    <div class="right-sidebar" :class="{ opened: mapZoneDetails }">
      <div v-if="mapZoneDetails">
        <h2>{{ $t('zone') }}</h2>
        <h1>{{ mapZoneDetails.name }}</h1>
        <div v-if="orders">
          <hr />
          <section>{{ $t('ordersCount') }}: {{ orders.length | number }}.</section>
          <hr />
          <section>
            <div class="label">{{ $t('courier') }}:</div>
            <CourierSelect width="100%" :model.sync="courierId" name="courier" />
          </section>
        </div>
        <Waiting v-else min-padding />
      </div>
      <footer>
        <el-button-group>
          <el-button @click="close">{{ $t('close') }}</el-button>
          <el-button
            type="primary"
            @click="save"
            :disabled="!courierId || !orders || !orders.length"
            :loading="!orders"
          >
            {{ $t('save') }}
          </el-button>
        </el-button-group>
      </footer>
    </div>
    <el-dialog
      top="7vh"
      :title="$t('warning')"
      :visible.sync="showOrdersOutZone"
      :width="clientWidth > 639 ? '620px' : '95%'"
    >
      <p>{{ $tc('ordersOutZoneMessage', 1) }}:</p>
      <el-table :data="ordersOutZone">
        <el-table-column prop="internalNumber" :label="$t('providerNumber')"></el-table-column>
        <el-table-column prop="address" :label="$t('address')"></el-table-column>
      </el-table>
      <p>{{ $tc('ordersOutZoneMessage', 2) }}.</p>
      <span slot="footer" class="dialog-footer">
        <el-button @click="showOrdersOutZone = false">{{ $t('close') }}</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import { mapState, mapMutations, mapActions } from 'vuex';
import { geoContains } from 'd3-geo';

import api from 'Common/js/api';
import { number } from 'Common/js/filters';
import CourierSelect from 'Components/form-elements/CourierSelect';
import Waiting from 'Components/Waiting';

export default {
  name: 'RoutingMapZoneDetails',
  filters: { number },
  components: { Waiting, CourierSelect },
  data() {
    return {
      courierId: null,
      orders: null,
      showOrdersOutZone: false,
      ordersInZone: [], // Заказы (только ID), расположенные в зоне
      ordersOutZone: [], // Заказы, координаты которых находятся вне зоны
    };
  },
  computed: {
    ...mapState('routing', ['mapZoneDetails', 'zonesList']),
    ...mapState('common', ['clientWidth']),
  },
  methods: {
    ...mapMutations('routing', ['setMapZoneDetails']),
    ...mapActions('orders', ['setCourier', 'setBadZone']),
    close() {
      this.setMapZoneDetails(null);
    },
    save() {
      this.ordersInZone = [];
      this.ordersOutZone = [];

      this.orders.forEach(order => {
        if (
          // Проверка, что координаты заказа расположены внутри полигона зоны
          geoContains(this.zonesList.data[this.mapZoneDetails.index], [order.lng, order.lat])
        ) {
          this.ordersInZone.push(order.id);
        } else {
          this.ordersOutZone.push(order);
        }
      });

      if (this.ordersInZone.length) {
        this.setCourier({
          courierId: this.courierId,
          orderIds: this.ordersInZone,
          callback: success => {
            if (success) {
              this.$message({
                message: this.$t('courierAreSet'),
                type: 'success',
              });

              this.$emit('update');
              this.close();
            }
          },
        });
      }

      if (this.ordersOutZone.length) {
        this.showOrdersOutZone = true;
        this.ordersOutZone.forEach(({ id }) =>
          this.setBadZone({
            orderId: id,
            callback() {},
          }),
        );

        this.close();
      }
    },
    fetchZoneOrders() {
      api
        .get('order', {
          params: {
            perPage: 0,
            deliveryZoneId: [this.mapZoneDetails.id],
            // Доп. фильтры, примененные к карте
            deliveryDateFrom: this.mapZoneDetails.date,
            deliveryDateTo: this.mapZoneDetails.date,
            statusId: this.mapZoneDetails.status,
            courierId: this.mapZoneDetails.courier,
          },
        })
        .then(({ data }) => {
          this.orders = data.map(order => ({
            id: order._id, // eslint-disable-line no-underscore-dangle
            lat: order.recipient.address.latitude,
            lng: order.recipient.address.longitude,
            address: order.recipient.address.value,
            internalNumber: order.internalNumber,
          }));
        });
    },
  },
  watch: {
    mapZoneDetails(mapZoneDetails) {
      this.courierId = null;
      this.orders = null;

      if (mapZoneDetails) this.fetchZoneOrders();
    },
  },
};
</script>
