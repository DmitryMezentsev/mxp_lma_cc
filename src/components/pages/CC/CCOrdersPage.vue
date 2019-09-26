<template>
  <div>
    <div v-if="$route.name === 'ccOrders'">
      <div class="top-buttons-right">
        <router-link :to="{ name: 'ccOrdersImport' }">
          <el-button type="primary">
            <fa-icon icon="file-upload" class="btn-margin" />{{ $t('ordersImport') }}
          </el-button>
        </router-link>
        <router-link :to="{ name: 'ccAddOrder' }">
          <el-button type="primary">
            {{ $t('addOrder') }}
          </el-button>
        </router-link>
      </div>
    </div>

    <router-view />
  </div>
</template>

<script>
export default {
  name: 'CCOrdersPage',
};
</script>

<style lang="less" scoped></style>
