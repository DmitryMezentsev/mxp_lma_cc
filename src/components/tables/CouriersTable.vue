<template>
    <el-table v-loading="loading"
              :data="data"
              :empty-text="$t(loading ? 'pleaseWait' : 'noCouriers')"
              class="couriers-table">
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
                class-name="actions"
                key="col-actions">
            <template slot-scope="scope">
                <el-button-group>
                    <el-tooltip :content="$t('sendToArchive')" placement="left" v-if="scope.row.isActive">
                        <el-button type="danger" size="mini" @click="setCourierActive(scope.row.courierId, false)">
                            <i class="fas fa-archive"></i>
                        </el-button>
                    </el-tooltip>
                    <el-tooltip :content="$t('restore')" placement="left" v-else>
                        <el-button type="primary" size="mini" @click="setCourierActive(scope.row.courierId, true)">
                            <i class="fas fa-redo-alt"></i>
                        </el-button>
                    </el-tooltip>
                    <el-tooltip :content="$t('printBadge')" placement="top" v-if="scope.row.isActive">
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
    import {mapState, mapActions} from 'vuex';

    import mixins from 'Common/js/mixins';
    import {OTH_SERVER_PATH} from 'Common/js/env';

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
            ...mapState('auth', [
                'token',
            ]),
            loading () { return this.data === null; },
        },
        methods: {
            ...mapActions('couriers', [
                'patchCourier',
            ]),
            setCourierActive (id, active) {
                this.confirm(this.$t(active ? 'restoreCourierConfirmation' : 'toArchiveCourierConfirmation'), ok => {
                    if (ok) {
                        this.patchCourier({
                            id,
                            params: {isActive: active},
                            callback: success => {
                                if (success) this.$emit('update');
                            },
                        });
                    }
                });
            },
            printBadge (id) {
                const params = 'width=360,height=280,resizable=no,scrollbars=no,toolbar=no,location=no,menubar=no,status=no';
                window.open(`${OTH_SERVER_PATH}courier/badge/${id}?token=${this.token}`, 'courier-badge', params).print();
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

<style lang="less">
    .couriers-table {
        .el-table__row {
            .actions {
                .cell { text-align: right; }
            }
        }
    }
</style>