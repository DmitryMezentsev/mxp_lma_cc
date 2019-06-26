<template>
  <div class="right-sidebar" :class="{ opened: mapOrderDetails }">
    <div v-if="mapOrderDetails">
      <h2>{{ $t('order') }}</h2>
      <h1>{{ mapOrderDetails.internalNumber }}<br />{{ mapOrderDetails.sender.internalNumber }}</h1>
      <hr />
      <section>{{ mapOrderDetails.recipient.address.value }}</section>
      <hr />
      <section></section>
    </div>
    <footer>
      <el-button-group>
        <el-button @click="close">{{ $t('close') }}</el-button>
        <el-button type="primary" @click="save">{{ $t('save') }}</el-button>
      </el-button-group>
    </footer>
  </div>
</template>

<script>
import { mapState, mapMutations } from 'vuex';

export default {
  name: 'RoutingMapOrderDetails',
  computed: {
    ...mapState('routing', ['mapOrderDetails']),
  },
  methods: {
    ...mapMutations('routing', ['setMapOrderDetails']),
    close() {
      this.setMapOrderDetails(null);
    },
    save() {},
  },
};
</script>
