<template>
    <div class="filters">
        <h4>{{ $t('filters') }}</h4>

        <div class="filter">
            <el-date-picker
                    v-model="filters.date"
                    type="daterange"
                    range-separator="—"
                    :value-format="dateValueFormat"
                    :picker-options="{firstDayOfWeek: 1}"
                    :start-placeholder="$tc('from', 1) + '...'"
                    :end-placeholder="$tc('to', 1) + '...'">
            </el-date-picker>
        </div>
        <div class="filter">
            <el-select v-model="filters.status"
                       :clearable="true"
                       :placeholder="$t('all')">
                <el-option
                        v-for="(status, i) in statuses"
                        :key="i"
                        :label="status.name"
                        :value="status.id">
                </el-option>
            </el-select>
        </div>
    </div>
</template>

<script>
    import pick from 'lodash/pick';

    import mixins from '../../common/mixins';
    import {DATE_API_FORMAT} from '../../constants/config';

    export default {
        name: 'OrdersFilters',
        mixins: [mixins],
        data () {
            return {
                filters: {
                    date: null,
                    status: null,
                },

                dateValueFormat: DATE_API_FORMAT,

                removeAfterEach: null,

                statuses: [{ id: '1', name: 'Статус 1' }, { id: '2', name: 'Статус 2' }],
            }
        },
        methods: {
            loadFilterValues () {
                this.filters = pick(this.$router.currentRoute.query, ['date', 'status']);
            },
        },
        mounted () {
            this.loadFilterValues();
            this.removeAfterEach = this.$router.afterEach(() => this.loadFilterValues());
        },
        destroyed () {
            if (this.removeAfterEach) this.removeAfterEach();
        },
        watch: {
            filters: {
                handler (values) {
                    this.replaceRouteQueryParams(values);
                },
                deep: true,
            }
        },
    }
</script>

<style lang="less" scoped>
    .el-range-editor { width: 250px; }
</style>