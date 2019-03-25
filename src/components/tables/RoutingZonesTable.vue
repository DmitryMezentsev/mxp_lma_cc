<template>
    <el-table v-loading="loading"
              :data="data"
              :empty-text="$t(loading ? 'pleaseWait' : 'noZones')">
        <el-table-column
                :label="$tc('name', 0)"
                key="col-name">
            <template slot-scope="scope">
                <el-button type="text" @click="edit(scope.row.geoId)">
                    {{ scope.row.properties.name }}
                </el-button>
            </template>
        </el-table-column>
        <el-table-column align="right" width="65" key="col-actions">
            <template slot-scope="scope">
                <el-tooltip :content="$t('sendToArchive')" placement="left" v-if="scope.row.properties.isOperating">
                    <el-button type="danger" size="mini" @click="setZoneActive(scope.row.geoId, false)">
                        <i class="fas fa-archive"></i>
                    </el-button>
                </el-tooltip>
                <el-tooltip :content="$t('restore')" placement="left" v-else>
                    <el-button type="primary" size="mini" @click="setZoneActive(scope.row.geoId, true)">
                        <i class="fas fa-redo-alt"></i>
                    </el-button>
                </el-tooltip>
            </template>
        </el-table-column>
    </el-table>
</template>

<script>
    import {mapActions} from 'vuex';

    import mixins from 'Common/js/mixins';

    export default {
        name: 'RoutingZonesTable',
        mixins: [mixins],
        props: {
            data: { type: Array },
        },
        computed: {
            loading () { return this.data === null; },
        },
        methods: {
            ...mapActions('geo', [
                'edit',
                'patchZone',
            ]),
            setZoneActive (id, isOperating) {
                this.confirm(this.$t(isOperating ? 'restoreZoneConfirmation' : 'toArchiveZoneConfirmation'), ok => {
                    if (ok) {
                        this.patchZone({
                            id,
                            params: { properties: { isOperating } },
                            callback: success => {
                                if (success) this.$emit('update');
                            },
                        });
                    }
                });
            },
        },
    }
</script>

<style lang="less" scoped>

</style>