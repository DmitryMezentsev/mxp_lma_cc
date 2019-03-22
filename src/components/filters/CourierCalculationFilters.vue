<template>
    <el-form class="filters">
        <div class="filter">
            <el-form-item :label="$t('courier')">
                <CourierSelect :value.sync="filters.courier" />
            </el-form-item>
        </div>
        <div class="filter">
            <el-form-item :label="$t('date')">
                <el-date-picker
                        v-model="filters.date"
                        type="date"
                        :clearable="false"
                        :value-format="dateValueFormat"
                        :picker-options="{firstDayOfWeek: 1}">
                </el-date-picker>
            </el-form-item>
        </div>
        <el-button @click.prevent native-type="submit" class="hidden" />
    </el-form>
</template>

<script>
    import pick from 'lodash/pick';

    import mixins from 'Common/js/mixins';
    import {DATE_API_FORMAT} from 'Constants/config';
    import CourierSelect from 'Components/CourierSelect';

    export default {
        name: 'CourierCalculationFilters',
        components: {CourierSelect},
        mixins: [mixins],
        data () {
            return {
                filters: {
                    courier: null,
                    date: null,
                },
                dateValueFormat: DATE_API_FORMAT,
                removeAfterEach: null,
            }
        },
        methods: {
            loadFilterValues () {
                this.filters = pick(this.$route.query, ['courier', 'date']);
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