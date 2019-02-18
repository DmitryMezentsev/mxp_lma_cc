<template>
    <div>
        <span class="value-label">{{ $t(name) }}: </span>
        <span v-if="!inner">
            <span v-if="isEmpty">&mdash;</span><span v-else>{{ value }}</span><span v-show="suffix"> {{ suffix }}</span><span v-show="dot">.</span>
        </span>
        <span v-else>
            <slot /><span v-show="dot">.</span>
        </span>
    </div>
</template>

<script>
    export default {
        name: 'Value',
        props: {
            name: { type: String, required: true },
            value: { type: [String, Number] },
            suffix: { type: String, default: '' },
            inner: { type: Boolean },
            dot: { type: Boolean, default: true },
        },
        computed: {
            isEmpty () {
                return this.value === null || this.value === '' || typeof this.value === 'undefined';
            },
        },
    }
</script>

<style lang="less" scoped>
    @import "../common/colors";

    .value-label {
        color: @secondary-text-color;
    }
</style>