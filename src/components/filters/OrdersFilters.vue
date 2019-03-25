<template>
    <el-form class="filters">
        <div class="filter delivery-date-filter">
            <el-form-item :label="$t('deliveryDate')">
                <DatePicker :model.sync="filters.deliveryDate"
                            :start-placeholder="$tc('from', 1) + '...'"
                            :end-placeholder="$tc('to', 1) + '...'"
                            type="daterange" />
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
    import StatusSelect from 'Components/form-elements/StatusSelect';
    import DatePicker from 'Components/DatePicker';

    export default {
        name: 'OrdersFilters',
        components: {DatePicker, StatusSelect},
        mixins: [mixins],
        data () {
            return {
                filters: {
                    deliveryDate: null,
                    status: null,
                },
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