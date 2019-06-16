<template>
    <el-form class="filters">
        <div class="filter">
            <el-form-item :label="$t('date')">
                <DatePicker :model.sync="filters.date" />
            </el-form-item>
        </div>
        <div class="filter">
            <el-form-item :label="$t('courier')">
                <CourierSelect :model.sync="filters.courier"
                               :noSelectPlaceholder="$t('all')"
                               clearable
                               multiple />
            </el-form-item>
        </div>
        <div class="filter">
            <el-form-item :label="$t('status')">
                <StatusSelect :model.sync="filters.status"
                              :noSelectPlaceholder="$t('all')"
                              clearable
                              multiple />
            </el-form-item>
        </div>
        <div class="filter">
            <el-form-item :label="$t('zone')">
                <RoutingZoneSelect :model.sync="filters.zone"
                                   :noSelectPlaceholder="$t('all')"
                                   clearable
                                   multiple />
            </el-form-item>
        </div>
        <el-button @click.prevent native-type="submit" class="hidden" />
    </el-form>
</template>

<script>
    import mixins from 'Common/js/mixins';
    import CourierSelect from 'Components/form-elements/CourierSelect';
    import DatePicker from 'Components/DatePicker';
    import StatusSelect from 'Components/form-elements/StatusSelect';
    import RoutingZoneSelect from 'Components/form-elements/RoutingZoneSelect';

    export default {
        name: 'RoutingMapFilters',
        components: {StatusSelect, DatePicker, CourierSelect, RoutingZoneSelect},
        mixins: [mixins],
        data () {
            return {
                filters: {
                    date: null,
                    courier: [],
                    status: [],
                    zone: [],
                },
                removeAfterEach: null,
            }
        },
        methods: {
            loadFilterValues () {
                function getMultiple (val) {
                    if (!val) return [];

                    if (!Array.isArray(val))
                        val = [val];

                    return val;
                }

                this.filters = {
                    date: this.$route.query.date,
                    courier: getMultiple(this.$route.query.courier),
                    status: getMultiple(this.$route.query.status),
                    zone: getMultiple(this.$route.query.zone),
                };
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

</style>