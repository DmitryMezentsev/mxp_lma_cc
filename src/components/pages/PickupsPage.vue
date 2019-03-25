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

        <PickupDialog @update="loadList" />
        <SelectCourierDialog :visible="selectCourierDialog"
                             @select="setCourier"
                             @cancel="selectCourierDialog = false" />

    </div>
</template>

<script>
    import {parallel} from 'async';
    import {mapState, mapActions} from 'vuex';
    import get from 'lodash/get';

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
                removeAfterEach: null,
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
            loadList () {
                this.getList({
                    perPage: PER_PAGE_DEFAULT,
                    page: get(this.$route.query, 'page'),
                    pickupDate: get(this.$route.query, 'pickupDate'),
                    courierId: get(this.$route.query, 'courier'),
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
                    this.loadList();

                    if (!err) {
                        this.$message({
                            message: this.$tc('courierAreSet', (this.selected.length > 1) ? 2 : 1),
                            type: 'success',
                        });
                    }
                });
            },
        },
        mounted () {
            this.loadList();

            this.removeAfterEach = this.$router.afterEach(to => {
                if (to.name === 'pickups') this.loadList();
            });
        },
        destroyed () {
            if (this.removeAfterEach) this.removeAfterEach();
        },
    }
</script>