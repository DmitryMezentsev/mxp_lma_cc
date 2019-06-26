<template>
  <div class="pagination-wrap" v-if="maxPage > 1">
    <el-pagination
      background
      layout="prev, pager, next"
      :pager-count="5"
      :current-page="page"
      :page-size="pageSize"
      :page-count="maxPage"
      @current-change="change"
    />
  </div>
</template>

<script>
import mixins from 'Common/js/mixins';
import { PER_PAGE_DEFAULT } from 'Constants/config';

const QUERY_PARAM_NAME = 'page';

export default {
  name: 'Pagination',
  mixins: [mixins],
  props: {
    pageSize: { type: Number, default: PER_PAGE_DEFAULT },
    maxPage: { type: Number },
  },
  data() {
    return {
      page: Number(this.$route.query[QUERY_PARAM_NAME]) || 1,
      removeAfterEach: null,
    };
  },
  methods: {
    change(page) {
      this.replaceRouteQueryParams({
        [QUERY_PARAM_NAME]: page,
      });
    },
    validatePage() {
      if (this.maxPage && this.page > this.maxPage) {
        this.change(this.maxPage);
      } else if (this.page < 1) {
        this.change(1);
      }
    },
  },
  mounted() {
    this.removeAfterEach = this.$router.afterEach(to => {
      this.page = Number(to.query[QUERY_PARAM_NAME]) || 1;
    });
  },
  destroyed() {
    if (this.removeAfterEach) this.removeAfterEach();
  },
  watch: {
    page: {
      handler() {
        this.validatePage();
      },
      immediate: true,
    },
    maxPage: {
      handler() {
        this.validatePage();
      },
      immediate: true,
    },
  },
};
</script>

<style lang="less">
.pagination-wrap {
  text-align: center;
  margin: 1em 0;

  .el-pager {
    @media (max-width: 470px) {
      display: none;
    }
  }
}
</style>
