<template>
    <el-form class="filters">
        <div class="filter">
            <el-form-item :label="$t('date')">
                <DatePicker name="date" :model="filters.date" @change="change" />
            </el-form-item>
        </div>
        <div class="filter">
            <el-form-item :label="$t('courier')">
                <CourierSelect name="courier"
                               :model="filters.courier"
                               :noSelectPlaceholder="$t('all')"
                               clearable
                               multiple
                               @change="change" />
            </el-form-item>
        </div>
        <div class="filter">
            <el-form-item :label="$t('status')">
                <StatusSelect name="status"
                              :model="filters.status"
                              :noSelectPlaceholder="$t('all')"
                              clearable
                              multiple
                              @change="change" />
            </el-form-item>
        </div>
        <div class="filter">
            <el-form-item :label="$t('zone')">
                <RoutingZoneSelect name="zone"
                                   :model="filters.zone"
                                   :noSelectPlaceholder="$t('all')"
                                   clearable
                                   multiple
                                   @change="change" />
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
        computed: {
            filters () {
                function getMultiple (val) {
                    if (!val) return [];

                    if (!Array.isArray(val))
                        val = [val];

                    return val;
                }

                return {
                    date: this.$route.query.date,
                    courier: getMultiple(this.$route.query.courier),
                    status: getMultiple(this.$route.query.status),
                    zone: getMultiple(this.$route.query.zone),
                };
            },
        },
        methods: {
            change ({name, value}) {
                this.replaceRouteQueryParams({ [name]: value });
            },
        },
    }
</script>

<style lang="less" scoped>
    .filters {
        display: flex;
        flex-wrap: wrap;

        .filter {

        }
    }
</style>