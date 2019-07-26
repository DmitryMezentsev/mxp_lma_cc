<template>
  <div>
    <div v-if="$route.name === 'lma'">
      <CurrentUserAlert />
    </div>
    <router-view />
  </div>
</template>

<script>
import CurrentUserAlert from 'Components/CurrentUserAlert';

export default {
  name: 'LMAHomePage',
  components: { CurrentUserAlert },
};
</script>

<style lang="less" scoped></style>
