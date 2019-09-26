<template>
  <div>
    <LMAPickupsFilters />
    <br />
    <LMAPickupsTable :data="list.data" />
    <Pagination :max-page="list.pages" />

    <LMAPickupDialog @update="loadPickups($route.query)" />
    <SelectCourierDialog
      :visible="selectCourierDialog"
      @select="setCourier"
      @cancel="selectCourierDialog = false"
    />

    <ActionsPanel :actions="actions" />
  </div>
</template>

<script>
import { mapState, mapMutations, mapActions } from 'vuex';
import { parallel } from 'async';

import { PER_PAGE_DEFAULT } from 'Constants/config';

import LMAPickupsFilters from 'Components/filters/LMA/LMAPickupsFilters';
import LMAPickupsTable from 'Components/tables/LMA/LMAPickupsTable';
import LMAPickupDialog from 'Components/dialog/LMA/LMAPickupDialog';
import Pagination from 'Components/Pagination';
import SelectCourierDialog from 'Components/dialog/SelectCourierDialog';
import ActionsPanel from 'Components/ActionsPanel';

export default {
  name: 'LMAPickupsPage',
  components: {
    ActionsPanel,
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
    actions() {
      if (this.selected.length) {
        return [
          [
            {
              name: this.$t('clearSelection'),
              btnType: 'default',
              callback: this.clearSelected,
              hideWidth: 459,
            },
            {
              name: this.$t('setCourier'),
              callback: () => {
                this.selectCourierDialog = true;
              },
            },
          ],
        ];
      }

      return null;
    },
  },
  methods: {
    ...mapMutations('pickups', ['clearSelected']),
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
              message: this.$t('courierAreSet'),
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
