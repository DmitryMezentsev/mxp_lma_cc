<template>
    <el-select v-model="value"
               :class="className"
               :placeholder="noSelectPlaceholder || $tc('noSelect', 1)"
               :loading="zones === null"
               :remote-method="remoteMethod"
               :clearable="clearable"
               :disabled="disabled"
               :multiple="multiple"
               :style="{ width }"
               :no-data-text="$t('zonesNotFound')"
               filterable
               remote
               @visible-change="onVisibleChange"
               @change="onChange">
        <el-option
                v-for="(zone, i) in zones"
                :key="i"
                :label="zone.properties.name"
                :value="zone.geoId" />
    </el-select>
</template>

<script>
    import {parallel} from 'async';

    import api from 'Common/js/api';

    export default {
        name: 'RoutingZoneSelect',
        props: {
            clearable: { type: Boolean },
            disabled: { type: Boolean },
            multiple: { type: Boolean },
            model: { type: [String, Array] },
            width: { type: String, default: '220px' },
            noSelectPlaceholder: { type: String },
            className: { type: String },
        },
        data () {
            return {
                value: this.multiple ? [] : null,
                zones: [],
            }
        },
        methods: {
            remoteMethod (name) {
                if (name) {
                    this.zones = null;

                    api.get('geo', {
                        params: {
                            fields: ['geoId', 'properties'],
                            name,
                        },
                    })
                        .then(({data}) => this.zones = data)
                        .catch(() => this.zones = []);
                }
            },
            onChange () {
                this.$emit('update:model', this.value);
            },
            onVisibleChange (visible) {
                if (!visible) this.zones = [];
            },
        },
        mounted () {
            this.$nextTick(() => {
                this.value = this.model;

                const ids = Array.isArray(this.model)
                    ? this.model
                    : this.model ? [this.model] : [];
                // Загрузка названий для выбранных изначально значений
                parallel(ids.map(id => {
                    return callback => {
                        api.get(`geo/${id}`).then(({data}) => callback(null, data));
                    }
                }), (err, zones) => {
                    this.zones = zones;
                    this.$nextTick(() => this.zones = []);
                });
            });
        },
        watch: {
            model (model) {
                this.value = model;
            },
        },
    }
</script>