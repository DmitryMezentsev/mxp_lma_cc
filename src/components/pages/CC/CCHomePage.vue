<template>
  <div>
    <div v-if="$route.name === 'cc'">
      <CurrentUserAlert />
    </div>
    <router-view />
  </div>
</template>

<script>
import CurrentUserAlert from 'Components/CurrentUserAlert';

export default {
  name: 'CCHomePage',
  components: { CurrentUserAlert },
};
</script>

<style lang="less" scoped></style>
