<template>
    <el-table v-loading="loading"
              show-summary
              :summary-method="summaryMethod"
              :data="data"
              :empty-text="$t('noReports')">
        <el-table-column
                v-if="width > 399"
                prop=""
                :label="$t('client')"
                key="col-client" />
        <el-table-column
                v-if="width > 479"
                :label="$t('reportDate')"
                key="col-report-date">
            <template slot-scope="scope">

            </template>
        </el-table-column>
        <el-table-column
                v-if="width > 1199"
                :label="$t('creatingDate')"
                key="col-creating-date">
            <template slot-scope="scope">

            </template>
        </el-table-column>
        <el-table-column
                v-if="width > 639"
                :label="$t('cod')"
                key="col-cod">
            <template slot-scope="scope">

            </template>
        </el-table-column>
        <el-table-column
                v-if="width > 679"
                :label="$t('sumForServices')"
                key="col-sum-for-services">
            <template slot-scope="scope">

            </template>
        </el-table-column>
        <el-table-column
                v-if="width > 799"
                :label="$t('deduction')"
                key="col-deduction">
            <template slot-scope="scope">

            </template>
        </el-table-column>
        <el-table-column
                v-if="width > 1099"
                :label="$t('payDate')"
                key="col-pay-date">
            <template slot-scope="scope">

            </template>
        </el-table-column>
        <el-table-column :label="$t('report')">
            <template slot-scope="scope">
                <el-button type="text" @click="openReport(scope.row)">
                    ---
                </el-button>
            </template>
        </el-table-column>
    </el-table>
</template>

<script>
    import mixins from 'Common/js/mixins';

    export default {
        name: 'ReportingStatementsTable',
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
            summaryMethod () {
                return [this.$t('paySum'), null, null, 0, 0, 0];
            },
            openReport (row) {

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