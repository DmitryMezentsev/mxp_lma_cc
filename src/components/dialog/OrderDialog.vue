<template>
    <el-dialog :title="$t('viewOrder')"
               :visible.sync="visible"
               :width="width > 719 ? '700px' : '100%'"
               top="5vh">
        <el-form v-if="order"
                 :model="order"
                 :rules="rules"
                 ref="order"
                 class="compact-form">
            <el-row :gutter="10">
                <el-col :span="12" :xs="24">
                    <div class="values-section">
                        <Value :name="$t('providerNumber')" :value="order.internalNumber" />
                        <Value :name="$t('shopNumber')" :value="order.sender.internalNumber" />
                    </div>
                    <div class="values-section">
                        <Value :name="$t('shop')" :value="order.sender.brandName" />
                        <Value :name="$t('issuePoint')" :value="order.deliveryOrder.orderServicePointId" v-if="order.serviceType === ORDER_TYPE_POINT" />
                    </div>
                    <div class="values-section">
                        <Value :name="$t('estimatedCost')" inner>
                            <Currency :val="order.cashOnDelivery.estimatedCost" />
                        </Value>
                    </div>
                </el-col>
                <el-col :span="12" :xs="24">
                    <div class="values-section" v-if="order.serviceType === ORDER_TYPE_POINT">
                        <Value :name="$t('storageTime')" :value="''" :suffix="$t('days')" :dot="false" />
                        <Value :name="$t('arrivalDate')" :value="''" />
                    </div>
                    <div class="values-section">
                        <Value :name="$t('weight')" :value="order.dimensions.weight / 1000" :suffix="$t('kg')" />
                        <Value :name="$t('dimensions')" inner>
                            <Dimensions :values="order.dimensions" />
                        </Value>
                    </div>
                </el-col>
            </el-row>
            <div v-if="order.serviceType === ORDER_TYPE_COURIER">
                <hr class="margin-top margin-bottom-x2">
                <el-row :gutter="10">
                    <el-col :span="10" :xs="24">
                        <el-form-item :label="$t('courier')">
                            <CourierSelect width="100%"
                                           :model.sync="order.serviceInfo.courierId"
                                           clearable />
                        </el-form-item>
                    </el-col>
                    <el-col :span="14" :xs="24">
                        <el-form-item :label="$t('deliveryAddress')">
                            <el-input class="custom-readonly" v-model="order.recipient.address.value" />
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row :gutter="10">
                    <el-col :span="14" :xs="24">
                        <el-form-item :label="$t('deliveryZone')">
                            <RoutingZoneSelect :model.sync="order.serviceInfo.deliveryZoneId"
                                               :no-select-placeholder="$tc('noSelect', 2)"
                                               width="100%"
                                               clearable />
                        </el-form-item>
                    </el-col>
                    <el-col :span="10" :xs="24">
                        <el-form-item :label="$t('deliveryDate')">
                            <DatePicker class="custom-readonly"
                                        name="deliveryDate"
                                        :model.sync="order.deliveryOrder.dateTimeInterval.date" />
                            <div class="hint hidden-xs-only">{{ $t('dateTimeZoneHint') }}</div>
                        </el-form-item>
                    </el-col>
                </el-row>
            </div>
            <hr class="margin-top margin-bottom">
            <el-row :gutter="10">
                <el-col :span="14" :xs="24">
                    <el-form-item :label="$t('recipient')">
                        <el-input class="custom-readonly" v-model="order.recipient.contacts.name" :readonly="!isAdmin" />
                    </el-form-item>
                    <el-form-item :label="$t('city')" v-if="order.serviceType === ORDER_TYPE_POINT">
                        <el-input class="custom-readonly" v-model="order.recipient.address.city" :readonly="!isAdmin" />
                    </el-form-item>
                </el-col>
                <el-col :span="10" :xs="24">
                    <el-form-item :label="$t('phone')">
                        <el-input type="tel"
                                  class="custom-readonly"
                                  v-model="order.recipient.contacts.phone"
                                  v-inputmask
                                  :readonly="!isAdmin" />
                    </el-form-item>
                </el-col>
            </el-row>
            <hr class="margin-bottom">
            <el-row :gutter="10">
                <el-col>
                    <el-form-item :label="$t('comment')">
                        <el-input type="textarea" class="custom-readonly" v-model="order.recipient.notes" :readonly="!isAdmin" />
                    </el-form-item>
                </el-col>
            </el-row>
            <hr class="margin-bottom-x2">
            <div class="services">
                <h4>{{ $t('services') }}:</h4>
                <div class="services-list">
                    <div class="tags-wrap">
                        <TagChecked label="opening" :checked="false" />
                        <TagChecked label="fitting" :checked="false" />
                        <TagChecked label="partialIssue" :checked="false" />
                        <TagChecked label="attachedDocuments" :checked="true" v-show="false" />
                        <TagChecked label="printDocument" :checked="false" :active="false" @click="printDocument()" />
                    </div>
                </div>
            </div>
            <hr class="margin-top-x2 margin-bottom-x2">
            <div class="places">
                <h4>{{ $t('orderPlaces') }}:</h4>
                <el-table :data="order.places"
                          :empty-text="$t('noPlaces')">
                    <el-table-column
                            label="№"
                            width="40"
                            prop="placeNum"
                            key="col-number" />
                    <el-table-column
                            :label="$t('barcode')"
                            key="col-barcode">
                        <template slot-scope="scope">
                            <span class="barcode">{{ scope.row.barcode }}</span>
                        </template>
                    </el-table-column>
                    <el-table-column
                            :label="$t('dimensions')"
                            key="col-dimensions">
                        <template slot-scope="scope">
                            <div class="dimensions">
                                <div class="label">{{ $t('declared') }}:</div>
                                <Dimensions :values="scope.row.dimensions" />
                                ({{ scope.row.dimensions.weight / 1000 }} {{ $t('kg') }})
                            </div>
                            <div class="dimensions">
                                <div class="label">{{ $t('actual') }}:</div>
                                <Dimensions :values="{
                                    width: scope.row.dimensions.widthFact,
                                    height: scope.row.dimensions.heightFact,
                                    length: scope.row.dimensions.lengthFact,
                                }" />
                                ({{ scope.row.dimensions.weightFact / 1000 }} {{ $t('kg') }})
                            </div>
                        </template>
                    </el-table-column>
                </el-table>
            </div>
            <div class="goods">
                <h4>{{ $t('goods') }}:</h4>
                <el-table :data="order.goods"
                          :empty-text="$t('noGoods')">
                    <el-table-column
                            v-if="width > 639"
                            type="index"
                            label="#"
                            width="40"
                            key="col-index" />
                    <el-table-column
                            :label="$tc('name', 3)"
                            key="col-name">
                        <template slot-scope="scope">
                            <div class="name">{{ scope.row.name }}</div>
                        </template>
                    </el-table-column>
                    <el-table-column
                            :label="$tc('quantity', 2)"
                            width="120"
                            key="col-quantity">
                        <template slot-scope="scope">
                            <el-input-number v-model="scope.row.counting.count"
                                             controls-position="right"
                                             size="mini"
                                             placeholder="1"
                                             class="compact"
                                             :min="1"
                                             :max="9999" />
                        </template>
                    </el-table-column>
                    <el-table-column
                            v-if="width > 479"
                            :label="$t('price')"
                            key="col-price">
                        <template slot-scope="scope">
                            <Currency :val="scope.row.price" />
                        </template>
                    </el-table-column>
                    <el-table-column
                            v-if="width > 579"
                            :label="$t('sum')"
                            key="col-sum">
                        <template slot-scope="scope">
                            <Currency :val="scope.row.price * scope.row.counting.count" />
                        </template>
                    </el-table-column>
                    <el-table-column
                            fixed="right"
                            width="65"
                            key="col-actions">
                        <template slot-scope="scope">
                            <el-tooltip :content="$t('remove')" placement="left">
                                <el-button @click="removeGoods(scope.$index)"
                                           type="danger"
                                           size="mini">
                                    <i class="fas fa-trash"></i>
                                </el-button>
                            </el-tooltip>
                        </template>
                    </el-table-column>
                </el-table>
                <br>
                <Value :name="$t('totalGoodsPrice')" inner>
                    <Currency :val="goodsSum" />
                </Value>
            </div>
            <el-button class="hidden" native-type="submit" @click.prevent="save" />
        </el-form>
        <span v-if="order" slot="footer" class="dialog-footer">
             <el-button @click="close">
                {{ $t('close') }}
            </el-button>
            <el-button @click="partialIssue" :v-if="true">
                {{ $t('partialIssue') }}
            </el-button>
            <el-button @click="toReturn" type="danger">
                {{ $t('return') }}
            </el-button>
            <el-button @click="toIssue" type="success">
                {{ $t('toIssue') }}
            </el-button>
        </span>
    </el-dialog>
</template>

<script>
    import {mapState, mapActions, mapGetters} from 'vuex';
    import cloneDeep from 'lodash/cloneDeep';

    import mixins from 'Common/js/mixins';
    import inputmask from 'Directives/inputmask';
    import Dimensions from 'Components/Dimensions';
    import TagChecked from 'Components/TagChecked';
    import Currency from 'Components/Currency';
    import Value from 'Components/Value';
    import CourierSelect from 'Components/form-elements/CourierSelect';
    import {ORDER_TYPE_COURIER, ORDER_TYPE_POINT} from 'Constants/data';
    import RoutingZoneSelect from 'Components/form-elements/RoutingZoneSelect';
    import DatePicker from 'Components/DatePicker';

    export default {
        name: 'OrderDialog',
        mixins: [mixins],
        components: {DatePicker, RoutingZoneSelect, CourierSelect, Value, Currency, TagChecked, Dimensions},
        directives: {inputmask},
        data () {
            return {
                ORDER_TYPE_COURIER,
                ORDER_TYPE_POINT,
                width: 0,
                order: null,
                rules: {

                },
            }
        },
        computed: {
            ...mapState('orders', {
                orders: 'list',
                opened: 'opened',
            }),
            ...mapGetters('auth', [
                'isAdmin',
            ]),
            visible: {
                get () { return !!this.order; },
                set () { this.close(); },
            },
            goodsSum () {
                let sum = 0;
                this.order.goods.forEach(item => sum += item.price * item.counting.count);
                return sum;
            },
        },
        methods: {
            ...mapActions('orders', [
                'close',
            ]),
            save () {
                this.$refs.order.validate(valid => {
                    if (valid) {

                    }
                });
            },
            printDocument () {

            },
            removeGoods (index) {

            },
            partialIssue () {

            },
            toIssue () {

            },
            toReturn () {

            },
        },
        created () {
            this.bindClientWidth('width');
        },
        destroyed () {
            this.unbindClientWidth();
        },
        watch: {
            opened: {
                handler (opened) {
                    this.order = (opened !== null)
                        ? cloneDeep(this.orders.data[opened])
                        : null;
                },
                immediate: true,
            },
        },
    }
</script>

<style lang="less" scoped>
    @import "~Common/colors";

    h4 {
        font-size: 13px;
        font-weight: normal;
        color: @secondary-text-color;
        margin:  0 0 .3em 0;
    }

    .el-date-editor {
        width: 100%;
    }

    .services {
        .services-list {
            margin-top: .5em;

            .tags-wrap { font-size: 0; }
        }
    }

    .places {
        .barcode {
            @media (max-width: 479px) { font-size: .9em; }
        }

        .dimensions {
            line-height: 1.2em;

            @media (max-width: 479px) { font-size: .9em; }

            &:not(:first-child) {
                margin-top: 7px;
            }

            .label {
                color: @secondary-text-color;
                font-size: .85em;
            }
        }
    }

    .goods {
        margin-top: 20px;

        .name {
            @media (max-width: 419px) {
                font-size: .9em;
                line-height: 1.5em;
            }
        }
    }

    .el-input-group {
        vertical-align: 2px;
    }

    @media (max-width: 767px) {
        .el-col {
            &.el-col-xs-24:not(:first-child) {
                .values-section { margin-top: 0; }
            }
        }
    }
</style>