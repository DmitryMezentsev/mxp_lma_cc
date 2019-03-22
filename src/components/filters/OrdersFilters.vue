<template>
    <el-form class="filters">
        <div class="filter delivery-date-filter">
            <el-form-item :label="$t('deliveryDate')">
                <el-date-picker
                        v-model="filters.deliveryDate"
                        type="daterange"
                        range-separator="—"
                        :value-format="dateValueFormat"
                        :picker-options="{firstDayOfWeek: 1}"
                        :start-placeholder="$tc('from', 1) + '...'"
                        :end-placeholder="$tc('to', 1) + '...'" />
            </el-form-item>
        </div>
        <div class="filter">
            <el-form-item :label="$t('status')">
                <StatusSelect :model.sync="filters.status"
                              :noSelectPlaceholder="$t('all')"
                              clearable />
            </el-form-item>
        </div>
        <el-button @click.prevent native-type="submit" class="hidden" />
    </el-form>
</template>

<script>
    import pick from 'lodash/pick';

    import mixins from 'Common/js/mixins';
    import {DATE_API_FORMAT} from 'Constants/config';
    import StatusSelect from 'Components/StatusSelect';

    export default {
        name: 'OrdersFilters',
        components: {StatusSelect},
        mixins: [mixins],
        data () {
            return {
                filters: {
                    deliveryDate: null,
                    status: null,
                },
                dateValueFormat: DATE_API_FORMAT,
                removeAfterEach: null,
            }
        },
        methods: {
            loadFilterValues () {
                this.filters = pick(this.$route.query, ['deliveryDate', 'status']);
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

    .delivery-date-filter {
        @media (max-width: 640px) { display: none; }
    }
</style>