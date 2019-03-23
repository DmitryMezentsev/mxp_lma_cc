<template>
    <el-form class="filters">
        <div class="filter">
            <el-form-item :label="$t('courier')">
                <CourierSelect :model.sync="filters.courier" clearable />
            </el-form-item>
        </div>
        <div class="filter">
            <el-form-item :label="$t('date')">
                <el-date-picker
                        v-model="filters.pickupDate"
                        type="date"
                        :value-format="dateValueFormat"
                        :picker-options="{firstDayOfWeek: 1}" />
            </el-form-item>
        </div>
        <el-button @click.prevent native-type="submit" class="hidden" />
    </el-form>
</template>

<script>
    import pick from 'lodash/pick';

    import mixins from 'Common/js/mixins';
    import {DATE_API_FORMAT} from 'Constants/config';
    import CourierSelect from 'Components/form-elements/CourierSelect';

    export default {
        name: 'PickupsFilters',
        components: {CourierSelect},
        mixins: [mixins],
        data () {
            return {
                filters: {
                    courier: null,
                    pickupDate: null,
                },
                dateValueFormat: DATE_API_FORMAT,
                removeAfterEach: null,
            }
        },
        methods: {
            loadFilterValues () {
                this.filters = pick(this.$route.query, ['pickupDate', 'courier']);
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