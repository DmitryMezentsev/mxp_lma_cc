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
        <RoutingZonesTable :data="list.data" @update="loadList" />
        <Pagination :total="list.totalCount" :max-page="list.pageCount" />

        <RoutingZoneDialog @update="loadList" />
    </div>
</template>

<script>
    import {mapState, mapActions} from 'vuex';
    import get from 'lodash/get';

    import {PER_PAGE_DEFAULT} from 'Constants/config';
    import Pagination from 'Components/Pagination';
    import RoutingZonesTable from 'Components/tables/RoutingZonesTable';
    import RoutingZoneDialog from 'Components/dialog/RoutingZoneDialog';
    import RoutingZonesFilters from 'Components/filters/RoutingZonesFilters';

    export default {
        name: 'RoutingZonesPage',
        components: {Pagination, RoutingZonesFilters, RoutingZonesTable, RoutingZoneDialog},
        data () {
            return {
                removeAfterEach: null,
                page: this.$route.name,
            }
        },
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
            loadList () {
                this.getList({
                    perPage: PER_PAGE_DEFAULT,
                    fields: ['geoId', 'properties', 'type'],
                    page: get(this.$route.query, 'page'),
                    isOperating: !get(this.$route.query, 'inArchive'),
                });
            },
        },
        mounted () {
            this.loadList();

            this.removeAfterEach = this.$router.afterEach(to => {
                this.page = to.name;
                if (to.name === 'routingZones') this.loadList();
            });
        },
        destroyed () {
            if (this.removeAfterEach) this.removeAfterEach();
        },
    }
</script>