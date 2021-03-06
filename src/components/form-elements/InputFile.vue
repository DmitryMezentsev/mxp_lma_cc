<template>
  <span>
    <input type="file" @change="onFileSelect" />
    <el-button @click="browse">
      {{ buttonText || $t('browse') + '...' }}
    </el-button>
  </span>
</template>

<script>
import mixins from 'Common/js/mixins';
import { getMimeFromBase64 } from 'Common/js/helpers';

export default {
  name: 'InputFile',
  props: {
    model: { type: String, required: true },
    allowedTypes: { type: Array },
    maxFileSize: { type: Number }, // В Кб
    filename: { type: String },
  },
  mixins: [mixins],
  data() {
    return {
      buttonText: null,
    };
  },
  methods: {
    browse({ target }) {
      this.$el.querySelector('input[type=file]').click();
      target.blur();
    },
    onFileSelect({ target }) {
      const reader = new FileReader();

      reader.addEventListener(
        'load',
        () => {
          // Проверка размера файла
          if (this.maxFileSize) {
            const fileSize = (reader.result.length * 6) / 8 / 1024; // Размер в Кб
            if (fileSize > this.maxFileSize)
              return this.warning(
                this.$tc('fileTooLarge', 1, { maxSize: this.maxFileSize / 1024 }),
              );
          }

          // Проверка типа файла
          if (this.allowedTypes && this.allowedTypes.length) {
            const mime = getMimeFromBase64(reader.result);
            if (!this.allowedTypes.includes(mime)) return this.warning(this.$t('invalidFileType'));
          }

          // Все ок, обновление модели
          this.$emit('update:model', reader.result);
          // Установка имени файла на кнопку загрузки
          this.buttonText = target.files[0].name;
          // Отправка имени файла через API компонента
          this.$emit('update:filename', target.files[0].name);

          return true;
        },
        false,
      );

      reader.readAsDataURL(target.files[0]);
    },
  },
  watch: {
    model(model) {
      if (!model) this.buttonText = null;
    },
  },
};
</script>

<style lang="less" scoped>
span {
  font-size: 16px;

  button {
    overflow: hidden;
    text-overflow: ellipsis;
    max-width: 100%;
  }
}

input[type='file'] {
  display: none;
}
</style>
