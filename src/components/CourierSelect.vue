<template>
    <el-select v-model="value"
               :no-data-text="$t('noCouriers')"
               :placeholder="placeholder"
               :loading="!couriers"
               :clearable="clearable"
               :disabled="disabled"
               :style="{ width: width + 'px' }"
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
    import api from '../common/js/api';

    export default {
        name: 'CourierSelect',
        props: {
            clearable: { type: Boolean },
            disabled: { type: Boolean },
            model: { type: String },
            width: { type: Number, default: 220 }
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