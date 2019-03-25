<template>
    <el-form class="filters">
        <div class="filter">
            <el-form-item :label="$t('inArchive')">
                <el-switch v-model="filters.inArchive" />
            </el-form-item>
        </div>
        <el-button @click.prevent native-type="submit" class="hidden" />
    </el-form>
</template>

<script>
    import pick from 'lodash/pick';

    import {str2Bool} from 'Common/js/helpers';
    import mixins from 'Common/js/mixins';

    export default {
        name: 'RoutingZonesFilters',
        mixins: [mixins],
        data () {
            return {
                filters: {
                    inArchive: false,
                },
                removeAfterEach: null,
            }
        },
        computed: {
            preparedFilters: {
                get () {
                    return {
                        inArchive: this.filters.inArchive ? 'true' : null,
                    }
                },
                set (values) {
                    this.filters = {
                        inArchive: str2Bool(values.inArchive),
                    };
                },
            },
        },
        methods: {
            loadFilterValues () {
                this.preparedFilters = pick(this.$route.query, ['inArchive']);
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
            preparedFilters: {
                handler (preparedFilters) {
                    this.replaceRouteQueryParams(preparedFilters);
                },
                deep: true,
            }
        },
    }
</script>