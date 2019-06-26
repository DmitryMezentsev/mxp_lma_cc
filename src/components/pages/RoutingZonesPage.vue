<template>
  <div>
    <el-row type="flex" align="bottom">
      <el-col :span="12" :xs="9">
        <RoutingZonesFilters />
      </el-col>
      <el-col :span="12" :xs="15">
        <div class="text-right">
          <el-button type="primary" @click="createNewZone">
            {{ $t('newZone') }}
          </el-button>
        </div>
      </el-col>
    </el-row>
    <br />
    <RoutingZonesTable :data="zonesList.data" @update="loadZones($route.query)" />
    <Pagination :max-page="zonesList.pages" />

    <RoutingZoneDialog @update="loadZones($route.query)" />
  </div>
</template>

<script>
import { mapState, mapActions } from 'vuex';

import { PER_PAGE_DEFAULT } from 'Constants/config';
import Pagination from 'Components/Pagination';
import RoutingZonesTable from 'Components/tables/RoutingZonesTable';
import RoutingZoneDialog from 'Components/dialog/RoutingZoneDialog';
import RoutingZonesFilters from 'Components/filters/RoutingZonesFilters';

export default {
  name: 'RoutingZonesPage',
  components: { Pagination, RoutingZonesFilters, RoutingZonesTable, RoutingZoneDialog },
  computed: {
    ...mapState('routing', ['zonesList']),
  },
  methods: {
    ...mapActions('routing', ['loadZonesList', 'createNewZone']),
    loadZones(query) {
      this.loadZonesList({
        perPage: PER_PAGE_DEFAULT,
        fields: ['geoId', 'properties', 'type'],
        page: query.page,
        isOperating: !query.inArchive,
      });
    },
  },
  beforeRouteEnter(to, from, next) {
    next(vm => vm.loadZones(to.query));
  },
  beforeRouteUpdate(to, from, next) {
    this.loadZones(to.query);
    next();
  },
};
</script>
