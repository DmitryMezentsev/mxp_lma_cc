<template>
  <div class="right-sidebar" :class="{ opened: mapZoneDetails }">
    <div v-if="mapZoneDetails">
      <h2>{{ $t('zone') }}</h2>
      <h1>{{ mapZoneDetails.name }}</h1>
      <div v-if="orders">
        <hr />
        <section>{{ $t('ordersCount') }}: {{ orders.length | number }}.</section>
      </div>
      <hr />
      <section>
        <div class="label">{{ $t('courier') }}:</div>
        <CourierSelect width="100%" :model.sync="courierId" name="courier" />
      </section>
    </div>
    <footer>
      <el-button-group>
        <el-button @click="close">{{ $t('close') }}</el-button>
        <el-button
          type="primary"
          @click="save"
          :disabled="!courierId || !orders.length"
          :loading="!orders"
        >
          {{ $t('save') }}
        </el-button>
      </el-button-group>
    </footer>
  </div>
</template>

<script>
import { mapState, mapMutations } from 'vuex';

import CourierSelect from 'Components/form-elements/CourierSelect';
import api from 'Common/js/api';
import { number } from 'Common/js/filters';

export default {
  name: 'RoutingMapZoneDetails',
  filters: { number },
  components: { CourierSelect },
  data() {
    return {
      courierId: null,
      orders: null,
    };
  },
  computed: {
    ...mapState('routing', ['mapZoneDetails']),
  },
  methods: {
    ...mapMutations('routing', ['setMapZoneDetails']),
    close() {
      this.setMapZoneDetails(null);
    },
    save() {
      api
        .post('/order/setCourierToOrders', {
          courierId: this.courierId,
          orderIds: this.orders,
        })
        .then(() => {
          this.$message({
            message: this.$t('courierAreSet'),
            type: 'success',
          });

          this.$emit('update');
          this.close();
        });
    },
    fetchZoneOrders() {
      api
        .get('order', {
          params: {
            perPage: 0,
            deliveryZoneId: [this.mapZoneDetails.id],
          },
        })
        .then(({ data }) => {
          this.orders = data.map(order => order._id); // eslint-disable-line no-underscore-dangle
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
