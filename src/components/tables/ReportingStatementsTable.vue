<template>
    <el-table v-loading="loading"
              show-summary
              :summary-method="summaryMethod"
              :data="data"
              :empty-text="$t('noReports')">
        <el-table-column
                v-if="width > 399"
                prop=""
                :label="$t('client')">
        </el-table-column>
        <el-table-column
                v-if="width > 479"
                prop=""
                :label="$t('reportDate')">
        </el-table-column>
        <el-table-column
                v-if="width > 1199"
                prop=""
                :label="$t('creatingDate')">
        </el-table-column>
        <el-table-column
                v-if="width > 639"
                prop=""
                :label="$t('cod')">
        </el-table-column>
        <el-table-column
                v-if="width > 679"
                prop=""
                :label="$t('sumForServices')">
        </el-table-column>
        <el-table-column
                v-if="width > 799"
                prop=""
                :label="$t('deduction')">
        </el-table-column>
        <el-table-column
                v-if="width > 1099"
                prop=""
                :label="$t('payDate')">
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
    import mixins from '../../common/mixins';

    export default {
        name: 'ReportingStatementsTable',
        mixins: [mixins],
        props: {
            loading: { type: Boolean },
            data: { type: Array, required: true },
        },
        data () {
            return {
                width: 0,
            }
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