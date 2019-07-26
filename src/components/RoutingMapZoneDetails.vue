<template>
  <div class="right-sidebar" :class="{ opened: mapZoneDetails }">
    <div v-if="mapZoneDetails">
      <h2>{{ $t('zone') }}</h2>
      <h1>{{ mapZoneDetails.name }}</h1>
      <hr />
      <section>
        <div class="label">{{ $t('courier') }}:</div>
        <CourierSelect width="100%" :model.sync="courierId" name="courier" />
      </section>
    </div>
    <footer>
      <el-button-group>
        <el-button @click="close">{{ $t('close') }}</el-button>
        <el-button type="primary" @click="save" :disabled="!courierId">
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

export default {
  name: 'RoutingMapZoneDetails',
  components: { CourierSelect },
  data() {
    return {
      courierId: null,
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
          orderIds: [],
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
  },
  watch: {
    mapZoneDetails() {
      this.courierId = null;
    },
  },
};
</script>
