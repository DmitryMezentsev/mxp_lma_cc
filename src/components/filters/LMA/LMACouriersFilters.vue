<template>
  <el-form>
    <div class="filters">
      <div class="filter hidden-xs-only">
        <el-form-item :label="$t('fullName')">
          <el-input v-model="filters.fullname" clearable />
        </el-form-item>
      </div>
      <div class="filter">
        <el-form-item :label="$t('inArchive')">
          <el-switch v-model="filters.inArchive" />
        </el-form-item>
      </div>
    </div>
    <el-button @click.prevent native-type="submit" class="hidden" />
  </el-form>
</template>

<script>
import { debounce } from 'lodash';

import { str2Bool } from 'Common/js/helpers';
import mixins from 'Common/js/mixins';

export default {
  name: 'LMACouriersFilters',
  mixins: [mixins],
  data() {
    return {
      filters: {
        fullname: null,
        inArchive: false,
      },
    };
  },
  watch: {
    '$route.query': {
      handler(query) {
        this.filters = {
          fullname: query.fullname,
          inArchive: str2Bool(query.inArchive),
        };
      },
      immediate: true,
    },
    filters: {
      // eslint-disable-next-line func-names
      handler: debounce(function({ fullname, inArchive }) {
        this.replaceRouteQueryParams({
          fullname,
          inArchive: inArchive || null,
        });
      }, 400),
      deep: true,
    },
  },
};
</script>
