<template>
    <el-select v-model="value"
               :no-data-text="$t('noStatuses')"
               :placeholder="placeholder"
               :loading="!statuses"
               :clearable="clearable"
               :disabled="disabled"
               :style="{ width: width + 'px' }"
               @change="onChange">
        <el-option
                v-for="(status, i) in statuses"
                :key="i"
                :label="status.name"
                :value="status.id">
        </el-option>
    </el-select>
</template>

<script>
    import api from 'Common/js/api';

    export default {
        name: 'StatusSelect',
        props: {
            clearable: { type: Boolean },
            disabled: { type: Boolean },
            model: { type: [String, Number] },
            width: { type: Number, default: 220 },
            noSelectPlaceholder: { type: String },
            type: { type: String, default: 'order' },
        },
        data () {
            return {
                value: null,
                statuses: null,
            }
        },
        computed: {
            placeholder () {
                return this.statuses
                    ? this.noSelectPlaceholder || this.$tc('noSelect', 1)
                    : this.$t('loading');
            },
        },
        methods: {
            onChange () {
                this.$emit('update:model', this.value);
            },
        },
        created () {
            api.get(`statuses/${this.type}`)
                .then(({data}) => {
                    this.statuses = data;
                    this.value = this.model;
                });
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