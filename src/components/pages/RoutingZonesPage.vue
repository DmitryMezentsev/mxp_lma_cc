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
        <br>
        <RoutingZonesTable :data="list.data" @update="loadList($route.query)" />
        <Pagination :total="list.totalCount" :max-page="list.pageCount" />

        <RoutingZoneDialog @update="loadList($route.query)" />
    </div>
</template>

<script>
    import {mapState, mapActions} from 'vuex';

    import {PER_PAGE_DEFAULT} from 'Constants/config';
    import Pagination from 'Components/Pagination';
    import RoutingZonesTable from 'Components/tables/RoutingZonesTable';
    import RoutingZoneDialog from 'Components/dialog/RoutingZoneDialog';
    import RoutingZonesFilters from 'Components/filters/RoutingZonesFilters';

    export default {
        name: 'RoutingZonesPage',
        components: {Pagination, RoutingZonesFilters, RoutingZonesTable, RoutingZoneDialog},
        computed: {
            ...mapState('geo', [
                'list',
            ]),
        },
        methods: {
            ...mapActions('geo', [
                'getList',
                'createNewZone',
            ]),
            loadList (query) {
                this.getList({
                    perPage: PER_PAGE_DEFAULT,
                    fields: ['geoId', 'properties', 'type'],
                    page: query.page,
                    isOperating: !query.inArchive,
                });
            },
        },
        beforeRouteEnter (to, from, next) {
            next(vm => vm.loadList(to.query));
        },
        beforeRouteUpdate (to, from, next) {
            this.loadList(to.query);
            next();
        },
    }
</script>