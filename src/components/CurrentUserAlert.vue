<template>
  <el-alert type="info" :closable="false"
    >{{ $t('youAreLoggedInAs') }} <b class="email">{{ currentUser.email }}</b> ({{
      currentUser.name
    }}).</el-alert
  >
</template>

<script>
import { mapState } from 'vuex';

export default {
  name: 'CurrentUserAlert',
  computed: {
    ...mapState('auth', ['currentUser']),
  },
};
</script>

<style lang="less" scoped>
.el-alert {
  padding-bottom: 11px;
}
</style>
