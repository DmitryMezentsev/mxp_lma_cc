<template>
  <el-dialog
    :title="$t('ordersImport')"
    :visible.sync="visible"
    :close-on-press-escape="!waiting"
    :show-close="!waiting"
    :close-on-click-modal="!waiting"
    :width="clientWidth > 480 ? '450px' : '300px'"
    top="5vh"
  >
    <el-form :model="data" :rules="rules" ref="import">
      <el-form-item :label="$t('fileForUpload')" prop="file" required>
        <br />
        <InputFile
          :model.sync="data.file"
          :filename.sync="data.filename"
          :max-file-size="1024 * this.maxFileSize"
          :allowed-types="[
            'application/x-msexcel',
            'application/x-excel',
            'application/excel',
            'application/vnd.ms-excel',
            'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
          ]"
        />
        <div class="hint">
          {{
            $tc('fileFormatAndMaxSize', 1, {
              format: 'XLS / XLSX',
              maxSize: this.maxFileSize,
            })
          }}
        </div>
        <el-input v-model="data.file" name="file" class="hidden" />
      </el-form-item>
      <el-form-item :label="$t('template')" prop="template" required>
        <ImportTemplateSelect :model.sync="data.template" />
      </el-form-item>
      <div class="create-new-template">
        <router-link :to="{ name: 'ccOrdersAddImportTemplate' }" :disabled="waiting">
          {{ $t('createNewTemplate') }}
        </router-link>
      </div>
    </el-form>
    <span slot="footer" class="dialog-footer">
      <el-button @click="visible = false" :disabled="waiting">
        {{ $t('close') }}
      </el-button>
      <el-button type="primary" @click="upload" :loading="waiting">
        {{ $t('doImport') }}
      </el-button>
    </span>
  </el-dialog>
</template>

<script>
import { mapState, mapMutations, mapActions } from 'vuex';

import mixins from 'Common/js/mixins';
import InputFile from 'Components/form-elements/InputFile';
import ImportTemplateSelect from 'Components/form-elements/ImportTemplateSelect';

export default {
  name: 'CCImportDialog',
  mixins: [mixins],
  components: { InputFile, ImportTemplateSelect },
  data() {
    return {
      maxFileSize: 4,
      waiting: false,
      rules: {
        file: [this.validationRule('fileRequired')],
        template: [this.validationRule('selectRequired')],
      },
      data: {
        file: '',
        filename: '',
        template: null,
      },
    };
  },
  computed: {
    ...mapState('common', ['clientWidth']),
    ...mapState('import', ['importDialog']),
    visible: {
      get() {
        return !!this.importDialog;
      },
      set() {
        this.closeImportDialog();
      },
    },
  },
  methods: {
    ...mapMutations('import', ['closeImportDialog']),
    ...mapActions('import', ['import']),
    upload() {
      this.$refs.import.validate(valid => {
        if (valid) {
          this.waiting = true;

          this.import({
            data: this.data,
            callback: success => {
              this.waiting = false;

              if (success) {
                this.closeImportDialog();
                this.$emit('upload');
              }
            },
          });
        }
      });
    },
  },
  destroyed() {
    this.closeImportDialog();
  },
  watch: {
    importDialog(importDialog) {
      // Очистка формы при закрытии окна
      if (this.$refs.import && !importDialog) {
        this.$refs.import.resetFields();
        this.$nextTick(() => this.$refs.import.clearValidate());
      } else if (typeof importDialog === 'string') {
        // Был передан ID шаблона по умолчанию
        this.$nextTick(() => (this.data.template = importDialog)); // eslint-disable-line
      }
    },
    $route() {
      this.closeImportDialog();
    },
  },
};
</script>

<style lang="less" scoped>
.create-new-template {
  text-align: right;
  font-size: 0.75rem;
  margin-top: -20px;
}
</style>
