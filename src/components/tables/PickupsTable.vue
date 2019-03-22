<template>
    <el-table v-loading="loading"
              :data="data"
              :empty-text="$t(loading ? 'pleaseWait' : 'noPickups')"
              @selection-change="onSelectionChange">
        <el-table-column
                type="selection"
                width="55"
                key="col-selection">
        </el-table-column>
        <el-table-column
                key="col-number"
                :label="$t('number')">
            <template slot-scope="scope">
                <el-button type="text" @click="open(scope.$index)">
                    {{ scope.row.sender.internalNumber }}
                </el-button>
            </template>
        </el-table-column>
        <el-table-column
                v-if="width > 459"
                key="col-pickup-date"
                width="150">
            <template slot="header" slot-scope="scope">
                {{ $t('pickupDate') }}&nbsp;
                <el-tooltip :content="$t('clientTimezoneMsg')" placement="top">
                    <i class="far fa-question-circle"></i>
                </el-tooltip>
            </template>
            <template slot-scope="scope">
                <div>{{ scope.row.pickup.date }}</div>
                <div>{{ scope.row.pickup.time.from }} &ndash; {{ scope.row.pickup.time.to }}</div>
            </template>
        </el-table-column>
        <el-table-column
                v-if="width > 1359"
                property=""
                key="col-customer"
                :label="$t('customer')">
        </el-table-column>
        <el-table-column
                v-if="width > 1169"
                property=""
                key="col-warehouse"
                :label="$t('warehouse')">
        </el-table-column>
        <el-table-column
                v-if="width > 767"
                :label="$t('status')"
                key="col-status"
                property="">
        </el-table-column>
        <el-table-column
                v-if="width > 639"
                key="col-zone-and-courier"
                :label="$t('zone') + ' / ' + $t('courier')">
            <template slot-scope="scope">
                <div></div>
                <div></div>
            </template>
        </el-table-column>
    </el-table>
</template>

<script>
    import {mapActions} from 'vuex';

    import mixins from 'Common/js/mixins';

    export default {
        name: 'PickupsTable',
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
            ...mapActions('pickups', [
                'open',
                'select',
                'clearSelect',
            ]),
            onSelectionChange (selection) {
                const ids = selection.map(item => item.pickupId);
                this.select(ids);
            },
        },
        created () {
            this.bindClientWidth('width');
        },
        destroyed () {
            this.unbindClientWidth();
            this.clearSelect();
        },
    }
</script>

<style lang="less" scoped>

</style>