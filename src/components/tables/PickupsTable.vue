<template>
    <el-table v-loading="loading"
              :data="data"
              :empty-text="$t(loading ? 'pleaseWait' : 'noPickups')"
              @selection-change="onSelectionChange">
        <el-table-column
                type="selection"
                width="55"
                key="col-selection" />
        <el-table-column
                key="col-number"
                :label="$t('orderNumberInCompanyOrShop')">
            <template slot-scope="scope">
                <el-button type="text" @click="open(scope.$index)">
                    {{ scope.row.logist.internalNumber }} /
                    {{ scope.row.sender.internalNumber }}
                </el-button>
            </template>
        </el-table-column>
        <el-table-column
                v-if="clientWidth > 459"
                key="col-pickup-date"
                width="150">
            <template slot="header" slot-scope="scope">
                {{ $t('pickupDate') }}&nbsp;
                <el-tooltip :content="$t('clientTimezoneMsg')" placement="top">
                    <i class="far fa-question-circle"></i>
                </el-tooltip>
            </template>
            <template slot-scope="scope">
                <FormattedDate :date="scope.row.pickup.date" />
                <div>{{ scope.row.pickup.time.from }} &ndash; {{ scope.row.pickup.time.to }}</div>
            </template>
        </el-table-column>
        <el-table-column
                v-if="clientWidth > 1359"
                property="sender.name"
                key="col-customer"
                :label="$t('customer')" />
        <el-table-column
                v-if="clientWidth > 1169"
                property="sender.warehouseName"
                key="col-warehouse"
                :label="$t('warehouse')" />
        <el-table-column
                v-if="clientWidth > 767"
                :label="$t('status')"
                key="col-status"
                property="serviceInfo.statusName" />
        <el-table-column
                v-if="clientWidth > 639"
                key="col-zone-and-courier"
                :label="$t('zone') + ' / ' + $t('courier')">
            <template slot-scope="scope">
                <div>{{ scope.row.serviceInfo.zoneName }}</div>
                <div>{{ scope.row.serviceInfo.courierName }}</div>
            </template>
        </el-table-column>
    </el-table>
</template>

<script>
    import {mapState, mapActions} from 'vuex';

    import FormattedDate from 'Components/FormattedDate';

    export default {
        name: 'PickupsTable',
        components: {FormattedDate},
        props: {
            data: { type: Array },
        },
        computed: {
            ...mapState('common', [
                'clientWidth',
            ]),
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
        destroyed () {
            this.clearSelect();
        },
    }
</script>

<style lang="less" scoped>

</style>