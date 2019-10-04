<template>
  <div>
    <LMAAcceptanceCodFromCourierFilters />

    <div v-if="$route.query.courier && $route.query.date">
      <div
        class="close-courier-panel"
        v-if="acceptanceCodFromCourier && acceptanceCodFromCourier.orders.length"
      >
        <el-button
          v-if="shiftIsClosed"
          type="primary"
          :disabled="courierClosed"
          :loading="closeWaiting"
          @click="close"
          >{{ $t('closeCourier') }}</el-button
        >
        <el-alert v-else type="error" :closable="false">{{
          $t('courierShiftNotClosedMessage')
        }}</el-alert>
      </div>

      <LMAAcceptanceCodFromCourierTable :data="acceptanceCodFromCourier" />
    </div>
    <div v-else class="page-center-message">{{ $t('selectCourierAndDate') }}</div>
  </div>
</template>

<script>
import { mapState, mapActions } from 'vuex';

import mixins from 'Common/js/mixins';
import { number, currency } from 'Common/js/filters';
import LMAAcceptanceCodFromCourierFilters from 'Components/filters/LMA/LMAAcceptanceCodFromCourierFilters';
import LMAAcceptanceCodFromCourierTable from 'Components/tables/LMA/LMAAcceptanceCodFromCourierTable';

export default {
  name: 'LMAAcceptanceCodFromCourierPage',
  mixins: [mixins],
  components: { LMAAcceptanceCodFromCourierFilters, LMAAcceptanceCodFromCourierTable },
  filters: { number, currency },
  data() {
    return {
      courierClosed: false,
      closeWaiting: false,
    };
  },
  computed: {
    ...mapState('reporting', ['acceptanceCodFromCourier']),
    // Флаг, что смена закрыта курьером
    shiftIsClosed() {
      let closed = true;

      if (this.acceptanceCodFromCourier) {
        this.acceptanceCodFromCourier.orders.forEach(({ status }) => {
          // Все статусы заказов должны начинаться на 308, 417, 521 или 522
          if (!['308', '417', '521', '522'].includes(status.substring(0, 3))) closed = false;
        });
      }
      return closed;
    },
  },
  methods: {
    ...mapActions('reporting', ['loadAcceptanceCodFromCourier', 'closeCourier']),
    loadData({ date, courier }) {
      this.courierClosed = false;
      this.closeWaiting = false;

      if (date && courier) this.loadAcceptanceCodFromCourier({ date, courierUID: courier });
    },
    // Закрытие курьера
    close() {
      this.confirm(this.$t('closeCourierConfirmation'), ok => {
        if (ok) {
          this.closeWaiting = true;

          this.closeCourier({
            orders: this.acceptanceCodFromCourier.orders.map(({ _id }) => _id),
            callback: success => {
              this.closeWaiting = false;

              if (success) {
                this.courierClosed = true;
                this.$message({
                  message: this.$t('closeCourierSuccessMessage'),
                  type: 'success',
                });
              }
            },
          });
        }
      });
    },
  },
  beforeRouteEnter(to, from, next) {
    next(vm => vm.loadData(to.query));
  },
  beforeRouteUpdate(to, from, next) {
    this.loadData(to.query);
    next();
  },
};
</script>

<style lang="less">
.close-courier-panel {
  margin: 1.2rem 0;
}
</style>
