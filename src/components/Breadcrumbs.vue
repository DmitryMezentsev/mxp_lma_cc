<template>
  <el-breadcrumb separator-class="el-icon-arrow-right">
    <el-breadcrumb-item
      v-for="(route, i) in path"
      v-if="!route.meta.isBase"
      :to="!route.redirect ? { name: route.name } : null"
      :key="i"
    >
      {{ getRoutePageName(route) }}</el-breadcrumb-item
    >
  </el-breadcrumb>
</template>

<script>
import mixins from 'Common/js/mixins';

export default {
  name: 'Breadcrumbs',
  mixins: [mixins],
  data() {
    return {
      path: [],
    };
  },
  mounted() {
    this.path = this.$router.history.current.matched;
    this.$router.afterEach(to => {
      this.path = to.matched;
    });
  },
};
</script>

<style lang="less" scoped>
.el-breadcrumb__item {
  line-height: 1.4rem;
}
</style>
