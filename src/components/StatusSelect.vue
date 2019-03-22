<template>
    <el-select v-model="value"
               :no-data-text="$t('noStatuses')"
               :placeholder="placeholder"
               :loading="!statuses"
               clearable
               @change="onChange">
        <el-option
                v-for="(status, i) in statuses"
                :key="i"
                :label="status.name"
                :value="status.statusId">
        </el-option>
    </el-select>
</template>

<script>
    import api from '../common/js/api';

    export default {
        name: 'StatusSelect',
        props: {
            model: { type: String },
        },
        data () {
            return {
                value: null,
                statuses: null,
            }
        },
        computed: {
            placeholder () {
                return this.$t(this.statuses ? 'all' : 'loading');
            },
        },
        methods: {
            onChange () {
                this.$emit('update:model', this.value);
            },
        },
        created () {
            // todo: доделать, когда будет API
            this.statuses = [];
            // api.get('statuses')
            //     .then(({data}) => {
            //         this.statuses = data;
            //         this.value = this.model;
            //     });
        },
        watch: {
            model: {
                handler (model) {
                    if (this.statuses) this.value = model;
                },
                immediate: true,
            },
        },
    }
</script>