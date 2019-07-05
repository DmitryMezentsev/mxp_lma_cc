<template>
  <div>
    <LMAPickupsFilters />
    <br />
    <LMAPickupsTable :data="list.data" />
    <br />
    <el-button
      v-if="list.data && list.data.length"
      size="mini"
      type="primary"
      :disabled="!selected.length"
      @click="selectCourierDialog = true"
    >
      {{ $t('setCourier') }}
    </el-button>
    <Pagination :max-page="list.pages" />

    <LMAPickupDialog @update="loadPickups($route.query)" />
    <SelectCourierDialog
      :visible="selectCourierDialog"
      @select="setCourier"
      @cancel="selectCourierDialog = false"
    />
  </div>
</template>

<script>
import { parallel } from 'async';
import { mapState, mapActions } from 'vuex';

import { PER_PAGE_DEFAULT } from 'Constants/config';

import LMAPickupsFilters from 'Components/filters/LMA/LMAPickupsFilters';
import LMAPickupsTable from 'Components/tables/LMA/LMAPickupsTable';
import LMAPickupDialog from 'Components/dialog/LMA/LMAPickupDialog';
import Pagination from 'Components/Pagination';
import SelectCourierDialog from 'Components/dialog/SelectCourierDialog';

export default {
  name: 'LMAPickupsPage',
  components: {
    LMAPickupDialog,
    LMAPickupsTable,
    LMAPickupsFilters,
    SelectCourierDialog,
    Pagination,
  },
  data() {
    return {
      selectCourierDialog: false,
    };
  },
  computed: {
    ...mapState('pickups', ['list', 'selected']),
  },
  methods: {
    ...mapActions('pickups', ['loadList', 'patchPickup', 'updatePickup']),
    loadPickups(query) {
      this.loadList({
        perPage: PER_PAGE_DEFAULT,
        page: query.page,
        pickupDate: query.pickupDate,
        courierId: query.courier,
      });
    },
    setCourier(courierId) {
      parallel(
        this.selected.map(id => {
          return callback => {
            this.patchPickup({
              id,
              params: { serviceInfo: { courierId } },
              callback: success => callback(!success),
            });
          };
        }),
        err => {
          this.selectCourierDialog = false;
          this.loadPickups(this.$route.query);

          if (!err) {
            this.$message({
              message: this.$tc('courierAreSet', this.selected.length > 1 ? 2 : 1),
              type: 'success',
            });
          }
        },
      );
    },
  },
  beforeRouteEnter(to, from, next) {
    next(vm => vm.loadPickups(to.query));
  },
  beforeRouteUpdate(to, from, next) {
    this.loadPickups(to.query);
    next();
  },
};
</script>
