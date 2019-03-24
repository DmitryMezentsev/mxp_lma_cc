<template>
    <el-row :gutter="10">
        <el-col :span="8" :xs="24">
            <el-form-item :label="$t('width')" :prop="widthPropName" :required="required">
                <el-input type="number"
                          :min="min"
                          :max="max"
                          v-model="widthInternal"
                          :class="className"
                          :name="widthPropName"
                          :readonly="readonly"
                          @keypress.native="onKeyPress"
                          @blur="onBlur('width')">
                    <template slot="append">{{ $t('cm') }}</template>
                </el-input>
            </el-form-item>
        </el-col>
        <el-col :span="8" :xs="24">
            <el-form-item :label="$t('height')" :prop="heightPropName" :required="required">
                <el-input type="number"
                          :min="min"
                          :max="max"
                          v-model="heightInternal"
                          :class="className"
                          :name="heightPropName"
                          :readonly="readonly"
                          @keypress.native="onKeyPress"
                          @blur="onBlur('height')">
                    <template slot="append">{{ $t('cm') }}</template>
                </el-input>
            </el-form-item>
        </el-col>
        <el-col :span="8" :xs="24">
            <el-form-item :label="$t('length')" :prop="lengthPropName" :required="required">
                <el-input type="number"
                          :min="min"
                          :max="max"
                          v-model="lengthInternal"
                          :class="className"
                          :name="lengthPropName"
                          :readonly="readonly"
                          @keypress.native="onKeyPress"
                          @blur="onBlur('length')">
                    <template slot="append">{{ $t('cm') }}</template>
                </el-input>
            </el-form-item>
        </el-col>
    </el-row>
</template>

<script>
    export default {
        name: 'DimensionsInput',
        props: {
            className: { type: String },
            readonly: { type: Boolean },
            required: { type: Boolean },

            min: { type: Number, default: 1 },
            max: { type: Number, default: 9999999 },

            width: { type: Number },
            height: { type: Number },
            length: { type: Number },

            widthPropName: { type: String },
            heightPropName: { type: String },
            lengthPropName: { type: String },
        },
        computed: {
            widthInternal: {
                get () {
                    return this.width;
                },
                set (width) {
                    this.update('width', width);
                },
            },
            heightInternal: {
                get () {
                    return this.height;
                },
                set (height) {
                    this.update('height', height);
                },
            },
            lengthInternal: {
                get () {
                    return this.length;
                },
                set (length) {
                    this.update('length', length);
                },
            },
        },
        methods: {
            update (name, val) {
                this.$emit(`update:${name}`, val ? Number(val) : null);
            },
            onKeyPress (e) {
                // Зарпет ввода нечисловых символов
                if (!Number(e.key) && Number(e.key) !== 0)
                    e.preventDefault();
            },
            onBlur (prop) {
                const name = `${prop}Internal`;

                if (this[name] || this[name] === 0) {
                    if (this[name] > this.max) this[name] = this.max;
                    else if (this[name] < this.min) this[name] = this.min;
                }
            },
        },
    }
</script>