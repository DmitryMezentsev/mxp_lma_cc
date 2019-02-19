<template>
    <el-table v-loading="loading"
              :data="data"
              :empty-text="$t(loading ? 'pleaseWait' : 'noCouriers')">
        <el-table-column
                :label="$t('fullName')"
                key="col-fullname">
            <template slot-scope="scope">
                <router-link :to="{ name: 'editCourier', params: { id: scope.row.courierId } }">
                    <el-button type="text">{{ scope.row.fullname }}</el-button>
                </router-link>
            </template>
        </el-table-column>
        <el-table-column
                :label="$t('phones')"
                v-if="width > 767"
                key="col-phones">
            <template slot-scope="scope">
                {{ scope.row.phone1 }}<span v-if="scope.row.phone2">, {{ scope.row.phone2 }}</span>
            </template>
        </el-table-column>
        <el-table-column
                prop="livingArea"
                :label="$t('livingArea')"
                v-if="width > 539"
                key="col-living-area">
        </el-table-column>
        <el-table-column
                width="110"
                key="col-actions">
            <template slot-scope="scope">
                <el-button-group>
                    <el-tooltip :content="$t('toArchive')"
                                placement="left"
                                v-if="scope.row.isActive"
                                @click="toArchive(scope.row.courierId)">
                        <el-button type="danger" size="mini">
                            <i class="fas fa-archive"></i>
                        </el-button>
                    </el-tooltip>
                    <el-tooltip :content="$t('restore')"
                                placement="left"
                                v-else
                                @click="restore(scope.row.courierId)">
                        <el-button type="primary" size="mini">
                            <i class="fas fa-redo-alt"></i>
                        </el-button>
                    </el-tooltip>
                    <el-tooltip :content="$t('printBadge')" placement="top">
                        <el-button type="primary" size="mini" @click="printBadge(scope.row.courierId)">
                            <i class="fas fa-id-badge"></i>
                        </el-button>
                    </el-tooltip>
                </el-button-group>
            </template>
        </el-table-column>
    </el-table>
</template>

<script>
    import {mapActions} from 'vuex';

    import mixins from '../../common/mixins';

    export default {
        name: 'CouriersTable',
        mixins: [mixins],
        props: {
            data: { type: Array },
        },
        data () {
            return {
                width: 0,
            }
        },
        computed: {
            loading () { return this.data === null; },
        },
        methods: {
            ...mapActions('couriers', [

            ]),
            toArchive (id) {

            },
            restore (id) {

            },
            printBadge (id) {

            },
        },
        created () {
            this.bindClientWidth('width');
        },
        destroyed () {
            this.unbindClientWidth();
        },
    }
</script>

<style lang="less" scoped>

</style>