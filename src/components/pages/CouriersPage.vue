<template>
    <div>
        <div v-if="page === 'couriers'">
            <el-row type="flex" align="bottom">
                <el-col :span="12" :xs="9">
                    <CouriersFilters />
                </el-col>
                <el-col :span="12" :xs="15">
                    <div class="text-right">
                        <router-link :to="{ name: 'addCourier' }">
                            <el-button type="primary">{{ $t('addCourier') }}</el-button>
                        </router-link>
                    </div>
                </el-col>
            </el-row>
            <br>
            <CouriersTable :data="list.data" />
            <Pagination :total="list.totalCount" :max-page="list.pageCount" />
        </div>

        <router-view />
    </div>
</template>

<script>
    import {mapState, mapActions} from 'vuex';
    import get from 'lodash/get';

    import {PER_PAGE_DEFAULT} from '../../constants/config';

    import CouriersFilters from '../filters/CouriersFilters';
    import CouriersTable from '../tables/CouriersTable';
    import Pagination from '../Pagination';

    export default {
        name: 'CouriersPage',
        components: {CouriersFilters, CouriersTable, Pagination},
        data () {
            return {
                removeAfterEach: null,
                page: this.$route.name,
            }
        },
        computed: {
            ...mapState('couriers', [
                'list',
            ]),
        },
        methods: {
            ...mapActions('couriers', [
                'getList',
            ]),
            loadList () {
                this.getList({
                    perPage: PER_PAGE_DEFAULT,
                    page: get(this.$route.query, 'page'),
                    fullname: get(this.$route.query, 'fullname'),
                    isActive: !get(this.$route.query, 'inArchive'),
                });
            },
        },
        mounted () {
            this.loadList();

            this.removeAfterEach = this.$router.afterEach(to => {
                this.page = to.name;
                if (to.name === 'couriers') this.loadList();
            });
        },
        destroyed () {
            if (this.removeAfterEach) this.removeAfterEach();
        },
    }
</script>