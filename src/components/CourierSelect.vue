<template>
    <el-select v-model="value"
               :no-data-text="$t('noCouriers')"
               :placeholder="placeholder"
               :loading="!couriers"
               :clearable="clearable"
               :disabled="disabled"
               filterable
               @change="onChange">
        <el-option
                v-for="(courier, i) in couriers"
                :key="i"
                :label="courier.fullname"
                :value="courier.courierId">
        </el-option>
    </el-select>
</template>

<script>
    import axios from 'axios';

    export default {
        name: 'CourierSelect',
        props: {
            clearable: { type: Boolean },
            disabled: { type: Boolean },
            model: { type: String },
        },
        data () {
            return {
                value: null,
                couriers: null,
            }
        },
        computed: {
            placeholder () {
                return this.couriers
                    ? this.$tc('noSelect', 1)
                    : this.$t('loading');
            },
        },
        methods: {
            onChange () {
                this.$emit('update:model', this.value);
            },
        },
        created () {
            axios.get('courier', {
                params: { perPage: 0 },
            })
                .then(({data}) => {
                    this.couriers = data;
                    this.value = this.model;
                });
        },
        watch: {
            model: {
                handler (model) {
                    if (this.couriers) this.value = model;
                },
                immediate: true,
            },
        },
    }
</script>