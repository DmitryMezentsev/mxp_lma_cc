<template>
    <span>
        <input type="file" @change="onFileSelect">
        <el-button @click="browse">{{ $t('browse') }}...</el-button>
    </span>
</template>

<script>
    import mixins from '../common/js/mixins';

    export default {
        name: 'InputFile',
        props: {
            model: { type: String, required: true },
            allowedTypes: { type: Array },
            maxFileSize: { type: Number }, // В Кб
        },
        mixins: [mixins],
        methods: {
            browse ({target}) {
                this.$el.querySelector('input[type=file]').click();
                target.blur();
            },
            onFileSelect ({target}) {
                // Возвращает MIME-type из base64
                function getMimeFromBase64 (base64) {
                    const mime = base64.match(/data:([a-zA-Z0-9]+\/[a-zA-Z0-9-.+]+).*,.*/);
                    return (mime && mime.length) ? mime[1] : null;
                }

                let reader = new FileReader();

                reader.addEventListener('load', () => {
                    // Проверка размера файла
                    if (this.maxFileSize) {
                        const fileSize = reader.result.length * 6 / 8 / 1024; // Размер в Кб
                        if (fileSize > this.maxFileSize)
                            return this.warning(this.$tc('fileTooLarge', 1, { maxSize: this.maxFileSize / 1024 }));
                    }

                    // Проверка типа файла
                    if (this.allowedTypes && this.allowedTypes.length) {
                        const mime = getMimeFromBase64(reader.result);
                        if (!this.allowedTypes.includes(mime))
                            return this.warning(this.$t('invalidFileType'));
                    }

                    // Все ок, обновление модели
                    this.$emit('update:model', reader.result);
                }, false);

                reader.readAsDataURL(target.files[0]);
            },
        },
    }
</script>

<style lang="less" scoped>
    input[type=file] {
        display: none;
    }
</style>