<template>
  <div class="services">
    <div v-if="services">
      <div class="tags-wrap">
        <TagChecked
          v-for="(service, i) in services"
          :key="i"
          :label="service.name"
          :checked="service.checked"
        />
      </div>
      <div v-show="!services.length">{{ $t('noServices') }}.</div>
    </div>
    <div v-else-if="deliveryServices === false">
      <el-alert
        type="error"
        :title="$t('deliveryServicesLoadingError')"
        :closable="false"
        show-icon
      />
    </div>
    <Waiting v-else min-padding />
  </div>
</template>

<script>
import { mapState, mapActions } from 'vuex';

import TagChecked from 'Components/TagChecked';
import Waiting from 'Components/Waiting';

export default {
  name: 'OrderServices',
  components: { Waiting, TagChecked },
  props: {
    order: { type: Object, required: true },
  },
  computed: {
    ...mapState('common', ['deliveryServices']),
    services() {
      if (!this.deliveryServices) return null;

      const services = [];

      this.order.additionalDeliveryServices.forEach(({ deliveryServiceId }) => {
        let checked = false;
        const { name } = this.deliveryServices[deliveryServiceId];

        this.order.completedAdditionalDeliveryServices.forEach(completedService => {
          if (completedService.deliveryServiceId === deliveryServiceId) checked = true;
        });

        services.push({ checked, name });
      });

      return services;
    },
  },
  methods: {
    ...mapActions('common', ['loadDeliveryServices']),
  },
  created() {
    this.loadDeliveryServices();
  },
};
</script>

<style lang="less" scoped>
.services {
  .tags-wrap {
    font-size: 0;
  }
}
</style>
