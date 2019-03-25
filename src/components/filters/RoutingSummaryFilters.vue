<template>
    <el-form class="filters">
        <div class="filter">
            <el-form-item :label="$t('date')">
                <DatePicker :model.sync="filters.date" :clearable="false" />
            </el-form-item>
        </div>
        <el-button @click.prevent native-type="submit" class="hidden" />
    </el-form>
</template>

<script>
    import pick from 'lodash/pick';

    import mixins from 'Common/js/mixins';
    import DatePicker from 'Components/DatePicker';

    export default {
        name: 'RoutingSummaryFilters',
        components: {DatePicker},
        mixins: [mixins],
        data () {
            return {
                filters: {
                    date: null,
                },
                removeAfterEach: null,
            }
        },
        methods: {
            loadFilterValues () {
                this.filters = pick(this.$route.query, ['date']);
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