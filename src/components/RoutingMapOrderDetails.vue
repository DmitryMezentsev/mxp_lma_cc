<template>
  <div class="right-sidebar" :class="{ opened: mapOrderDetails }">
    <div v-if="mapOrderDetails">
      <h2>{{ $t('order') }}</h2>
      <h1>{{ mapOrderDetails.internalNumber }}<br />{{ mapOrderDetails.sender.internalNumber }}</h1>
      <hr />
      <section>
        <div class="label">{{ $t('address') }}:</div>
        <div>{{ mapOrderDetails.recipient.address.value }}</div>
      </section>
      <hr />
      <section>
        <div class="label">{{ $t('deliveryDate') }}:</div>
        <OrderDeliveryDate
          :date-time-interval="mapOrderDetails.deliveryOrder.dateTimeInterval"
          inline
        />
      </section>
      <hr />
      <section>
        <div class="label">{{ $t('courier') }}:</div>
        <CourierSelect
          width="100%"
          :model="mapOrderDetails.serviceInfo.courierId"
          name="courier"
          @change="change"
        />
      </section>
    </div>
    <footer>
      <el-button-group>
        <el-button @click="close" :disabled="waiting">{{ $t('close') }}</el-button>
        <el-button type="primary" @click="save" :disabled="!newCourier" :loading="waiting">
          {{ $t('save') }}
        </el-button>
      </el-button-group>
    </footer>
  </div>
</template>

<script>
import { mapState, mapMutations, mapActions } from 'vuex';

import OrderDeliveryDate from 'Components/OrderDeliveryDate';
import CourierSelect from 'Components/form-elements/CourierSelect';

export default {
  name: 'RoutingMapOrderDetails',
  components: { CourierSelect, OrderDeliveryDate },
  data() {
    return {
      newCourier: null,
      waiting: false,
    };
  },
  computed: {
    ...mapState('routing', ['mapOrderDetails']),
  },
  methods: {
    ...mapMutations('routing', ['setMapOrderDetails']),
    ...mapActions('orders', ['setCourier']),
    close() {
      this.setMapOrderDetails(null);
    },
    change({ value }) {
      this.newCourier = value;
    },
    save() {
      this.waiting = true;

      this.setCourier({
        courierId: this.newCourier,
        orderIds: [this.mapOrderDetails._id], // eslint-disable-line no-underscore-dangle
        callback: success => {
          this.waiting = false;

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
    },
  },
  watch: {
    mapOrderDetails() {
      this.newCourier = null;
    },
  },
};
</script>

<style lang="less" scoped>
section {
  .label {
    @media (max-height: 459px) {
      display: none;
    }
  }
}
</style>
