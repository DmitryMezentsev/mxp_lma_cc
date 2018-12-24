<template>
    <el-table v-loading="loading"
              :data="data"
              :empty-text="$t('noActs')"
              class="service-acts-table">
        <el-table-column
                v-if="width > 579"
                prop=""
                :label="$t('client')"></el-table-column>
        <el-table-column
                v-if="width > 479"
                prop=""
                :label="$t('actNumber')"></el-table-column>
        <el-table-column
                v-if="width > 1099"
                prop=""
                :label="$t('date')"></el-table-column>
        <el-table-column
                v-if="width > 799"
                prop=""
                :label="$t('sum')"></el-table-column>
        <el-table-column :label="$t('documentReceiptDate')">
            <template slot-scope="scope">
                <div v-if="false"></div>
                <el-button type="text" @click="setDate(scope.row)" v-else>{{ $t('setDate') }}</el-button>
            </template>
        </el-table-column>
        <el-table-column width="100">
            <template slot-scope="scope">
                <div class="text-right">
                    <el-dropdown>
                        <span class="el-dropdown-link">
                            {{ $t('open') }}<i class="el-icon-arrow-down el-icon--right"></i>
                        </span>
                        <el-dropdown-menu slot="dropdown">
                            <el-dropdown-item @click="open(scope.row, 'act')">{{ $t('act') }}</el-dropdown-item>
                            <el-dropdown-item @click="open(scope.row, 'bill')">{{ $t('bill') }}</el-dropdown-item>
                            <el-dropdown-item @click="open(scope.row, 'invoice')">{{ $t('invoice') }}</el-dropdown-item>
                        </el-dropdown-menu>
                    </el-dropdown>
                </div>
            </template>
        </el-table-column>
    </el-table>
</template>

<script>
    import mixins from '../../common/mixins';

    export default {
        name: 'ServiceActsTable',
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
            setDate (act) {
                this.$emit('setDate', act);
            },
            open (act, documentType) {

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
    .service-acts-table {
        .el-button {
            &.el-button--text {
                padding-top: 0;
                padding-bottom: 0;
            }
        }
    }
</style>