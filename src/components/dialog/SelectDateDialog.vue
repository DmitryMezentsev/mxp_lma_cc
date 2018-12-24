<template>
    <el-dialog :title="$t(title)"
               :visible.sync="visible"
               :width="width > 450 ? '400px' : '300px'">
        <div class="date-select-wrap">
            <el-alert v-show="error" type="error" :title="$t('dateNotSelected')" :closable="false" show-icon></el-alert>
            <el-date-picker v-model="date" type="date" :value-format="format" :clearable="false"></el-date-picker>
        </div>
        <span slot="footer" class="dialog-footer">
            <el-button @click="close">{{ $t('close') }}</el-button>
            <el-button type="primary" @click="save">{{ $t('done') }}</el-button>
        </span>
    </el-dialog>
</template>

<script>
    import {DATE_API_FORMAT} from '../../constants/config';

    import mixins from '../../common/mixins';

    export default {
        name: 'SelectDateDialog',
        mixins: [mixins],
        props: {
            title: { type: String, required: true },
        },
        data () {
            return {
                width: 0,
                date: null,
                error: false,
                format: DATE_API_FORMAT,
            }
        },
        computed: {
            visible: {
                get () { return true; },
                set () { this.close(); },
            },
        },
        methods: {
            save () {
                if (this.date) {
                    this.$emit('select', this.date);
                } else {
                    this.error = true;
                }
            },
            close () {
                this.$emit('close');
            },

        },
        mounted () {
            setTimeout(() => document.querySelector('.date-select-wrap input').focus(), 250);
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
    .date-select-wrap {
        text-align: center;

        .el-alert {
            &.el-alert--error {
                margin-bottom: 1em;
            }
        }
    }
</style>