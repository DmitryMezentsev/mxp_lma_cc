<template>
    <el-input maxlength="8"
              :class="className"
              :name="name"
              :readonly="readonly"
              v-model="value"
              ref="input"
              @keypress.native="onKeyPress"
              @blur="onBlur">
        <template slot="append">{{ $t('kg') }}</template>
    </el-input>
</template>

<script>
    export default {
        name: 'WeightInput',
        props: {
            name: { type: String },
            className: { type: String },
            model: { type: [String, Number] },
            readonly: { type: Boolean },
        },
        data () {
            return {
                value: null,
            }
        },
        methods: {
            onBlur () {
                if (typeof this.value === 'string') {
                    this.value = parseFloat(this.value
                        .replace(/,/, '.')
                        .replace(/[^\d.]/ig, '')
                    );

                    if (isNaN(this.value)) this.value = null;
                }

                this.$emit('update:model', (this.value || this.value === 0)
                    ? Math.round(this.value * 1000)
                    : null);
            },
            onKeyPress ({key}) {
                if (key === 'Enter')
                    this.$refs.input.blur();
            },
        },
        watch: {
            model: {
                handler (model) {
                    model = parseFloat(model);

                    this.value = (model || model === 0)
                        ? model / 1000
                        : null;
                },
                immediate: true,
            },
        },
    }
</script>