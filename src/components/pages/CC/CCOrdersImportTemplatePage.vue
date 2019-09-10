<template>
  <div>
    <div v-if="template">
      <div v-if="!template.file" class="select-file">
        <div class="file-icon">
          <fa-icon icon="file-excel" />
        </div>
        <div class="input-label">{{ $t('selectXlsxFile') }}</div>
        <InputFile
          :model.sync="template.file"
          :filename.sync="template.filename"
          :max-file-size="4096"
          :allowed-types="[
            'application/x-msexcel',
            'application/x-excel',
            'application/excel',
            'application/vnd.ms-excel',
            'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
          ]"
        />
      </div>
      <div v-else>
        <el-form class="actions-form-wrap" ref="template" :model="template" :rules="rules">
          <el-form-item class="name-input" :label="$tc('name', 0)" prop="name" required>
            <el-input v-model="template.name" name="name" />
          </el-form-item>
          <h4>{{ $t('fieldMappingSettings') }}</h4>
          <div class="data-from-file">
            {{ $t('dataFromFile') }}
            <span class="link" @click="openFile">{{ template.filename }}</span>
          </div>
          <el-table :data="fields" class="mapping-table">
            <el-table-column :label="$t('needField')" key="col-need-field">
              <template slot-scope="scope">
                {{ $t(`orderImportFields.${scope.row}`) }}
              </template>
            </el-table-column>
            <el-table-column :label="$t('fieldFromFile')" key="col-file-field">
              <template slot-scope="scope">
                <el-form-item :prop="`template.${scope.row}`" required>
                  <el-select v-model="template.template[scope.row]" :name="`template.${scope.row}`">
                    <el-option
                      v-for="(field, i) in fileData"
                      :key="i"
                      :value="i"
                      :label="field.title"
                    />
                  </el-select>
                </el-form-item>
              </template>
            </el-table-column>
            <el-table-column
              :label="$t('valueExamples')"
              key="col-file-examples"
              v-if="clientWidth > 799"
            >
              <template slot-scope="scope">
                <div
                  v-for="example in get(fileData, `${template.template[scope.row]}.examples`, [])"
                  class="value-example"
                >
                  {{ example }}
                </div>
                <div class="show-if-first">&mdash;</div>
              </template>
            </el-table-column>
          </el-table>
          <el-button native-type="submit" @click.prevent="save" class="hidden" />
        </el-form>
        <ActionsPanel :actions="actions" />
      </div>
    </div>
    <Waiting v-else />
  </div>
</template>

<script>
import { mapState, mapActions } from 'vuex';
import XLSX from 'xlsx';
import { forEach, get } from 'lodash';
import downloadjs from 'downloadjs';

import mixins from 'Common/js/mixins';
import { trimBase64Data } from 'Common/js/helpers';
import InputFile from 'Components/form-elements/InputFile';
import ActionsPanel from 'Components/ActionsPanel';
import Waiting from 'Components/Waiting';

export default {
  name: 'CCOrdersImportTemplatePage',
  components: { Waiting, InputFile, ActionsPanel },
  mixins: [mixins],
  data() {
    const fields = [
      'order_clientNumber',
      'order_barcode',
      'recipient_contactName',
      'recipient_city',
      'recipient_addressString',
      'recipient_phone',
      'item_articul',
      'item_description',
      'item_quantity',
      'item_cost',
      'item_assessedCost',
      'order_deliveryType',
      'item_weight',
      'order_deliveryDate',
      'order_deliveryTimeStart',
      'order_deliveryTimeEnd',
      'extraParams_DopRecno',
      'item_costVat',
    ];

    return {
      fields,
      isAdd: this.$route.name === 'ccOrdersAddImportTemplate',
      saving: false,
      rules: (() => {
        const rules = {
          name: [this.validationRule('required')],
        };

        // eslint-disable-next-line no-return-assign
        fields.forEach(f => (rules[`template.${f}`] = this.validationRule('selectRequired')));

        return rules;
      })(),
    };
  },
  computed: {
    ...mapState('common', ['clientWidth']),
    ...mapState('ordersTemplates', ['template']),
    fileData() {
      if (this.template.file) {
        const workbook = XLSX.read(trimBase64Data(this.template.file), { type: 'base64' });
        const table = get(workbook, `Sheets[${get(workbook, 'SheetNames[0]')}]`);

        if (table) {
          const fileData = {};

          forEach(table, (data, key) => {
            if (key.search(/!/) !== -1) return;

            // Строка с названиями столбцов
            if (key[1] === '1') {
              fileData[key[0]] = {
                title: data.v,
                examples: [],
              };
              // Строки со значениями
            } else if (
              fileData[key[0]] &&
              !fileData[key[0]].examples.includes(data.v) &&
              fileData[key[0]].examples.length < 3
            ) {
              fileData[key[0]].examples.push(data.v);
            }
          });

          return fileData;
        }
      }

      return [];
    },
    actions() {
      return [
        [
          {
            callback: () => this.$router.push({ name: 'ccOrdersImportTemplates' }),
            hideWidth: 559,
            btnType: 'default',
            name: this.$t('cancel'),
            key: 'cancel',
          },
          {
            loading: this.saving,
            callback: this.save,
            name: this.$t('save'),
            key: 'save',
          },
          {
            loading: this.saving,
            hideWidth: 429,
            callback: this.saveAndUse,
            name: this.$t('saveAndUse'),
            key: 'saveAndUse',
          },
        ],
      ];
    },
  },
  methods: {
    ...mapActions('ordersTemplates', ['createNewTemplate', 'openTemplate', 'saveTemplate']),
    get,
    save() {
      this.$refs.template.validate(valid => {
        if (valid) {
          this.saving = true;

          this.saveTemplate({
            template: this.template,
            callback: success => {
              this.saving = false;
              if (success) this.$router.push({ name: 'ccOrdersImportTemplates' });
            },
          });
        }
      });
    },
    saveAndUse() {},
    openFile() {
      downloadjs(this.template.file, this.template.filename);
    },
  },
  created() {
    if (!this.isAdd) {
      this.openTemplate(this.$route.params.id);
    } else {
      this.createNewTemplate();
    }
  },
};
</script>

<style lang="less" scoped>
@import '~Common/colors';

.select-file {
  text-align: center;
  margin: 100px 0;

  .file-icon {
    font-size: 3rem;
    color: @placeholder-text-color;
  }

  .input-label {
    font-size: 1.5rem;
    margin-bottom: 1rem;
    color: @placeholder-text-color;
  }
}

.name-input {
  max-width: 400px;
}

.data-from-file {
  font-size: 0.75rem;
  margin-bottom: 0.75rem;
}

.mapping-table {
  margin-bottom: 20px;

  .el-form-item {
    &:not(.is-error) {
      margin-bottom: 0;
    }
  }

  .value-example {
    font-size: 0.8rem;
    line-height: 1.2rem;

    &:not(:first-child) {
      border-top: 1px dashed @light-border-color;
      margin-top: 0.2rem;
      padding-top: 0.2rem;
    }
  }
}
</style>
