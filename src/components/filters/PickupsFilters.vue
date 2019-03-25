<template>
    <el-form class="filters">
        <div class="filter">
            <el-form-item :label="$t('courier')">
                <CourierSelect :model.sync="filters.courier"
                               :noSelectPlaceholder="$t('all')"
                               clearable />
            </el-form-item>
        </div>
        <div class="filter">
            <el-form-item :label="$t('date')">
                <DatePicker :model.sync="filters.pickupDate" />
            </el-form-item>
        </div>
        <el-button @click.prevent native-type="submit" class="hidden" />
    </el-form>
</template>

<script>
    import pick from 'lodash/pick';

    import mixins from 'Common/js/mixins';
    import CourierSelect from 'Components/form-elements/CourierSelect';
    import DatePicker from 'Components/DatePicker';

    export default {
        name: 'PickupsFilters',
        components: {DatePicker, CourierSelect},
        mixins: [mixins],
        data () {
            return {
                filters: {
                    courier: null,
                    pickupDate: null,
                },
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