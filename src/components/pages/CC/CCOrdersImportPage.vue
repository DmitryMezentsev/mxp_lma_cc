<template>
  <div>
    <div v-if="$route.name === 'ccOrdersImport'">
      <div class="text-right">
        <router-link :to="{ name: 'ccOrdersImportTemplates' }">
          <el-button type="primary">
            <fa-icon icon="pencil-alt" class="btn-margin" />{{ $t('templatesManagement') }}
          </el-button>
        </router-link>
      </div>
    </div>

    <router-view />
  </div>
</template>

<script>
export default {
  name: 'CCOrdersImportPage',
};
</script>

<style lang="less" scoped></style>
