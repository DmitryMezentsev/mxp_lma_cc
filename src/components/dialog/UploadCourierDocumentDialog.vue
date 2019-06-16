<template>
    <el-dialog :title="$t('uploadDocument')"
               :visible.sync="visible"
               :width="clientWidth > 450 ? '420px' : '300px'">
        <el-form :model="document" ref="document" :rules="rules">
            <el-form-item :label="$t('documentType')" prop="type" required>
                <br>
                <el-select v-model="document.type" :placeholder="$tc('noSelect', 1)" name="type">
                    <el-option :label="$t('passport')" :value="DOCUMENT_TYPES.PASSPORT" />
                    <el-option :label="$t('vehiclePassport')" :value="DOCUMENT_TYPES.VEHICLE_PASSPORT" />
                    <el-option :label="$t('driversLicense')" :value="DOCUMENT_TYPES.DRIVERS_LICENSE" />
                </el-select>
            </el-form-item>
            <el-form-item :label="$t('fileForUpload')" prop="data" required>
                <br>
                <InputFile :model.sync="document.data"
                           :max-file-size="1024 * this.maxFileSize"
                           :allowed-types="['image/jpeg', 'image/png', 'image/tiff', 'application/pdf']" />
                <el-input v-model="document.data" name="data" class="hidden" />
                <div class="hint">
                    {{ $tc('fileFormatAndMaxSize', 1, { format: 'PNG / JPEG / TIFF / PDF', maxSize: this.maxFileSize }) }}
                </div>
            </el-form-item>
            <el-button @click.prevent="upload" native-type="submit" class="hidden" />
        </el-form>
        <span slot="footer" class="dialog-footer">
            <el-button @click="visible = false">{{ $t('cancel') }}</el-button>
            <el-button type="primary" @click="upload">{{ $t('upload') }}</el-button>
        </span>
    </el-dialog>
</template>

<script>
    import {mapState} from 'vuex';

    import DOCUMENT_TYPES from 'Constants/courier-document-types';
    import mixins from 'Common/js/mixins';
    import InputFile from 'Components/form-elements/InputFile';

    export default {
        name: 'UploadCourierDocumentDialog',
        mixins: [mixins],
        components: {InputFile},
        props: {
            opened: { type: Boolean, default: false },
        },
        data () {
            return {
                maxFileSize: 5,
                document: { type: null, data: '' },
                rules: {
                    type: [this.validationRule('selectRequired')],
                    data: [this.validationRule('fileRequired')],
                },
                DOCUMENT_TYPES,
            }
        },
        computed: {
            ...mapState('common', [
                'clientWidth',
            ]),
            visible: {
                get () { return this.opened; },
                set (visible) {
                    this.$emit('update:opened', visible);
                },
            },
        },
        methods: {
            upload () {
                this.$refs.document.validate(valid => {
                    if (valid) this.$emit('upload', { ...this.document });
                });
            },
        },
        watch: {
            visible (visible) {
                // Очистка формы при повторном открытии окна
                if (visible && this.$refs.document) {
                    this.$refs.document.resetFields();
                    this.$nextTick(() => {
                        this.$refs.document.clearValidate();
                    });
                }
            },
        },
    }
</script>