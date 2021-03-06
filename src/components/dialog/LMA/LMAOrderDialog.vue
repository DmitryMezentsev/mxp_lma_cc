<template>
  <el-dialog
    :title="$t('viewOrder')"
    :visible.sync="visible"
    :width="clientWidth > 819 ? '800px' : '100%'"
    :show-close="!lock"
    :close-on-press-escape="!lock"
    :close-on-click-modal="!lock"
    top="5vh"
  >
    <el-form v-if="order" :model="order" :rules="rules" ref="order" class="compact-form">
      <el-row :gutter="10">
        <el-col :span="12" :xs="24">
          <div class="values-section">
            <Value :name="$t('providerNumber')" :value="order.internalNumber" />
            <Value :name="$t('shopNumber')" :value="order.sender.internalNumber" />
          </div>
          <div class="values-section">
            <Value
              :name="$t('status')"
              :value="order.currentStatus.statusInfo.name"
              :active="order.statuses && order.statuses.length > 1"
              @click="setStatusesHistory(order.statuses)"
            />
          </div>
          <div class="values-section">
            <Value :name="$t('shop')" :value="order.sender.brandName" />
            <Value :name="$t('issuePoint')" :value="''" v-if="order.serviceType === POINT" />
          </div>
          <div class="values-section">
            <Value
              :name="$t('estimatedCost')"
              :value="order.cashOnDelivery.estimatedCost | currency"
            />
          </div>
        </el-col>
        <el-col :span="12" :xs="24">
          <div class="values-section" v-if="order.serviceType === POINT">
            <Value :name="$t('storageTime')" :value="''" :suffix="$t('days')" :dot="false" />
            <Value :name="$t('arrivalDate')" :value="''" />
          </div>
          <div class="values-section">
            <Value
              :name="$t('weight')"
              :value="order.dimensions.weight / 1000"
              :suffix="$t('kg')"
            />
            <Value :name="$t('dimensions')" inner>
              <Dimensions :values="order.dimensions" />
            </Value>
          </div>
        </el-col>
      </el-row>
      <div v-if="order.serviceType === COURIER">
        <hr class="margin-top margin-bottom-x2" />
        <el-row :gutter="10">
          <el-col :span="10" :xs="24">
            <el-form-item :label="$t('courier')" prop="serviceInfo.courierId">
              <CourierSelect
                v-if="editAllowed"
                width="100%"
                :model.sync="order.serviceInfo.courierId"
                clearable
              />
              <el-input
                v-else
                class="custom-readonly"
                v-model="order.serviceInfo.courierName"
                readonly
              />
            </el-form-item>
          </el-col>
          <el-col :span="14" :xs="24">
            <el-form-item :label="$t('deliveryAddress')" prop="recipient.address.value">
              <el-autocomplete
                v-if="currentUser.locale === 'RU' && editAllowed"
                v-model="order.recipient.address.value"
                :fetch-suggestions="dadataCleanAddress"
                :debounce="700"
              />
              <el-input
                v-else
                class="custom-readonly"
                v-model="order.recipient.address.value"
                :readonly="!editAllowed"
              />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="10">
          <el-col :span="10" :xs="24">
            <el-form-item :label="$t('deliveryZone')" prop="serviceInfo.deliveryZoneId">
              <RoutingZoneSelect
                v-if="
                  editAllowed &&
                    (isAdminLMA ||
                      (!order.recipient.address.longitude || !order.recipient.address.longitude))
                "
                :model.sync="order.serviceInfo.deliveryZoneId"
                width="100%"
                clearable
              />
              <el-input
                v-else
                class="custom-readonly"
                v-model="order.serviceInfo.deliveryZoneName"
                readonly
              />
            </el-form-item>
          </el-col>
          <el-col :span="6" :xs="24">
            <el-form-item :label="$t('deliveryDate')" prop="deliveryOrder.dateTimeInterval.date">
              <DatePicker
                class="custom-readonly"
                name="deliveryDate"
                :options="deliveryDateOptions"
                :clearable="false"
                :model.sync="order.deliveryOrder.dateTimeInterval.date"
                :readonly="!editAllowed"
              />
              <div class="hint hidden-xs-only">{{ $t('dateTimeZoneHint') }}</div>
            </el-form-item>
          </el-col>
          <el-col :span="4" :xs="12">
            <el-form-item
              :label="$tc('from', 2)"
              prop="deliveryOrder.dateTimeInterval.timeInterval.from"
            >
              <el-time-select
                class="custom-readonly"
                v-model="order.deliveryOrder.dateTimeInterval.timeInterval.from"
                :clearable="false"
                :picker-options="
                  getTimePickerOptions('from', order.deliveryOrder.dateTimeInterval.timeInterval.to)
                "
                :readonly="!editAllowed"
              />
            </el-form-item>
          </el-col>
          <el-col :span="4" :xs="12">
            <el-form-item
              :label="$tc('to', 2)"
              prop="deliveryOrder.dateTimeInterval.timeInterval.to"
            >
              <el-time-select
                class="custom-readonly"
                v-model="order.deliveryOrder.dateTimeInterval.timeInterval.to"
                :clearable="false"
                :picker-options="
                  getTimePickerOptions('to', order.deliveryOrder.dateTimeInterval.timeInterval.from)
                "
                :readonly="!editAllowed"
              />
            </el-form-item>
          </el-col>
        </el-row>
      </div>
      <hr class="margin-top margin-bottom" />
      <el-row :gutter="10">
        <el-col :span="14" :xs="24">
          <el-form-item :label="$t('recipient')" prop="recipient.contacts.name">
            <el-input
              class="custom-readonly"
              v-model="order.recipient.contacts.name"
              :readonly="!isAdminLMA || !editAllowed"
            />
          </el-form-item>
          <el-form-item
            :label="$t('city')"
            v-if="order.serviceType === POINT"
            prop="recipient.address.city"
          >
            <el-input
              class="custom-readonly"
              v-model="order.recipient.address.city"
              :readonly="!isAdminLMA || !editAllowed"
            />
          </el-form-item>
        </el-col>
        <el-col :span="10" :xs="24">
          <el-form-item :label="$t('phone')" prop="recipient.contacts.phone">
            <el-input
              type="tel"
              class="custom-readonly"
              v-model="order.recipient.contacts.phone"
              v-inputmask
              :readonly="!isAdminLMA || !editAllowed"
            />
          </el-form-item>
        </el-col>
      </el-row>
      <hr class="margin-bottom" />
      <el-row :gutter="10">
        <el-col>
          <el-form-item :label="$t('recipientComment')" v-if="order.recipient.notes">
            <el-input
              type="textarea"
              class="custom-readonly"
              v-model="order.recipient.notes"
              readonly
            />
          </el-form-item>
          <el-form-item :label="$t('delivererComment')" prop="deliverer.notes">
            <el-input
              type="textarea"
              class="custom-readonly"
              v-model="order.deliverer.notes"
              :readonly="!isAdminLMA || !editAllowed"
            />
          </el-form-item>
        </el-col>
      </el-row>
      <hr class="margin-bottom-x2" />
      <h4>{{ $t('services') }}:</h4>
      <OrderServices :order="order" />
      <hr class="margin-top-x2 margin-bottom-x2" />
      <div class="places">
        <h4>{{ $t('orderPlaces') }}:</h4>
        <el-table :data="order.places" :empty-text="$t('noPlaces')">
          <el-table-column label="№" width="40" prop="placeNum" key="col-number" />
          <el-table-column :label="$t('barcode')" key="col-barcode">
            <template slot-scope="scope">
              <span class="barcode">{{ scope.row.barcode }}</span>
            </template>
          </el-table-column>
          <el-table-column :label="$t('dimensions')" key="col-dimensions">
            <template slot-scope="scope">
              <div class="dimensions">
                <div class="label">{{ $t('declared') }}:</div>
                <Dimensions :values="scope.row.dimensions" />
                <!-- eslint-disable-next-line -->
                ({{ scope.row.dimensions.weight / 1000 }} {{ $t('kg') }})</div>
              <div class="dimensions">
                <div class="label">{{ $t('actual') }}:</div>
                <Dimensions
                  :values="{
                    width: scope.row.dimensions.widthFact,
                    height: scope.row.dimensions.heightFact,
                    length: scope.row.dimensions.lengthFact,
                  }"
                />
                <!-- eslint-disable-next-line -->
                ({{ scope.row.dimensions.weightFact / 1000 }} {{ $t('kg') }})</div>
            </template>
          </el-table-column>
        </el-table>
      </div>
      <div class="goods">
        <h4>{{ $t('goods') }}:</h4>
        <el-table :data="order.goods" :empty-text="$t('noGoods')">
          <el-table-column
            v-if="clientWidth > 639"
            type="index"
            label="#"
            width="40"
            key="col-index"
          />
          <el-table-column :label="$tc('name', 3)" key="col-name">
            <template slot-scope="scope">
              <div class="name">{{ scope.row.name }}</div>
            </template>
          </el-table-column>
          <el-table-column :label="$tc('quantity', 2)" width="120" key="col-quantity">
            <template slot-scope="scope">
              <el-input-number
                v-model="scope.row.counting.count"
                controls-position="right"
                size="mini"
                placeholder="1"
                class="compact"
                v-if="partialIssueMode"
                :min="1"
                :max="maxGoodsCounts[scope.row.itemId]"
              />
              <span v-else>{{ scope.row.counting.count }} {{ $t('pc') }}</span>
            </template>
          </el-table-column>
          <el-table-column v-if="clientWidth > 479" :label="$t('price')" key="col-price">
            <template slot-scope="scope">{{ scope.row.price | currency }}</template>
          </el-table-column>
          <el-table-column v-if="clientWidth > 579" :label="$t('sum')" key="col-sum">
            <template slot-scope="scope">{{
              (scope.row.price * scope.row.counting.count) | currency
            }}</template>
          </el-table-column>
          <el-table-column fixed="right" width="65" key="col-actions" v-if="partialIssueMode">
            <template slot-scope="scope">
              <el-tooltip :content="$t('remove')" placement="left">
                <el-button @click="removeGoodsItem(scope.$index)" type="danger" size="mini">
                  <fa-icon icon="trash" />
                </el-button>
              </el-tooltip>
            </template>
          </el-table-column>
        </el-table>
        <br />
        <Value :name="$t('totalGoodsPrice')" :value="goodsSum | currency" />
      </div>
      <el-button class="hidden" native-type="submit" @click.prevent="save" :disabled="!!lock" />
    </el-form>
    <span v-if="order" slot="footer" class="dialog-footer">
      <el-button @click="setOpened(null)" :disabled="!!lock" key="close-btn">{{
        $t('close')
      }}</el-button>
      <el-button
        @click="cancel"
        type="danger"
        v-if="showCancelBtn"
        :disabled="!!lock"
        key="cancel-btn"
        >{{ $t('cancel') }}</el-button
      >
      <el-button
        @click="endDialog = 'return'"
        type="danger"
        v-if="showReturnBtn"
        :disabled="!!lock"
        key="return-btn"
        >{{ $t('return') }}</el-button
      >
      <el-button
        @click="partialIssueMode = true"
        type="success"
        v-if="showPartialIssueBtn"
        :disabled="!!lock"
        key="partial-issue-btn"
        >{{ $t('partialIssue') }}</el-button
      >
      <el-button
        @click="endDialog = 'issue'"
        type="success"
        v-if="showToIssueBtn"
        :disabled="!!lock || !order.goods.length"
        key="to-issue-btn"
        >{{ $t('toIssue') }}</el-button
      >
      <el-button
        type="primary"
        @click="save"
        v-if="editAllowed"
        :loading="lock === 'saving'"
        :disabled="!!lock"
        key="save-btn"
        >{{ $t('save') }}</el-button
      >
    </span>

    <LMAOrderEndDialog :mode="endDialog" @end="end" @cancel="endDialog = null" />
  </el-dialog>
</template>

<script>
import { mapState, mapMutations, mapGetters } from 'vuex';
import { cloneDeep, get } from 'lodash';
import { parallel } from 'async';
import moment from 'moment';

import { CORE_REQUEST_HEADERS } from 'Constants/config';
import { PARTIAL_ISSUE_SERVICE_ID } from 'Constants/services';
import { COURIER, POINT } from 'Constants/delivery-types';
import api from 'Common/js/api';
import mixins from 'Common/js/mixins';
import { currency } from 'Common/js/filters';
import inputmask from 'Directives/inputmask';
import Dimensions from 'Components/Dimensions';
import TagChecked from 'Components/TagChecked';
import Value from 'Components/Value';
import CourierSelect from 'Components/form-elements/CourierSelect';
import RoutingZoneSelect from 'Components/form-elements/RoutingZoneSelect';
import DatePicker from 'Components/form-elements/DatePicker';
import LMAOrderEndDialog from 'Components/dialog/LMA/LMAOrderEndDialog';
import OrderServices from 'Components/OrderServices';

export default {
  name: 'LMAOrderDialog',
  mixins: [mixins],
  filters: { currency },
  components: {
    OrderServices,
    LMAOrderEndDialog,
    DatePicker,
    RoutingZoneSelect,
    CourierSelect,
    Value,
    TagChecked,
    Dimensions,
  },
  directives: { inputmask },
  data() {
    // Timestamp начала текущего дня
    const today = Number(moment(moment().format('YYYY-MM-DD')).format('x'));

    return {
      COURIER,
      POINT,
      order: null,
      deliveryDateOptions: {
        disabledDate: time => time.getTime() < today,
      },
      rules: {
        'recipient.address.value': [this.validationRule('required')],
        'recipient.contacts.name': [this.validationRule('required')],
        'recipient.contacts.phone': [this.validationRule('required'), this.validationRule('phone')],
      },
      partialIssueMode: false, // Режим частичной выдачи
      lock: false,
      endDialog: null, // Окно завершения (выдачи / отмены) заказа
    };
  },
  computed: {
    ...mapState('auth', ['currentUser']),
    ...mapState('common', ['clientWidth']),
    ...mapState('orders', {
      orders: 'list',
      opened: 'opened',
    }),
    ...mapGetters('auth', ['isAdminLMA']),
    visible: {
      get() {
        return !!this.order;
      },
      set() {
        this.setOpened(null);
      },
    },
    // Максимальные значения количества товаров
    maxGoodsCounts() {
      const max = {};
      if (this.opened !== null) {
        this.orders.data[this.opened].goods.forEach(item => {
          max[item.itemId] = item.counting.count;
        });
      }
      return max;
    },
    // Сумма товаров
    goodsSum() {
      let sum = 0;
      this.order.goods.forEach(item => {
        sum += item.price * item.counting.count;
      });
      return sum;
    },
    // Наличие услуги "Частичная выдача"
    partialIssueAllowed() {
      let exists = false;
      this.order.additionalDeliveryServices.forEach(({ deliveryServiceId }) => {
        if (deliveryServiceId === PARTIAL_ISSUE_SERVICE_ID) exists = true;
      });
      return exists;
    },
    // Разрешено ли завершать заказ выдачей / отменой
    endAllowed() {
      return (
        this.order.currentStatus.statusInfo.stageId === 4 &&
        !this.order.currentStatus.statusInfo.isEnd &&
        !['420', '419', '417'].includes(this.order.currentStatus.orderStatusModelId.substring(0, 3))
      );
    },
    // Разрешено ли редактирование заказа
    editAllowed() {
      return (
        !this.partialIssueMode &&
        this.order.currentStatus.statusInfo.stageId < 5 &&
        !['420', '419', '417'].includes(this.order.currentStatus.orderStatusModelId.substring(0, 3))
      );
    },
    // Показывать кнопку "Частичная выдача"
    showPartialIssueBtn() {
      return this.endAllowed && this.partialIssueAllowed && !this.partialIssueMode;
    },
    // Показывать кнопку "Отмена"
    showCancelBtn() {
      return this.endAllowed && this.isAdminLMA && !this.partialIssueMode;
    },
    // Показывать кнопку "Возврат"
    showReturnBtn() {
      return this.endAllowed && !this.partialIssueMode;
    },
    // Показывать кнопку "Выдать"
    showToIssueBtn() {
      return this.endAllowed || this.partialIssueMode;
    },
  },
  methods: {
    ...mapMutations('orders', ['setOpened', 'setStatusesHistory']),
    // Отмена заказа
    cancel() {
      this.confirm(this.$t('orderCancelConfirmation'), ok => {
        if (ok) this.endDialog = 'cancel';
      });
    },
    // Сохранение изменений в заказе
    save() {
      this.$refs.order.validate(valid => {
        if (valid) {
          // Проверяет, было ли изменено свойство заказа
          const isUpdated = prop =>
            get(this.order, prop) !== get(this.orders.data[this.opened], prop);

          const requests = [];

          // Изменен курьер
          if (isUpdated('serviceInfo.courierId')) {
            requests.push({
              api: 'serviceInfo/courierId',
              data: { value: this.order.serviceInfo.courierId },
            });
          }
          // Изменен адрес
          if (isUpdated('recipient.address.value')) {
            requests.push({
              api: 'recipient/address',
              data: { unrestricted_value: this.order.recipient.address.value },
            });
          }
          // Изменены контакты получателя
          if (isUpdated('recipient.contacts.name') || isUpdated('recipient.contacts.phone')) {
            requests.push({
              api: 'recipient/contacts',
              data: this.order.recipient.contacts,
            });
          }
          // Изменены дата или время доставки
          if (
            isUpdated('deliveryOrder.dateTimeInterval.date') ||
            isUpdated('deliveryOrder.dateTimeInterval.timeInterval.from') ||
            isUpdated('deliveryOrder.dateTimeInterval.timeInterval.to')
          ) {
            requests.push({
              api: 'orderDelivery/date',
              data: this.order.deliveryOrder.dateTimeInterval,
            });
          }
          // Изменена зона доставки
          if (isUpdated('serviceInfo.deliveryZoneId')) {
            requests.push({
              api: 'serviceInfo/deliveryZoneId',
              data: { value: this.order.serviceInfo.deliveryZoneId },
            });
          }
          // Изменен комментарий
          if (isUpdated('deliverer.notes')) {
            requests.push({
              api: 'deliverer/notes',
              data: { value: this.order.deliverer.notes },
            });
          }

          this.lock = 'saving';

          parallel(
            requests.map(request => callback => {
              api
                .patch(
                  // eslint-disable-next-line no-underscore-dangle
                  `orders/${this.order._id}/${request.api}`,
                  request.data,
                  {
                    headers: CORE_REQUEST_HEADERS,
                  },
                )
                .then(() => callback())
                .catch(err => callback(err));
            }),
            err => {
              this.lock = false;

              if (!err) {
                this.setOpened(null);
                this.changesSavedMessage();
                this.$emit('update');
              }
            },
          );
        }
      });
    },
    // Удаление товара из заказа
    removeGoodsItem(index) {
      this.order.goods.splice(index, 1);
    },
    // Запрос на завершение заказа (Выдача / Частичная выдача / Возврат / Отмена)
    end(values) {
      const params = { query: values };

      if (this.endDialog === 'issue' && !this.partialIssueMode) {
        // Выдача
        params.route = 'delivered';
        params.successMessage = 'orderIssued';
      } else if (this.endDialog === 'issue') {
        // Частичная выдача
        params.route = 'partial-delivered';
        params.query.goods = this.order.goods.map(item => ({
          itemId: item.itemId,
          count: item.counting.count,
        }));
        params.successMessage = 'orderIssued';
      } else if (this.endDialog === 'return') {
        // Возврат
        params.route = 'return';
        params.successMessage = 'orderReturned';
      } else if (this.endDialog === 'cancel') {
        // Отмена
        params.route = 'cancel';
        params.successMessage = 'orderCancelled';
      }

      api
        .put(`order/${this.order._id}/${params.route}`, params.query) // eslint-disable-line no-underscore-dangle
        .then(() => {
          this.endDialog = null;
          this.setOpened(null);
          this.$emit('update');

          this.$message({
            message: this.$t(params.successMessage),
            type: 'success',
          });
        })
        .catch(() => {
          this.endDialog = null;
        });
    },
  },
  destroyed() {
    this.setOpened(null);
  },
  watch: {
    opened: {
      handler(opened) {
        this.partialIssueMode = false;
        this.issueParams = null;

        // eslint-disable-next-line prettier/prettier
        this.order = opened !== null
          ? cloneDeep(this.orders.data[opened])
          : null;
      },
      immediate: true,
    },
    $route() {
      this.setOpened(null);
    },
  },
};
</script>

<style lang="less" scoped>
@import '~Common/colors';

h4 {
  font-size: 13px;
  font-weight: normal;
  color: @secondary-text-color;
  margin: 0 0 0.3em 0;
}

.el-date-editor {
  width: 100%;
}

.places {
  .barcode {
    @media (max-width: 479px) {
      font-size: 0.9em;
    }
  }

  .dimensions {
    line-height: 1.2em;

    @media (max-width: 479px) {
      font-size: 0.9em;
    }

    &:not(:first-child) {
      margin-top: 7px;
    }

    .label {
      color: @secondary-text-color;
      font-size: 0.85em;
    }
  }
}

.goods {
  margin-top: 20px;

  .name {
    @media (max-width: 419px) {
      font-size: 0.9em;
      line-height: 1.5em;
    }
  }
}

.el-input-group {
  vertical-align: 2px;
}

.el-autocomplete {
  display: block;
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
