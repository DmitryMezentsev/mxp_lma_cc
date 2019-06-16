<template>
    <el-form class="filters">
        <div class="filter">
            <el-form-item :label="$t('date')">
                <DatePicker name="date" :model="filters.date" :clearable="false" @change="change" />
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
        computed: {
            filters () {
                return pick(this.$route.query, ['date']);
            },
        },
        methods: {
            change ({name, value}) {
                this.replaceRouteQueryParams({ [name]: value });
            },
        },
    }
</script>