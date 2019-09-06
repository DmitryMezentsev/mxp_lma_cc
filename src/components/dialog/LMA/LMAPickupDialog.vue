<template>
  <el-dialog
    :title="$t('viewPickup')"
    :visible.sync="visible"
    :width="clientWidth > 719 ? '700px' : '95%'"
    :close-on-press-escape="!waiting"
    :show-close="!waiting"
    :close-on-click-modal="!waiting"
    top="5vh"
  >
    <el-form v-if="pickup" :model="pickup" :rules="rules" ref="pickup" class="compact-form">
      <el-row :gutter="10">
        <el-col :span="12" :xs="24">
          <div class="values-section">
            <Value :name="$t('providerNumber')" :value="pickup.logist.internalNumber" />
            <Value :name="$t('shopNumber')" :value="pickup.sender.internalNumber" />
          </div>
        </el-col>
        <el-col :span="12" :xs="24">
          <div class="values-section">
            <Value :name="$t('customer')" :value="pickup.sender.name" />
          </div>
        </el-col>
      </el-row>
      <el-row :gutter="10">
        <el-col :span="12" :xs="24">
          <el-form-item :label="$t('status')" prop="serviceInfo.status" required>
            <StatusSelect
              type="pickup"
              class-name="custom-disabled"
              width="100%"
              :model.sync="pickup.serviceInfo.status"
            />
          </el-form-item>
        </el-col>
        <el-col :span="12" :xs="24">
          <el-form-item :label="$t('courier')" prop="serviceInfo.courierId">
            <CourierSelect
              width="100%"
              class-name="custom-disabled"
              :model.sync="pickup.serviceInfo.courierId"
              clearable
            />
          </el-form-item>
        </el-col>
      </el-row>

      <hr class="margin-bottom" />
      <el-row :gutter="10" class="pickup-time-select-wrap">
        <el-col :span="12" :xs="24">
          <el-form-item :label="$t('pickupDate')" prop="pickup.date" required>
            <DatePicker
              class="custom-readonly"
              name="pickupDate"
              :model.sync="pickup.pickup.date"
              :clearable="false"
            />
            <div class="hint hidden-xs-only">{{ $t('dateTimeZoneHint') }}</div>
          </el-form-item>
        </el-col>
        <el-col :span="6" :xs="12">
          <el-form-item :label="$tc('from', 2)" prop="pickup.time.from" required>
            <el-time-select
              class="custom-readonly"
              v-model="pickup.pickup.time.from"
              :clearable="false"
              :picker-options="getTimePickerOptions('from', pickup.pickup.time.to)"
            />
          </el-form-item>
        </el-col>
        <el-col :span="6" :xs="12">
          <el-form-item :label="$tc('to', 2)" prop="pickup.time.to" required>
            <el-time-select
              class="custom-readonly"
              v-model="pickup.pickup.time.to"
              :clearable="false"
              :picker-options="getTimePickerOptions('to', pickup.pickup.time.from)"
            />
          </el-form-item>
        </el-col>
      </el-row>

      <hr class="margin-bottom-x2" />
      <h3>{{ $t('warehouse') }}.</h3>
      <el-row :gutter="10">
        <el-col :span="12" :xs="24">
          <div class="values-section">
            <Value :name="$tc('name', 0)" :value="pickup.sender.warehouseName" />
          </div>
        </el-col>
        <el-col :span="12" :xs="24">
          <div class="values-section">
            <Value :name="$t('zone')" :value="pickup.serviceInfo.zoneName" />
          </div>
        </el-col>
      </el-row>
      <el-form-item
        :label="$t('address')"
        prop="sender.warehouseAddress"
        class="autocomplete-form-item"
        required
      >
        <el-autocomplete
          v-if="currentUser.locale === 'RU'"
          v-model="pickup.sender.warehouseAddress"
          :fetch-suggestions="dadataCleanAddress"
          :debounce="700"
          name="warehouseAddress"
        />
        <el-input
          v-else
          v-model="pickup.sender.warehouseAddress"
          class="custom-readonly"
          name="warehouseAddress"
        />
      </el-form-item>
      <el-row :gutter="10">
        <el-col :span="12" :xs="24">
          <el-form-item :label="$t('contactName')" prop="sender.contacts.name" required>
            <el-input
              class="custom-readonly"
              name="contactName"
              v-model="pickup.sender.contacts.name"
            />
          </el-form-item>
        </el-col>
        <el-col :span="12" :xs="24">
          <el-form-item :label="$t('phone')" prop="sender.contacts.phone" required>
            <el-input
              class="custom-readonly"
              name="phone"
              type="tel"
              v-inputmask
              v-model="pickup.sender.contacts.phone"
            />
          </el-form-item>
        </el-col>
      </el-row>
      <el-form-item :label="$t('comment')" prop="sender.notes">
        <el-input
          type="textarea"
          class="custom-readonly"
          name="notes"
          v-model="pickup.sender.notes"
        />
      </el-form-item>

      <hr class="margin-bottom-x2" />
      <h3>{{ $t('declaredDimensions') }}.</h3>
      <el-row :gutter="10">
        <el-col :span="12" :xs="24">
          <div class="values-section">
            <Value
              :name="$t('weight')"
              :value="pickup.dimensions.weight / 1000"
              :suffix="$t('kg')"
            />
          </div>
        </el-col>
        <el-col :span="12" :xs="24">
          <div class="values-section">
            <Value :name="$t('dimensions')" inner>
              <Dimensions :values="pickup.dimensions" />
            </Value>
          </div>
        </el-col>
      </el-row>

      <hr class="margin-top margin-bottom-x2" />
      <h3>{{ $t('actualDimensions') }}.</h3>
      <DimensionsInput
        className="custom-readonly"
        class="dimensions-input"
        width-prop-name="dimensions.widthFact"
        height-prop-name="dimensions.heightFact"
        length-prop-name="dimensions.lengthFact"
        :width.sync="pickup.dimensions.widthFact"
        :height.sync="pickup.dimensions.heightFact"
        :length.sync="pickup.dimensions.lengthFact"
        :readonly="!isAdmin"
      />
      <el-row :gutter="10">
        <el-col :span="8" :xs="24">
          <el-form-item :label="$t('weight')" prop="dimensions.weightFact">
            <WeightInput
              name="weightFact"
              className="custom-readonly"
              :model.sync="pickup.dimensions.weightFact"
              :readonly="!isAdmin"
            />
          </el-form-item>
        </el-col>
      </el-row>
      <el-button class="hidden" native-type="submit" @click.prevent="save" />
    </el-form>
    <span v-if="pickup" slot="footer" class="dialog-footer">
      <el-button @click="setOpened(null)" :disabled="waiting">
        {{ $t('close') }}
      </el-button>
      <el-button type="primary" @click="save" :loading="waiting">
        {{ $t('save') }}
      </el-button>
    </span>
  </el-dialog>
</template>

<script>
import { mapState, mapActions, mapGetters, mapMutations } from 'vuex';
import { cloneDeep } from 'lodash';

import mixins from 'Common/js/mixins';
import inputmask from 'Directives/inputmask';
import Dimensions from 'Components/Dimensions';
import Value from 'Components/Value';
import WeightInput from 'Components/form-elements/WeightInput';
import DimensionsInput from 'Components/form-elements/DimensionsInput';
import StatusSelect from 'Components/form-elements/StatusSelect';
import CourierSelect from 'Components/form-elements/CourierSelect';
import DatePicker from 'Components/form-elements/DatePicker';

export default {
  name: 'LMAPickupDialog',
  mixins: [mixins],
  components: {
    DatePicker,
    CourierSelect,
    StatusSelect,
    DimensionsInput,
    WeightInput,
    Value,
    Dimensions,
  },
  directives: { inputmask },
  data() {
    return {
      pickup: null,
      waiting: false,
      rules: {
        'sender.contacts.name': [this.validationRule('required')],
        'sender.contacts.phone': [this.validationRule('required'), this.validationRule('phone')],
        'sender.warehouseAddress': [this.validationRule('required')],
        'dimensions.weightFact': [this.validationRule('numberMin', [1, 0.001])],
        'dimensions.widthFact': [this.validationRule('numberMin', [1, 1])],
        'dimensions.heightFact': [this.validationRule('numberMin', [1, 1])],
        'dimensions.lengthFact': [this.validationRule('numberMin', [1, 1])],
        'serviceInfo.status': [this.validationRule('required')],
        'pickup.date': [this.validationRule('required')],
        'pickup.time.from': [this.validationRule('required')],
        'pickup.time.to': [this.validationRule('required')],
      },
    };
  },
  computed: {
    ...mapState('common', ['clientWidth']),
    ...mapState('auth', ['currentUser']),
    ...mapState('pickups', {
      pickups: 'list',
      opened: 'opened',
    }),
    ...mapGetters('auth', ['isAdmin']),
    visible: {
      get() {
        return !!this.pickup;
      },
      set() {
        this.setOpened(null);
      },
    },
  },
  methods: {
    ...mapMutations('pickups', ['setOpened']),
    ...mapActions('pickups', ['updatePickup']),
    save() {
      this.$refs.pickup.validate(valid => {
        if (valid) {
          this.waiting = true;

          this.updatePickup({
            pickup: this.pickup,
            callback: success => {
              this.waiting = false;

              if (success) {
                this.$emit('update');
                this.changesSavedMessage();
                this.setOpened(null);
              }
            },
          });
        }
      });
    },
  },
  watch: {
    opened: {
      handler(opened) {
        this.waiting = false;

        // eslint-disable-next-line prettier/prettier
        this.pickup = opened !== null
          ? cloneDeep(this.pickups.data[opened])
          : null;
      },
      immediate: true,
    },
  },
};
</script>

<style lang="less" scoped>
@import '~Common/colors';

h3 {
  font-weight: normal;
  margin: 0;
}

.autocomplete-form-item {
  .el-autocomplete {
    display: block;
  }
}

.dimensions-input {
  margin-top: 8px;
}

.pickup-time-select-wrap {
  .el-input {
    width: 100%;
  }
}

@media (max-width: 767px) {
  .el-col {
    &.el-col-xs-24:not(:first-child) {
      .values-section {
        margin-top: 0;
      }
    }
  }
}
</style>
