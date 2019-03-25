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
            <CouriersTable :data="list.data" @update="loadList" />
            <Pagination :total="list.totalCount" :max-page="list.pageCount" />
        </div>

        <router-view />
    </div>
</template>

<script>
    import {mapState, mapActions} from 'vuex';

    import {PER_PAGE_DEFAULT} from 'Constants/config';
    import CouriersFilters from 'Components/filters/CouriersFilters';
    import CouriersTable from 'Components/tables/CouriersTable';
    import Pagination from 'Components/Pagination';

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
                    fields: ['courierId', 'fullname', 'phone1', 'phone2', 'livingArea', 'isActive'],
                    page: this.$route.query.page,
                    fullname: this.$route.query.fullname,
                    isActive: !this.$route.query.inArchive,
                });
            },
        },
        mounted () {
            if (this.$route.name === 'couriers')
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