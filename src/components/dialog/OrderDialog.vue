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
                        <Value :name="$t('providerNumber')" :value="order.sender.providerNumber" />
                        <Value :name="$t('shopNumber')" :value="order.sender.internalNumber" />
                    </div>
                    <div class="values-section">
                        <Value :name="$t('shop')" :value="order.sender.brandName" />
                        <Value :name="$t('issuePoint')" :value="order.deliveryOrder.orderServicePointId" v-if="order.serviceType === 1" />
                    </div>
                    <div class="values-section">
                        <Value :name="$t('estimatedCost')" inner>
                            <Currency :val="order.cashOnDelivery.estimatedCost" />
                        </Value>
                    </div>
                </el-col>
                <el-col :span="12" :xs="24">
                    <div class="values-section" v-if="order.serviceType === 1">
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
            <hr class="margin-top margin-bottom">
            <el-row :gutter="10">
                <el-col :span="12" :xs="24">
                    <el-form-item :label="$t('recipient')">
                        <el-input class="custom-readonly" v-model="order.recipient.contacts.name" :readonly="!isAdmin" />
                    </el-form-item>
                    <el-form-item :label="$t('city')" v-if="order.serviceType === 1">
                        <el-input class="custom-readonly" v-model="order.recipient.address.city" :readonly="!isAdmin" />
                    </el-form-item>
                </el-col>
                <el-col :span="12" :xs="24">
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
                            prop="name"
                            :label="$tc('name', 3)"
                            key="col-name" />
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
            <el-button @click="partialIssue" :v-show="true">
                {{ $t('partialIssue') }}
            </el-button>
            <el-button @click="toIssue" type="success">
                {{ $t('toIssue') }}
            </el-button>
            <el-button @click="toReturn" type="danger">
                {{ $t('return') }}
            </el-button>
            <el-button @click="close">
                {{ $t('close') }}
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

    export default {
        name: 'OrderDialog',
        mixins: [mixins],
        components: {Value, Currency, TagChecked, Dimensions},
        directives: {inputmask},
        data () {
            return {
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
    @import "../../common/colors";

    h4 {
        font-size: 13px;
        font-weight: normal;
        color: @secondary-text-color;
        margin:  0 0 .3em 0;
    }

    .services {
        .services-list {
            margin-top: .5em;

            .tags-wrap { font-size: 0; }
        }
    }

    .goods {

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