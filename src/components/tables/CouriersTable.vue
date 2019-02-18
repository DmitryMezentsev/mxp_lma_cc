<template>
    <el-table v-loading="loading"
              :data="data"
              :empty-text="$t(loading ? 'pleaseWait' : 'noCouriers')">
        <el-table-column
                :label="$t('fullName')"
                key="col-fullname">
            <template slot-scope="scope">

            </template>
        </el-table-column>
        <el-table-column
                :label="$t('phones')"
                key="col-phones">
            <template slot-scope="scope">

            </template>
        </el-table-column>
        <el-table-column
                prop=""
                :label="$t('livingArea')"
                key="col-living-area">
        </el-table-column>
        <el-table-column
                width="110"
                key="col-actions">
            <template slot-scope="scope">

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