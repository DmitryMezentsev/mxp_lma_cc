<template>
  <el-form class="filters">
    <div class="filter">
      <el-form-item :label="$t('inArchive')">
        <el-switch v-model="filters.inArchive" @change="changeInArchive" />
      </el-form-item>
    </div>
    <el-button @click.prevent native-type="submit" class="hidden" />
  </el-form>
</template>

<script>
import { pick } from 'lodash';

import { str2Bool } from 'Common/js/helpers';
import mixins from 'Common/js/mixins';

export default {
  name: 'LMARoutingZonesFilters',
  mixins: [mixins],
  computed: {
    filters() {
      const { inArchive } = pick(this.$route.query, ['inArchive']);

      return {
        inArchive: str2Bool(inArchive),
      };
    },
  },
  methods: {
    changeInArchive(inArchive) {
      this.replaceRouteQueryParams({ inArchive: inArchive || null });
    },
  },
};
</script>
