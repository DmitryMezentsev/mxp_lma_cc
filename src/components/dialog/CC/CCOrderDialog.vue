<template>
  <el-dialog
    :title="$t('viewOrder')"
    :visible.sync="visible"
    :width="clientWidth > 819 ? '800px' : '100%'"
    top="5vh"
  >
    <div></div>
    <span slot="footer" class="dialog-footer">
      <el-button @click="setOpened(null)" key="close-btn">{{ $t('close') }}</el-button>
    </span>
  </el-dialog>
</template>

<script>
import { mapState, mapMutations, mapActions } from 'vuex';
import { cloneDeep } from 'lodash';

export default {
  name: 'CCOrderDialog',
  data() {
    return {
      order: null,
    };
  },
  computed: {
    ...mapState('auth', ['currentUser']),
    ...mapState('common', ['clientWidth', 'deliveryServices']),
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
    // Список услуг для раздела "Услуги"
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
    ...mapMutations('orders', ['setOpened', 'setStatusesHistory']),
    ...mapActions('common', ['loadDeliveryServices']),
  },
  created() {
    this.loadDeliveryServices();
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

.services {
  .services-list {
    margin-top: 0.5em;

    .tags-wrap {
      font-size: 0;
    }
  }
}
</style>
