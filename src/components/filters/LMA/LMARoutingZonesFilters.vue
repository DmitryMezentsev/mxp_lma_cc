<template>
  <el-form>
    <div class="filters">
      <div class="filter">
        <el-form-item :label="$t('inArchive')">
          <el-switch v-model="filters.inArchive" @change="changeInArchive" />
        </el-form-item>
      </div>
    </div>
    <el-button @click.prevent native-type="submit" class="hidden" />
  </el-form>
</template>

<script>
import { str2Bool } from 'Common/js/helpers';
import mixins from 'Common/js/mixins';

export default {
  name: 'LMARoutingZonesFilters',
  mixins: [mixins],
  computed: {
    filters() {
      return {
        inArchive: str2Bool(this.$route.query.inArchive),
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
