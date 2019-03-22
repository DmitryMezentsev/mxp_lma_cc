<template>
    <el-form class="filters">
        <div class="filter hidden-xs-only">
            <el-form-item :label="$t('fullName')">
                <el-input v-model="filters.fullname" clearable></el-input>
            </el-form-item>
        </div>
        <div class="filter">
            <el-form-item :label="$t('inArchive')">
                <el-switch v-model="filters.inArchive"></el-switch>
            </el-form-item>
        </div>
        <el-button @click.prevent native-type="submit" class="hidden" />
    </el-form>
</template>

<script>
    import debounce from 'lodash/debounce';
    import pick from 'lodash/pick';

    import {str2Bool} from 'Common/js/helpers';
    import mixins from 'Common/js/mixins';

    export default {
        name: 'CouriersFilters',
        mixins: [mixins],
        data () {
            return {
                filters: {
                    fullname: null,
                    inArchive: false,
                },
                removeAfterEach: null,
            }
        },
        computed: {
            preparedFilters: {
                get () {
                    return {
                        fullname: this.filters.fullname,
                        inArchive: this.filters.inArchive ? 'true' : null,
                    }
                },
                set (values) {
                    this.filters = {
                        fullname: values.fullname || null,
                        inArchive: str2Bool(values.inArchive),
                    };
                },
            },
        },
        methods: {
            loadFilterValues () {
                this.preparedFilters = pick(this.$route.query, ['fullname', 'inArchive']);
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
                handler: debounce(function (values) {
                    this.replaceRouteQueryParams(values);
                }, 400),
                deep: true,
            }
        },
    }
</script>