<template>
    <div>
        <PickupsFilters />
        <br>
        <PickupsTable :data="list.data" />
        <br>
        <el-button v-if="list.data && list.data.length"
                   size="mini"
                   type="primary"
                   :disabled="!selected.length"
                   @click="selectCourierDialog = true">
            {{ $t('setCourier') }}
        </el-button>
        <Pagination :total="list.totalCount" :max-page="list.pageCount" />

        <PickupDialog @update="loadList($route.query)" />
        <SelectCourierDialog :visible="selectCourierDialog"
                             @select="setCourier"
                             @cancel="selectCourierDialog = false" />

    </div>
</template>

<script>
    import {parallel} from 'async';
    import {mapState, mapActions} from 'vuex';

    import {PER_PAGE_DEFAULT} from 'Constants/config';

    import PickupsFilters from 'Components/filters/PickupsFilters';
    import Pagination from 'Components/Pagination';
    import PickupsTable from 'Components/tables/PickupsTable';
    import SelectCourierDialog from 'Components/dialog/SelectCourierDialog';
    import PickupDialog from 'Components/dialog/PickupDialog';

    export default {
        name: 'PickupsPage',
        components: {PickupDialog, SelectCourierDialog, PickupsTable, Pagination, PickupsFilters},
        data () {
            return {
                selectCourierDialog: false,
            }
        },
        computed: {
            ...mapState('pickups', [
                'list',
                'selected',
            ]),
        },
        methods: {
            ...mapActions('pickups', [
                'getList',
                'patchPickup',
                'updatePickup',
            ]),
            loadList (query) {
                this.getList({
                    perPage: PER_PAGE_DEFAULT,
                    page: query.page,
                    pickupDate: query.pickupDate,
                    courierId: query.courier,
                });
            },
            setCourier (courierId) {
                parallel(this.selected.map(id => {
                    return callback => {
                        this.patchPickup({
                            id,
                            params: { serviceInfo: { courierId } },
                            callback: success => callback(!success),
                        });
                    }
                }), err => {
                    this.selectCourierDialog = false;
                    this.loadList(this.$route.query);

                    if (!err) {
                        this.$message({
                            message: this.$tc('courierAreSet', (this.selected.length > 1) ? 2 : 1),
                            type: 'success',
                        });
                    }
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