<template>
  <div>
    <el-form v-if="courier" ref="courier" :model="courier" :rules="rules">
      <div class="actions-form-wrap">
        <el-row :gutter="10">
          <el-col :span="8" :xs="24">
            <h4>{{ $t('basic') }}</h4>
            <el-form-item :label="$t('fullName')" prop="fullname" required>
              <el-input v-model="courier.fullname" name="fullname" />
            </el-form-item>
            <el-form-item :label="$t('shortName')" prop="shortname" required>
              <el-input v-model="courier.shortname" name="shortname" />
            </el-form-item>
            <el-form-item :label="$t('phone')" prop="phone1" required>
              <el-input v-model="courier.phone1" v-inputmask name="phone1" type="tel" />
            </el-form-item>
            <el-form-item :label="$t('additionalPhone')" prop="phone2">
              <el-input v-model="courier.phone2" v-inputmask name="phone2" type="tel" />
            </el-form-item>
            <el-form-item :label="$t('livingArea')" prop="livingArea" required>
              <el-input v-model="courier.livingArea" name="livingArea" />
            </el-form-item>
            <el-form-item :label="$t('legalPerson')" prop="permissions.legalpersonId" required>
              <LegalPersonSelect :model.sync="courier.permissions.legalpersonId" width="100%" />
            </el-form-item>
            <el-form-item :label="$t('warehouse')" prop="permissions.warehouseIds" required>
              <WarehouseSelect
                :model.sync="courier.permissions.warehouseIds"
                width="100%"
                multiple
              />
            </el-form-item>
          </el-col>
          <el-col :span="8" :xs="24">
            <h4>{{ $t('passportData') }}</h4>
            <el-form-item :label="$t('photo')">
              <br />
              <div class="passport-photo">
                <img v-if="courier.passport.photo" :src="courier.passport.photo" />
                <InputFile
                  :model.sync="courier.passport.photo"
                  :max-file-size="1024"
                  :allowed-types="['image/jpeg', 'image/png', 'image/bmp']"
                />
                <div class="hint">{{ $t('imageSize') }} 100x120px</div>
              </div>
            </el-form-item>
            <el-form-item
              :label="$t('registrationAddress')"
              prop="passport.address"
              class="autocomplete-form-item"
              required
            >
              <el-autocomplete
                v-if="currentUser.locale === 'RU'"
                v-model="courier.passport.address"
                :fetch-suggestions="dadataCleanAddress"
                :debounce="700"
                name="passport.address"
              />
              <el-input v-else v-model="courier.passport.address" name="passport.address" />
            </el-form-item>
            <el-form-item :label="$t('passportNumber')" prop="passport.series" required>
              <el-input v-model="courier.passport.series" name="passport.series" />
            </el-form-item>
            <el-form-item
              :label="$t('whenAndWhoIssuedPassport')"
              prop="passport.issueInfo"
              required
            >
              <el-input v-model="courier.passport.issueInfo" name="passport.issueInfo" />
            </el-form-item>
            <el-form-item :label="$t('birthday')" prop="passport.birthday" required>
              <br />
              <DatePicker :model.sync="courier.passport.birthday" />
            </el-form-item>
          </el-col>
          <el-col :span="8" :xs="24">
            <h4>{{ $t('carData') }}</h4>
            <el-form-item
              :label="$tc('brand', 1)"
              prop="transport.brand"
              class="autocomplete-form-item"
            >
              <el-autocomplete
                name="transport.brand"
                v-model="courier.transport.brand"
                :fetch-suggestions="carBrands"
              />
            </el-form-item>

            <el-form-item :label="$t('model')" prop="transport.model">
              <el-input v-model="courier.transport.model" name="transport.model" />
            </el-form-item>
            <el-form-item :label="$t('govNumber')" prop="transport.registrationNumber">
              <el-input
                v-model="courier.transport.registrationNumber"
                name="transport.registrationNumber"
              />
            </el-form-item>

            <br />
            <h4>{{ $t('authorizationData') }}</h4>
            <el-form-item :label="$t('login')" prop="access.login" required>
              <el-input
                v-model="courier.access.login"
                name="access.login"
                :readonly="!isAdd"
                class="custom-readonly"
              />
            </el-form-item>
            <el-form-item v-if="isAdd" :label="$t('password')" prop="access.password" required>
              <el-input
                v-model="courier.access.password"
                name="access.password"
                :placeholder="$tc('atLeastCharacters', 1, { quantity: minPasswordLength })"
              />
              <el-button size="mini" @click="generatePassword" v-autoblur>{{
                $t('generatePassword')
              }}</el-button>
            </el-form-item>
          </el-col>
        </el-row>

        <div class="documents">
          <h4>{{ $t('documents') }}</h4>
          <el-table :data="courier.documents" :empty-text="$t('noDocuments')">
            <el-table-column :label="$t('document')" key="col-document">
              <template slot-scope="scope">
                <el-button type="text" @click="openDocument(scope.row)">
                  <span v-if="scope.row.type === PASSPORT">{{ $t('passport') }}</span>
                  <span v-else-if="scope.row.type === VEHICLE_PASSPORT">{{
                    $t('vehiclePassport')
                  }}</span>
                  <span v-else-if="scope.row.type === DRIVERS_LICENSE">{{
                    $t('driversLicense')
                  }}</span>
                </el-button>
              </template>
            </el-table-column>
            <el-table-column
              v-if="clientWidth > 500"
              :label="$t('uploadDate')"
              key="col-document-upload-date"
            >
              <template slot-scope="scope">{{ scope.row.uploadDate | formatDate(true) }}</template>
            </el-table-column>
            <el-table-column width="65" key="col-document-actions">
              <template slot-scope="scope">
                <el-tooltip :content="$t('remove')" placement="left">
                  <el-button type="danger" size="mini" @click="removeDocument(scope.$index)">
                    <fa-icon icon="trash" />
                  </el-button>
                </el-tooltip>
              </template>
            </el-table-column>
          </el-table>
          <div class="upload-button-wrap">
            <el-button size="mini" @click="uploadDocumentDialog = true" type="primary">{{
              $t('uploadDocument')
            }}</el-button>
          </div>
          <LMAUploadCourierDocumentDialog
            :opened.sync="uploadDocumentDialog"
            @upload="uploadDocument"
          />
        </div>
      </div>
      <el-button native-type="submit" @click.prevent="submit" class="hidden" />
    </el-form>
    <Waiting v-else />

    <ActionsPanel :actions="actions" />
  </div>
</template>

<script>
import { mapState, mapActions } from 'vuex';
import downloadjs from 'downloadjs';

import { PASSPORT, VEHICLE_PASSPORT, DRIVERS_LICENSE } from 'Constants/courier-document-types';
import api from 'Common/js/api';
import mixins from 'Common/js/mixins';
import { generateRandomString, getExtensionFromBase64 } from 'Common/js/helpers';
import cars from 'Common/js/cars';
import { formatDate } from 'Common/js/filters';
import inputmask from 'Directives/inputmask';
import autoblur from 'Directives/autoblur';
import Waiting from 'Components/Waiting';
import InputFile from 'Components/form-elements/InputFile';
import LMAUploadCourierDocumentDialog from 'Components/dialog/LMA/LMAUploadCourierDocumentDialog';
import DatePicker from 'Components/form-elements/DatePicker';
import ActionsPanel from 'Components/ActionsPanel';
import LegalPersonSelect from 'Components/form-elements/LegalPersonSelect';
import WarehouseSelect from 'Components/form-elements/WarehouseSelect';

// Минимальная длина пароля при создании нового курьера
const minPasswordLength = 6;

export default {
  name: 'LMACourierPage',
  components: {
    WarehouseSelect,
    LegalPersonSelect,
    ActionsPanel,
    DatePicker,
    LMAUploadCourierDocumentDialog,
    InputFile,
    Waiting,
  },
  mixins: [mixins],
  filters: { formatDate },
  directives: { inputmask, autoblur },
  data() {
    return {
      minPasswordLength,
      processing: false,
      isAdd: this.$route.name === 'lmaAddCourier',
      uploadDocumentDialog: false,
      PASSPORT,
      VEHICLE_PASSPORT,
      DRIVERS_LICENSE,
      rules: {
        fullname: [this.validationRule('required')],
        shortname: [this.validationRule('required')],
        phone1: [this.validationRule('required'), this.validationRule('phone')],
        phone2: [this.validationRule('phone')],
        livingArea: [this.validationRule('required')],
        'permissions.legalpersonId': [this.validationRule('selectRequired')],
        'permissions.warehouseIds': [this.validationRule('selectRequired')],
        'passport.address': [this.validationRule('required')],
        'passport.series': [this.validationRule('required')],
        'passport.issueInfo': [this.validationRule('required')],
        'passport.birthday': [this.validationRule('required')],
        'access.login': [this.validationRule('required')],
        'access.password': [
          this.validationRule('required'),
          { type: 'string', min: minPasswordLength, message: this.$t('passwordIsTooShort') },
        ],
      },
    };
  },
  computed: {
    ...mapState('common', ['clientWidth']),
    ...mapState('auth', ['currentUser']),
    ...mapState('couriers', ['courier']),
    actions() {
      const actions = [[], []];
      const disabled = Boolean(this.processing) || !this.courier;

      // Отмена
      actions[0].push({
        disabled,
        callback: () => this.$router.push({ name: 'lmaCouriers' }),
        hideWidth: 849,
        btnType: 'default',
        name: this.$t('cancel'),
        key: 'cancel',
      });
      // Сохранить
      actions[0].push({
        disabled,
        loading: this.processing === 'saving',
        callback: this.submit,
        name: this.$t(this.isAdd ? 'createCourier' : 'saveChanges'),
        key: 'save',
      });

      // Только для страницы добавления нового курьера
      if (this.courier && !this.isAdd) {
        if (this.courier.isActive) {
          // В архив
          actions[1].push({
            disabled,
            loading: this.processing === 'changeActive',
            callback: () => this.changeActive(false),
            btnType: 'danger',
            hideWidth: 849,
            icon: 'archive',
            name: this.$t('toArchive'),
            key: 'toArchive',
          });
        } else {
          // Восстановить
          actions[1].push({
            disabled,
            loading: this.processing === 'changeActive',
            callback: () => this.changeActive(true),
            hideWidth: 849,
            icon: 'redo-alt',
            name: this.$t('restore'),
            key: 'restore',
          });
        }

        // Отправить новый пароль в SMS
        actions[1].push({
          disabled,
          callback: this.sendNewPassword,
          name: this.$t('sendNewPasswordInSMS'),
          key: 'sendNewPasswordInSMS',
          btnType: 'default',
          hideWidth: 579,
        });
      }

      return actions;
    },
  },
  methods: {
    ...mapActions('couriers', ['createNewCourier', 'openCourier', 'saveCourier', 'patchCourier']),
    uploadDocument(document) {
      this.uploadDocumentDialog = false;
      this.courier.documents.push({
        ...document,
        uploadDate: new Date().getTime(),
      });
    },
    removeDocument(i) {
      this.confirm(this.$t('removeDocumentConfirmation'), confirm => {
        if (confirm) this.courier.documents.splice(i, 1);
      });
    },
    openDocument({ data, type }) {
      const ext = getExtensionFromBase64(data);
      const id = this.courier.courierId || '';

      downloadjs(data, `courier${id}_doc_${type}.${ext}`);
    },
    carBrands(query, cb) {
      query = query.trim().toLowerCase(); // eslint-disable-line no-param-reassign

      const result =
        query.length > 1
          ? cars[this.currentUser.locale].filter(car => car.toLowerCase().indexOf(query) !== -1)
          : [];

      cb(
        result.map(value => {
          return { value };
        }),
      );
    },
    changeActive(active) {
      const dialogTitle = this.$t(
        active ? 'restoreCourierConfirmation' : 'toArchiveCourierConfirmation',
      );

      this.confirm(dialogTitle, ok => {
        if (ok) {
          this.processing = 'changeActive';

          this.patchCourier({
            id: this.courier.courierId,
            params: { isActive: active },
            callback: success => {
              this.processing = false;
              if (success) this.courier.isActive = active;
            },
          });
        }
      });
    },
    sendNewPassword() {
      this.confirm(
        this.$t('sendPasswordDialogText'),
        ok => {
          if (ok) {
            api.post(`courier/${this.courier.courierId}/send-password-by-sms`).then(() => {
              this.$message({
                message: this.$t('newPasswordSentToCourier'),
                type: 'success',
              });
            });
          }
        },
        this.$t('sendPassword'),
      );
    },
    generatePassword() {
      this.courier.access.password = generateRandomString();
    },
    submit() {
      this.$refs.courier.validate(valid => {
        if (valid) {
          this.processing = 'saving';
          this.saveCourier({
            courier: this.courier,
            callback: success => {
              this.processing = false;
              if (success) this.$router.push({ name: 'lmaCouriers' });
            },
          });
        }
      });
    },
  },
  created() {
    if (!this.isAdd) {
      this.openCourier(this.$route.params.id);
    } else {
      this.createNewCourier();
    }
  },
};
</script>

<style lang="less" scoped>
@import '~Common/colors';

.passport-photo {
  @img-margin: 8px;

  font-size: 0;
  margin-bottom: -@img-margin;

  * {
    vertical-align: top;
  }

  img {
    max-width: 100px;
    max-height: 120px;
    margin-right: @img-margin;
    margin-bottom: @img-margin;
  }
}

.autocomplete-form-item {
  .el-autocomplete {
    display: block;
  }
}

.documents {
  margin-top: 2em;
  border-top: 1px solid @light-border-color;

  .upload-button-wrap {
    margin: 1em 0;
    text-align: right;
  }
}
</style>
