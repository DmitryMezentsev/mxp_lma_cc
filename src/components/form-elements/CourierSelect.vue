<template>
    <el-select v-model="value"
               :class="className"
               :no-data-text="$t('noCouriers')"
               :placeholder="placeholder"
               :loading="!couriers"
               :clearable="clearable"
               :disabled="disabled"
               :style="{ width }"
               filterable
               @change="onChange">
        <el-option
                v-for="(courier, i) in couriers"
                :key="i"
                :label="courier.fullname"
                :value="courier.courierId" />
    </el-select>
</template>

<script>
    import api from 'Common/js/api';

    export default {
        name: 'CourierSelect',
        props: {
            clearable: { type: Boolean },
            disabled: { type: Boolean },
            model: { type: String },
            width: { type: String, default: '220px' },
            className: { type: String },
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
            api.get('courier', {
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