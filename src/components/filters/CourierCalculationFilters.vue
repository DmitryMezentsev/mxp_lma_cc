<template>
    <el-form class="filters">
        <div class="filter">
            <el-form-item :label="$t('courier')">
                <el-select v-model="filters.courier"
                           :no-data-text="$t('noCouriers')"
                           :placeholder="$tc('noSelect', 1)"
                           :loading="!couriers"
                           filterable>
                    <el-option
                            v-for="(courier, i) in couriers"
                            :key="i"
                            :label="courier.name"
                            :value="courier.id">
                    </el-option>
                </el-select>
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
    </el-form>
</template>

<script>
    import pick from 'lodash/pick';

    import mixins from '../../common/mixins';
    import {DATE_API_FORMAT} from '../../constants/config';

    export default {
        name: 'CourierCalculationFilters',
        mixins: [mixins],
        data () {
            return {
                filters: {
                    courier: null,
                    date: null,
                },

                dateValueFormat: DATE_API_FORMAT,

                removeAfterEach: null,

                couriers: [{ id: '1', name: 'Вася' }, { id: '2', name: 'Паша' }],
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

<style lang="less" scoped>

</style>